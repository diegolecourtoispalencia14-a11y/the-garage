-- ==============================================================================
-- BiciSaaS & The Garage — Esquema Multi-Tenant con Row Level Security (RLS)
-- ==============================================================================

-- 1. Extensiones requeridas
create extension if not exists "pgcrypto";

-- 2. Emulación de esquema auth de Supabase (para entornos locales/pruebas)
create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz default now()
);

create or replace function auth.uid()
returns uuid
language sql stable
as $$
  select 
    coalesce(
      nullif(current_setting('request.jwt.claim.sub', true), ''),
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid;
$$;

create or replace function auth.role()
returns text
language sql stable
as $$
  select 
    coalesce(
      nullif(current_setting('request.jwt.claim.role', true), ''),
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'),
      'anon'
    );
$$;

-- Roles de Postgres estándar de Supabase
do $$
begin
  if not exists (select from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end
$$;

-- ==============================================================================
-- 3. Definición de las 14 Tablas
-- ==============================================================================

-- Tabla 1: tenants (Inquilinos / Tiendas)
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  domain text,
  created_at timestamptz default now()
);

-- Tabla 2: user_profiles (Perfiles de usuario ligados a auth.users y a su tenant)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  role text not null check (role in ('admin', 'staff', 'mechanic', 'cashier')),
  full_name text not null,
  email text not null,
  created_at timestamptz default now()
);

-- Funciones Helper de Seguridad (Security Definer para consultar user_profiles sin recursión)
create or replace function public.get_auth_tenant_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select tenant_id from public.user_profiles where id = auth.uid();
$$;

create or replace function public.is_tenant_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles 
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Tabla 3: employee_attendance (Asistencia y checador)
create table if not exists public.employee_attendance (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  date date not null default current_date,
  check_in timestamptz not null default now(),
  check_out timestamptz,
  status text not null default 'present'
);

-- Tabla 4: products (Inventario general)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  sku text not null,
  name text not null,
  brand text,
  category text,
  size text,
  color text,
  price numeric(12,2) not null check (price >= 0),
  cost numeric(12,2) not null check (cost >= 0), -- CONFIDENCIAL
  margin_percent numeric(5,2),                   -- CONFIDENCIAL
  stock integer not null default 0,
  min_stock_alert integer not null default 2,
  supplier text,                                  -- CONFIDENCIAL
  supplier_sku text,                              -- CONFIDENCIAL
  is_web_published boolean not null default false,
  images text[] default '{}',
  specs jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique (tenant_id, sku)
);

-- Tabla 5: orders (Ventas de POS y pedidos web)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_number text not null,
  customer_id uuid,
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'completed',
  payment_method text not null,
  created_at timestamptz default now(),
  unique (tenant_id, order_number)
);

-- Tabla 6: order_items (Partidas de ventas - CON tenant_id PROPIO POR DISEÑO)
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  subtotal numeric(12,2) not null check (subtotal >= 0)
);

-- Tabla 7: customers (CRM y Directorio de clientes)
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  bikes jsonb default '[]'::jsonb,
  notes text,
  created_at timestamptz default now()
);

-- Tabla 8: customer_events (Historial CRM / Línea de tiempo)
create table if not exists public.customer_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  event_type text not null,
  description text not null,
  created_at timestamptz default now()
);

-- Tabla 9: workshop_tickets (Taller y órdenes de servicio)
create table if not exists public.workshop_tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  ticket_number text not null,
  customer_id uuid not null references public.customers(id),
  bike_description text not null,
  services_requested jsonb default '[]'::jsonb,
  status text not null default 'received',
  mechanic_id uuid references public.user_profiles(id),
  total_estimated numeric(12,2) default 0,
  created_at timestamptz default now(),
  unique (tenant_id, ticket_number)
);

-- Tabla 10: rental_fleet (Flota de rentas)
create table if not exists public.rental_fleet (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  bike_code text not null,
  model text not null,
  type text not null,
  size text,
  rate_per_day numeric(10,2) not null check (rate_per_day >= 0),
  status text not null default 'available',
  unique (tenant_id, bike_code)
);

-- Tabla 11: rental_bookings (Contratos y reservas de renta)
create table if not exists public.rental_bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  booking_number text not null,
  fleet_id uuid not null references public.rental_fleet(id),
  customer_name text not null,
  start_date date not null,
  end_date date not null,
  deposit_amount numeric(10,2) not null default 0,
  status text not null default 'confirmed',
  unique (tenant_id, booking_number)
);

-- Tabla 12: accounting_ledger (Libro mayor contable inmutable)
create table if not exists public.accounting_ledger (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12,2) not null check (amount > 0),
  category text not null,
  reference_type text,
  reference_id uuid,
  description text not null,
  created_at timestamptz default now()
);

-- Tabla 13: tasks (Tareas operativas del equipo)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  assigned_to uuid references public.user_profiles(id),
  due_date date,
  status text not null default 'todo'
);

-- Tabla 14: tenant_config (Configuración de tienda: fiscal, moneda, apariencia)
create table if not exists public.tenant_config (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  business_name text not null,
  rfc text,
  address text,
  phone text,
  currency text not null default 'MXN',
  logo_url text,
  theme_settings jsonb default '{}'::jsonb
);

-- ==============================================================================
-- 4. Catálogo Público Seguro (Vista y RPC)
-- ==============================================================================

-- Vista pública que enmascara stock exacto y oculta columnas sensibles
create or replace view public.public_products as
select 
  p.id,
  p.tenant_id,
  t.slug as tenant_slug,
  p.sku,
  p.name,
  p.brand,
  p.category,
  p.price,
  case 
    when p.stock > 5 then 'in_stock'
    when p.stock between 1 and 5 then 'low_stock'
    else 'out_of_stock'
  end as stock_status,
  (p.stock > 0) as is_available,
  p.size,
  p.color,
  p.specs,
  p.images,
  p.is_web_published
from public.products p
join public.tenants t on t.id = p.tenant_id
where p.is_web_published = true;

-- Función RPC con filtro OBLIGATORIO por slug de tienda
create or replace function public.get_public_catalog(p_tenant_slug text)
returns table (
  id uuid,
  tenant_id uuid,
  tenant_slug text,
  sku text,
  name text,
  brand text,
  category text,
  price numeric,
  stock_status text,
  is_available boolean,
  size text,
  color text,
  specs jsonb,
  images text[],
  is_web_published boolean
)
language sql stable security definer
set search_path = public
as $$
  select 
    p.id,
    p.tenant_id,
    t.slug as tenant_slug,
    p.sku,
    p.name,
    p.brand,
    p.category,
    p.price,
    case 
      when p.stock > 5 then 'in_stock'
      when p.stock between 1 and 5 then 'low_stock'
      else 'out_of_stock'
    end as stock_status,
    (p.stock > 0) as is_available,
    p.size,
    p.color,
    p.specs,
    p.images,
    p.is_web_published
  from public.products p
  join public.tenants t on t.id = p.tenant_id
  where p.is_web_published = true 
    and t.slug = p_tenant_slug;
$$;

-- Permisos públicos para anon y authenticated
revoke all on public.products from anon;
grant select on public.public_products to anon, authenticated;
grant execute on function public.get_public_catalog(text) to anon, authenticated;

-- Permisos sobre el resto de tablas para authenticated
grant select, insert, update, delete on public.tenants to authenticated;
grant select, insert, update, delete on public.user_profiles to authenticated;
grant select, insert, update, delete on public.employee_attendance to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.customer_events to authenticated;
grant select, insert, update, delete on public.workshop_tickets to authenticated;
grant select, insert, update, delete on public.rental_fleet to authenticated;
grant select, insert, update, delete on public.rental_bookings to authenticated;
grant select, insert, update, delete on public.accounting_ledger to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, update, delete on public.tenant_config to authenticated;

-- ==============================================================================
-- 5. Activación de RLS en TODAS las 14 Tablas
-- ==============================================================================

alter table public.tenants enable row level security;
alter table public.user_profiles enable row level security;
alter table public.employee_attendance enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.customers enable row level security;
alter table public.customer_events enable row level security;
alter table public.workshop_tickets enable row level security;
alter table public.rental_fleet enable row level security;
alter table public.rental_bookings enable row level security;
alter table public.accounting_ledger enable row level security;
alter table public.tasks enable row level security;
alter table public.tenant_config enable row level security;

-- ==============================================================================
-- 6. Políticas RLS Completas (select, insert, update, delete)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Tabla 1: tenants
-- ------------------------------------------------------------------------------
create policy "tenants_select" on public.tenants
  for select to authenticated
  using (id = public.get_auth_tenant_id());

create policy "tenants_insert" on public.tenants
  for insert to authenticated
  with check (false);

create policy "tenants_update" on public.tenants
  for update to authenticated
  using (id = public.get_auth_tenant_id() and public.is_tenant_admin())
  with check (id = public.get_auth_tenant_id() and public.is_tenant_admin());

create policy "tenants_delete" on public.tenants
  for delete to authenticated
  using (false);

-- ------------------------------------------------------------------------------
-- Tabla 2: user_profiles
-- ------------------------------------------------------------------------------
create policy "user_profiles_select" on public.user_profiles
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "user_profiles_insert" on public.user_profiles
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

create policy "user_profiles_update" on public.user_profiles
  for update to authenticated
  using (
    (id = auth.uid() and tenant_id = public.get_auth_tenant_id()) 
    or 
    (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin())
  )
  with check (tenant_id = public.get_auth_tenant_id());

create policy "user_profiles_delete" on public.user_profiles
  for delete to authenticated
  using (
    tenant_id = public.get_auth_tenant_id() 
    and public.is_tenant_admin() 
    and id <> auth.uid()
  );

-- ------------------------------------------------------------------------------
-- Tabla 3: employee_attendance
-- ------------------------------------------------------------------------------
create policy "employee_attendance_select" on public.employee_attendance
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "employee_attendance_insert" on public.employee_attendance
  for insert to authenticated
  with check (
    tenant_id = public.get_auth_tenant_id() 
    and (user_id = auth.uid() or public.is_tenant_admin())
  );

create policy "employee_attendance_update" on public.employee_attendance
  for update to authenticated
  using (
    tenant_id = public.get_auth_tenant_id() 
    and (user_id = auth.uid() or public.is_tenant_admin())
  )
  with check (tenant_id = public.get_auth_tenant_id());

create policy "employee_attendance_delete" on public.employee_attendance
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

-- ------------------------------------------------------------------------------
-- Tabla 4: products
-- ------------------------------------------------------------------------------
create policy "products_select" on public.products
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "products_insert" on public.products
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "products_update" on public.products
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

create policy "products_delete" on public.products
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

-- ------------------------------------------------------------------------------
-- Tabla 5: orders
-- ------------------------------------------------------------------------------
create policy "orders_select" on public.orders
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "orders_insert" on public.orders
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "orders_update" on public.orders
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

create policy "orders_delete" on public.orders
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

-- ------------------------------------------------------------------------------
-- Tabla 6: order_items
-- ------------------------------------------------------------------------------
create policy "order_items_select" on public.order_items
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "order_items_insert" on public.order_items
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "order_items_update" on public.order_items
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

create policy "order_items_delete" on public.order_items
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

-- ------------------------------------------------------------------------------
-- Tabla 7: customers
-- ------------------------------------------------------------------------------
create policy "customers_select" on public.customers
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "customers_insert" on public.customers
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "customers_update" on public.customers
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

create policy "customers_delete" on public.customers
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

-- ------------------------------------------------------------------------------
-- Tabla 8: customer_events
-- ------------------------------------------------------------------------------
create policy "customer_events_select" on public.customer_events
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "customer_events_insert" on public.customer_events
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "customer_events_update" on public.customer_events
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

create policy "customer_events_delete" on public.customer_events
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

-- ------------------------------------------------------------------------------
-- Tabla 9: workshop_tickets
-- ------------------------------------------------------------------------------
create policy "workshop_tickets_select" on public.workshop_tickets
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "workshop_tickets_insert" on public.workshop_tickets
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "workshop_tickets_update" on public.workshop_tickets
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

create policy "workshop_tickets_delete" on public.workshop_tickets
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

-- ------------------------------------------------------------------------------
-- Tabla 10: rental_fleet
-- ------------------------------------------------------------------------------
create policy "rental_fleet_select" on public.rental_fleet
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "rental_fleet_insert" on public.rental_fleet
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "rental_fleet_update" on public.rental_fleet
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

create policy "rental_fleet_delete" on public.rental_fleet
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

-- ------------------------------------------------------------------------------
-- Tabla 11: rental_bookings
-- ------------------------------------------------------------------------------
create policy "rental_bookings_select" on public.rental_bookings
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "rental_bookings_insert" on public.rental_bookings
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "rental_bookings_update" on public.rental_bookings
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

-- ------------------------------------------------------------------------------
-- Tabla 12: accounting_ledger (INMUTABLE: Nadie puede borrar)
-- ------------------------------------------------------------------------------
create policy "accounting_ledger_select" on public.accounting_ledger
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "accounting_ledger_insert" on public.accounting_ledger
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "accounting_ledger_update" on public.accounting_ledger
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin())
  with check (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

create policy "accounting_ledger_delete" on public.accounting_ledger
  for delete to authenticated
  using (false); -- ¡PROHIBIDO BORRAR REGISTROS CONTABLES!

-- ------------------------------------------------------------------------------
-- Tabla 13: tasks
-- ------------------------------------------------------------------------------
create policy "tasks_select" on public.tasks
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "tasks_insert" on public.tasks
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id());

create policy "tasks_update" on public.tasks
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id())
  with check (tenant_id = public.get_auth_tenant_id());

create policy "tasks_delete" on public.tasks
  for delete to authenticated
  using (tenant_id = public.get_auth_tenant_id());

-- ------------------------------------------------------------------------------
-- Tabla 14: tenant_config
-- ------------------------------------------------------------------------------
create policy "tenant_config_select" on public.tenant_config
  for select to authenticated
  using (tenant_id = public.get_auth_tenant_id());

create policy "tenant_config_insert" on public.tenant_config
  for insert to authenticated
  with check (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

create policy "tenant_config_update" on public.tenant_config
  for update to authenticated
  using (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin())
  with check (tenant_id = public.get_auth_tenant_id() and public.is_tenant_admin());

create policy "tenant_config_delete" on public.tenant_config
  for delete to authenticated
  using (false); -- La configuración no se borra, solo se edita

-- ==============================================================================
-- 7. Triggers de Protección contra Escalación de Privilegios e Inmutabilidad
-- ==============================================================================

-- Trigger 1: Prevención de escalación en user_profiles
create or replace function public.validate_user_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 1. El ID de auth nunca puede cambiarse
  if new.id is distinct from old.id then
    raise exception 'Violación de seguridad: El ID del usuario es inmutable.' using errcode = '42501';
  end if;

  -- 2. El tenant_id nunca puede cambiarse (ni siquiera por un admin)
  if new.tenant_id is distinct from old.tenant_id then
    raise exception 'Violación de seguridad: El tenant_id de un usuario es estrictamente inmutable.' using errcode = '42501';
  end if;

  -- 3. Solo un administrador de la misma tienda puede modificar roles
  if new.role is distinct from old.role then
    if not public.is_tenant_admin() then
      raise exception 'Privilegios insuficientes: Solo un administrador puede modificar roles de usuario.' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_user_profile_update on public.user_profiles;
create trigger trg_validate_user_profile_update
  before update on public.user_profiles
  for each row
  execute function public.validate_user_profile_update();

-- Trigger 2: Inmutabilidad estricta de tenant_id en todas las tablas
create or replace function public.enforce_tenant_immutability()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.tenant_id is distinct from old.tenant_id then
    raise exception 'Violación de seguridad: tenant_id es inmutable en la tabla %', TG_TABLE_NAME
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_immutable_tenant_products on public.products;
create trigger trg_immutable_tenant_products before update on public.products for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_orders on public.orders;
create trigger trg_immutable_tenant_orders before update on public.orders for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_order_items on public.order_items;
create trigger trg_immutable_tenant_order_items before update on public.order_items for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_customers on public.customers;
create trigger trg_immutable_tenant_customers before update on public.customers for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_customer_events on public.customer_events;
create trigger trg_immutable_tenant_customer_events before update on public.customer_events for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_workshop_tickets on public.workshop_tickets;
create trigger trg_immutable_tenant_workshop_tickets before update on public.workshop_tickets for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_rental_fleet on public.rental_fleet;
create trigger trg_immutable_tenant_rental_fleet before update on public.rental_fleet for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_rental_bookings on public.rental_bookings;
create trigger trg_immutable_tenant_rental_bookings before update on public.rental_bookings for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_accounting_ledger on public.accounting_ledger;
create trigger trg_immutable_tenant_accounting_ledger before update on public.accounting_ledger for each row execute function public.enforce_tenant_immutability();

drop trigger if exists trg_immutable_tenant_tasks on public.tasks;
create trigger trg_immutable_tenant_tasks before update on public.tasks for each row execute function public.enforce_tenant_immutability();

-- Trigger 3: Inmutabilidad de user_id en employee_attendance
create or replace function public.validate_attendance_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is distinct from old.user_id then
    raise exception 'Violación de seguridad: user_id en employee_attendance es inmutable.' using errcode = '42501';
  end if;
  if not public.is_tenant_admin() and new.check_in is distinct from old.check_in then
    raise exception 'Privilegios insuficientes: Solo un administrador puede alterar la hora de entrada (check_in).' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_validate_attendance_update on public.employee_attendance;
create trigger trg_validate_attendance_update
  before update on public.employee_attendance
  for each row
  execute function public.validate_attendance_update();

