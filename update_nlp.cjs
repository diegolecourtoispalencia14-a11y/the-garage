const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const newIntents = `  const intents = [
    { pattern: /(hola|buenas|que tal|hols|buenos dias|buenas tardes)/i, 
      responses: ["¡Hola! Soy Diego. ¿En qué te puedo ayudar hoy con tu próxima bicicleta?", "¡Qué tal! Bienvenido a The Garage. ¿Buscas algo en específico?"] },
    { pattern: /(no se|no estoy seguro|recomiendame|recomendacion|recomendar|ayuda|diario|ciudad|urbana|trabajo)/i,
      responses: ["¡Para uso diario y moverte por la ciudad, te recomiendo muchísimo una bicicleta Híbrida o Gravel! Son rápidas y comodísimas. ¿Qué presupuesto tienes en mente?"] },
    { pattern: /(comprar|quiero una|busco una|me interesa|bici)/i,
      responses: ["Excelente decisión. Manejamos Ruta, Gravel y Montaña. ¿Qué disciplina te gusta más?", "Tengo opciones listas para rodar. ¿Para qué terreno la buscas?"] },
    { pattern: /(ruta|asfalto|carrera)/i,
      responses: ["La velocidad es lo nuestro. Manejamos marcas top como Merida y Basso. ¿Qué presupuesto tienes en mente?", "Perfecto para asfalto. Te puedo mandar fotos reales del inventario. ¿Me pasas tu WhatsApp?"] },
    { pattern: /(montaña|mtb|terraceria|senderos)/i,
      responses: ["Nada como el MTB. Tenemos desde suspensiones rígidas hasta dobles. Si me dejas tu WhatsApp te mando el catálogo con precios.", "¡Rudos senderos! Tengo unas Trek y Giant listas. ¿Te paso la info por WhatsApp?"] },
    { pattern: /(gravel|mixto)/i,
      responses: ["Gravel es la disciplina más versátil hoy en día. Tengo unas joyas en tienda. ¿Me compartes tu cel a 10 dígitos para mandarte fotos?"] },
    { pattern: /(precio|cuesta|costo|cuanto|caro)/i,
      responses: ["Nuestros equipos van desde los $7,900 MXN hasta gama premium. Todo se entrega ajustado y con servicio gratis. ¿Me pasas tu WhatsApp y te armo una cotización?"] },
    { pattern: /(garantia|servicio|taller)/i,
      responses: ["Somos centro de servicio certificado. Todas traen garantía y tu primer servicio va por nuestra cuenta. ¿Te animas a venir a la tienda?"] },
    { pattern: /(donde|ubicacion|direccion|tienda)/i,
      responses: ["Estamos en Av. Ich Xeel CASA 19, Cataluña, Playa del Carmen. ¿Te gustaría agendar una cita?"] },
    { pattern: /(^|\\s)(no|nop|nel|ahorita no|despues|luego)(\\s|$|\\.|,|\\?)/i,
      responses: ["No te preocupes. Aquí ando si cambias de opinión o necesitas ayuda con el catálogo."] },
    { pattern: /(quien eres|con quien tengo el gusto|como te llamas|nombre)/i,
      responses: ["Soy Diego, asesor especializado de The Garage. ¡Un gusto! ¿Con quién tengo el gusto yo?"] }
  ];`;

content = content.replace(/const intents = \[[\s\S]*?\];/m, newIntents);

fs.writeFileSync('src/components/GarageBot.astro', content);
