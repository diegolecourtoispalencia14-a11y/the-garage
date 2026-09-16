/**
 * BiciSaaS & The Garage — Webhook de Notificaciones de MercadoPago
 * 
 * Verifica criptográficamente la firma HMAC SHA-256 enviada por MercadoPago
 * antes de procesar o actualizar cualquier estado de pago.
 * 
 * Especificación de MercadoPago:
 *  Header: x-signature -> 'ts=1709900000,v1=a1b2c3d4e5f6...'
 *  Header: x-request-id -> Identificador único de la petición
 *  Manifest: "id:[data.id];request-id:[x-request-id];ts:[ts];"
 */

interface Env {
  MP_ACCESS_TOKEN?: string;
  MP_WEBHOOK_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

/**
 * Convierte un ArrayBuffer a cadena hexadecimal
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Comparación segura contra ataques de tiempo (Timing-Safe)
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Verifica la firma HMAC-SHA256 de MercadoPago
 */
export async function verifyMercadoPagoSignature(
  xSignatureHeader: string | null,
  xRequestIdHeader: string | null,
  dataId: string | null,
  webhookSecret: string
): Promise<{ isValid: boolean; reason?: string }> {
  if (!xSignatureHeader) {
    return { isValid: false, reason: 'Cabecera x-signature ausente.' };
  }

  // Parsear ts y v1 de 'ts=12345,v1=abcdef'
  const parts: Record<string, string> = {};
  xSignatureHeader.split(',').forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) parts[key.trim()] = value.trim();
  });

  const ts = parts['ts'];
  const hashV1 = parts['v1'];

  if (!ts || !hashV1) {
    return { isValid: false, reason: 'Formato inválido en x-signature (se requiere ts y v1).' };
  }

  // Prevenir ataques de repetición (Replay Attacks) — Máximo 5 minutos (300 segundos) de tolerancia
  const timestampSec = parseInt(ts, 10);
  const currentSec = Math.floor(Date.now() / 1000);
  if (isNaN(timestampSec) || Math.abs(currentSec - timestampSec) > 300) {
    return { isValid: false, reason: 'Firma caducada o timestamp fuera de ventana permitida (5 min).' };
  }

  // Construir manifest oficial de MercadoPago
  // Formato: id:[data.id];request-id:[x-request-id];ts:[ts];
  const manifest = `id:${dataId || ''};request-id:${xRequestIdHeader || ''};ts:${ts};`;

  // Calcular HMAC-SHA256 con Web Crypto API
  const encoder = new TextEncoder();
  const keyData = encoder.encode(webhookSecret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(manifest)
  );

  const calculatedHex = bufferToHex(signatureBuffer);

  if (!timingSafeEqual(calculatedHex, hashV1)) {
    return { isValid: false, reason: 'Firma criptográfica inválida (discrepancia de hash HMAC).' };
  }

  return { isValid: true };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');

    // Leer payload JSON
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    // MercadoPago envía el ID del recurso en data.id o en el query param id / data.id
    const dataId = body?.data?.id || url.searchParams.get('data.id') || url.searchParams.get('id');

    // Clave secreta de Webhook de MercadoPago
    const webhookSecret = env.MP_WEBHOOK_SECRET || 'sandbox_webhook_secret_the_garage_2026';

    // 1. Verificación Criptográfica Obligatoria
    const verification = await verifyMercadoPagoSignature(
      xSignature,
      xRequestId,
      dataId,
      webhookSecret
    );

    if (!verification.isValid) {
      console.warn(`[WEBHOOK RECHAZADO] Intento de notificación no autorizada: ${verification.reason}`);
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        message: verification.reason
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Firma Válida — MercadoPago legítimo
    const action = body?.action || body?.type || 'payment';
    console.log(`[WEBHOOK APROBADO] Notificación legítima recibida para recurso ID: ${dataId} (Acción: ${action})`);

    // Si es un pago, consultar la API de MercadoPago para verificar estado real
    // En producción:
    // const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
    //   headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}` }
    // });
    // const paymentData = await paymentRes.json();
    // if (paymentData.status === 'approved') {
    //    Actualizar orden en Postgres / Supabase
    // }

    return new Response(JSON.stringify({
      status: 'success',
      received: true,
      resource_id: dataId,
      verified: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[WEBHOOK ERROR] Excepción no controlada:', err);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al procesar la notificación'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
