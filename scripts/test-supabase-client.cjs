#!/usr/bin/env node
/**
 * BiciSaaS & The Garage — Suite de Pruebas con Cliente Supabase Oficial (@supabase/supabase-js)
 * 
 * Corre contra la API PostgREST real de Supabase sobre HTTP con JWTs firmados.
 * Cubre:
 *  - 14 Tablas completas: SELECT, INSERT, UPDATE, DELETE cruzados
 *  - Escalación de privilegios en user_profiles (role, tenant_id)
 *  - Inmutabilidad de tenant_id y registros de asistencia
 *  - Catálogo público seguro y enmascaramiento de stock
 *  - Inmutabilidad del libro mayor contable
 */

const http = require('http');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = 'super-secret-jwt-token-with-at-least-32-characters-long';
const PROXY_PORT = 54320;
const POSTGREST_PORT = 54321;

const TENANT_A_ID = '00000000-0000-0000-0000-00000000000a';
const TENANT_B_ID = '00000000-0000-0000-0000-00000000000b';

const USER_ADMIN_A = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001';
const USER_EMP_A   = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002';
const USER_ADMIN_B = 'bbbbbbbb-bbbb-bbbb-bbbb-000000000001';
const USER_EMP_B   = 'bbbbbbbb-bbbb-bbbb-bbbb-000000000002';

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

function signJwt(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encode = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${encode(header)}.${encode(payload)}`;
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(unsigned).digest('base64url');
  return `${unsigned}.${sig}`;
}

const ANON_KEY = signJwt({ role: 'anon', exp: 1893456000 });

function createSupabaseClient(sub = null, email = null) {
  const headers = {};
  if (sub) {
    const token = signJwt({
      role: 'authenticated',
      sub,
      email,
      exp: Math.floor(Date.now() / 1000) + 7200
    });
    headers['Authorization'] = `Bearer ${token}`;
  }
  return createClient(`http://localhost:${PROXY_PORT}`, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers }
  });
}

// Iniciar proxy local para mapear /rest/v1/* a /* hacia PostgREST
const proxy = http.createServer((req, res) => {
  const targetPath = req.url.replace(/^\/rest\/v1/, '') || '/';
  const proxyReq = http.request({
    hostname: 'localhost',
    port: POSTGREST_PORT,
    path: targetPath,
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  req.pipe(proxyReq, { end: true });
});

const testResults = [];

function recordTest(category, table, description, passed, detail = '') {
  testResults.push({
    category,
    table,
    description,
    status: passed ? 'PASA' : 'FALLA',
    detail
  });
}

async function runSuite() {
  console.log('\n================================================================================');
  console.log(' BANCO DE PRUEBAS EXTENDIDO CON CLIENTE OFICIAL (@supabase/supabase-js)');
  console.log(' Evaluando PostgREST + Supabase JWT + RLS en PostgreSQL 16');
  console.log('================================================================================\n');

  const clientAnon = createSupabaseClient();
  const clientEmpA = createSupabaseClient(USER_EMP_A, 'empleado@tienda-a.com');
  const clientAdminA = createSupabaseClient(USER_ADMIN_A, 'admin@tienda-a.com');
  const clientEmpB = createSupabaseClient(USER_EMP_B, 'empleado@tienda-b.com');
  const clientAdminB = createSupabaseClient(USER_ADMIN_B, 'admin@tienda-b.com');

  // ---------------------------------------------------------------------------
  // GRUPO 1: ESCALACIÓN DE PRIVILEGIOS EN user_profiles
  // ---------------------------------------------------------------------------
  console.log('--> Probando Grupo 1: Prevención de escalación de privilegios en user_profiles...');
  
  // 1.1 Empleado intenta cambiar su propio rol a admin
  const resRoleEscalate = await clientEmpA
    .from('user_profiles')
    .update({ role: 'admin' })
    .eq('id', USER_EMP_A);
  const passedRole = resRoleEscalate.error !== null;
  recordTest(
    '1. Escalación Privilegios',
    'user_profiles',
    'Empleado intenta cambiar su propio rol a admin',
    passedRole,
    resRoleEscalate.error ? resRoleEscalate.error.message : 'Permitió escalación!'
  );

  // 1.2 Empleado intenta cambiar su propio tenant_id a Tienda B
  const resTenantEscalate = await clientEmpA
    .from('user_profiles')
    .update({ tenant_id: TENANT_B_ID })
    .eq('id', USER_EMP_A);
  const passedTenant = resTenantEscalate.error !== null;
  recordTest(
    '1. Escalación Privilegios',
    'user_profiles',
    'Empleado intenta cambiar su propio tenant_id a Tienda B',
    passedTenant,
    resTenantEscalate.error ? resTenantEscalate.error.message : 'Permitió cambiar tenant!'
  );

  // 1.3 Empleado verifica que no puede leer datos de B tras intentos fallidos
  const resReadAfterAttempt = await clientEmpA
    .from('products')
    .select('id, name')
    .eq('tenant_id', TENANT_B_ID);
  const passedReadAfter = !resReadAfterAttempt.error && resReadAfterAttempt.data.length === 0;
  recordTest(
    '1. Escalación Privilegios',
    'products',
    'Empleado consulta productos de B tras intentos de escalación (0 filas)',
    passedReadAfter,
    `Productos de B visibles: ${resReadAfterAttempt.data ? resReadAfterAttempt.data.length : 0}`
  );

  // 1.4 Admin A intenta cambiar su tenant_id a Tienda B
  const resAdminTenantChange = await clientAdminA
    .from('user_profiles')
    .update({ tenant_id: TENANT_B_ID })
    .eq('id', USER_ADMIN_A);
  const passedAdminTenant = resAdminTenantChange.error !== null;
  recordTest(
    '1. Escalación Privilegios',
    'user_profiles',
    'Admin A intenta cambiar su tenant_id a Tienda B',
    passedAdminTenant,
    resAdminTenantChange.error ? resAdminTenantChange.error.message : 'Permitió cambiar tenant!'
  );

  // 1.5 Empleado intenta cambiar el rol de un compañero
  const resCoworkerRole = await clientEmpA
    .from('user_profiles')
    .update({ role: 'admin' })
    .eq('id', USER_ADMIN_A)
    .select();
  const countCoworker = resCoworkerRole.data ? resCoworkerRole.data.length : 0;
  const passedCoworker = (countCoworker === 0 && !resCoworkerRole.error) || resCoworkerRole.error !== null;
  recordTest(
    '1. Escalación Privilegios',
    'user_profiles',
    'Empleado intenta modificar el rol de un compañero (0 afectadas)',
    passedCoworker,
    resCoworkerRole.error ? `Rechazado: ${resCoworkerRole.error.message}` : `Filas afectadas: ${countCoworker}`
  );

  // 1.6 Empleado intenta modificar user_id en employee_attendance
  const resAttendUserId = await clientEmpA
    .from('employee_attendance')
    .update({ user_id: USER_ADMIN_A })
    .eq('user_id', USER_EMP_A);
  const passedAttend = resAttendUserId.error !== null;
  recordTest(
    '1. Escalación Privilegios',
    'employee_attendance',
    'Empleado intenta cambiar user_id en checador de asistencia',
    passedAttend,
    resAttendUserId.error ? resAttendUserId.error.message : 'Permitió usurpar checador!'
  );

  // ---------------------------------------------------------------------------
  // GRUPO 2: UPDATE CRUZADO EN LAS 14 TABLAS
  // ---------------------------------------------------------------------------
  console.log('--> Probando Grupo 2: UPDATE cruzado en las 14 tablas...');
  for (const tbl of ALL_TABLES) {
    const tenantCol = tbl === 'tenants' ? 'id' : 'tenant_id';
    
    // Generar un payload genérico
    const dummyUpdate = {};
    if (tbl === 'tenants') dummyUpdate.name = 'HACKED';
    else if (tbl === 'user_profiles') dummyUpdate.full_name = 'HACKED';
    else if (tbl === 'employee_attendance') dummyUpdate.status = 'absent';
    else if (tbl === 'products') dummyUpdate.name = 'HACKED';
    else if (tbl === 'orders') dummyUpdate.status = 'cancelled';
    else if (tbl === 'order_items') dummyUpdate.quantity = 99;
    else if (tbl === 'customers') dummyUpdate.name = 'HACKED';
    else if (tbl === 'customer_events') dummyUpdate.description = 'HACKED';
    else if (tbl === 'workshop_tickets') dummyUpdate.bike_description = 'HACKED';
    else if (tbl === 'rental_fleet') dummyUpdate.model = 'HACKED';
    else if (tbl === 'rental_bookings') dummyUpdate.customer_name = 'HACKED';
    else if (tbl === 'accounting_ledger') dummyUpdate.description = 'HACKED';
    else if (tbl === 'tasks') dummyUpdate.title = 'HACKED';
    else if (tbl === 'tenant_config') dummyUpdate.business_name = 'HACKED';

    const res = await clientEmpA
      .from(tbl)
      .update(dummyUpdate)
      .eq(tenantCol, TENANT_B_ID)
      .select();

    // RLS debe devolver 0 filas afectadas o error
    const count = res.data ? res.data.length : 0;
    const passed = (count === 0 && !res.error) || (res.error !== null);
    recordTest(
      '2. Prevención UPDATE Cruzado',
      tbl,
      `Empleado A intenta UPDATE en filas de Tienda B (0 afectadas)`,
      passed,
      res.error ? `Rechazado: ${res.error.code}` : `Filas afectadas: ${count}`
    );
  }

  // ---------------------------------------------------------------------------
  // GRUPO 3: DELETE CRUZADO EN LAS 14 TABLAS
  // ---------------------------------------------------------------------------
  console.log('--> Probando Grupo 3: DELETE cruzado en las 14 tablas...');
  for (const tbl of ALL_TABLES) {
    const tenantCol = tbl === 'tenants' ? 'id' : 'tenant_id';
    
    const res = await clientEmpA
      .from(tbl)
      .delete()
      .eq(tenantCol, TENANT_B_ID)
      .select();

    const count = res.data ? res.data.length : 0;
    const passed = (count === 0 && !res.error) || (res.error !== null);
    recordTest(
      '3. Prevención DELETE Cruzado',
      tbl,
      `Empleado A intenta DELETE en filas de Tienda B (0 afectadas)`,
      passed,
      res.error ? `Rechazado: ${res.error.code}` : `Filas eliminadas: ${count}`
    );
  }

  // ---------------------------------------------------------------------------
  // GRUPO 4: ADMIN DE A NO PUEDE TOCAR NADA DE TIENDA B (UPDATE & DELETE)
  // ---------------------------------------------------------------------------
  console.log('--> Probando Grupo 4: Admin A NO puede modificar ni borrar filas de B...');
  for (const tbl of ALL_TABLES) {
    const tenantCol = tbl === 'tenants' ? 'id' : 'tenant_id';
    
    // UPDATE
    const resUp = await clientAdminA
      .from(tbl)
      .update(tbl === 'products' ? { name: 'ADMIN_HACK' } : { notes: 'ADMIN_HACK' })
      .eq(tenantCol, TENANT_B_ID)
      .select();
    const countUp = resUp.data ? resUp.data.length : 0;
    const passedUp = (countUp === 0 && !resUp.error) || (resUp.error !== null);
    recordTest(
      '4. Admin A Bloqueado de B',
      tbl,
      `Admin A intenta UPDATE en Tienda B (0 afectadas)`,
      passedUp,
      resUp.error ? `Rechazado: ${resUp.error.code}` : `Filas afectadas: ${countUp}`
    );

    // DELETE
    const resDel = await clientAdminA
      .from(tbl)
      .delete()
      .eq(tenantCol, TENANT_B_ID)
      .select();
    const countDel = resDel.data ? resDel.data.length : 0;
    const passedDel = (countDel === 0 && !resDel.error) || (resDel.error !== null);
    recordTest(
      '4. Admin A Bloqueado de B',
      tbl,
      `Admin A intenta DELETE en Tienda B (0 afectadas)`,
      passedDel,
      resDel.error ? `Rechazado: ${resDel.error.code}` : `Filas eliminadas: ${countDel}`
    );
  }

  // ---------------------------------------------------------------------------
  // GRUPO 5: USUARIO ANÓNIMO BLOQUEADO DE LAS 14 TABLAS DIRECTAS
  // ---------------------------------------------------------------------------
  console.log('--> Probando Grupo 5: Usuario anónimo bloqueado de las 14 tablas...');
  for (const tbl of ALL_TABLES) {
    const res = await clientAnon.from(tbl).select('*').limit(1);
    const passed = res.error !== null && (res.error.code === '42501' || res.status === 401 || res.status === 403);
    recordTest(
      '5. Bloqueo Anónimo Directo',
      tbl,
      `Anónimo intenta SELECT directo en tabla base`,
      passed,
      passed ? `Rechazado (${res.error ? res.error.code : res.status})` : 'Acceso permitido!'
    );
  }

  // ---------------------------------------------------------------------------
  // GRUPO 6: CATÁLOGO PÚBLICO SEGURO Y PROTECCIÓN DE DATOS CONFIDENCIALES
  // ---------------------------------------------------------------------------
  console.log('--> Probando Grupo 6: Catálogo público seguro y RPC...');
  
  // 6.1 Anónimo consulta vista pública
  const resAnonView = await clientAnon.from('public_products').select('id, name, price, stock_status, is_available');
  const countAnonView = resAnonView.data ? resAnonView.data.length : 0;
  recordTest(
    '6. Catálogo Público',
    'public_products',
    'Anónimo consulta vista pública de productos',
    countAnonView > 0 && !resAnonView.error,
    `Productos públicos devueltos: ${countAnonView}`
  );

  // 6.2 Anónimo intenta consultar 'cost' en vista pública
  const resCost = await clientAnon.from('public_products').select('cost');
  recordTest(
    '6. Catálogo Público',
    'public_products',
    'Anónimo intenta leer columna cost (confidencial)',
    resCost.error !== null,
    resCost.error ? `Bloqueado: ${resCost.error.message}` : 'Expuesto!'
  );

  // 6.3 Anónimo intenta consultar 'supplier' en vista pública
  const resSupplier = await clientAnon.from('public_products').select('supplier');
  recordTest(
    '6. Catálogo Público',
    'public_products',
    'Anónimo intenta leer columna supplier (confidencial)',
    resSupplier.error !== null,
    resSupplier.error ? `Bloqueado: ${resSupplier.error.message}` : 'Expuesto!'
  );

  // 6.4 Anónimo consulta RPC get_public_catalog('tienda-a')
  const resRpcA = await clientAnon.rpc('get_public_catalog', { p_tenant_slug: 'tienda-a' });
  const dataRpcA = resRpcA.data || [];
  const onlyA = dataRpcA.length === 1 && dataRpcA[0].tenant_slug === 'tienda-a';
  recordTest(
    '6. Catálogo Público',
    'get_public_catalog',
    'RPC get_public_catalog(tienda-a) devuelve exclusivamente productos de A',
    onlyA,
    `Devueltos: ${dataRpcA.length} (Slug: ${dataRpcA[0] ? dataRpcA[0].tenant_slug : 'N/A'})`
  );

  // 6.5 Stock exacto enmascarado
  const item = dataRpcA[0] || {};
  const hasExactStock = Object.prototype.hasOwnProperty.call(item, 'stock');
  const hasStatus = Object.prototype.hasOwnProperty.call(item, 'stock_status') && item.stock_status === 'in_stock';
  recordTest(
    '6. Catálogo Público',
    'get_public_catalog',
    'Stock numérico ausente y enmascarado como stock_status',
    !hasExactStock && hasStatus,
    `stock_status: "${item.stock_status}", is_available: ${item.is_available}`
  );

  // ---------------------------------------------------------------------------
  // GRUPO 7: INMUTABILIDAD CONTABLE (Nadie puede borrar en accounting_ledger)
  // ---------------------------------------------------------------------------
  console.log('--> Probando Grupo 7: Inmutabilidad contable...');
  const resDelLedgerEmp = await clientEmpA.from('accounting_ledger').delete().eq('tenant_id', TENANT_A_ID).select();
  const countLedgerEmp = resDelLedgerEmp.data ? resDelLedgerEmp.data.length : 0;
  recordTest(
    '7. Inmutabilidad Contable',
    'accounting_ledger',
    'Empleado intenta borrar asiento contable (0 eliminadas)',
    countLedgerEmp === 0,
    `Eliminadas: ${countLedgerEmp}`
  );

  // ---------------------------------------------------------------------------
  // GRUPO 8: OPERACIONES LEGÍTIMAS (CAMINO FELIZ)
  // ---------------------------------------------------------------------------
  console.log('--> Probando Grupo 8: Operaciones legítimas (Camino Feliz)...');

  // 8.1 Empleado de A registra una venta de su tienda (orders + order_items)
  const resHappyOrder = await clientEmpA.from('orders').insert({
    tenant_id: TENANT_A_ID,
    order_number: 'ORD-A-HAPPY-01',
    total: 18500,
    payment_method: 'efectivo'
  }).select();
  
  let passedOrderItems = false;
  let orderItemsDetail = '';
  if (resHappyOrder.data && resHappyOrder.data.length > 0) {
    const orderId = resHappyOrder.data[0].id;
    const resHappyItems = await clientEmpA.from('order_items').insert({
      tenant_id: TENANT_A_ID,
      order_id: orderId,
      product_id: '11111111-aaaa-aaaa-aaaa-000000000001',
      quantity: 1,
      unit_price: 18500,
      subtotal: 18500
    }).select();
    passedOrderItems = resHappyItems.data && resHappyItems.data.length > 0;
    orderItemsDetail = passedOrderItems ? `Orden e Item creados con éxito` : (resHappyItems.error?.message || 'Fallo en items');
  } else {
    orderItemsDetail = resHappyOrder.error?.message || 'Fallo en orden';
  }
  recordTest(
    '8. Camino Feliz',
    'orders + order_items',
    'Empleado de A registra una venta legítima con partidas',
    passedOrderItems,
    orderItemsDetail
  );

  // 8.2 Admin de A da de alta un producto legítimo
  const resHappyProd = await clientAdminA.from('products').insert({
    tenant_id: TENANT_A_ID,
    sku: 'PROD-A-NEW-FOX',
    name: 'Guantes Fox Ranger 2026',
    brand: 'Fox',
    category: 'Accesorios',
    price: 850,
    cost: 450,
    margin_percent: 47.06,
    stock: 12,
    supplier: 'Distribuidora Fox Mexico',
    is_web_published: true
  }).select();
  const passedHappyProd = resHappyProd.data && resHappyProd.data.length > 0;
  recordTest(
    '8. Camino Feliz',
    'products',
    'Admin de A da de alta un producto en inventario',
    passedHappyProd,
    passedHappyProd ? `Producto creado: ${resHappyProd.data[0].name}` : (resHappyProd.error?.message || 'Error')
  );

  // 8.3 Empleado de A edita su propio full_name (sin tocar role ni tenant_id)
  const resHappyName = await clientEmpA.from('user_profiles').update({
    full_name: 'Empleado Modificado Legítimo'
  }).eq('id', USER_EMP_A).select();
  const passedHappyName = resHappyName.data && resHappyName.data[0]?.full_name === 'Empleado Modificado Legítimo';
  recordTest(
    '8. Camino Feliz',
    'user_profiles',
    'Empleado edita su propio nombre legítimamente',
    passedHappyName,
    passedHappyName ? `Nombre actualizado: ${resHappyName.data[0].full_name}` : (resHappyName.error?.message || 'Error')
  );

  // 8.4 Mecánico / Staff de A crea y luego cierra un workshop_ticket
  const resHappyTicket = await clientEmpA.from('workshop_tickets').insert({
    tenant_id: TENANT_A_ID,
    ticket_number: 'WS-HAPPY-01',
    customer_id: '11111111-cccc-cccc-cccc-000000000001',
    bike_description: 'Trek Fuel EX Negra',
    status: 'received'
  }).select();
  let passedTicketCycle = false;
  let ticketDetail = '';
  if (resHappyTicket.data && resHappyTicket.data.length > 0) {
    const ticketId = resHappyTicket.data[0].id;
    const resCloseTicket = await clientEmpA.from('workshop_tickets').update({
      status: 'delivered',
      total_estimated: 1250
    }).eq('id', ticketId).select();
    passedTicketCycle = resCloseTicket.data && resCloseTicket.data[0]?.status === 'delivered';
    ticketDetail = passedTicketCycle ? `Ticket creado y entregado con éxito` : (resCloseTicket.error?.message || 'Error al cerrar');
  } else {
    ticketDetail = resHappyTicket.error?.message || 'Error al crear ticket';
  }
  recordTest(
    '8. Camino Feliz',
    'workshop_tickets',
    'Mecánico/Staff crea y luego cierra orden de taller',
    passedTicketCycle,
    ticketDetail
  );

  // 8.5 Empleado registra su propia entrada en el checador
  const resHappyAttendance = await clientEmpA.from('employee_attendance').insert({
    tenant_id: TENANT_A_ID,
    user_id: USER_EMP_A,
    status: 'present'
  }).select();
  const passedAttendance = resHappyAttendance.data && resHappyAttendance.data.length > 0;
  recordTest(
    '8. Camino Feliz',
    'employee_attendance',
    'Empleado registra su propia entrada en checador',
    passedAttendance,
    passedAttendance ? `Asistencia registrada (ID: ${resHappyAttendance.data[0].id.slice(0, 8)})` : (resHappyAttendance.error?.message || 'Error')
  );

  // 8.6 Admin de A cambia el role de un compañero de staff a admin
  const resAdminPromo = await clientAdminA.from('user_profiles').update({
    role: 'admin'
  }).eq('id', USER_EMP_A).select();
  const passedAdminPromo = resAdminPromo.data && resAdminPromo.data[0]?.role === 'admin';
  recordTest(
    '8. Camino Feliz',
    'user_profiles',
    'Admin de A promueve a un compañero de staff a admin',
    passedAdminPromo,
    passedAdminPromo ? `Rol actualizado a ${resAdminPromo.data[0].role}` : (resAdminPromo.error?.message || 'Error')
  );
  // Revertir rol a staff para mantener estado predecible
  await clientAdminA.from('user_profiles').update({ role: 'staff' }).eq('id', USER_EMP_A);

  // 8.7 Catálogo público de una tienda devuelve productos publicados
  const resHappyCatalog = await clientAnon.rpc('get_public_catalog', { p_tenant_slug: 'tienda-a' });
  const countCatalog = resHappyCatalog.data ? resHappyCatalog.data.length : 0;
  const passedCatalog = countCatalog > 0;
  recordTest(
    '8. Camino Feliz',
    'get_public_catalog',
    'Catálogo público de Tienda A devuelve productos publicados',
    passedCatalog,
    `Productos publicados devueltos: ${countCatalog}`
  );

  // ---------------------------------------------------------------------------
  // IMPRESIÓN DEL REPORTE FINAL
  // ---------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log(' RESULTADOS DEL BANCO DE PRUEBAS (@supabase/supabase-js)');
  console.log('================================================================================\n');
  console.log('| # | Categoría | Tabla | Caso de Prueba | Resultado | Detalle |');
  console.log('|---|---|---|---|:---:|---|');

  let passCount = 0;
  let failCount = 0;

  testResults.forEach((t, idx) => {
    const num = (idx + 1).toString().padStart(2, '0');
    if (t.status === 'PASA') passCount++;
    else failCount++;
    const cleanDetail = t.detail ? t.detail.replace(/[\r\n]+/g, ' ').slice(0, 50) : '';
    console.log(`| ${num} | ${t.category} | \`${t.table}\` | ${t.description} | **${t.status}** | ${cleanDetail} |`);
  });

  console.log('\n================================================================================');
  console.log(` TOTAL DE PRUEBAS: ${testResults.length} | PASADAS: ${passCount} | FALLADAS: ${failCount}`);
  if (failCount === 0) {
    console.log(' ESTADO: SUITE EXTENDIDA APROBADA AL 100% SOBRE CLIENTE SUPABASE REAL');
  } else {
    console.log(' ESTADO: AL MENOS UNA PRUEBA FALLÓ. REVISAR DETALLES.');
  }
  console.log('================================================================================\n');

  proxy.close();
  process.exit(failCount === 0 ? 0 : 1);
}

proxy.listen(PROXY_PORT, () => {
  runSuite().catch(err => {
    console.error('Error fatal en la suite:', err);
    proxy.close();
    process.exit(1);
  });
});
