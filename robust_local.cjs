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

  let chatHistory = JSON.parse(localStorage.getItem('tg_bot_history') || '[]');
  let fsmState = localStorage.getItem('tg_fsm_state') || 'STATE_IDLE_NEW';
  let leadCaptured = localStorage.getItem('tg_lead_captured') === 'true';

  function updateState(newState) {
    fsmState = newState;
    localStorage.setItem('tg_fsm_state', newState);
  }

  function captureCRMContact(val) {
    if(!leadCaptured) {
        window.dispatchEvent(new CustomEvent('tg:lead_captured', { 
          detail: { contact: val, channel: val.includes('@') ? 'email' : 'whatsapp', model: 'Orquestador Local Experto' }
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

  // --- MOTOR LOCAL HIPER INTELIGENTE (SIN APIs EXTERNAS) ---
  const knowledgeBase = [
    { pattern: /(historia|tour de francia|tour de france|giro de italia|vuelta a españa|eddy merckx|pogacar|vingegaard)/i,
      responses: ["¡Qué gran tema! La historia del ciclismo está marcada por leyendas. Si te apasiona ese nivel de rendimiento, manejamos marcas como Pinarello o Cervélo que tienen ADN del Tour. ¿Qué disciplina practicas tú?"] },
    { pattern: /(shimano|sram|campagnolo|transmision|cambios)/i,
      responses: ["¡Las transmisiones son el corazón de la bici! Shimano domina con su durabilidad, mientras que SRAM lidera en innovación AXS. ¿Buscas armar o mejorar tu bici con alguno en especial?"] },
    { pattern: /(suspension|fox|rockshox|horquilla|amortiguador)/i,
      responses: ["En suspensiones, el eterno debate: FOX Kashima vs RockShox. En nuestro taller especializado damos servicio a ambas marcas. ¿Necesitas mejorar tu suspensión o darle mantenimiento?"] },
    { pattern: /(lee cougan|merida|basso|giant|trek|specialized|pinarello|cervelo|bmc)/i,
      responses: ["¡Traes muy buen gusto! Somos distribuidores de esa línea. Traen excelente geometría y valor. Para mandarte fotos reales de lo que tenemos en piso, pásame tu WhatsApp a 10 dígitos."] },
    { pattern: /(sunpeed|canyon|scott|orbea|cannondale)/i,
      responses: ["Fíjate que esa marca es excelente, pero nosotros decidimos enfocarnos en Trek o Merida, que nos permiten darte mejor garantía local y un valor brutal en componentes. ¿Qué tipo de rutas haces normalmente?"] },
    { pattern: /(barata|economica|menor precio|accesible|oferta|descuento)/i,
      responses: ["En The Garage cuidamos mucho la calidad. Nuestras opciones más accesibles arrancan desde los $7,900 MXN, ¡ya armadas y con el primer servicio incluido! ¿Te mando fotos de los modelos económicos por WhatsApp?"] },
    { pattern: /(precio|cuesta|costo|cuanto|presupuesto)/i,
      responses: ["Manejamos desde bicis de entrada súper confiables hasta máquinas de competencia. Para darte un precio exacto necesito conocer tus gustos. ¿Por qué terrenos te gusta rodar?"] },
    { pattern: /(comprar|quiero una|busco una|disponible|entrega inmediata)/i,
      responses: ["¡Estás en el lugar indicado! Tenemos modelos de Ruta, Gravel y Montaña listos para salir a rodar. ¿Qué disciplina te apasiona más?"] },
    { pattern: /(taller|mantenimiento|purgado|ajuste|reparacion)/i,
      responses: ["Nuestro taller especializado es la joya de The Garage. Estamos certificados para mantenimientos profundos y suspensiones. ¿Te gustaría agendar una cita para consentir a tu bici?"] },
    { pattern: /(envio|envios|mandan|republica|enviar|paqueteria)/i,
      responses: ["¡Enviamos a todo México de forma 100% segura! Las mandamos en su caja original, ultra protegidas. ¿A qué estado o código postal te la mandaríamos?"] },
    { pattern: /(talla|medida|estatura|\\bs\\b|\\bm\\b|\\bl\\b|\\bxl\\b)/i,
      responses: ["El fit es lo más importante para evitar lesiones. Manejamos todas las tallas. ¿Exactamente cuánto mides para decirte tu talla ideal?"] },
    { pattern: /(nuevo|principiante|empezando)/i,
      responses: ["¡No te preocupes, para eso estamos los expertos! Todos empezamos desde cero. Una bici Híbrida o una Gravel son opciones comodísimas para empezar. ¿Qué presupuesto te gustaría invertir?"] },
    { pattern: /(mejor por whatsapp|te paso mi numero|mi numero es|pasame el tuyo|por whats)/i,
      responses: ["¡Excelente decisión! Por WhatsApp la atención es muchísimo más rápida. Pásame tu número a 10 dígitos aquí mismo y yo te contacto enseguida."] },
    { pattern: /(^|\\s)(no|nop|nel)(\\s|$|\\.|,|\\?)/i,
      responses: ["Sin problema, el chiste es que te sientas súper cómodo. Podemos seguir platicando por aquí. ¿De casualidad ya sabes qué disciplina o rodada estabas buscando?"] }
  ];

  function evaluateLocalEngine(text) {
    const t = text.toLowerCase();
    
    // Primero, revisamos si el estado dicta la conversación
    if (fsmState === 'STATE_IDLE_NEW') {
        if (/hola|buenas|que tal/.test(t)) {
            updateState('STATE_QUALIFYING_DISCIPLINE');
            return "¡Hola! Qué gusto saludarte. Soy Diego, asesor especializado de The Garage. ¿Buscas alguna bici en especial o necesitas taller?";
        }
    }
    
    if (fsmState === 'STATE_QUALIFYING_DISCIPLINE') {
        if (/(ruta|montaña|mtb|gravel|urbana)/.test(t)) {
            updateState('STATE_QUALIFYING_EXPERIENCE');
            return "¡Excelente elección! Tenemos modelos increíbles para eso. Oye, y para perfilarte bien, ¿eres principiante o ya traes experiencia rodando?";
        }
    }
    
    if (fsmState === 'STATE_QUALIFYING_EXPERIENCE') {
        if (/(nuevo|principiante|empezando|experto|pro)/.test(t)) {
            updateState('STATE_GATHERING_FIT_DATA');
            return "Súper bien. Con eso en mente, lo ideal es basarnos en tu estatura para darte la talla correcta. ¿Cuánto mides exactamente?";
        }
    }
    
    if (fsmState === 'STATE_GATHERING_FIT_DATA') {
        if (/\\d\\.\\d{2}/.test(t) || /\\d{3}/.test(t)) { // Altura en metros o cm
            updateState('STATE_AWAITING_LEAD_INFO');
            return "¡Anotado! Ya tengo tu talla. Fíjate que para poder mandarte las fotos reales de los modelos que me quedan en tu medida, prefiero que lo veamos por WhatsApp. Pásame tu número a 10 dígitos aquí mismo.";
        }
    }

    // Buscador general en Base de Conocimientos
    for (let i = 0; i < knowledgeBase.length; i++) {
      if (knowledgeBase[i].pattern.test(t)) {
        return knowledgeBase[i].responses[0];
      }
    }
    
    // Fallback Final Contextual
    return "Ese es un gran punto. Fíjate que para darte una asesoría más precisa y no perder detalles, prefiero que un experto de la tienda lo vea contigo directo por WhatsApp. Pásame tu número a 10 dígitos.";
  }

  function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    showTyping();
    
    // 1. EXTRACTOR DE NÚMEROS DE TELÉFONO (LA META)
    const phoneRegex = /\\b\\d{10}\\b/;
    if (phoneRegex.test(text)) {
      captureCRMContact(text.match(phoneRegex)[0]);
      hideTyping();
      addMessage('bot', "¡Número recibido perfectamente! Un técnico de The Garage te estará mandando catálogo a ese WhatsApp en los próximos minutos. (Nota: Tu registro CRM ya fue actualizado internamente). Si tienes otra duda por acá, sigo a la orden.");
      return;
    }

    let delay = Math.random() * 800 + 700;
    setTimeout(() => {
      hideTyping();
      const reply = evaluateLocalEngine(text);
      addMessage('bot', reply);
    }, delay);
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
    if (chatHistory.length > 0) {
      renderMessages();
    }
  }, 1000);
})();
</script>`;

content = content.replace(scriptRegex, newScript);
fs.writeFileSync('src/components/GarageBot.astro', content);
