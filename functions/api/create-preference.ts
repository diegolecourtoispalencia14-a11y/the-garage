/**
 * Cloudflare Pages Function: /api/create-preference
 * Creates a MercadoPago payment preference and returns the init_point URL.
 * 
 * Environment variables required (set in Cloudflare Dashboard):
 *   MP_ACCESS_TOKEN  — Your MercadoPago Access Token (starts with APP_USR-...)
 */

import { z } from 'zod';
import { MASTER_PRODUCTS } from '../../src/data/allProducts';
import { getSecureCorsHeaders, handleOptionsCors } from '../_cors';
import { checkRateLimit, rateLimitResponse } from '../_ratelimit';
import { logSecurityEvent } from '../_logger';

interface Env {
  MP_ACCESS_TOKEN?: string;
  PUBLIC_SITE_URL?: string;
}

const OrderItemSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  quantity: z.number().int().positive().max(99),
  sku: z.string().max(64).optional(),
});

const PreferenceBodySchema = z.object({
  items: z.array(OrderItemSchema).min(1).max(50),
  payer: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^[0-9+ ]{8,20}$/, 'Teléfono de contacto inválido'),
    email: z.string().email().optional().or(z.literal('')),
  }),
  delivery: z.string().max(50),
  address: z.string().max(250).optional(),
  orderId: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/, 'Formato de ID de orden inválido'),
  total: z.number().positive(),
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const corsHeaders = {
    ...getSecureCorsHeaders(request, env),
    'Content-Type': 'application/json',
  };

  // 1. Rate limiting check (15 requests per minute per IP)
  const rl = checkRateLimit(request, { maxRequests: 15, windowSeconds: 60 });
  if (!rl.allowed) {
    logSecurityEvent(request, 'RATE_LIMIT_EXCEEDED', 'WARN', { limit: rl.limit });
    return rateLimitResponse(corsHeaders, rl.resetSeconds, rl.limit);
  }

  // Fail-Closed: Do not fake approved checkout if token is missing
  if (!env.MP_ACCESS_TOKEN) {
    logSecurityEvent(request, 'PAYMENT_GATEWAY_UNAVAILABLE', 'WARN');
    return new Response(JSON.stringify({
      error: 'La pasarela de pago digital está en configuración. Por favor confirma tu compra directamente con la tienda por WhatsApp (+52 984 138 1493).',
      code: 'GATEWAY_UNAVAILABLE'
    }), { status: 503, headers: corsHeaders });
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      logSecurityEvent(request, 'INVALID_INPUT_DETECTED', 'WARN', { reason: 'malformed_json' });
      return new Response(JSON.stringify({ error: 'Cuerpo de solicitud JSON malformado.' }), { status: 400, headers: corsHeaders });
    }

    const parseResult = OrderBodySchema.safeParse(rawBody);
    if (!parseResult.success) {
      const errorDetails = parseResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
      logSecurityEvent(request, 'INVALID_INPUT_DETECTED', 'WARN', { details: errorDetails });
      return new Response(JSON.stringify({
        error: 'Validación de datos fallida en el servidor.',
        details: errorDetails
      }), { status: 400, headers: corsHeaders });
    }

    const { items, payer, delivery, address, orderId } = parseResult.data;

    // Server-Side Price Authority: Recalculate price from authoritative catalog
    const authoritativeItems = items.map(item => {
      const cleanId = item.id.trim().toLowerCase();
      const catalogMatch = MASTER_PRODUCTS.find(p =>
        p.id.toLowerCase() === cleanId ||
        p.sku.toLowerCase() === cleanId ||
        (p.slug && p.slug.toLowerCase() === cleanId)
      );

      // If item is recognized in official catalog, enforce official price.
      // Otherwise use submitted price but strictly sanitized.
      const realUnitPrice = catalogMatch ? catalogMatch.price : item.price;
      const finalUnitPrice = Number((realUnitPrice * 1.035).toFixed(2)); // +3.5% online fee

      return {
        id: catalogMatch ? catalogMatch.sku : item.id.replace(/[^a-zA-Z0-9_-]/g, ''),
        title: (catalogMatch ? catalogMatch.name : item.name).slice(0, 120),
        quantity: item.qty,
        unit_price: finalUnitPrice,
        currency_id: 'MXN',
      };
    });

    const preference = {
      external_reference: orderId,
      items: authoritativeItems,
      payer: {
        name: payer.name,
        email: payer.email || `${payer.phone.replace(/\D/g, '')}@thegarage.mx`,
        phone: { area_code: '52', number: payer.phone.replace(/\D/g, '') },
      },
      back_urls: {
        success: `${allowedOrigin}/checkout/exito?status=approved`,
        failure: `${allowedOrigin}/checkout?status=failed`,
        pending: `${allowedOrigin}/checkout/exito?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${allowedOrigin}/api/mp-webhook`,
      statement_descriptor: 'THE GARAGE PDC',
      metadata: { delivery, address: address || '', orderId },
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': orderId,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      logSecurityEvent(request, 'PAYMENT_GATEWAY_ERROR', 'SECURITY_ALERT', { status: response.status });
      return new Response(JSON.stringify({
        error: 'No fue posible generar la sesión de pago con el proveedor bancario. Intenta de nuevo más tarde.'
      }), { status: 502, headers: corsHeaders });
    }

    const data = await response.json() as { init_point: string };
    logSecurityEvent(request, 'PAYMENT_PREFERENCE_CREATED', 'INFO', { orderId });
    return new Response(JSON.stringify({ init_point: data.init_point }), { status: 200, headers: corsHeaders });

  } catch(err: any) {
    logSecurityEvent(request, 'PAYMENT_GATEWAY_ERROR', 'SECURITY_ALERT', { reason: 'exception' });
    return new Response(JSON.stringify({
      error: 'Ocurrió un error inesperado al procesar la orden en el servidor.'
    }), { status: 500, headers: corsHeaders });
  }
};

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return handleOptionsCors(request, env);
};
