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
    
    // El API de Gemini EXIGE que el historial comience con el rol "user" y que los roles se alternen.
    if (history.length > 0 && history[0].sender === 'bot') {
        contents.push({ role: 'user', parts: [{ text: "Hola, me interesa ver bicicletas." }] });
    }

    for (const msg of history) {
      const role = msg.sender === 'user' ? 'user' : 'model';
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n${msg.text}`;
      } else {
          contents.push({ role, parts: [{ text: msg.text }] });
      }
    }

    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents[contents.length - 1].parts[0].text += `\n${userMessage}`;
    } else {
        contents.push({ role: 'user', parts: [{ text: userMessage }] });
    }

    const payload = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 250,
      }
    };

    // Google API explícitamente requiere el modelo gemini-3.1-pro-preview para cuentas nuevas
    let selectedModel = 'models/gemini-3.1-pro-preview';
    let url = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`;
    
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Model ${selectedModel} failed: ${res.status} - ${errorText}`);
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
