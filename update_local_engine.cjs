const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// I need to replace the entire handleUserInput and the previous processLocalEngine definition
// I will just use regex to replace everything from `const localIntents = [` down to the end of `async function handleUserInput(text) { ... }`

const startTag = 'const localIntents = [';
const endTag = '  // Events';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
    console.error("No se encontraron las anclas.");
    process.exit(1);
}

const newEngine = `const localIntents = [
    // Marcas SÍ manejadas
    { pattern: /(lee cougan|merida|basso|giant|trek|specialized|pinarello|cervelo|bmc|alubike|allubike)/i,
      responses: ["¡Excelente elección! Somos distribuidores de esa línea y tenemos varios modelos armados. ¿Me podrías compartir tu WhatsApp (10 dígitos) para mandarte las fotos reales que tenemos en el piso?"] },
    
    // Marcas NO manejadas (Competencia o comerciales)
    { pattern: /(sunpeed|canyon|scott|orbea|cannondale|benotto|bimex|veloci)/i,
      responses: ["Fíjate que no somos distribuidores de esa marca, pero te aseguro que tenemos opciones en Merida, Giant o Trek que compiten directamente y te ofrecen mejor garantía local. ¿Para qué uso la estás buscando?"] },
    
    // Accesorios y Refacciones
    { pattern: /(casco|cascos|zapatillas|pedales|luces|ropa|jersey|llantas|camaras|refacciones)/i,
      responses: ["Contamos con una boutique muy completa de accesorios y componentes listos para rodar. ¿Buscas alguna talla, marca o color en específico?"] },
    
    // Envíos
    { pattern: /(envio|envios|mandan|republica|mexico|enviar|paqueteria)/i,
      responses: ["¡Hacemos envíos 100% seguros a toda la República Mexicana! Las bicis van en caja, súper protegidas y pre-ajustadas. ¿De qué estado o ciudad nos escribes?"] },
    
    // Financiamiento / Meses
    { pattern: /(meses|msi|tarjeta|credito|financiamiento|pagos|abonos)/i,
      responses: ["¡Claro! Manejamos 3, 6, 9 y hasta 12 Meses Sin Intereses con tarjetas participantes. ¿Tienes en mente algún presupuesto o modelo para hacerte una corrida financiera?"] },

    // Disciplinas
    { pattern: /(ruta|asfalto|carrera)/i,
      responses: ["¡La velocidad pura es lo nuestro! Manejamos pura calidad en ruta. ¿Me pasas tu WhatsApp para mandarte las bellezas que tenemos disponibles en tu talla?"] },
    { pattern: /(montaña|mtb|terraceria|senderos|cross country)/i,
      responses: ["Nada como el MTB. Tenemos desde suspensiones rígidas veloces hasta dobles para descensos rudos. Si me dejas tu WhatsApp a 10 dígitos te mando catálogo con precios."] },
    { pattern: /(gravel|mixto)/i,
      responses: ["¡Gravel es la disciplina más versátil hoy en día! Tenemos unas joyas en tienda listas para asfalto o terracería. ¿Me compartes tu cel a 10 dígitos para mandarte fotos?"] },
    
    // Principiantes
    { pattern: /(no se|no estoy seguro|nuevo|principiante|recomiendame|recomendacion|recomendar|ayuda|diario|ciudad|urbana|trabajo)/i,
      responses: ["¡No te preocupes, todos empezamos desde cero! Para iniciar o moverte por la ciudad, lo mejor y más cómodo es una bici Híbrida o una Gravel. ¿Qué presupuesto tienes pensado para tu primera bici?"] },
    
    // Compra / Precio
    { pattern: /(precio|cuesta|costo|cuanto|caro|presupuesto)/i,
      responses: ["Nuestros equipos van desde los $7,900 MXN hasta la gama premium, y todas incluyen el primer servicio gratis. ¿Me pasas tu WhatsApp para cotizarte exactamente lo que buscas?"] },
    { pattern: /(comprar|quiero una|busco una|me interesa|bici|tienen dispo|disponibles|entrega inmediata)/i,
      responses: ["¡Claro que sí! Tenemos Ruta, Gravel y Montaña armadas y listas para entrega inmediata. ¿Qué disciplina te gusta más o por dónde te gusta rodar?"] },
    
    // Taller
    { pattern: /(garantia|servicio|taller|mantenimiento|purgado|ajuste)/i,
      responses: ["Nuestro taller especializado es de los mejores de la Riviera Maya. Hacemos desde un ajuste básico hasta mantenimientos completos. ¿Qué le duele a tu bici o qué servicio buscas?"] },
    { pattern: /(donde|ubicacion|direccion|tienda)/i,
      responses: ["Estamos en Av. Ich Xeel CASA 19, Cataluña, Playa del Carmen. Nos encantaría recibirte, ¿te gustaría agendar una cita para que un técnico te atienda?"] },
    
    // Interacciones Cortas
    { pattern: /(solo estoy viendo|mirando|curioseando|viendo)/i,
      responses: ["¡Adelante! Tómate tu tiempo. El catálogo está abierto. Si ves alguna que te llame la atención o tienes alguna duda técnica, aquí ando."] },
    { pattern: /(^|\\s)(si|sí|claro|por supuesto|dale|va|me parece bien|ok|okay|vale|simon|sipi)(\\s|$|\\.|,|\\?|!)/i,
      responses: ["¡Excelente! Por favor escríbeme tu número de WhatsApp a 10 dígitos para mandarte toda la información y ponernos en contacto directo."] },
    { pattern: /(^|\\s)(no|nop|nel|ahorita no|despues|luego)(\\s|$|\\.|,|\\?)/i,
      responses: ["No te preocupes. Aquí ando si cambias de opinión o si necesitas ayuda más adelante."] },
    { pattern: /(hola|buenas|que tal|hols|buenos dias|buenas tardes)/i, 
      responses: ["¡Hola! Cuéntame, ¿qué bicicleta tienes en mente hoy o en qué te puedo asesorar?"] },
    { pattern: /(quien eres|con quien tengo el gusto|como te llamas|nombre)/i,
      responses: ["Soy Diego, asesor especializado de The Garage. ¡Un gusto! ¿Con quién tengo el gusto yo?"] }
  ];

  function processLocalEngine(text) {
    let t = text.toLowerCase();
    let prefix = "";
    
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
    
    // Fallback inteligente basado en el contexto
    const score = getCRMScore();
    if (score > 35) {
        return "Entiendo. Cada ciclista busca algo súper específico. Como noto que estás revisando el catálogo, ¿prefieres que platiquemos a detalle por WhatsApp para enviarte modelos exactos?";
    }
    return "Comprendo. Me encantaría darte una mejor asesoría. ¿Te interesaría venir al taller en Playa del Carmen o prefieres que un técnico te contacte por WhatsApp?";
  }

  function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    showTyping();
    
    const phoneRegex = /\\b\\d{10}\\b/;
    const emailRegex = /\\S+@\\S+\\.\\S+/;
    if (phoneRegex.test(text) || emailRegex.test(text)) {
      let match = text.match(phoneRegex) || text.match(emailRegex);
      captureCRMContact(match[0]);
    }

    // Retraso simulado para que parezca humano (800ms a 1.5s)
    let delay = Math.random() * 700 + 800;
    
    setTimeout(() => {
      hideTyping();
      const reply = processLocalEngine(text);
      addMessage('bot', reply);
    }, delay);
  }

`;

content = content.substring(0, startIndex) + newEngine + content.substring(endIndex);

fs.writeFileSync('src/components/GarageBot.astro', content);
