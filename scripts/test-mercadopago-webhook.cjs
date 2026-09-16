#!/usr/bin/env node
/**
 * BiciSaaS & The Garage — Pruebas Automatizadas de Verificación de Webhook MercadoPago
 * 
 * Simula notificaciones HTTP de MercadoPago y valida:
 *  1. Firma HMAC válida -> Aceptado (200 OK)
 *  2. Firma falsificada / manipulada -> Rechazado (401 Unauthorized)
 *  3. Timestamp caducado (Replay Attack) -> Rechazado (401 Unauthorized)
 *  4. Cabecera ausente -> Rechazado (401 Unauthorized)
 */

const crypto = require('crypto');

const WEBHOOK_SECRET = 'sandbox_webhook_secret_the_garage_2026';

function generateSignature(dataId, requestId, ts, secret) {
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  return crypto.createHmac('sha256', secret).update(manifest).digest('hex');
}

async function verifySignature(xSignatureHeader, xRequestIdHeader, dataId, secret) {
  if (!xSignatureHeader) {
    return { status: 401, error: 'Cabecera x-signature ausente' };
  }

  const parts = {};
  xSignatureHeader.split(',').forEach(part => {
    const [k, v] = part.split('=');
    if (k && v) parts[k.trim()] = v.trim();
  });

  const ts = parts['ts'];
  const hashV1 = parts['v1'];

  if (!ts || !hashV1) {
    return { status: 401, error: 'Formato inválido en x-signature' };
  }

  // Comprobar ventana de 5 minutos
  const tsNum = parseInt(ts, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - tsNum) > 300) {
    return { status: 401, error: 'Timestamp caducado (Replay Attack prevenido)' };
  }

  const manifest = `id:${dataId || ''};request-id:${xRequestIdHeader || ''};ts:${ts};`;
  const expectedHash = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  const bufA = Buffer.from(expectedHash, 'hex');
  const bufB = Buffer.from(hashV1, 'hex');

  if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
    return { status: 401, error: 'Firma HMAC falsificada o inválida' };
  }

  return { status: 200, message: 'Firma válida verificada' };
}

async function runTests() {
  console.log('\n================================================================================');
  console.log(' PRUEBAS DE SEGURIDAD: WEBHOOK MERCADOPAGO (FIRMA HMAC SHA-256)');
  console.log('================================================================================\n');

  const dataId = '99887766554';
  const requestId = 'req-uuid-550e8400-e29b-41d4';
  const currentTs = Math.floor(Date.now() / 1000);

  const tests = [];

  // CASO 1: Notificación Legítima de MercadoPago (Firma Válida)
  const validHash = generateSignature(dataId, requestId, currentTs, WEBHOOK_SECRET);
  const resValid = await verifySignature(`ts=${currentTs},v1=${validHash}`, requestId, dataId, WEBHOOK_SECRET);
  tests.push({
    name: 'Firma válida auténtica de MercadoPago',
    expected: 200,
    actual: resValid.status,
    detail: resValid.message || resValid.error
  });

  // CASO 2: Notificación con Firma Falsificada / Alterada por Atacante
  const fakeHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const resFake = await verifySignature(`ts=${currentTs},v1=${fakeHash}`, requestId, dataId, WEBHOOK_SECRET);
  tests.push({
    name: 'Firma falsificada por un atacante',
    expected: 401,
    actual: resFake.status,
    detail: resFake.error
  });

  // CASO 3: Ataque de Replay (Firma válida pero con timestamp de hace 10 minutos)
  const oldTs = currentTs - 600; // 10 min atrás
  const oldHash = generateSignature(dataId, requestId, oldTs, WEBHOOK_SECRET);
  const resReplay = await verifySignature(`ts=${oldTs},v1=${oldHash}`, requestId, dataId, WEBHOOK_SECRET);
  tests.push({
    name: 'Ataque de repetición (Timestamp de hace 10 min)',
    expected: 401,
    actual: resReplay.status,
    detail: resReplay.error
  });

  // CASO 4: Petición sin cabecera x-signature
  const resMissing = await verifySignature(null, requestId, dataId, WEBHOOK_SECRET);
  tests.push({
    name: 'Petición sin cabecera de firma',
    expected: 401,
    actual: resMissing.status,
    detail: resMissing.error
  });

  console.log('| # | Caso de Prueba | HTTP Esperado | HTTP Obtenido | Resultado | Diagnóstico |');
  console.log('|---|---|:---:|:---:|:---:|---|');

  let passedAll = true;
  tests.forEach((t, i) => {
    const passed = t.expected === t.actual;
    if (!passed) passedAll = false;
    const num = (i + 1).toString().padStart(2, '0');
    console.log(`| ${num} | ${t.name} | **${t.expected}** | **${t.actual}** | ${passed ? '✅ PASA' : '❌ FALLA'} | ${t.detail} |`);
  });

  console.log('\n================================================================================');
  if (passedAll) {
    console.log(' ESTADO: TODAS LAS PRUEBAS DE WEBHOOK PASARON AL 100%');
  } else {
    console.log(' ESTADO: ERROR EN VALIDACIÓN DE WEBHOOK');
    process.exit(1);
  }
  console.log('================================================================================\n');
}

runTests();
