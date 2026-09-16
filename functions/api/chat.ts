import { z } from 'zod';
import { getSecureCorsHeaders, handleOptionsCors } from '../_cors';
import { checkRateLimit, rateLimitResponse } from '../_ratelimit';
import { logSecurityEvent } from '../_logger';

const ChatMessageSchema = z.object({
  sender: z.enum(['user', 'assistant', 'bot']),
  text: z.string().max(800),
});

const ChatBodySchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío').max(500, 'Mensaje demasiado largo (máximo 500 caracteres)'),
  history: z.array(ChatMessageSchema).max(20).optional().default([]),
  state: z.string().max(40).regex(/^[a-zA-Z0-9_]+$/, 'Estado no válido').optional().default('STATE_IDLE_NEW'),
});

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const headers = {
    ...getSecureCorsHeaders(request, env),
    'Content-Type': 'application/json',
  };

  // 1. Rate limiting check (20 requests per minute per IP)
  const rl = checkRateLimit(request, { maxRequests: 20, windowSeconds: 60 });
  if (!rl.allowed) {
    logSecurityEvent(request, 'RATE_LIMIT_EXCEEDED', 'WARN', { limit: rl.limit });
    return rateLimitResponse(headers, rl.resetSeconds, rl.limit);
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      logSecurityEvent(request, 'INVALID_INPUT_DETECTED', 'WARN', { reason: 'malformed_json' });
      return new Response(JSON.stringify({ error: 'Formato JSON inválido' }), { status: 400, headers });
    }

    const validation = ChatBodySchema.safeParse(rawBody);
    if (!validation.success) {
      logSecurityEvent(request, 'INVALID_INPUT_DETECTED', 'WARN', { error: validation.error.issues[0]?.message });
      return new Response(JSON.stringify({
        error: 'Datos de entrada no válidos',
        details: validation.error.issues[0]?.message || 'Verifica el contenido de tu mensaje'
      }), { status: 400, headers });
    }

    const { message: userMessage, history, state: currentState } = validation.data;

    // Verificamos si el motor de IA de Cloudflare está vinculado
    if (!env.AI) {
      return new Response(JSON.stringify({
        error: "El servicio de chat inteligente está temporalmente inactivo. Escríbenos por WhatsApp."
      }), { status: 503, headers });
    }

    const systemInstruction = `Eres Diego, Asesor Senior de The Garage Bike Experts (Playa del Carmen).
REGLAS ESTRICTAS:
1. Experto absoluto en historia del ciclismo, marcas (Trek, Merida, Giant, Basso) y componentes técnicos (Shimano, SRAM, Fox).
2. Tono persuasivo, empático, sin emojis, sin jerga informática. Eres humano.
3. El motor de estado interno indica que el cliente actualmente está en la fase: [${currentState}]. Usa este contexto para guiar tu respuesta.
4. Si el estado es STATE_AWAITING_LEAD_INFO, tu objetivo es que el cliente nos dé su WhatsApp a 10 dígitos.
5. Si el estado es STATE_OBJECTION_COMPETITOR, redirige la venta sutilmente hacia nuestras marcas.
6. Nunca des precios de bicicletas por debajo de $7,900 MXN.
7. Mantén tus respuestas en un solo párrafo, fluidas y muy conversacionales.`;

    const messages = [
      { role: 'system', content: systemInstruction }
    ];

    for (const msg of history) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text.slice(0, 800)
      });
    }

    messages.push({ role: 'user', content: userMessage });

    // Ejecutamos Llama 3 8B (Nativo y Gratuito en Cloudflare)
    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: messages,
      max_tokens: 250,
      temperature: 0.6
    });

    return new Response(JSON.stringify({ reply: response.response }), {
      status: 200,
      headers
    });

  } catch {
    return new Response(JSON.stringify({
      error: 'Lo sentimos, hubo un inconveniente al procesar tu consulta. Por favor intenta de nuevo.'
    }), { status: 500, headers });
  }
}

export async function onRequestOptions(context: any) {
  return handleOptionsCors(context.request, context.env);
}
