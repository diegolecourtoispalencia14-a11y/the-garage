const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

content = content.replace(/\/\\\\b/g, '/\\b');
content = content.replace(/\\\\b\//g, '\\b/');
content = content.replace(/\\\\b/g, '\\b');
content = content.replace(/\\\\s\+/g, '\\s+');
content = content.replace(/\\\\S\+/g, '\\S+');
content = content.replace(/\\\\d\{10\}/g, '\\d{10}');
content = content.replace(/\\\\\./g, '\\.');

fs.writeFileSync('src/components/GarageBot.astro', content);
