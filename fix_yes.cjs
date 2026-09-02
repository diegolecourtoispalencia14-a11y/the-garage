const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const yesIntent = `    { pattern: /(^|\\s)(si|sí|claro|por supuesto|dale|va|me parece bien|ok|okay|vale|simon|sipi)(\\s|$|\\.|,|\\?|!)/i,
      responses: ["¡Excelente! Por favor escríbeme tu número de WhatsApp a 10 dígitos para mandarte todo.", "¡Perfecto! Pásame tu número (10 dígitos) y nos ponemos en contacto en un momento."] },
    { pattern: /(^|\\s)(no|nop|nel|ahorita no|despues|luego)(\\s|$|\\.|,|\\?)/i,`;

content = content.replace('{ pattern: /(^|\\s)(no|nop|nel|ahorita no|despues|luego)(\\s|$|\\.|,|\\?)/i,', yesIntent);

fs.writeFileSync('src/components/GarageBot.astro', content);
