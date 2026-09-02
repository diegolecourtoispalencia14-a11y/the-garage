const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

content = content.replace(
  'lee cougan|merida|basso|giant|trek|specialized|pinarello|cervelo|bmc',
  'lee cougan|merida|basso|giant|trek|specialized|pinarello|cervelo|bmc|alubike|allubike'
);

fs.writeFileSync('src/components/GarageBot.astro', content);
