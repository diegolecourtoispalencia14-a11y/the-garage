const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const newIntents = `  const intents = [
    // 1. Specific Brands (Highest Priority)
    { pattern: /(lee cougan|merida|basso|giant|trek|specialized|pinarello|cervelo|bmc|alubike|allubike)/i,
      responses: ["¡Excelente marca! Manejamos esa línea. ¿Me podrías compartir tu WhatsApp a 10 dígitos para mandarte los modelos y tallas exactas que tenemos en piso?"] },
    
    // 2. Specific Disciplines
    { pattern: /(ruta|asfalto|carrera)/i,
      responses: ["¡La velocidad es lo nuestro! Manejamos marcas top de ruta. ¿Me pasas tu WhatsApp para mandarte fotos del inventario real?"] },
    { pattern: /(montaña|mtb|terraceria|senderos)/i,
      responses: ["Nada como el MTB. Tenemos desde suspensiones rígidas hasta dobles. Si me dejas tu WhatsApp a 10 dígitos te mando el catálogo con precios."] },
    { pattern: /(gravel|mixto)/i,
      responses: ["Gravel es la disciplina más versátil. Tengo unas joyas en tienda para rodar donde sea. ¿Me compartes tu cel a 10 dígitos para mandarte fotos?"] },
    { pattern: /(no se|no estoy seguro|recomiendame|recomendacion|recomendar|ayuda|diario|ciudad|urbana|trabajo)/i,
      responses: ["¡Para uso diario y moverte por la ciudad, te recomiendo muchísimo una bicicleta Híbrida o Gravel! Son cómodas y rápidas. ¿Qué presupuesto tienes en mente?"] },

    // 3. Purchase / Price Intents
    { pattern: /(precio|cuesta|costo|cuanto|caro)/i,
      responses: ["Nuestros equipos van desde los $7,900 MXN hasta gama premium, y todo se entrega ajustado con servicio gratis. ¿Me pasas tu WhatsApp y te armo una cotización?"] },
    { pattern: /(comprar|quiero una|busco una|me interesa|bici|tienen dispo|disponibles|entrega inmediata)/i,
      responses: ["¡Claro que sí! Manejamos Ruta, Gravel y Montaña listas para entrega. ¿Qué disciplina te gusta más?", "Tenemos un catálogo muy amplio listo para rodar. ¿Buscas de Ruta, Montaña o Gravel?"] },
    { pattern: /(garantia|servicio|taller)/i,
      responses: ["Somos centro de servicio certificado. Todas traen garantía y tu primer servicio va por nuestra cuenta. ¿Te animas a venir a la tienda?"] },
    { pattern: /(donde|ubicacion|direccion|tienda)/i,
      responses: ["Estamos en Av. Ich Xeel CASA 19, Cataluña, Playa del Carmen. ¿Te gustaría agendar una cita?"] },

    // 4. Affirmative / Negative / Just looking
    { pattern: /(solo estoy viendo|mirando|curioseando|viendo)/i,
      responses: ["¡Adelante! Tómate tu tiempo. Si ves alguna que te llame la atención, aquí estoy para resolver tus dudas."] },
    { pattern: /(^|\\s)(si|sí|claro|por supuesto|dale|va|me parece bien|ok|okay|vale|simon|sipi)(\\s|$|\\.|,|\\?|!)/i,
      responses: ["¡Excelente! Por favor escríbeme tu número de WhatsApp a 10 dígitos para mandarte todo.", "¡Perfecto! Pásame tu número (10 dígitos) y nos ponemos en contacto en un momento."] },
    { pattern: /(^|\\s)(no|nop|nel|ahorita no|despues|luego)(\\s|$|\\.|,|\\?)/i,
      responses: ["No te preocupes. Aquí ando si cambias de opinión o necesitas ayuda con el catálogo."] },

    // 5. Greetings (Lowest Priority)
    { pattern: /(hola|buenas|que tal|hols|buenos dias|buenas tardes)/i, 
      responses: ["¡Hola! Cuéntame, ¿qué bicicleta tienes en mente hoy?", "¡Qué tal! ¿Buscas alguna marca o disciplina en específico?"] },
    { pattern: /(quien eres|con quien tengo el gusto|como te llamas|nombre)/i,
      responses: ["Soy Diego, asesor especializado de The Garage. ¡Un gusto! ¿Con quién tengo el gusto yo?"] }
  ];`;

content = content.replace(/const intents = \[[\s\S]*?\];/m, newIntents);

fs.writeFileSync('src/components/GarageBot.astro', content);
