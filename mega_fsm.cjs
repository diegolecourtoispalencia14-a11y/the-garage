const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const scriptRegex = /<script is:inline>[\s\S]*?<\/script>/;

const newScript = `<script is:inline>
(function() {
  const toggleBtn = document.getElementById('gb-toggle-btn');
  const chatWindow = document.getElementById('gb-chat-window');
  const closeBtn = document.getElementById('gb-close-btn');
  const msgContainer = document.getElementById('gb-messages');
  const form = document.getElementById('gb-input-form');
  const input = document.getElementById('gb-input');
  const notifDot = document.getElementById('gb-notif-dot');

  // --- ARQUITECTURA FSM (MÁQUINA DE ESTADOS FINITOS) ---
  let chatHistory = JSON.parse(localStorage.getItem('tg_bot_history') || '[]');
  let fsmState = localStorage.getItem('tg_fsm_state') || 'STATE_IDLE_NEW';
  let leadCaptured = localStorage.getItem('tg_lead_captured') === 'true';

  function updateState(newState) {
    fsmState = newState;
    localStorage.setItem('tg_fsm_state', newState);
    console.log("[FSM Transition] -> " + newState);
  }

  function getSessionId() { return localStorage.getItem('tg_session_id'); }
  function getCRMScore() {
    try {
      const s = JSON.parse(localStorage.getItem('tg_sessions')||'[]').find(x => x.id === getSessionId());
      if (!s || !s.events) return 0;
      return Math.min(100, s.events.reduce((acc, e) => acc + (e.type==='page_view'?2:e.type==='whatsapp_click'?25:5), 0));
    } catch(e) { return 0; }
  }

  function captureCRMContact(val) {
    if(!leadCaptured) {
        window.dispatchEvent(new CustomEvent('tg:lead_captured', { 
          detail: { contact: val, channel: val.includes('@') ? 'email' : 'whatsapp', model: 'FSM Orchestrator' }
        }));
        leadCaptured = true;
        localStorage.setItem('tg_lead_captured', 'true');
        updateState('STATE_LEAD_CAPTURED');
    }
  }

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

  // Analizador Léxico para N-Grams y Extracción
  function analyzeIntent(text) {
    const t = text.toLowerCase();
    const intent = { category: 'UNKNOWN', extracted: null, confidence: 0 };
    
    if (/\\b(barata|baratas|economica|menor precio|descuento|promo)\\b/.test(t)) {
        intent.category = 'BUDGET_LOW'; intent.confidence = 1;
    } else if (/\\b(talla|medida|estatura|chica|mediana|grande|\\bs\\b|\\bm\\b|\\bl\\b|\\bxl\\b)\\b/.test(t) || /\\d\\.\\d{2}/.test(t)) {
        intent.category = 'FIT_DATA'; intent.confidence = 1;
    } else if (/\\b(ruta|montaña|mtb|gravel|urbana)\\b/.test(t)) {
        intent.category = 'DISCIPLINE'; intent.confidence = 1;
    } else if (/\\b(sunpeed|canyon|scott|orbea|cannondale)\\b/.test(t)) {
        intent.category = 'OBJECTION_COMPETITOR'; intent.confidence = 1;
    } else if (/\\b(no|nop|luego|despues)\\b/.test(t)) {
        intent.category = 'REJECTION'; intent.confidence = 1;
    }
    return intent;
  }

  async function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    showTyping();
    
    // 1. EVALUADOR DE ESTADO CRÍTICO (Extracción de Números)
    const phoneRegex = /\\b\\d{10}\\b/;
    if (phoneRegex.test(text)) {
      captureCRMContact(text.match(phoneRegex)[0]);
      hideTyping();
      addMessage('bot', "¡Número recibido perfectamente! Un técnico de The Garage te estará mandando catálogo y fotos a ese WhatsApp en los próximos minutos. Si tienes otra duda por acá, sigo a la orden.");
      return;
    }

    // 2. TRANSICIONES DE ESTADO LOCALES
    const intent = analyzeIntent(text);
    if (intent.category === 'OBJECTION_COMPETITOR') updateState('STATE_OBJECTION_COMPETITOR');
    else if (intent.category === 'FIT_DATA') updateState('STATE_GATHERING_FIT_DATA');
    else if (intent.category === 'BUDGET_LOW') updateState('STATE_QUALIFYING_BUDGET');
    else if (intent.category === 'REJECTION' && fsmState === 'STATE_AWAITING_LEAD_INFO') {
        updateState('STATE_SOFT_RECOVERY');
        hideTyping();
        addMessage('bot', "Sin problema, el chiste es que te sientas súper cómodo. Podemos seguir platicando por aquí. ¿De casualidad ya sabes qué disciplina o rodada estabas buscando?");
        return;
    }

    // 3. ORQUESTADOR IA (Enviamos el Estado a Llama 3)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: text, 
            history: chatHistory.slice(0, -1),
            state: fsmState
        }) 
      });
      const data = await res.json();
      hideTyping();
      
      if (data.error) {
        console.error("AI FSM Error:", data.error);
        // Fallback de Emergencia FSM
        addMessage('bot', "Tengo una respuesta súper completa para eso, pero ¿qué te parece si mejor platicamos los detalles finos por WhatsApp? Pásame tu número a 10 dígitos.");
        updateState('STATE_AWAITING_LEAD_INFO');
      } else {
        // En 1 de cada 4 interacciones, inyectamos urgencia comercial si estamos calificando
        let finalReply = data.reply;
        if (Math.random() > 0.75 && !leadCaptured && fsmState !== 'STATE_OBJECTION_COMPETITOR') {
            finalReply += " (Por cierto, los modelos de esta temporada se están moviendo muy rápido, si quieres asegurar una talla, ¿me pasas tu WhatsApp?)";
            updateState('STATE_AWAITING_LEAD_INFO');
        }
        addMessage('bot', finalReply);
      }
    } catch (err) {
      hideTyping();
      addMessage('bot', "Hubo un salto de cadena en la red. ¿Me dejas tu WhatsApp a 10 dígitos para seguir la plática por allá?");
      updateState('STATE_AWAITING_LEAD_INFO');
    }
  }

  toggleBtn.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    toggleBtn.style.display = 'none';
    notifDot.style.display = 'none';
    
    if (chatHistory.length === 0) {
      showTyping();
      setTimeout(() => {
        hideTyping();
        addMessage('bot', "¡Hola! Soy Diego, tu asesor. ¿Buscas armar una bici, agendar un taller, o platicar sobre la industria?");
        updateState('STATE_IDLE_NEW');
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
</script>`;

content = content.replace(scriptRegex, newScript);

fs.writeFileSync('src/components/GarageBot.astro', content);
