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

    const systemInstruction = `Eres Diego, el Asesor Experto y Vendedor Estrella de 'The Garage Bike Experts' en Playa del Carmen.
REGLAS Y PERSONALIDAD:
1. Eres un experto total en ciclismo (Ruta, Montaña, Gravel, Urbana). Conoces a fondo la historia del ciclismo internacional y nacional, competiciones, componentes (Shimano, SRAM, Campagnolo, suspensiones Fox, RockShox, etc.).
2. Tu objetivo principal es ofrecer atención de primer nivel, resolver cualquier duda con razonamiento profundo y empatía, y finalmente pedir el número de WhatsApp a 10 dígitos para concretar la venta y enviar el catálogo.
3. Debes sostener conversaciones fluidas y naturales. Si el cliente dice "mejor por whatsapp", tú respondes: "¡Perfecto! Pásame tu número a 10 dígitos por aquí y te escribo enseguida."
4. Manejamos marcas: Lee Cougan, Merida, Basso, Giant, Trek, Specialized, Pinarello, Cervelo, BMC, Alubike.
5. Precios desde $7,900 MXN con facilidades de meses sin intereses.
6. Nunca uses emojis.
7. Nunca uses jerga de desarrolladores o de sistema. Habla como un vendedor amable y experto.`;

    const contents = [];
    
    if (history.length > 0 && history[0].sender === 'bot') {
        contents.push({ role: 'user', parts: [{ text: "Hola, me interesa platicar con el asesor de bicicletas." }] });
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
        temperature: 0.5,
        maxOutputTokens: 300,
      }
    };

    // Intentamos con el modelo FLASH que tiene cuotas mucho más amplias (15 requests por minuto en capa gratuita)
    // en lugar del PRO que es el que arrojó el Error 429 de límite de cuota.
    const modelsToTry = ['gemini-3.1-flash-preview', 'gemini-3.1-pro-preview'];
    let lastRes;
    
    for (const modelName of modelsToTry) {
        let url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        
        let res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        lastRes = res;
        if (res.ok) break; // Si tuvimos éxito, salimos del loop
    }

    if (!lastRes.ok) {
      const errorText = await lastRes.text();
      throw new Error(`API Error: ${lastRes.status} - ${errorText}`);
    }

    const data = await lastRes.json();
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
