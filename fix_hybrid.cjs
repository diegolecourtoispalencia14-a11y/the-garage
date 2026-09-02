const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// I need to replace the error block inside handleUserInput
const findErrorBlock = `      if (data.error) {
        console.error("Bot API Error:", data.error);
        addMessage('bot', "Error de Sistema: " + data.error);
      } else {
        addMessage('bot', data.reply);
      }`;

const hybridBlock = `      if (data.error) {
        console.warn("LLM Fallando (Posible límite de cuota). Activando Motor Local de Respaldo...", data.error);
        const fallbackReply = processLocalEngine(text);
        addMessage('bot', fallbackReply);
      } else {
        addMessage('bot', data.reply);
      }`;

content = content.replace(findErrorBlock, hybridBlock);

const findCatchBlock = `    } catch (err) {
      hideTyping();
      addMessage('bot', "Se perdió la conexión. Por favor intenta de nuevo o escríbenos al WhatsApp.");
    }`;

const hybridCatchBlock = `    } catch (err) {
      hideTyping();
      console.warn("Error de red. Activando Motor Local de Respaldo...");
      const fallbackReply = processLocalEngine(text);
      addMessage('bot', fallbackReply);
    }`;

content = content.replace(findCatchBlock, hybridCatchBlock);

// Now I need to inject processLocalEngine function before handleUserInput
const localEngineCode = `
  const localIntents = [
    { pattern: /(lee cougan|merida|basso|giant|trek|specialized|pinarello|cervelo|bmc|alubike|allubike)/i,
      responses: ["¡Excelente marca! Manejamos esa línea. ¿Me podrías compartir tu WhatsApp a 10 dígitos para mandarte los modelos y tallas exactas que tenemos en piso?"] },
    { pattern: /(ruta|asfalto|carrera)/i,
      responses: ["¡La velocidad es lo nuestro! Manejamos marcas top de ruta. ¿Me pasas tu WhatsApp para mandarte fotos del inventario real?"] },
    { pattern: /(montaña|mtb|terraceria|senderos)/i,
      responses: ["Nada como el MTB. Tenemos desde suspensiones rígidas hasta dobles. Si me dejas tu WhatsApp a 10 dígitos te mando el catálogo con precios."] },
    { pattern: /(gravel|mixto)/i,
      responses: ["Gravel es la disciplina más versátil. Tengo unas joyas en tienda para rodar donde sea. ¿Me compartes tu cel a 10 dígitos para mandarte fotos?"] },
    { pattern: /(no se|no estoy seguro|nuevo|principiante|recomiendame|recomendacion|recomendar|ayuda|diario|ciudad|urbana|trabajo)/i,
      responses: ["¡Para uso diario o si vas empezando, te recomiendo muchísimo una bicicleta Híbrida o Gravel! Son súper cómodas y versátiles. ¿Qué presupuesto tienes en mente?"] },
    { pattern: /(precio|cuesta|costo|cuanto|caro)/i,
      responses: ["Nuestros equipos van desde los $7,900 MXN hasta gama premium, y todo se entrega ajustado con servicio gratis. ¿Me pasas tu WhatsApp y te armo una cotización?"] },
    { pattern: /(comprar|quiero una|busco una|me interesa|bici|tienen dispo|disponibles|entrega inmediata)/i,
      responses: ["¡Claro que sí! Manejamos Ruta, Gravel y Montaña listas para entrega. ¿Qué disciplina te gusta más?"] },
    { pattern: /(garantia|servicio|taller)/i,
      responses: ["Somos centro de servicio certificado. Todas traen garantía y tu primer servicio va por nuestra cuenta. ¿Te animas a venir a la tienda?"] },
    { pattern: /(donde|ubicacion|direccion|tienda)/i,
      responses: ["Estamos en Av. Ich Xeel CASA 19, Cataluña, Playa del Carmen. ¿Te gustaría agendar una cita?"] },
    { pattern: /(solo estoy viendo|mirando|curioseando|viendo)/i,
      responses: ["¡Adelante! Tómate tu tiempo. Si ves alguna que te llame la atención, aquí estoy para resolver tus dudas."] },
    { pattern: /(^|\\s)(si|sí|claro|por supuesto|dale|va|me parece bien|ok|okay|vale|simon|sipi)(\\s|$|\\.|,|\\?|!)/i,
      responses: ["¡Excelente! Por favor escríbeme tu número de WhatsApp a 10 dígitos para mandarte todo."] },
    { pattern: /(^|\\s)(no|nop|nel|ahorita no|despues|luego)(\\s|$|\\.|,|\\?)/i,
      responses: ["No te preocupes. Aquí ando si cambias de opinión o necesitas ayuda con el catálogo."] },
    { pattern: /(hola|buenas|que tal|hols|buenos dias|buenas tardes)/i, 
      responses: ["¡Hola! Cuéntame, ¿qué bicicleta tienes en mente hoy?"] },
    { pattern: /(quien eres|con quien tengo el gusto|como te llamas|nombre)/i,
      responses: ["Soy Diego, asesor especializado de The Garage. ¡Un gusto! ¿Con quién tengo el gusto yo?"] }
  ];

  function processLocalEngine(text) {
    let t = text.toLowerCase();
    let prefix = "";
    
    // Eliminé "soy" para evitar errores como "soy nuevo". Solo detecta "me llamo X" o "mi nombre es X".
    const nameMatch = t.match(/\\b(me llamo|mi nombre es)\\s+([a-záéíóúñ]+)/i);
    if (nameMatch) {
      const extractedName = nameMatch[2].charAt(0).toUpperCase() + nameMatch[2].slice(1);
      prefix = \`¡Mucho gusto, \${extractedName}! \`;
      t = t.replace(nameMatch[0], "");
    }

    for (let i = 0; i < localIntents.length; i++) {
      if (localIntents[i].pattern.test(t)) {
        let options = localIntents[i].responses;
        return prefix + options[Math.floor(Math.random() * options.length)];
      }
    }
    
    if (prefix) return prefix + "¿En qué te puedo ayudar hoy con tu próxima bicicleta?";
    return "Comprendo. Cada ciclista es único, y me gustaría asesorarte bien. ¿Te interesaría venir al taller o prefieres que platiquemos por WhatsApp?";
  }
`;

content = content.replace('async function handleUserInput(text) {', localEngineCode + '\n  async function handleUserInput(text) {');

fs.writeFileSync('src/components/GarageBot.astro', content);
