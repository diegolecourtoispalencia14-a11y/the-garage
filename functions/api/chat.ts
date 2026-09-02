export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessage = body.message;
    const history = body.history || [];
    const currentState = body.state || 'STATE_IDLE_NEW';
    
    // Verificamos si el motor de IA de Cloudflare está vinculado
    if (!env.AI) {
      return new Response(JSON.stringify({ error: "Cloudflare Workers AI no está activado. Verifica el binding 'AI'." }), { status: 500 });
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
            content: msg.text
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
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
