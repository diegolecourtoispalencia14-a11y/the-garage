const fs = require('fs');
let content = fs.readFileSync('functions/api/chat.ts', 'utf8');

// Use 1.5 flash instead of 3.6 flash
content = content.replace('gemini-3.6-flash', 'gemini-1.5-flash');

fs.writeFileSync('functions/api/chat.ts', content);
