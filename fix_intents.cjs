const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// Replace all /\b(something)\b/i with /(something)/i
content = content.replace(/\/\\b\((.*?)\)\\b\/i/g, '/($1)/i');

// Add intent for "no"
const newIntents = `    { pattern: /(no|no gracias|ahorita no|despues|luego)/i,
      responses: ["No te preocupes. Aquí ando si cambias de opinión o necesitas ayuda con el catálogo."] },
    { pattern: /(quien eres|con quien tengo el gusto|como te llamas|nombre)/i,`;

content = content.replace('{ pattern: /(quien eres|con quien tengo el gusto|como te llamas)/i,', newIntents);

fs.writeFileSync('src/components/GarageBot.astro', content);
