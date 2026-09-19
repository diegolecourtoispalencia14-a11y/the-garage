-- ==============================================================================
-- BiciSaaS & The Garage — Catálogo Oficial de Lanzamiento (Supabase Cloud)
-- Limpia productos no oficiales y registra las Bicicletas Oficiales de Google Drive
-- ==============================================================================

-- 1. Limpieza de inventario y reservas previas para dejar todo limpio
delete from public.order_items where tenant_id = '00000000-0000-0000-0000-00000000000a';
delete from public.orders where tenant_id = '00000000-0000-0000-0000-00000000000a';
delete from public.products where tenant_id = '00000000-0000-0000-0000-00000000000a';
delete from public.rental_bookings where tenant_id = '00000000-0000-0000-0000-00000000000a';
delete from public.rental_fleet where tenant_id = '00000000-0000-0000-0000-00000000000a';

-- 2. Inserción de las Bicicletas Oficiales en public.products con Precios Exactos de Google Drive
insert into public.products (tenant_id, sku, name, brand, category, size, color, price, cost, margin_percent, stock, min_stock_alert, is_web_published, images, specs) values
  ('00000000-0000-0000-0000-00000000000a', 'GNT-TCR-M', 'Giant TCR Advanced Carbon', 'Giant', 'Ruta', 'M', 'Azul Cobalto Brillante', 29900.00, 19435.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/giant-tcr-1.jpg', '/img/catalogo/giant-tcr-2.jpg'], '{"cuadro": "Carbón Advanced", "grupo": "Shimano Tiagra 2x10 vel", "frenos": "Herradura aluminio", "rodada": "700c"}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'SCT-ASP-29S', 'Scott Aspect R29 Deore 12V', 'Scott', 'MTB', 'S', 'Negro con vivos Naranja Amber', 12800.00, 8320.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/scott-r29-1.jpg', '/img/catalogo/scott-r29-2.jpg'], '{"cuadro": "Aluminio Hidroformado", "grupo": "Shimano Deore 1x12 vel", "frenos": "Hidráulicos Shimano", "rodada": "29\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'SPZ-CROSS-M', 'Specialized Crosstrail 29 Disc', 'Specialized', 'Urbana', 'M', 'Negro Mate con vivos Amarillo Neón', 7900.00, 5135.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/specialized-crosstrail-r29-1.jpg', '/img/catalogo/specialized-crosstrail-r29-2.jpg'], '{"cuadro": "Aluminio A1 Premium", "grupo": "Shimano Altus 2x8 vel", "frenos": "Disco mecánico", "rodada": "700x38C"}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'GNT-DEFY-M', 'Giant Defy Aluxx Road', 'Giant', 'Ruta', 'M', 'Blanco Perla con detalles Plata', 13500.00, 8775.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/giant-defy-1.jpg', '/img/catalogo/giant-defy-2.jpg'], '{"cuadro": "Aluminio ALUXX con tijera carbón", "grupo": "Shimano 2x10 vel (Tiagra/Ultegra/105)", "frenos": "Herradura", "rodada": "700c"}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'LIV-AVAIL-S', 'Liv Avail Aluxx Road Mujer', 'Liv', 'Ruta', 'S', 'Blanco y Aqua', 9900.00, 6435.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/liv-avail-1.jpg', '/img/catalogo/liv-avail-2.jpg'], '{"cuadro": "Aluminio Liv 3F", "grupo": "Shimano Claris 2x8 vel", "frenos": "Herradura", "rodada": "700c"}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'GNT-STN-29S', 'Giant Stance 29 Doble Suspensión', 'Giant', 'MTB', 'S', 'Gris Titanio / Gunmetal', 14500.00, 9425.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/giant-stance-r29-1.jpg', '/img/catalogo/giant-stance-r29-2.jpg'], '{"cuadro": "Aluminio ALUXX doble suspensión", "grupo": "Shimano Deore 1x12 vel", "frenos": "Hidráulicos", "rodada": "29\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'MER-RNG-27', 'Mercurio Ranger 27.5 Sport', 'Mercurio', 'MTB', 'M', 'Negro Mate con Verde Lima', 2999.00, 1949.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/mercurio-ranger-r27-1.jpg', '/img/catalogo/mercurio-ranger-r27-2.jpg'], '{"cuadro": "Aluminio hidroformado", "grupo": "microSHIFT 3x7 vel", "frenos": "Freno de disco delantero", "rodada": "27.5\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'TRK-TF-29L', 'Trek Top Fuel 29 Carbon Full Suspension', 'Trek', 'MTB', 'L', 'Gris Titanio con acentos Rojo Escarlata', 44500.00, 28925.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/trek-top-fuel-r29-1.jpg', '/img/catalogo/trek-top-fuel-r29-2.jpg'], '{"cuadro": "Aluminio con manillar Bontrager carbono", "grupo": "Shimano SLX/XT 12 vel", "frenos": "SRAM DB8 hidráulicos", "rodada": "29\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'ORB-ONNA-29M', 'Orbea Onna 29 Hardtail', 'Orbea', 'MTB', 'M', 'Terracota Metálico', 13000.00, 8450.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/orbea-onna-r29-1.jpg', '/img/catalogo/orbea-onna-r29-2.jpg'], '{"cuadro": "Aluminio Hidroformado", "grupo": "Shimano Deore 1x12 vel", "frenos": "Frenos hidráulicos", "rodada": "29\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'MER-RNG-29M', 'Mercurio Ranger 29 Sport', 'Mercurio', 'MTB', 'M', 'Rojo con Negro', 3000.00, 1950.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/mercurio-ranger-r29-1.jpg', '/img/catalogo/mercurio-ranger-r29-2.jpg'], '{"cuadro": "Aluminio rodada 29", "grupo": "Shimano 3x7 vel", "frenos": "Frenos mecánicos de disco", "rodada": "29\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'GNT-STN-27M', 'Giant Stance 27.5 Full Suspension', 'Giant', 'MTB', 'M', 'Negro con acentos Rojo y Naranja', 15000.00, 9750.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/giant-stance-r27-1.jpg', '/img/catalogo/giant-stance-r27-2.jpg'], '{"cuadro": "Aluminio doble suspensión", "grupo": "Shimano Deore 1x10 vel", "frenos": "Disco hidráulico", "rodada": "27.5\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'TRX-QST-29S', 'Trinx Quest M100 R29', 'Trinx', 'MTB', 'S', 'Azul Petróleo con detalles Flúor', 7800.00, 5070.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/trinx-r29-1.jpg', '/img/catalogo/trinx-r29-2.jpg'], '{"cuadro": "Aluminio 6061", "grupo": "Shimano 2x8 vel", "frenos": "Shimano MT200 hidráulicos", "rodada": "29\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'GT-STMP-24', 'GT Stomper 24 Infantil/Juvenil', 'GT', 'Infantil', 'Juvenil', 'Azul Celeste con Naranja Neón', 3900.00, 2535.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/gt-stomper-r24-1.jpg', '/img/catalogo/gt-stomper-r24-2.jpg'], '{"cuadro": "Aluminio Ligero GT LegitFit", "grupo": "Shimano Altus 1x8 vel", "frenos": "Mecánicos", "rodada": "24\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'GNT-TLJR-24', 'Giant Talon Jr 24 Infantil/Juvenil', 'Giant', 'Infantil', 'Juvenil', 'Azul Marino con Verde Lima', 6900.00, 4485.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/giant-talon-jr-r24-1.jpg', '/img/catalogo/giant-talon-jr-r24-2.jpg'], '{"cuadro": "Aluminio ALUXX-Grade", "grupo": "Shimano 1x7 vel", "frenos": "Disco mecánico", "rodada": "24\""}'::jsonb),
  ('00000000-0000-0000-0000-00000000000a', 'SPZ-RIP-12', 'Specialized Riprock 12 Infantil', 'Specialized', 'Infantil', 'Infantil R12', 'Rosa Fucsia con detalles Turquesa', 3800.00, 2470.00, 35.00, 1, 1, true, ARRAY['/img/catalogo/specialized-riprock-r12-1.jpg', '/img/catalogo/specialized-riprock-r12-2.jpg', '/img/catalogo/specialized-riprock-r12-3.jpg'], '{"cuadro": "Aluminio A1 Premium", "grupo": "Single Speed", "frenos": "Contrapedal trasero", "rodada": "12\""}'::jsonb);

-- 3. Inserción de la Flota de Renta Oficial en public.rental_fleet
-- Solo las bicicletas designadas para renta en Google Drive
insert into public.rental_fleet (tenant_id, bike_code, model, type, size, rate_per_day, status) values
  ('00000000-0000-0000-0000-00000000000a', 'TG-GNT-DEF02', 'Giant Defy Aluxx Road', 'Ruta', 'M', 300.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-LIV-AVA03', 'Liv Avail Aluxx Road Mujer', 'Ruta', 'S', 300.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-GNT-STN04', 'Giant Stance 29 FlexPoint', 'MTB', 'S', 300.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-ORB-ONN05', 'Orbea Onna 29 Hardtail', 'MTB', 'M', 300.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-SCT-ASP06', 'Scott Aspect R29 Deore 12V', 'MTB', 'S', 300.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-TRX-QST07', 'Trinx Quest R29', 'MTB', 'S', 300.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-MER-R2908', 'Mercurio Ranger 29 Sport', 'MTB', 'M', 300.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-MER-R2709', 'Mercurio Ranger 27.5 Sport', 'MTB', 'M', 300.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-GT-ST2410', 'GT Stomper 24 Juvenil', 'Infantil', 'Juvenil', 250.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-GNT-JR2411', 'Giant Talon Jr 24', 'Infantil', 'Juvenil', 250.00, 'available'),
  ('00000000-0000-0000-0000-00000000000a', 'TG-SPZ-CRS12', 'Specialized Crosstrail 29', 'Urbana', 'M', 300.00, 'available');
