-- ==============================================================================
-- BiciSaaS & The Garage — Datos de Prueba para Tienda A y Tienda B
-- ==============================================================================

-- 1. Limpieza previa en orden inverso de claves foráneas
delete from public.order_items;
delete from public.orders;
delete from public.workshop_tickets;
delete from public.rental_bookings;
delete from public.rental_fleet;
delete from public.customer_events;
delete from public.customers;
delete from public.products;
delete from public.accounting_ledger;
delete from public.tasks;
delete from public.employee_attendance;
delete from public.tenant_config;
delete from public.user_profiles;
delete from public.tenants;
delete from auth.users where email like '%@tienda-%.com';

-- 2. Inquilinos Ficticios (Tenants)
insert into public.tenants (id, name, slug, domain) values
  ('00000000-0000-0000-0000-00000000000a', 'Tienda A (The Garage)', 'tienda-a', 'tienda-a.com'),
  ('00000000-0000-0000-0000-00000000000b', 'Tienda B (Cancun Bikes)', 'tienda-b', 'tienda-b.com');

-- 3. Usuarios en auth.users
insert into auth.users (id, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'admin@tienda-a.com'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'empleado@tienda-a.com'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000001', 'admin@tienda-b.com'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000002', 'empleado@tienda-b.com');

-- 4. Perfiles en public.user_profiles
insert into public.user_profiles (id, tenant_id, role, full_name, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', '00000000-0000-0000-0000-00000000000a', 'admin', 'Admin Tienda A', 'admin@tienda-a.com'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000002', '00000000-0000-0000-0000-00000000000a', 'staff', 'Empleado Tienda A', 'empleado@tienda-a.com'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000001', '00000000-0000-0000-0000-00000000000b', 'admin', 'Admin Tienda B', 'admin@tienda-b.com'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000002', '00000000-0000-0000-0000-00000000000b', 'staff', 'Empleado Tienda B', 'empleado@tienda-b.com');

-- 5. Configuración de Tienda (tenant_config)
insert into public.tenant_config (tenant_id, business_name, rfc, address, phone, currency) values
  ('00000000-0000-0000-0000-00000000000a', 'The Garage Playa S.A. de C.V.', 'GAR20230101ABC', 'Av. 10 Sur, Playa del Carmen', '9841234567', 'MXN'),
  ('00000000-0000-0000-0000-00000000000b', 'Cancun Bikes Pro S.A. de C.V.', 'CBP20240202XYZ', 'Av. Bonampak, Cancun', '9987654321', 'MXN');

-- 6. Asistencia de Empleados (employee_attendance)
insert into public.employee_attendance (id, tenant_id, user_id, date, check_in, status) values
  ('11111111-1111-1111-1111-000000000001', '00000000-0000-0000-0000-00000000000a', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', current_date, now() - interval '4 hours', 'present'),
  ('22222222-2222-2222-2222-000000000001', '00000000-0000-0000-0000-00000000000b', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000002', current_date, now() - interval '3 hours', 'present');

-- 7. Productos (products) con columnas confidenciales y públicas
insert into public.products (id, tenant_id, sku, name, brand, category, size, color, price, cost, margin_percent, stock, supplier, is_web_published) values
  -- Tienda A: 1 publicado, 1 no publicado
  ('11111111-aaaa-aaaa-aaaa-000000000001', '00000000-0000-0000-0000-00000000000a', 'PROD-A-01', 'Bicicleta Trek Marlin 7', 'Trek', 'Montaña', 'M', 'Azul', 18500.00, 11000.00, 40.54, 8, 'Distribuidora Trek Mexico', true),
  ('11111111-aaaa-aaaa-aaaa-000000000002', '00000000-0000-0000-0000-00000000000a', 'PROD-A-02', 'Cadena KMC X11 Secreta', 'KMC', 'Refacciones', 'Unica', 'Plata', 650.00, 280.00, 56.92, 2, 'Mayorista CicloPartes', false),
  -- Tienda B: 1 publicado, 1 no publicado
  ('22222222-bbbb-bbbb-bbbb-000000000001', '00000000-0000-0000-0000-00000000000b', 'PROD-B-01', 'Bicicleta Specialized Rockhopper', 'Specialized', 'Montaña', 'L', 'Negro', 21000.00, 13500.00, 35.71, 4, 'Specialized Latin America', true),
  ('22222222-bbbb-bbbb-bbbb-000000000002', '00000000-0000-0000-0000-00000000000b', 'PROD-B-02', 'Pastillas Freno Shimano B05S', 'Shimano', 'Frenos', 'Unica', 'Rojo', 350.00, 120.00, 65.71, 0, 'Shimano Mexico', false);

-- 8. Clientes (customers)
insert into public.customers (id, tenant_id, name, email, phone) values
  ('11111111-cccc-cccc-cccc-000000000001', '00000000-0000-0000-0000-00000000000a', 'Carlos Perez (Cliente A)', 'carlos@cliente-a.com', '9841112233'),
  ('22222222-cccc-cccc-cccc-000000000001', '00000000-0000-0000-0000-00000000000b', 'Mariana Lopez (Cliente B)', 'mariana@cliente-b.com', '9984445566');

-- 9. Eventos de CRM (customer_events)
insert into public.customer_events (id, tenant_id, customer_id, event_type, description) values
  ('11111111-ee00-ee00-ee00-000000000001', '00000000-0000-0000-0000-00000000000a', '11111111-cccc-cccc-cccc-000000000001', 'visita', 'Cliente pregunto por mantenimiento general'),
  ('22222222-ee00-ee00-ee00-000000000001', '00000000-0000-0000-0000-00000000000b', '22222222-cccc-cccc-cccc-000000000001', 'llamada', 'Cliente pidio cotizacion de suspension');

-- 10. Órdenes (orders)
insert into public.orders (id, tenant_id, order_number, customer_id, total, payment_method) values
  ('11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'ORD-A-1001', '11111111-cccc-cccc-cccc-000000000001', 18500.00, 'tarjeta'),
  ('22222222-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'ORD-B-2001', '22222222-cccc-cccc-cccc-000000000001', 21000.00, 'efectivo');

-- 11. Partidas de Órdenes (order_items con tenant_id)
insert into public.order_items (id, tenant_id, order_id, product_id, quantity, unit_price, subtotal) values
  ('11111111-0001-0001-0001-000000000001', '00000000-0000-0000-0000-00000000000a', '11111111-0000-0000-0000-000000000001', '11111111-aaaa-aaaa-aaaa-000000000001', 1, 18500.00, 18500.00),
  ('22222222-0001-0001-0001-000000000001', '00000000-0000-0000-0000-00000000000b', '22222222-0000-0000-0000-000000000001', '22222222-bbbb-bbbb-bbbb-000000000001', 1, 21000.00, 21000.00);

-- 12. Tickets de Taller (workshop_tickets)
insert into public.workshop_tickets (id, tenant_id, ticket_number, customer_id, bike_description, services_requested, total_estimated) values
  ('11111111-3333-3333-3333-000000000001', '00000000-0000-0000-0000-00000000000a', 'WS-A-01', '11111111-cccc-cccc-cccc-000000000001', 'Trek Marlin 5 Azul', '["Ajuste de cambios", "Purga de frenos"]'::jsonb, 650.00),
  ('22222222-3333-3333-3333-000000000001', '00000000-0000-0000-0000-00000000000b', 'WS-B-01', '22222222-cccc-cccc-cccc-000000000001', 'Specialized Chisel Roja', '["Mantenimiento suspension"]'::jsonb, 1200.00);

-- 13. Flota de Renta (rental_fleet)
insert into public.rental_fleet (id, tenant_id, bike_code, model, type, rate_per_day) values
  ('11111111-4444-4444-4444-000000000001', '00000000-0000-0000-0000-00000000000a', 'RENT-A-01', 'Cruiser Vintage Playa', 'Cruiser', 350.00),
  ('22222222-4444-4444-4444-000000000001', '00000000-0000-0000-0000-00000000000b', 'RENT-B-01', 'Gravel Cannondale Topstone', 'Gravel', 850.00);

-- 14. Reservas de Renta (rental_bookings)
insert into public.rental_bookings (id, tenant_id, booking_number, fleet_id, customer_name, start_date, end_date, deposit_amount) values
  ('11111111-5555-5555-5555-000000000001', '00000000-0000-0000-0000-00000000000a', 'BK-A-01', '11111111-4444-4444-4444-000000000001', 'John Doe Turista', current_date, current_date + 2, 500.00),
  ('22222222-5555-5555-5555-000000000001', '00000000-0000-0000-0000-00000000000b', 'BK-B-01', '22222222-4444-4444-4444-000000000001', 'Alice Smith Turista', current_date, current_date + 3, 1000.00);

-- 15. Libro Mayor Contable (accounting_ledger)
insert into public.accounting_ledger (id, tenant_id, type, amount, category, description) values
  ('11111111-6666-6666-6666-000000000001', '00000000-0000-0000-0000-00000000000a', 'income', 18500.00, 'ventas_bicicletas', 'Venta ORD-A-1001'),
  ('22222222-6666-6666-6666-000000000001', '00000000-0000-0000-0000-00000000000b', 'income', 21000.00, 'ventas_bicicletas', 'Venta ORD-B-2001');

-- 16. Tareas de Empleados (tasks)
insert into public.tasks (id, tenant_id, title, description, assigned_to) values
  ('11111111-9999-9999-9999-000000000001', '00000000-0000-0000-0000-00000000000a', 'Limpieza de exhibidor', 'Acomodar vitrina delantera', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002'),
  ('22222222-9999-9999-9999-000000000001', '00000000-0000-0000-0000-00000000000b', 'Inventario de aceites', 'Contar botes de lubricante Muc-Off', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000002');
