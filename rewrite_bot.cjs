const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// Replace everything inside <script is:inline>
const scriptStart = '<script is:inline>';
const scriptEnd = '</script>';
const startIndex = content.indexOf(scriptStart) + scriptStart.length;
const endIndex = content.indexOf(scriptEnd);

const newScript = `
(function() {
  const toggleBtn = document.getElementById('gb-toggle-btn');
  const chatWindow = document.getElementById('gb-chat-window');
  const closeBtn = document.getElementById('gb-close-btn');
  const msgContainer = document.getElementById('gb-messages');
  const form = document.getElementById('gb-input-form');
  const input = document.getElementById('gb-input');
  const notifDot = document.getElementById('gb-notif-dot');

  let chatHistory = JSON.parse(localStorage.getItem('tg_bot_history') || '[]');

  // CRM Helpers
  function getSessionId() { return localStorage.getItem('tg_session_id'); }
  function getCRMScore() {
    try {
      const s = JSON.parse(localStorage.getItem('tg_sessions')||'[]').find(x => x.id === getSessionId());
      if (!s || !s.events) return 0;
      return Math.min(100, s.events.reduce((acc, e) => acc + (e.type==='page_view'?2:e.type==='whatsapp_click'?25:5), 0));
    } catch(e) { return 0; }
  }
  function captureCRMContact(val) {
    window.dispatchEvent(new CustomEvent('tg:lead_captured', { 
      detail: { contact: val, channel: val.includes('@') ? 'email' : 'whatsapp', model: 'Gemini AI Engine' }
    }));
  }

  // UI
  function renderMessages() {
    msgContainer.innerHTML = '';
    chatHistory.forEach(m => {
      const el = document.createElement('div');
      el.className = 'gb-msg ' + (m.sender === 'bot' ? 'gb-msg-bot' : 'gb-msg-user');
      el.textContent = m.text;
      msgContainer.appendChild(el);
    });
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
  function addMessage(sender, text) {
    chatHistory.push({ sender, text });
    localStorage.setItem('tg_bot_history', JSON.stringify(chatHistory));
    renderMessages();
  }
  function showTyping() {
    const t = document.createElement('div');
    t.id = 'gb-typing';
    t.className = 'gb-msg gb-msg-bot';
    t.style.width = '50px';
    t.style.padding = '0.5rem 0.85rem';
    t.innerHTML = '<span class="dot-bounce"></span><span class="dot-bounce" style="animation-delay:0.2s"></span><span class="dot-bounce" style="animation-delay:0.4s"></span>';
    msgContainer.appendChild(t);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
  function hideTyping() {
    const t = document.getElementById('gb-typing');
    if (t) t.remove();
  }

  async function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    showTyping();
    
    // CRM Contact Extraction Heuristic
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
        body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) }) // send history without current msg
      });
      const data = await res.json();
      hideTyping();
      
      if (data.error) {
        console.error("Bot API Error:", data.error);
        addMessage('bot', "Disculpa, tuve un problema de conexión. ¿Te importaría escribirme a nuestro WhatsApp directamente?");
      } else {
        addMessage('bot', data.reply);
      }
    } catch (err) {
      hideTyping();
      addMessage('bot', "Se perdió la conexión. Por favor intenta de nuevo o escríbenos al WhatsApp.");
    }
  }

  // Events
  toggleBtn.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    toggleBtn.style.display = 'none';
    notifDot.style.display = 'none';
    
    if (chatHistory.length === 0) {
      showTyping();
      setTimeout(() => {
        hideTyping();
        const score = getCRMScore();
        const initialGreeting = score > 45 
          ? "¡Hola! Noto que estás viendo nuestras bicis. Si quieres fotos reales del taller, avísame."
          : "¡Bienvenido a The Garage! Soy Diego, si tienes dudas con los precios o modelos, escríbeme.";
        addMessage('bot', initialGreeting);
      }, 700);
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
    toggleBtn.style.display = 'flex';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!input.value.trim()) return;
    handleUserInput(input.value.trim());
  });

  setTimeout(() => {
    if (chatHistory.length === 0) {
      const score = getCRMScore();
      if (score >= 45 && chatWindow.style.display === 'none') {
        notifDot.style.display = 'block';
      }
    } else {
      renderMessages();
    }
  }, 2000);
})();
`;

content = content.substring(0, startIndex) + '\n' + newScript + '\n' + content.substring(endIndex);
fs.writeFileSync('src/components/GarageBot.astro', content);
