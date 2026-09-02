const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// Replace the entire processBotLogic function
const newLogic = `  function processBotLogic(text) {
    let t = text.toLowerCase();
    
    // Always check for contact info to feed the CRM
    const phoneRegex = /\\b\\d{10}\\b/;
    const emailRegex = /\\S+@\\S+\\.\\S+/;
    
    if (phoneRegex.test(t) || emailRegex.test(t)) {
      let match = t.match(phoneRegex) || t.match(emailRegex);
      captureCRMContact(match[0]);
      // We don't return here! We still send it to the LLM so it can say "Thanks, I saved your number!"
    }

    const crmData = {
      score: getCRMScore(),
      name: getCRMName(),
      pages: getCRMPages().join(', ')
    };

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: chatHistory, crmContext: crmData })
    })
    .then(r => r.json())
    .then(data => {
      addMessage('bot', data.reply);
    })
    .catch(err => {
      addMessage('bot', 'Perdón, mi sistema está intentando conectar. ¿Me dejas tu WhatsApp a 10 dígitos para atenderte por allá?');
    });
  }`;

content = content.replace(/function processBotLogic\(text\) \{[\s\S]*?\}\s*(?=\/\/ Events)/, newLogic + '\n\n  ');

// Also remove the old getGreeting logic so the LLM ALWAYS starts the conversation
const newToggle = `  toggleBtn.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    toggleBtn.style.display = 'none';
    notifDot.style.display = 'none';
    
    if (chatHistory.length === 0) {
      showTyping();
      setTimeout(() => {
        processBotLogic('HOLA_INICIAL_SISTEMA'); // trigger LLM for first message
      }, 500);
    }
  });`;

content = content.replace(/toggleBtn\.addEventListener\('click'[\s\S]*?\n  \}\);\n/, newToggle + '\n');

fs.writeFileSync('src/components/GarageBot.astro', content);
