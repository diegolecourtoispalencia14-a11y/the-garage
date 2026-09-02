const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const startTag = '  function processLocalEngine(text) {';
const endTag = '    let delay = Math.random() * 700 + 800;';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    const newHandleInput = `
  async function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    showTyping();
    
    const phoneRegex = /\\b\\d{10}\\b/;
    const emailRegex = /\\S+@\\S+\\.\\S+/;
    if (phoneRegex.test(text) || emailRegex.test(text)) {
      let match = text.match(phoneRegex) || text.match(emailRegex);
      captureCRMContact(match[0]);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) }) 
      });
      const data = await res.json();
      hideTyping();
      
      if (data.error) {
        console.error("Bot API Error:", data.error);
        if (data.error.includes('429')) {
             addMessage('bot', "Tu cuenta de Google (API KEY) ha agotado su límite gratuito de inteligencia artificial (Error 429). Para que yo pueda razonar y platicar contigo como un experto de The Garage, necesitas agregar más cuota en Google AI Studio o esperar a que se reinicie el límite.");
        } else {
             addMessage('bot', "Error en el servidor de IA: " + data.error);
        }
      } else {
        addMessage('bot', data.reply);
      }
    } catch (err) {
      hideTyping();
      addMessage('bot', "Se perdió la conexión con el motor de Inteligencia Artificial de Google.");
    }
  }

  // --- IGNORAR ABAJO (CÓDIGO LEGACY) ---
`;
    // We will just replace handleUserInput entirely and rip out processLocalEngine
    
    // Actually, safer regex replacement:
    const regex = /function processLocalEngine.*?setTimeout\(\(\) => \{.*?addMessage\('bot', reply\);\s*\}, delay\);\s*\}/s;
    content = content.replace(regex, newHandleInput);
    fs.writeFileSync('src/components/GarageBot.astro', content);
} else {
    console.log("No match found for replacement");
}
