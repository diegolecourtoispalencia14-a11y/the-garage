const fs = require('fs');
let content = fs.readFileSync('functions/api/chat.ts', 'utf8');

content = content.replace('generationConfig: { temperature: 0.7, maxOutputTokens: 250 }', 'generationConfig: { temperature: 0.7 }');

fs.writeFileSync('functions/api/chat.ts', content);
