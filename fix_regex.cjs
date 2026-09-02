const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// Fix the catastrophic regex flaw
content = content.replace(
  /{ pattern: \/\(talla\|medida\|mido\|estatura\|chica\|mediana\|grande\|s\|m\|l\|xl\)\/i,/g,
  '{ pattern: /(talla|medida|mido|estatura|chica|mediana|grande|\\\\bs\\\\b|\\\\bm\\\\b|\\\\bl\\\\b|\\\\bxl\\\\b)/i,'
);

fs.writeFileSync('src/components/GarageBot.astro', content);
