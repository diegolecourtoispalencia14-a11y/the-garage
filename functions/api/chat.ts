export async function onRequestPost(context) {
  try {
    const request = context.request;
    const { history, crmContext } = await request.json();
    const apiKey = context.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        reply: "Necesitas configurar tu `GEMINI_API_KEY` en Cloudflare." 
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const systemPrompt = `
Eres Diego, asesor experto en ventas de "The Garage Bike Experts", una boutique de bicicletas de gama alta en Playa del Carmen.
Tono: Profesional, experto, persuasivo. Estilo WhatsApp, corto y al grano.

Contexto Actual del Cliente:
- Nombre: ${crmContext.name || 'Desconocido'}
- Score de Interés: ${crmContext.score}/100

Instrucciones:
1. Si el usuario dice "HOLA_INICIAL_SISTEMA", preséntate e inicia la conversación.
2. Si quiere informes, pide sutilmente el WhatsApp a 10 dígitos.
3. NUNCA uses emojis (regla estricta).
`;

    let formattedHistory = history.map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Fix: If history is empty because it's the auto-greeting ping
    if (formattedHistory.length === 0) {
      formattedHistory = [{ role: 'user', parts: [{ text: 'HOLA_INICIAL_SISTEMA' }] }];
    }

    const payload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: formattedHistory,
      generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
    };

    let data;
    let success = false;
    let attempts = 3; // Retry logic for high demand

    for (let i = 0; i < attempts; i++) {
      const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      data = await apiResponse.json();
      
      // If 503 high demand, wait 1.5s and retry
      if (data.error && data.error.message.includes('high demand')) {
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }
      success = true;
      break;
    }

    if (!success || data.error) {
      return new Response(JSON.stringify({ reply: "Hubo un error de conexión temporal con los servidores de Google: " + (data.error?.message || "Unknown error") }), { status: 500, headers: { 'Content-Type': 'application/json' } });
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
