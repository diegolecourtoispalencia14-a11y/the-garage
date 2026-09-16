#!/usr/bin/env node
/**
 * BiciSaaS & The Garage — Banco de Pruebas Automatizado de RLS (PostgreSQL 16)
 * 
 * Verifica tabla por tabla y operación por operación el aislamiento multi-inquilino,
 * restricciones por rol, inmutabilidad contable y protección del catálogo público.
 */

const { execSync } = require('child_process');

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

function runQuery(sql) {
  try {
    const escapedSql = sql.replace(/"/g, '\\"');
    const cmd = `docker exec -i test-supabase-pg psql -U postgres -v ON_ERROR_STOP=1 -At -c "${escapedSql}"`;
    const output = execSync(cmd, { stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
    return { ok: true, output, error: null };
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString() : err.message;
    return { ok: false, output: null, error: stderr };
  }
}

function runInSession(role, userId, sqlStatements) {
  const setAuth = role === 'anon'
    ? `SET LOCAL ROLE anon; SET LOCAL "request.jwt.claim.sub" = ''; SET LOCAL "request.jwt.claim.role" = 'anon';`
    : `SET LOCAL ROLE authenticated; SET LOCAL "request.jwt.claim.sub" = '${userId}'; SET LOCAL "request.jwt.claim.role" = 'authenticated';`;

  const fullSql = `
    BEGIN;
    ${setAuth}
    ${sqlStatements}
    ROLLBACK;
  `;
  return runQuery(fullSql);
}

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

console.log('\n================================================================================');
console.log(' INICIANDO BANCO DE PRUEBAS AUTOMATIZADO DE RLS (BiciSaaS / The Garage)');
console.log('================================================================================\n');

function extractNumber(output) {
  if (!output) return null;
  const lines = output.split('\n')
    .map(l => l.trim())
    .filter(l => l && !['BEGIN', 'SET', 'ROLLBACK', 'COMMIT'].includes(l));
  if (lines.length === 0) return null;
  const num = parseInt(lines[0], 10);
  return isNaN(num) ? null : num;
}

function extractContent(output) {
  if (!output) return '';
  return output.split('\n')
    .map(l => l.trim())
    .filter(l => l && !['BEGIN', 'SET', 'ROLLBACK', 'COMMIT'].includes(l))
    .join(' ');
}

// -----------------------------------------------------------------------------
// GRUPO A: Empleado A NO puede leer ni una sola fila de Tienda B (14 tablas)
// -----------------------------------------------------------------------------
console.log('--> Probando Grupo A: Empleado A NO puede leer filas de Tienda B...');
for (const tbl of ALL_TABLES) {
  const tenantCol = tbl === 'tenants' ? 'id' : 'tenant_id';
  const query = `SELECT count(*) FROM public.${tbl} WHERE ${tenantCol} = '${TENANT_B_ID}';`;
  const res = runInSession('authenticated', USER_EMP_A, query);
  
  if (!res.ok) {
    recordTest('A. Aislamiento SELECT', tbl, 'Empleado A intenta leer filas de B', false, res.error);
  } else {
    const count = extractNumber(res.output);
    const passed = count === 0;
    recordTest('A. Aislamiento SELECT', tbl, 'Empleado A lee datos de B (debe ser 0)', passed, `Filas visibles de B: ${count}`);
  }
}

// -----------------------------------------------------------------------------
// GRUPO B: Empleado A NO puede insertar filas con tenant_id de Tienda B
// -----------------------------------------------------------------------------
console.log('--> Probando Grupo B: Empleado A NO puede insertar filas en Tienda B...');
const insertPayloads = {
  products: `INSERT INTO public.products (tenant_id, sku, name, price, cost) VALUES ('${TENANT_B_ID}', 'INJECT-01', 'Hack Bici', 1000, 500);`,
  orders: `INSERT INTO public.orders (tenant_id, order_number, total, payment_method) VALUES ('${TENANT_B_ID}', 'INJECT-ORD-01', 1000, 'efectivo');`,
  order_items: `INSERT INTO public.order_items (tenant_id, order_id, product_id, quantity, unit_price, subtotal) VALUES ('${TENANT_B_ID}', '11111111-0000-0000-0000-000000000001', '11111111-aaaa-aaaa-aaaa-000000000001', 1, 100, 100);`,
  customers: `INSERT INTO public.customers (tenant_id, name, email) VALUES ('${TENANT_B_ID}', 'Cliente Infiltrado', 'infiltrado@b.com');`,
  workshop_tickets: `INSERT INTO public.workshop_tickets (tenant_id, ticket_number, customer_id, bike_description) VALUES ('${TENANT_B_ID}', 'TICKET-INJECT', '11111111-cccc-cccc-cccc-000000000001', 'Bici Robada');`,
  tasks: `INSERT INTO public.tasks (tenant_id, title) VALUES ('${TENANT_B_ID}', 'Tarea Infiltrada');`,
  accounting_ledger: `INSERT INTO public.accounting_ledger (tenant_id, type, amount, category, description) VALUES ('${TENANT_B_ID}', 'income', 5000, 'ventas', 'Falso ingreso');`
};

for (const [tbl, sql] of Object.entries(insertPayloads)) {
  const res = runInSession('authenticated', USER_EMP_A, sql);
  // Debe fallar con violación de RLS (policy violation)
  const passed = !res.ok && res.error.includes('violates row-level security policy');
  recordTest('B. Prevención INSERT ajeno', tbl, 'Empleado A intenta insertar fila con tenant_id de B', passed, res.ok ? 'Permitió insertar!' : 'Rechazado por RLS');
}

// -----------------------------------------------------------------------------
// GRUPO C: Empleado A NO puede modificar ni borrar filas de Tienda B
// -----------------------------------------------------------------------------
console.log('--> Probando Grupo C: Empleado A NO puede modificar ni borrar filas de Tienda B...');
const updateTarget = `UPDATE public.products SET name = 'HACKED' WHERE tenant_id = '${TENANT_B_ID}';`;
const resUpdateC = runInSession('authenticated', USER_EMP_A, updateTarget);
const passedUpdateC = resUpdateC.ok && (resUpdateC.output.includes('UPDATE 0') || resUpdateC.output.endsWith('0'));
recordTest('C. Prevención UPDATE ajeno', 'products', 'Empleado A intenta modificar productos de B', passedUpdateC, resUpdateC.output);

const deleteTarget = `DELETE FROM public.products WHERE tenant_id = '${TENANT_B_ID}';`;
const resDeleteC = runInSession('authenticated', USER_EMP_A, deleteTarget);
const passedDeleteC = resDeleteC.ok && (resDeleteC.output.includes('DELETE 0') || resDeleteC.output.endsWith('0'));
recordTest('C. Prevención DELETE ajeno', 'products', 'Empleado A intenta borrar productos de B', passedDeleteC, resDeleteC.output);

const deleteCustomerC = `DELETE FROM public.customers WHERE tenant_id = '${TENANT_B_ID}';`;
const resDeleteCustC = runInSession('authenticated', USER_EMP_A, deleteCustomerC);
const passedCustC = resDeleteCustC.ok && (resDeleteCustC.output.includes('DELETE 0') || resDeleteCustC.output.endsWith('0'));
recordTest('C. Prevención DELETE ajeno', 'customers', 'Empleado A intenta borrar clientes de B', passedCustC, resDeleteCustC.output);

// -----------------------------------------------------------------------------
// GRUPO D: Admin A NO puede tocar absolutamente nada de Tienda B
// -----------------------------------------------------------------------------
console.log('--> Probando Grupo D: Admin A NO puede tocar recursos de Tienda B...');
for (const tbl of ALL_TABLES) {
  const tenantCol = tbl === 'tenants' ? 'id' : 'tenant_id';
  const query = `SELECT count(*) FROM public.${tbl} WHERE ${tenantCol} = '${TENANT_B_ID}';`;
  const res = runInSession('authenticated', USER_ADMIN_A, query);
  
  const count = extractNumber(res.output);
  const passed = res.ok && count === 0;
  recordTest('D. Aislamiento Admin A -> B', tbl, 'Admin A lee datos de B (debe ser 0)', passed, `Filas visibles de B: ${count}`);
}

const adminBInsert = `INSERT INTO public.products (tenant_id, sku, name, price, cost) VALUES ('${TENANT_B_ID}', 'ADMIN-HACK', 'Bici', 200, 100);`;
const resAdminInsert = runInSession('authenticated', USER_ADMIN_A, adminBInsert);
const passedAdminInsert = !resAdminInsert.ok && resAdminInsert.error.includes('violates row-level security policy');
recordTest('D. Aislamiento Admin A -> B', 'products', 'Admin A intenta insertar en tenant B', passedAdminInsert, resAdminInsert.ok ? 'Permitió insertar!' : 'Rechazado por RLS');

const adminBUpdate = `UPDATE public.tenant_config SET business_name = 'Secuestrado' WHERE tenant_id = '${TENANT_B_ID}';`;
const resAdminUpdate = runInSession('authenticated', USER_ADMIN_A, adminBUpdate);
const passedAdminUpdate = resAdminUpdate.ok && resAdminUpdate.output.includes('UPDATE 0');
recordTest('D. Aislamiento Admin A -> B', 'tenant_config', 'Admin A intenta cambiar config de tenant B', passedAdminUpdate, resAdminUpdate.output);

// -----------------------------------------------------------------------------
// GRUPO E: Usuario Anónimo (anon) no puede consultar tablas directas
// -----------------------------------------------------------------------------
console.log('--> Probando Grupo E: Usuario anónimo bloqueado de las 14 tablas...');
for (const tbl of ALL_TABLES) {
  const query = `SELECT * FROM public.${tbl} LIMIT 1;`;
  const res = runInSession('anon', null, query);
  // Debe fallar con permission denied
  const passed = !res.ok && res.error.includes('permission denied');
  recordTest('E. Bloqueo Anónimo Directo', tbl, 'Anónimo intenta SELECT directo en tabla base', passed, passed ? 'Permission denied (Correcto)' : 'Acceso no autorizado!');
}

// -----------------------------------------------------------------------------
// GRUPO F: Catálogo Público y Protección de Columnas Sensibles
// -----------------------------------------------------------------------------
console.log('--> Probando Grupo F: Catálogo público seguro y columnas sensibles...');
// 1. Anon consulta public_products
const resAnonView = runInSession('anon', null, `SELECT count(*) FROM public.public_products;`);
const countAnon = extractNumber(resAnonView.output);
const passedAnonView = resAnonView.ok && countAnon > 0;
recordTest('F. Catálogo Público', 'public_products', 'Anónimo consulta vista pública de productos', passedAnonView, `Productos públicos visibles: ${countAnon}`);

// 2. Anon intenta seleccionar cost de public_products
const resCost = runInSession('anon', null, `SELECT cost FROM public.public_products;`);
const passedCost = !resCost.ok && resCost.error.includes('column "cost" does not exist');
recordTest('F. Catálogo Público', 'public_products', 'Anónimo intenta leer columna cost (confidencial)', passedCost, passedCost ? 'Columna inexistente en vista (Blindado)' : 'Columna expuesta!');

// 3. Anon intenta seleccionar margin_percent de public_products
const resMargin = runInSession('anon', null, `SELECT margin_percent FROM public.public_products;`);
const passedMargin = !resMargin.ok && resMargin.error.includes('column "margin_percent" does not exist');
recordTest('F. Catálogo Público', 'public_products', 'Anónimo intenta leer margin_percent (confidencial)', passedMargin, passedMargin ? 'Columna inexistente en vista (Blindado)' : 'Columna expuesta!');

// 4. Anon intenta seleccionar supplier de public_products
const resSupplier = runInSession('anon', null, `SELECT supplier FROM public.public_products;`);
const passedSupplier = !resSupplier.ok && resSupplier.error.includes('column "supplier" does not exist');
recordTest('F. Catálogo Público', 'public_products', 'Anónimo intenta leer supplier (confidencial)', passedSupplier, passedSupplier ? 'Columna inexistente en vista (Blindado)' : 'Columna expuesta!');

// 5. Anon consulta RPC get_public_catalog('tienda-a')
const resRpcA = runInSession('anon', null, `SELECT count(*) FROM public.get_public_catalog('tienda-a');`);
const countRpcA = extractNumber(resRpcA.output);

const resRpcA_B = runInSession('anon', null, `SELECT count(*) FROM public.get_public_catalog('tienda-a') WHERE tenant_slug = 'tienda-b';`);
const countRpcA_B = extractNumber(resRpcA_B.output);
const passedRpcA = resRpcA.ok && countRpcA === 1 && countRpcA_B === 0;
recordTest('F. Catálogo Público', 'get_public_catalog', 'get_public_catalog(tienda-a) devuelve SOLO productos de Tienda A', passedRpcA, `Tienda A: ${countRpcA}, Tienda B filtrada: ${countRpcA_B}`);

// 6. Verificación de enmascaramiento de stock (stock_status e is_available)
const resStockMask = runInSession('anon', null, `SELECT stock_status, is_available FROM public.get_public_catalog('tienda-a') LIMIT 1;`);
const passedStockMask = resStockMask.ok && resStockMask.output.includes('in_stock') && resStockMask.output.includes('t');
recordTest('F. Catálogo Público', 'get_public_catalog', 'Stock exacto enmascarado como stock_status e is_available', passedStockMask, resStockMask.output);

// -----------------------------------------------------------------------------
// GRUPO G: Privilegios Staff vs Admin dentro de la misma tienda
// -----------------------------------------------------------------------------
console.log('--> Probando Grupo G: Empleado no-admin restringido de acciones de Admin...');

// 1. Empleado intenta borrar un producto de su propia tienda (debe fallar / 0 rows)
const resEmpDelProd = runInSession('authenticated', USER_EMP_A, `DELETE FROM public.products WHERE id = '11111111-aaaa-aaaa-aaaa-000000000001';`);
const passedEmpDelProd = resEmpDelProd.ok && resEmpDelProd.output.includes('DELETE 0');
recordTest('G. Restricciones de Rol', 'products', 'Empleado intenta borrar producto propio (solo admin)', passedEmpDelProd, resEmpDelProd.output);

// 2. Admin borra producto de su propia tienda (debe tener éxito)
const resAdminDelProd = runInSession('authenticated', USER_ADMIN_A, `DELETE FROM public.products WHERE id = '11111111-aaaa-aaaa-aaaa-000000000002';`);
const passedAdminDelProd = resAdminDelProd.ok && resAdminDelProd.output.includes('DELETE 1');
recordTest('G. Restricciones de Rol', 'products', 'Admin borra producto de su propia tienda (autorizado)', passedAdminDelProd, resAdminDelProd.output);

// 3. Empleado intenta modificar tenant_config de su tienda (solo admin)
const resEmpConfig = runInSession('authenticated', USER_EMP_A, `UPDATE public.tenant_config SET business_name = 'Cambio Ilegal' WHERE tenant_id = '${TENANT_A_ID}';`);
const passedEmpConfig = resEmpConfig.ok && resEmpConfig.output.includes('UPDATE 0');
recordTest('G. Restricciones de Rol', 'tenant_config', 'Empleado intenta editar datos fiscales de tienda (solo admin)', passedEmpConfig, resEmpConfig.output);

// 4. Admin modifica tenant_config de su tienda (autorizado)
const resAdminConfig = runInSession('authenticated', USER_ADMIN_A, `UPDATE public.tenant_config SET business_name = 'The Garage Oficial' WHERE tenant_id = '${TENANT_A_ID}';`);
const passedAdminConfig = resAdminConfig.ok && resAdminConfig.output.includes('UPDATE 1');
recordTest('G. Restricciones de Rol', 'tenant_config', 'Admin edita datos fiscales de su tienda (autorizado)', passedAdminConfig, resAdminConfig.output);

// 5. Empleado intenta crear nuevo user_profile (solo admin)
const resEmpCreateUser = runInSession('authenticated', USER_EMP_A, `INSERT INTO public.user_profiles (id, tenant_id, role, full_name, email) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-999999999999', '${TENANT_A_ID}', 'admin', 'Nuevo Admin Pirata', 'pirata@tienda-a.com');`);
const passedEmpCreateUser = !resEmpCreateUser.ok && resEmpCreateUser.error.includes('violates row-level security policy');
recordTest('G. Restricciones de Rol', 'user_profiles', 'Empleado intenta dar de alta nuevo usuario (solo admin)', passedEmpCreateUser, resEmpCreateUser.ok ? 'Permitió alta!' : 'Rechazado por RLS');

// -----------------------------------------------------------------------------
// GRUPO H: Inmutabilidad de accounting_ledger (Nadie puede borrar)
// -----------------------------------------------------------------------------
console.log('--> Probando Grupo H: Inmutabilidad de accounting_ledger...');
const resEmpDelAcc = runInSession('authenticated', USER_EMP_A, `DELETE FROM public.accounting_ledger WHERE tenant_id = '${TENANT_A_ID}';`);
const passedEmpDelAcc = resEmpDelAcc.ok && resEmpDelAcc.output.includes('DELETE 0');
recordTest('H. Inmutabilidad Contable', 'accounting_ledger', 'Empleado intenta borrar asiento contable (prohibido)', passedEmpDelAcc, resEmpDelAcc.output);

const resAdminDelAcc = runInSession('authenticated', USER_ADMIN_A, `DELETE FROM public.accounting_ledger WHERE tenant_id = '${TENANT_A_ID}';`);
const passedAdminDelAcc = resAdminDelAcc.ok && resAdminDelAcc.output.includes('DELETE 0');
recordTest('H. Inmutabilidad Contable', 'accounting_ledger', 'Admin intenta borrar asiento contable (prohibido por diseño)', passedAdminDelAcc, resAdminDelAcc.output);

// -----------------------------------------------------------------------------
// REPORTE FINAL DE PRUEBAS
// -----------------------------------------------------------------------------
console.log('\n================================================================================');
console.log(' TABLA DE RESULTADOS DE PRUEBAS DE RLS');
console.log('================================================================================\n');

console.log('| # | Categoría | Tabla | Caso de Prueba | Resultado | Detalle |');
console.log('|---|---|---|---|---|---|');

let passCount = 0;
let failCount = 0;

testResults.forEach((t, idx) => {
  const num = (idx + 1).toString().padStart(2, '0');
  if (t.status === 'PASA') {
    passCount++;
  } else {
    failCount++;
  }
  const cleanDetail = t.detail ? t.detail.replace(/[\r\n]+/g, ' ').slice(0, 55) : '';
  console.log(`| ${num} | ${t.category} | \`${t.table}\` | ${t.description} | **${t.status}** | ${cleanDetail} |`);
});

console.log('\n================================================================================');
console.log(` TOTAL DE PRUEBAS: ${testResults.length} | PASADAS: ${passCount} | FALLADAS: ${failCount}`);
if (failCount === 0) {
  console.log(' ESTADO FINAL: BANCO DE PRUEBAS 100% APROBADO (ESQUEMA CERTIFICADO)');
} else {
  console.log(' ESTADO FINAL: ERROR — HUBO PRUEBAS FALLIDAS. REVISAR ESQUEMA.');
  process.exit(1);
}
console.log('================================================================================\n');
