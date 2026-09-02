const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// 1. Remove the hardcoded typing indicator
content = content.replace(/<div id="gb-typing".*?<\/div>/s, '');

// 2. Replace the broken handleUserInput
const oldHandleUser = `  function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    const typing = document.getElementById('gb-typing');
    typing.style.display = 'block';
    msgContainer.appendChild(typing);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    
    let delay = Math.random() * 1000 + 800; // Fake typing 0.8s - 1.8s
    setTimeout(() => {
      typing.style.display = 'none';
      processBotLogic(text);
    }, delay);
  }`;

const newHandleUser = `  function showTyping() {
    const t = document.createElement('div');
    t.id = 'gb-typing';
    t.className = 'gb-msg gb-msg-bot';
    t.style.width = '50px';
    t.style.padding = '0.5rem 0.85rem';
    t.innerHTML = '<span class="dot-bounce"></span><span class="dot-bounce" style="animation-delay:0.2s"></span><span class="dot-bounce" style="animation-delay:0.4s"></span>';
    msgContainer.appendChild(t);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    showTyping();
    
    let delay = Math.random() * 1000 + 800; // Fake typing delay
    setTimeout(() => {
      processBotLogic(text);
    }, delay);
  }`;

content = content.replace(oldHandleUser, newHandleUser);

// 3. Make sure fetch response clears typing if it takes long
const oldFetch = `    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: chatHistory, crmContext: crmData })
    })
    .then(r => r.json())
    .then(data => {
      addMessage('bot', data.reply);
    })
    .catch(err => {
      addMessage('bot', 'Perdón, mi sistema de IA está fuera de línea. Si dejas tu WhatsApp un humano te contactará.');
    });`;

const newFetch = `    fetch('/api/chat', {
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
    });`;

content = content.replace(oldFetch, newFetch);

fs.writeFileSync('src/components/GarageBot.astro', content);
