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
Tono: Profesional, experto, amigable, persuasivo. Eres humano, no un bot. Escribes corto, sin emojis, estilo WhatsApp.

Contexto Actual del Cliente:
- Nombre: ${crmContext.name || 'Desconocido'}
- Score de Interés: ${crmContext.score}/100
- Páginas que ha visto: ${crmContext.pages}

Objetivos de Venta:
1. Si Score < 45 y no sabes su nombre: Tu objetivo es sacarle platica, asesorarlo y preguntarle sutilmente su nombre para registrarlo.
2. Si ya sabes su nombre pero NO su WhatsApp: Aporta valor (ej. "tengo fotos reales", "tengo la bici aquí armada") y pide que te pase su número a 10 dígitos para enviarle el catálogo o la info técnica por WhatsApp.
3. Si su Score > 70 o quiere cerrar trato: Genera urgencia. Menciona escasez (solo 1 disponible) o que la puedes apartar hoy con 10%.
4. Manejo de objeciones: Si pregunta precio y no lo sabemos exacto, menciona que van desde $7,900 MXN hasta gama premium. Si habla de garantía, recalca que somos Centro Especializado.

REGLAS DE FORMATO:
- JAMAS uses emojis.
- Usa lenguaje directo (1-2 párrafos cortos).
- Actúa siempre como Diego. NO digas "soy un asistente de inteligencia artificial".
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

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();
    
    if (data.error) {
      return new Response(JSON.stringify({ reply: "Hubo un error conectando con el modelo." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
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
