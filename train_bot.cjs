const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const startTag = 'const localIntents = [';
const endTag = 'function processLocalEngine(text) {';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
    console.error("No se encontraron las anclas.");
    process.exit(1);
}

const massiveEngine = `const localIntents = [
    // --- INTENCIONES DE PRECIO Y PRESUPUESTO (AMPLIADO) ---
    { pattern: /(barata|baratas|economica|economicas|mas bajo|accesible|menor precio)/i,
      responses: ["Nuestras opciones más accesibles arrancan desde los $7,900 MXN, ¡y ya incluyen el primer servicio gratis! ¿Te mando fotos de esos modelos por WhatsApp?"] },
    { pattern: /(ninguno|ninungo|niguno|no tengo|no se todavia|nada en mente)/i,
      responses: ["¡No hay problema! Si no tienes un presupuesto fijo, te puedo mandar nuestro catálogo con las opciones de entrada más económicas (desde $7,900) para que te des una idea. ¿Me pasas tu WhatsApp?"] },
    { pattern: /(oferta|ofertas|descuento|descuentos|rebaja|promo|promocion|buen fin)/i,
      responses: ["Siempre tenemos alguna promoción especial en piso o facilidades de pago. ¿Buscas alguna bici de Montaña o de Ruta para revisarte qué promos aplican hoy?"] },
    { pattern: /(precio|cuesta|costo|cuanto|caro|presupuesto|valor)/i,
      responses: ["Nuestros equipos van desde los $7,900 MXN hasta la gama premium. Todo se entrega ajustado. ¿Me pasas tu WhatsApp para cotizarte algo a tu medida?"] },
    { pattern: /(meses|msi|tarjeta|credito|financiamiento|pagos|abonos)/i,
      responses: ["¡Claro! Manejamos 3, 6, 9 y hasta 12 Meses Sin Intereses con tarjetas participantes. ¿Tienes en mente algún modelo para hacerte una corrida financiera?"] },

    // --- TIPOS DE BICICLETAS Y ATRIBUTOS ---
    { pattern: /(usada|usadas|segunda mano|seminueva|seminuevas)/i,
      responses: ["Por el momento solo manejamos equipos 100% nuevos y con garantía de fábrica, pero tenemos opciones de entrada muy accesibles. ¿Te interesa conocerlas?"] },
    { pattern: /(electrica|electricas|ebike|e-bike|motor|bateria)/i,
      responses: ["¡Las E-Bikes son el futuro! Manejamos líneas de pedaleo asistido que te llevan más lejos sin tanto desgaste. ¿La quieres para moverte en la ciudad o para la montaña?"] },
    { pattern: /(niños|infantil|infantiles|rueditas|niño|niña)/i,
      responses: ["¡También equipamos a los futuros ciclistas! Tenemos bicis rodada 16, 20 y 24. ¿Para qué edad o estatura la estás buscando?"] },
    { pattern: /(mujer|dama)/i,
      responses: ["Claro, tenemos geometrías específicas para mujer que son mucho más cómodas, o modelos unisex en tallas chicas. ¿Qué estatura tienes para revisar inventario?"] },
    { pattern: /(carbono|carbon|fibra|ligera|peso)/i,
      responses: ["Si buscas ligereza, tenemos unos cuadros de fibra de carbono espectaculares, súper rígidos y ligeros. ¿Me pasas tu WhatsApp para mandarte las gamas altas?"] },
    { pattern: /(talla|tallas|medida|medidas|chica|mediana|grande|mido|estatura)/i,
      responses: ["Manejamos todas las tallas (S, M, L, XL). Para no fallarle, lo ideal es basarnos en tu estatura exacta. ¿Cuánto mides?"] },
    { pattern: /(llantas|ruedas|rines|rodada|r29|r27|29|27\\.5|700)/i,
      responses: ["¡La rodada es clave! Para montaña casi todo es 29, y en ruta 700c. ¿Buscas alguna rodada o llanta en particular?"] },
    
    // --- MARCAS ---
    { pattern: /(lee cougan|merida|basso|giant|trek|specialized|pinarello|cervelo|bmc|alubike|allubike)/i,
      responses: ["¡Excelente elección! Somos distribuidores de esa marca y tenemos varios modelos en tienda. ¿Me podrías compartir tu WhatsApp (10 dígitos) para mandarte las fotos reales?"] },
    { pattern: /(sunpeed|canyon|scott|orbea|cannondale|benotto|bimex|veloci|alubike)/i,
      responses: ["Fíjate que no somos distribuidores directos de esa marca, pero tenemos opciones en Merida, Trek o Giant que compiten directamente y con mejor garantía local. ¿Qué uso le darías?"] },

    // --- ACCESORIOS Y TALLER ---
    { pattern: /(casco|cascos|zapatillas|pedales|luces|ropa|jersey|guantes|candado|bomba)/i,
      responses: ["Contamos con una boutique muy completa de accesorios para que salgas a rodar súper equipado y seguro. ¿Buscas alguna marca o talla en específico?"] },
    { pattern: /(garantia|servicio|taller|mantenimiento|purgado|ajuste|taller|mecanico|reparacion)/i,
      responses: ["Nuestro taller especializado es de los mejores de la Riviera Maya. Hacemos desde un ajuste básico hasta mantenimientos completos de suspensión. ¿Qué le duele a tu bici?"] },

    // --- LOGÍSTICA E INFORMACIÓN LOCAL ---
    { pattern: /(envio|envios|mandan|republica|mexico|enviar|paqueteria)/i,
      responses: ["¡Hacemos envíos 100% seguros a toda la República Mexicana! Las bicis van en caja, súper protegidas y pre-ajustadas. ¿A qué código postal sería el envío?"] },
    { pattern: /(horario|abierto|cierran|abren|dias)/i,
      responses: ["Abrimos de Lunes a Sábado. ¿Te gustaría agendar una cita para visitarnos y probar algunas tallas?"] },
    { pattern: /(donde|ubicacion|direccion|tienda|local)/i,
      responses: ["Estamos en Av. Ich Xeel CASA 19, Cataluña, Playa del Carmen. Nos encantaría recibirte, ¿quieres que te pase la ubicación por WhatsApp?"] },

    // --- DISCIPLINAS ---
    { pattern: /(ruta|asfalto|carrera)/i,
      responses: ["¡La velocidad pura es lo nuestro! Manejamos pura calidad en ruta. ¿Me pasas tu WhatsApp para mandarte las bellezas que tenemos disponibles en tu talla?"] },
    { pattern: /(montaña|mtb|terraceria|senderos|cross country)/i,
      responses: ["Nada como el MTB. Tenemos desde rígidas veloces hasta dobles para descensos rudos. Si me dejas tu WhatsApp a 10 dígitos te mando catálogo."] },
    { pattern: /(gravel|mixto)/i,
      responses: ["¡Gravel es la disciplina más versátil hoy en día! Tenemos unas joyas en tienda listas para asfalto o terracería. ¿Me compartes tu cel a 10 dígitos para pasarte modelos?"] },
    { pattern: /(no se|no estoy seguro|nuevo|principiante|recomiendame|recomendacion|recomendar|ayuda|diario|ciudad|urbana|trabajo)/i,
      responses: ["¡No te preocupes, todos empezamos desde cero! Para iniciar o moverte por la ciudad, lo mejor y más cómodo es una bici Híbrida o una Gravel. ¿Qué presupuesto tienes pensado?"] },
    
    // --- INTERACCIONES GENERALES Y CIERRES ---
    { pattern: /(comprar|quiero una|busco una|me interesa|bici|tienen dispo|disponibles|entrega inmediata)/i,
      responses: ["¡Claro que sí! Tenemos Ruta, Gravel y Montaña armadas y listas para entrega inmediata. ¿Qué disciplina te gusta más o por dónde te gusta rodar?"] },
    { pattern: /(solo estoy viendo|mirando|curioseando|viendo|checar)/i,
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

  `;

content = content.substring(0, startIndex) + massiveEngine + content.substring(endIndex);

// Update fallback to be more tolerant of weird inputs
const oldFallback = `if (prefix) return prefix + "¿En qué te puedo ayudar hoy con tu próxima bicicleta?";
    
    // Fallback inteligente basado en el contexto
    const score = getCRMScore();
    if (score > 35) {
        return "Entiendo. Cada ciclista busca algo súper específico. Como noto que estás revisando el catálogo, ¿prefieres que platiquemos a detalle por WhatsApp para enviarte modelos exactos?";
    }
    return "Comprendo. Me encantaría darte una mejor asesoría. ¿Te interesaría venir al taller en Playa del Carmen o prefieres que un técnico te contacte por WhatsApp?";`;

const newFallback = `if (prefix) return prefix + "¿En qué te puedo ayudar hoy con tu próxima bicicleta?";
    
    // Fallback Ultra-Tolerante
    const score = getCRMScore();
    if (score > 35) {
        return "Me agarraste un poco en curva, pero entiendo por dónde vas. Cada ciclista busca algo súper específico. Como noto que estás revisando el catálogo, ¿prefieres que platiquemos a detalle por WhatsApp para enviarte modelos exactos?";
    }
    return "Esa es una excelente pregunta, pero para no darte información a medias por este chat, me encantaría que un técnico te asesore bien. ¿Te interesaría venir al taller en Playa del Carmen o prefieres dejarnos tu WhatsApp?";`;

content = content.replace(oldFallback, newFallback);

fs.writeFileSync('src/components/GarageBot.astro', content);
