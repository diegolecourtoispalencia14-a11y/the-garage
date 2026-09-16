/**
 * Cloudflare Pages Function: /api/generate-product-image
 * Uses Cloudflare Workers AI (Flux Schnell) to generate
 * high-quality marketplace product photos from bike data.
 *
 * Env vars (set in Cloudflare Dashboard → Pages → Settings → Variables):
 *   AI  — bound automatically when you enable Workers AI in the Pages project
 *
 * To enable Workers AI binding:
 *   1. Go to Cloudflare Dashboard → Pages → the-garage → Settings → Functions
 *   2. Under "AI Bindings", add binding with variable name: AI
 */

import { z } from 'zod';
import { getSecureCorsHeaders, handleOptionsCors } from '../_cors';
import { checkRateLimit, rateLimitResponse } from '../_ratelimit';
import { logSecurityEvent } from '../_logger';

interface Env {
  AI?: any;
  PUBLIC_SITE_URL?: string;
}

const ImagePromptSchema = z.object({
  brand: z.string().min(1).max(80).regex(/^[a-zA-Z0-9 ._-]+$/, 'Nombre de marca no válido'),
  model: z.string().min(1).max(80).regex(/^[a-zA-Z0-9 ._-]+$/, 'Nombre de modelo no válido'),
  type: z.string().min(1).max(50).regex(/^[a-zA-Z0-9 ._-]+$/, 'Tipo de bicicleta no válido'),
  color: z.string().max(50).regex(/^[a-zA-Z0-9 ._-]+$/, 'Color no válido').optional(),
  style: z.enum(['studio', 'action', 'lifestyle', 'minimalist']).optional().default('studio'),
});

const STYLE_PRESETS: Record<string, string> = {
  studio:
    'professional studio photography, pure clean dark gradient background, dramatic rim lighting, ' +
    'sharp focus, commercial photography, 8K resolution, no shadows harsh, soft box lighting',
  action:
    'dynamic action shot, outdoor mountain trail, golden hour sunlight, dramatic angle, ' +
    'motion blur background, professional sports photography, cinematic',
  lifestyle:
    'lifestyle photography, urban street setting, natural daylight, warm tones, ' +
    'aspirational, modern city background bokeh, Instagram-worthy',
  minimalist:
    'minimalist flat lay, top-down view, clean white surface, subtle shadow, ' +
    'Scandinavian aesthetic, editorial photography, luxury brand style',
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const cors = {
    ...getSecureCorsHeaders(request, env),
    'Content-Type': 'application/json',
  };

  // 1. Rate limiting check (10 requests per minute per IP)
  const rl = checkRateLimit(request, { maxRequests: 10, windowSeconds: 60 });
  if (!rl.allowed) {
    logSecurityEvent(request, 'RATE_LIMIT_EXCEEDED', 'WARN', { limit: rl.limit });
    return rateLimitResponse(cors, rl.resetSeconds, rl.limit);
  }

  // Sandbox fallback when Workers AI is not bound
  if (!env.AI) {
    const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#1c1c1e"/>
      <text x="256" y="240" text-anchor="middle" fill="#86868b" font-size="48" font-family="sans-serif">🚲</text>
      <text x="256" y="300" text-anchor="middle" fill="#86868b" font-size="18" font-family="sans-serif">Workers AI no configurado</text>
      <text x="256" y="330" text-anchor="middle" fill="#444" font-size="14" font-family="sans-serif">Activa Workers AI en Cloudflare Pages</text>
    </svg>`;
    const b64 = btoa(placeholder);
    return new Response(JSON.stringify({
      sandbox: true,
      image: `data:image/svg+xml;base64,${b64}`,
      message: 'Workers AI binding (AI) no configurado. Habilítalo en Cloudflare Pages.'
    }), { status: 200, headers: cors });
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Cuerpo de solicitud JSON malformado' }), { status: 400, headers: cors });
    }

    const validation = BikeDataSchema.safeParse(rawBody);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: 'Parámetros de producto inválidos',
        details: validation.error.issues[0]?.message
      }), { status: 400, headers: cors });
    }

    const { marca, modelo, categoria, color, estado, stylePreset } = validation.data;
    const styleDesc = STYLE_PROMPTS[stylePreset] || STYLE_PROMPTS.studio;

    // Sanitized prompt construction: strictly typed parameters
    const prompt =
      `${marca} ${modelo} ${categoria} bicycle, ${color} color finish, ${estado.toLowerCase()} condition, ` +
      `${styleDesc}, ` +
      `perfect for e-commerce marketplace listing, highly detailed, ` +
      `photorealistic, no people, bicycle only, centered composition, ` +
      `professional product shot, award-winning commercial photography`;

    const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt,
      num_steps: 8,
      width: 1024,
      height: 1024,
    }) as ArrayBuffer | { image?: string };

    if (response instanceof ArrayBuffer) {
      const bytes = new Uint8Array(response);
      let binary = '';
      bytes.forEach(b => { binary += String.fromCharCode(b); });
      const b64 = btoa(binary);
      return new Response(JSON.stringify({
        image: `data:image/png;base64,${b64}`,
        prompt
      }), { status: 200, headers: cors });
    }

    if (response && typeof response === 'object' && 'image' in response && response.image) {
      return new Response(JSON.stringify({
        image: `data:image/png;base64,${response.image}`,
        prompt
      }), { status: 200, headers: cors });
    }

    return new Response(JSON.stringify({ error: 'Formato de respuesta inesperado del motor generativo' }), { status: 502, headers: cors });

  } catch {
    return new Response(JSON.stringify({ error: 'Error al generar la imagen del producto' }), { status: 500, headers: cors });
  }
};

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return handleOptionsCors(request, env);
};
