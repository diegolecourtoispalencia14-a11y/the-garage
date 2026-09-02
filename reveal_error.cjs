const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// Replace the generic error message with the actual error message
content = content.replace(
  /addMessage\('bot', "Disculpa, tuve un problema de conexión.*?WhatsApp directamente\?"\);/g,
  'addMessage(\'bot\', "Error de Sistema: " + data.error);'
);

fs.writeFileSync('src/components/GarageBot.astro', content);
