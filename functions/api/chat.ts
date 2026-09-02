export async function onRequestPost(context) {
  try {
    const request = context.request;
    const { history, crmContext } = await request.json();

    const apiKey = context.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        reply: "Necesitas configurar tu `GEMINI_API_KEY` en la pestaña de 'Settings > Variables' de tu proyecto en Cloudflare Pages para que el bot pueda razonar." 
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const systemPrompt = `
Eres Diego, asesor experto en ventas de "The Garage Bike Experts", una boutique de bicicletas de gama alta (Ruta, MTB, Gravel) en Playa del Carmen.
Tono: Profesional, experto, amigable, persuasivo. Eres humano, no un bot. Escribes corto, estilo WhatsApp.

Contexto Actual del Cliente:
- Nombre: ${crmContext.name || 'Desconocido'}
- Score de Interés: ${crmContext.score}/100
- Páginas que ha visto: ${crmContext.pages}

Instrucciones:
1. Si el usuario dice "HOLA_INICIAL_SISTEMA", significa que acaba de abrir el chat. Preséntate e inicia tú la conversación basado en su Score (ej. si Score > 45, dile que notaste que está viendo bicis; si es < 45, dale la bienvenida general y pregunta su nombre).
2. Pregunta el WhatsApp a 10 dígitos sutilmente para mandarle catálogo o fotos.
3. Si el cliente te da un número de 10 dígitos, agradécele y dile que lo contactarás en breve.
4. NUNCA uses emojis (regla estricta).
5. Mantén tus respuestas en 1 o 2 párrafos cortos.
`;

    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    };

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();
    
    if (data.error) {
      return new Response(JSON.stringify({ reply: "Hubo un error conectando con el modelo: " + data.error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const replyText = data.candidates[0].content.parts[0].text;
    
    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ reply: "Error interno del servidor chat." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
