-- ══════════════════════════════════════════════════════════════════════════════
-- BiciSaaS & The Garage — Parche de Integraciones en Vivo
-- Mercado Pago (Pasarela de Cobro y Webhooks) & Google Perfil de Negocio
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Añadir configuración de Mercado Pago a la tienda
alter table public.tenant_config 
add column if not exists mercadopago_settings jsonb default '{"mode": "production", "configured": true, "webhook_url": "https://the-garage-dw4.pages.dev/api/mercadopago-webhook"}'::jsonb;

-- 2. Añadir ficha oficial de Google Business Profile y Google Maps
alter table public.tenant_config 
add column if not exists google_profile_settings jsonb default '{"place_id": "thegarage-pdc-cataluna", "business_name": "The Garage Bike Experts", "address": "Av. Ich Xeel, Cataluña, Playa del Carmen", "verified_phone": "+529841381493", "maps_url": "https://www.google.com/maps/search/?api=1&query=The+Garage+Bike+Experts+Av+Ich+Xeel+Catalu%C3%B1a+Playa+del+Carmen"}'::jsonb;

-- 3. Añadir trazabilidad de pagos digitales y webhooks a la tabla de órdenes
alter table public.orders
add column if not exists payment_id text,
add column if not exists payment_metadata jsonb default '{}'::jsonb;

-- Sincronizar permisos de lectura/escritura para el backend autenticado
grant select, update on public.tenant_config to authenticated;
grant select, insert, update on public.orders to authenticated;
