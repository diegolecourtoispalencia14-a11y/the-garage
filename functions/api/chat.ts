export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessage = body.message;
    const history = body.history || [];
    
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Falta la API KEY de Gemini en Cloudflare" }), { status: 500 });
    }

    // System prompt para el LLM
    const systemInstruction = `Eres Diego, el asesor experto en bicicletas de 'The Garage Bike Experts' en Playa del Carmen.
REGLAS ESTRICTAS:
1. Nunca uses emojis.
2. Nunca uses jerga de desarrolladores.
3. Se empático, razona la conversación y compórtate como un humano real experto en bicicletas.
4. Tu objetivo principal es asesorar, detectar la necesidad (Ruta, Montaña, Gravel, Urbana) y pedir el número de WhatsApp a 10 dígitos para cerrar la venta enviando el catálogo.
5. Si el usuario te da su nombre, grábatelo y úsalo. Si dice 'soy nuevo', asiste con paciencia. No asumas que 'nuevo' es su nombre.
6. Manejamos marcas: Lee Cougan, Merida, Basso, Giant, Trek, Specialized, Pinarello, Cervelo, BMC, Alubike.
7. Precios desde $7,900 MXN. Entregamos ajustado y con 1er servicio gratis.
8. Mantén respuestas cortas, fluidas y muy conversacionales.`;

    const contents = [];
    // Convertir el historial al formato de Gemini
    for (const msg of history) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const payload = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 200,
      }
    };

    // Intentaremos con gemini-1.5-flash primero, si falla gemini-pro
    let model = 'gemini-1.5-flash';
    let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // Fallback a gemini-pro (Gemini 1.0) si 1.5-flash falla
      model = 'gemini-pro';
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      // gemini-pro no soporta system_instruction en la raíz de la misma forma a veces,
      // pero se lo inyectaremos en el primer mensaje de usuario si es necesario.
      const fallbackContents = [...contents];
      fallbackContents[0].parts[0].text = `[Instrucciones de sistema: ${systemInstruction}]\n\n${fallbackContents[0].parts[0].text}`;
      
      const fallbackPayload = {
        contents: fallbackContents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 200 }
      };

      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackPayload)
      });
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    const botReply = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ reply: botReply }), {
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
