#!/usr/bin/env node
/**
 * BiciSaaS & The Garage — Despliegue y Suite de Pruebas en Supabase Cloud Real
 * 
 * 1. Lee credenciales de .env.supabase
 * 2. Aplica el esquema completo (14 tablas, RLS, funciones, triggers) vía PostgreSQL
 * 3. Crea usuarios reales en Supabase Auth y sincroniza perfiles
 * 4. Obtiene tokens JWT auténticos emitidos por GoTrue en la nube
 * 5. Ejecuta las 89 pruebas (82 de seguridad + 7 de camino feliz) contra Supabase Cloud
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// 1. Cargar variables de .env.supabase si existe
const envFile = path.join(__dirname, '../.env.supabase');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = val;
    }
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.log('\n================================================================================');
  console.log(' CONFIGURACIÓN REQUERIDA PARA EJECUTAR EN SUPABASE CLOUD');
  console.log('================================================================================\n');
  console.log('No se encontraron las variables de Supabase Cloud en .env.supabase.\n');
  console.log('PASO A PASO PARA CREAR EL PROYECTO REAL (Toma 2 minutos):');
  console.log(' 1. Entra a https://database.new (o https://supabase.com/dashboard)');
  console.log(' 2. Crea un proyecto nuevo gratuito:');
  console.log('    - Nombre: the-garage-test');
  console.log('    - Database Password: [Guarda tu contraseña segura]');
  console.log('    - Región: US East (N. Virginia) o Central (Dallas) para menor latencia con México.');
  console.log(' 3. En Project Settings -> API, copia:');
  console.log('    - Project URL');
  console.log('    - Project API keys -> anon (public)');
  console.log('    - Project API keys -> service_role (secret)');
  console.log(' 4. En Project Settings -> Database -> Connection string -> URI, copia:');
  console.log('    - Connection string (reemplazando [YOUR-PASSWORD])');
  console.log(' 5. Crea el archivo .env.supabase en este repositorio con esos 4 valores:');
  console.log('    (Puedes basarte en la plantilla .env.supabase.example)');
  console.log('\nLuego vuelve a ejecutar: node scripts/deploy-and-test-cloud.cjs\n');
  console.log('================================================================================\n');
  process.exit(1);
}

const TENANT_A_ID = '00000000-0000-0000-0000-00000000000a';
const TENANT_B_ID = '00000000-0000-0000-0000-00000000000b';

const ALL_TABLES = [
  'tenants',
  'user_profiles',
  'employee_attendance',
  'products',
  'orders',
  'order_items',
  'customers',
  'customer_events',
  'workshop_tickets',
  'rental_fleet',
  'rental_bookings',
  'accounting_ledger',
  'tasks',
  'tenant_config'
];

const testResults = [];
function recordTest(category, table, description, passed, detail = '') {
  testResults.push({ category, table, description, status: passed ? 'PASA' : 'FALLA', detail });
}

async function main() {
  console.log('\n================================================================================');
  console.log(' DESPLIEGUE Y CERTIFICACIÓN EN SUPABASE CLOUD (ENTORNO REAL)');
  console.log(` Destino: ${SUPABASE_URL}`);
  console.log('================================================================================\n');

  // 1. APLICAR MIGRACIÓN EN LA BASE DE DATOS
  if (SUPABASE_DB_URL) {
    console.log('PASO 1: Conectando a PostgreSQL en la nube para aplicar esquema y RLS...');
    const client = new Client({ connectionString: SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20260908000001_multi_tenant_schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✓ Esquema, funciones, 55 políticas RLS y triggers aplicados exitosamente en la nube.\n');
    await client.end();
  } else {
    console.log('ℹ SUPABASE_DB_URL no fue proporcionada. Asumiendo que el esquema ya fue aplicado en el SQL Editor de Supabase.\n');
  }

  // 2. CREAR CLIENTE ADMIN PARA SEMBRAR USUARIOS EN SUPABASE AUTH REAL
  console.log('PASO 2: Gestionando usuarios de prueba en Supabase Auth Real...');
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const TEST_USERS = [
    { email: 'admin@tienda-a.com', pass: 'BiciSaasAdmin2026!', role: 'admin', tenant: TENANT_A_ID, name: 'Admin Tienda A' },
    { email: 'empleado@tienda-a.com', pass: 'BiciSaasStaff2026!', role: 'staff', tenant: TENANT_A_ID, name: 'Empleado Tienda A' },
    { email: 'admin@tienda-b.com', pass: 'BiciSaasAdmin2026!', role: 'admin', tenant: TENANT_B_ID, name: 'Admin Tienda B' },
    { email: 'empleado@tienda-b.com', pass: 'BiciSaasStaff2026!', role: 'staff', tenant: TENANT_B_ID, name: 'Empleado Tienda B' }
  ];

  const userIds = {};

  for (const u of TEST_USERS) {
    // Intentar crear o verificar existencia
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.pass,
      email_confirm: true
    });

    let uid = data?.user?.id;
    if (error && error.message.includes('already exists')) {
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      const existing = listData?.users?.find(x => x.email === u.email);
      uid = existing?.id;
    }
    userIds[u.email] = uid;
  }

  // Sembrar inquilinos y perfiles
  await supabaseAdmin.from('tenants').upsert([
    { id: TENANT_A_ID, name: 'Tienda A (The Garage)', slug: 'tienda-a', domain: 'tienda-a.com' },
    { id: TENANT_B_ID, name: 'Tienda B (Cancun Bikes)', slug: 'tienda-b', domain: 'tienda-b.com' }
  ]);

  for (const u of TEST_USERS) {
    const uid = userIds[u.email];
    if (uid) {
      await supabaseAdmin.from('user_profiles').upsert({
        id: uid,
        tenant_id: u.tenant,
        role: u.role,
        full_name: u.name,
        email: u.email
      });
    }
  }

  // Sembrar datos de prueba iniciales en cloud
  await supabaseAdmin.from('products').upsert([
    { id: '11111111-aaaa-aaaa-aaaa-000000000001', tenant_id: TENANT_A_ID, sku: 'PROD-A-01', name: 'Bicicleta Trek Marlin 7', brand: 'Trek', category: 'Montaña', price: 18500, cost: 11000, margin_percent: 40.54, stock: 8, is_web_published: true },
    { id: '11111111-aaaa-aaaa-aaaa-000000000002', tenant_id: TENANT_A_ID, sku: 'PROD-A-02', name: 'Cadena KMC X11 Secreta', brand: 'KMC', category: 'Refacciones', price: 650, cost: 280, margin_percent: 56.92, stock: 2, is_web_published: false },
    { id: '22222222-bbbb-bbbb-bbbb-000000000001', tenant_id: TENANT_B_ID, sku: 'PROD-B-01', name: 'Bicicleta Specialized Rockhopper', brand: 'Specialized', category: 'Montaña', price: 21000, cost: 13500, margin_percent: 35.71, stock: 4, is_web_published: true },
    { id: '22222222-bbbb-bbbb-bbbb-000000000002', tenant_id: TENANT_B_ID, sku: 'PROD-B-02', name: 'Pastillas Freno Shimano B05S', brand: 'Shimano', category: 'Frenos', price: 350, cost: 120, margin_percent: 65.71, stock: 0, is_web_published: false }
  ]);
  console.log('✓ Usuarios y datos iniciales sincronizados en Supabase Cloud.\n');

  // 3. INICIAR SESIÓN CON CREDENCIALES REALES EN GOTRUE
  console.log('PASO 3: Iniciando sesión en Supabase GoTrue Auth para obtener JWTs auténticos...');
  async function loginClient(email, pass) {
    const c = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    const { data, error } = await c.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${data.session.access_token}` } }
    });
  }

  const clientAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const clientEmpA = await loginClient('empleado@tienda-a.com', 'BiciSaasStaff2026!');
  const clientAdminA = await loginClient('admin@tienda-a.com', 'BiciSaasAdmin2026!');
  const clientEmpB = await loginClient('empleado@tienda-b.com', 'BiciSaasStaff2026!');
  const clientAdminB = await loginClient('admin@tienda-b.com', 'BiciSaasAdmin2026!');

  const UID_EMP_A = userIds['empleado@tienda-a.com'];
  const UID_ADMIN_A = userIds['admin@tienda-a.com'];
  console.log('✓ Sesiones creadas exitosamente con tokens JWT emitidos por la nube.\n');

  // 4. EJECUCIÓN DE LA SUITE COMPLETA (89 PRUEBAS)
  console.log('PASO 4: Ejecutando suite completa de 89 pruebas contra Supabase Cloud...');
  const startSuite = Date.now();

  // ---------------------------------------------------------------------------
  // GRUPO 1: ESCALACIÓN DE PRIVILEGIOS
  // ---------------------------------------------------------------------------
  const resRole = await clientEmpA.from('user_profiles').update({ role: 'admin' }).eq('id', UID_EMP_A);
  recordTest('1. Escalación Privilegios', 'user_profiles', 'Empleado intenta cambiar su propio rol a admin', resRole.error !== null, resRole.error?.message);

  const resTenant = await clientEmpA.from('user_profiles').update({ tenant_id: TENANT_B_ID }).eq('id', UID_EMP_A);
  recordTest('1. Escalación Privilegios', 'user_profiles', 'Empleado intenta cambiar su tenant_id a Tienda B', resTenant.error !== null, resTenant.error?.message);

  const resReadAfter = await clientEmpA.from('products').select('id').eq('tenant_id', TENANT_B_ID);
  recordTest('1. Escalación Privilegios', 'products', 'Empleado consulta productos de B tras intentos fallidos', !resReadAfter.error && resReadAfter.data.length === 0, `Filas: ${resReadAfter.data?.length || 0}`);

  const resAdminTenant = await clientAdminA.from('user_profiles').update({ tenant_id: TENANT_B_ID }).eq('id', UID_ADMIN_A);
  recordTest('1. Escalación Privilegios', 'user_profiles', 'Admin A intenta cambiar su tenant_id a Tienda B', resAdminTenant.error !== null, resAdminTenant.error?.message);

  const resCoworker = await clientEmpA.from('user_profiles').update({ role: 'admin' }).eq('id', UID_ADMIN_A).select();
  const countCoworker = resCoworker.data?.length || 0;
  recordTest('1. Escalación Privilegios', 'user_profiles', 'Empleado intenta modificar rol de compañero (0 filas)', countCoworker === 0, `Filas afectadas: ${countCoworker}`);

  const resAttend = await clientEmpA.from('employee_attendance').update({ user_id: UID_ADMIN_A }).eq('user_id', UID_EMP_A);
  recordTest('1. Escalación Privilegios', 'employee_attendance', 'Empleado intenta cambiar user_id en checador', resAttend.error !== null, resAttend.error?.message);

  // ---------------------------------------------------------------------------
  // GRUPO 2: UPDATE CRUZADO EN LAS 14 TABLAS
  // ---------------------------------------------------------------------------
  for (const tbl of ALL_TABLES) {
    const col = tbl === 'tenants' ? 'id' : 'tenant_id';
    const res = await clientEmpA.from(tbl).update({ name: 'HACK', description: 'HACK' }).eq(col, TENANT_B_ID).select();
    const count = res.data?.length || 0;
    recordTest('2. UPDATE Cruzado', tbl, `Empleado A intenta UPDATE en Tienda B (0 filas)`, count === 0 || res.error !== null, `Afectadas: ${count}`);
  }

  // ---------------------------------------------------------------------------
  // GRUPO 3: DELETE CRUZADO EN LAS 14 TABLAS
  // ---------------------------------------------------------------------------
  for (const tbl of ALL_TABLES) {
    const col = tbl === 'tenants' ? 'id' : 'tenant_id';
    const res = await clientEmpA.from(tbl).delete().eq(col, TENANT_B_ID).select();
    const count = res.data?.length || 0;
    recordTest('3. DELETE Cruzado', tbl, `Empleado A intenta DELETE en Tienda B (0 filas)`, count === 0 || res.error !== null, `Eliminadas: ${count}`);
  }

  // ---------------------------------------------------------------------------
  // GRUPO 4: ADMIN BLOQUEADO DE TIENDA B EN LAS 14 TABLAS (UPDATE & DELETE)
  // ---------------------------------------------------------------------------
  for (const tbl of ALL_TABLES) {
    const col = tbl === 'tenants' ? 'id' : 'tenant_id';
    const resUp = await clientAdminA.from(tbl).update({ name: 'HACK' }).eq(col, TENANT_B_ID).select();
    recordTest('4. Admin A Bloqueado', tbl, `Admin A intenta UPDATE en Tienda B (0 filas)`, (resUp.data?.length || 0) === 0 || resUp.error !== null);
    const resDel = await clientAdminA.from(tbl).delete().eq(col, TENANT_B_ID).select();
    recordTest('4. Admin A Bloqueado', tbl, `Admin A intenta DELETE en Tienda B (0 filas)`, (resDel.data?.length || 0) === 0 || resDel.error !== null);
  }

  // ---------------------------------------------------------------------------
  // GRUPO 5: BLOQUEO ANÓNIMO DIRECTO EN LAS 14 TABLAS
  // ---------------------------------------------------------------------------
  for (const tbl of ALL_TABLES) {
    const res = await clientAnon.from(tbl).select('*').limit(1);
    recordTest('5. Bloqueo Anónimo', tbl, `Anónimo intenta SELECT directo en tabla base`, res.error !== null, res.error?.code);
  }

  // ---------------------------------------------------------------------------
  // GRUPO 6: CATÁLOGO PÚBLICO
  // ---------------------------------------------------------------------------
  const resPub = await clientAnon.from('public_products').select('id, name, stock_status');
  recordTest('6. Catálogo Público', 'public_products', 'Anónimo lee vista pública', (resPub.data?.length || 0) > 0);

  const resCost = await clientAnon.from('public_products').select('cost');
  recordTest('6. Catálogo Público', 'public_products', 'Anónimo intenta leer columna cost (confidencial)', resCost.error !== null);

  const resSup = await clientAnon.from('public_products').select('supplier');
  recordTest('6. Catálogo Público', 'public_products', 'Anónimo intenta leer columna supplier (confidencial)', resSup.error !== null);

  const resRpc = await clientAnon.rpc('get_public_catalog', { p_tenant_slug: 'tienda-a' });
  const dataRpc = resRpc.data || [];
  recordTest('6. Catálogo Público', 'get_public_catalog', 'RPC aisla únicamente catálogo de Tienda A', dataRpc.length > 0 && dataRpc.every(x => x.tenant_slug === 'tienda-a'));

  const item = dataRpc[0] || {};
  recordTest('6. Catálogo Público', 'get_public_catalog', 'Stock exacto ausente y enmascarado como stock_status', !item.hasOwnProperty('stock') && item.hasOwnProperty('stock_status'));

  // ---------------------------------------------------------------------------
  // GRUPO 7: INMUTABILIDAD CONTABLE
  // ---------------------------------------------------------------------------
  const resDelLedger = await clientAdminA.from('accounting_ledger').delete().eq('tenant_id', TENANT_A_ID).select();
  recordTest('7. Inmutabilidad Contable', 'accounting_ledger', 'Admin intenta borrar asiento contable (0 eliminadas)', (resDelLedger.data?.length || 0) === 0);

  // ---------------------------------------------------------------------------
  // GRUPO 8: OPERACIONES LEGÍTIMAS (CAMINO FELIZ)
  // ---------------------------------------------------------------------------
  const resHappyOrder = await clientEmpA.from('orders').insert({ tenant_id: TENANT_A_ID, order_number: 'ORD-CLOUD-01', total: 18500, payment_method: 'efectivo' }).select();
  let passedItems = false;
  if (resHappyOrder.data?.length > 0) {
    const resItems = await clientEmpA.from('order_items').insert({ tenant_id: TENANT_A_ID, order_id: resHappyOrder.data[0].id, product_id: '11111111-aaaa-aaaa-aaaa-000000000001', quantity: 1, unit_price: 18500, subtotal: 18500 }).select();
    passedItems = resItems.data?.length > 0;
  }
  recordTest('8. Camino Feliz', 'orders + order_items', 'Empleado registra venta con partidas', passedItems);

  const resHappyP = await clientAdminA.from('products').insert({ tenant_id: TENANT_A_ID, sku: 'PROD-CLOUD-FOX', name: 'Casco Fox Proframe', price: 4500, cost: 2500, stock: 3, is_web_published: true }).select();
  recordTest('8. Camino Feliz', 'products', 'Admin da de alta producto', (resHappyP.data?.length || 0) > 0);

  const resHappyN = await clientEmpA.from('user_profiles').update({ full_name: 'Empleado Cloud Feliz' }).eq('id', UID_EMP_A).select();
  recordTest('8. Camino Feliz', 'user_profiles', 'Empleado edita su propio nombre', resHappyN.data?.[0]?.full_name === 'Empleado Cloud Feliz');

  const resHappyT = await clientEmpA.from('workshop_tickets').insert({ tenant_id: TENANT_A_ID, ticket_number: 'WS-CLOUD-01', customer_id: '11111111-cccc-cccc-cccc-000000000001', bike_description: 'Trek Top Fuel', status: 'received' }).select();
  let passedTicket = false;
  if (resHappyT.data?.length > 0) {
    const resClose = await clientEmpA.from('workshop_tickets').update({ status: 'delivered', total_estimated: 1400 }).eq('id', resHappyT.data[0].id).select();
    passedTicket = resClose.data?.[0]?.status === 'delivered';
  }
  recordTest('8. Camino Feliz', 'workshop_tickets', 'Empleado crea y cierra ticket de taller', passedTicket);

  const resHappyAtt = await clientEmpA.from('employee_attendance').insert({ tenant_id: TENANT_A_ID, user_id: UID_EMP_A, status: 'present' }).select();
  recordTest('8. Camino Feliz', 'employee_attendance', 'Empleado registra entrada en checador', (resHappyAtt.data?.length || 0) > 0);

  const resPromo = await clientAdminA.from('user_profiles').update({ role: 'admin' }).eq('id', UID_EMP_A).select();
  const passedPromo = resPromo.data?.[0]?.role === 'admin';
  await clientAdminA.from('user_profiles').update({ role: 'staff' }).eq('id', UID_EMP_A);
  recordTest('8. Camino Feliz', 'user_profiles', 'Admin promueve compañero de staff a admin', passedPromo);

  const resCatalogA = await clientAnon.rpc('get_public_catalog', { p_tenant_slug: 'tienda-a' });
  recordTest('8. Camino Feliz', 'get_public_catalog', 'Catálogo público devuelve productos publicados', (resCatalogA.data?.length || 0) > 0);

  const suiteDuration = ((Date.now() - startSuite) / 1000).toFixed(2);

  // 5. REPORTE FINAL
  console.log('\n================================================================================');
  console.log(' RESULTADOS DEL BANCO DE PRUEBAS EN SUPABASE CLOUD');
  console.log('================================================================================\n');
  console.log(`| # | Categoría | Tabla | Caso de Prueba | Resultado |`);
  console.log(`|---|---|---|---|:---:|`);

  let passedTotal = 0;
  let failedTotal = 0;

  testResults.forEach((t, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    if (t.status === 'PASA') passedTotal++;
    else failedTotal++;
    console.log(`| ${num} | ${t.category} | \`${t.table}\` | ${t.description} | **${t.status}** |`);
  });

  console.log('\n================================================================================');
  console.log(` TOTAL DE PRUEBAS: ${testResults.length} | PASADAS: ${passedTotal} | FALLADAS: ${failedTotal} | TIEMPO: ${suiteDuration}s`);
  if (failedTotal === 0) {
    console.log(' ESTADO: CERTIFICACIÓN 100% EXITOSA EN SUPABASE CLOUD');
  } else {
    console.log(' ESTADO: ERROR — HUBO PRUEBAS FALLIDAS EN LA NUBE');
  }
  console.log('================================================================================\n');
}

main().catch(err => {
  console.error('Error fatal durante la certificación en Supabase Cloud:', err);
  process.exit(1);
});
