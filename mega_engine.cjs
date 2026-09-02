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
      detail: { contact: val, channel: val.includes('@') ? 'email' : 'whatsapp', model: 'MegaEngine Local' }
    }));
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

  // --- MEGA ENGINE: LA BASE DE CONOCIMIENTO ENTRENADA ---
  const knowledgeBase = [
    // 1. HISTORIA DEL CICLISMO (INTERNACIONAL Y NACIONAL)
    { pattern: /(historia|tour de francia|tour de france|giro|vuelta a españa|eddy merckx|pogacar|vingegaard|ciclismo internacional)/i,
      responses: ["¡Qué gran tema! La historia del ciclismo está marcada por leyendas como Eddy Merckx o Miguel Indurain, y hoy vivimos una era dorada con Tadej Pogačar y Vingegaard destrozando récords en el Tour de Francia. Si te apasiona ese nivel de rendimiento, manejamos marcas como Pinarello, Cervélo o Colnago que tienen ADN del Tour. ¿Qué disciplina practicas tú?"] },
    { pattern: /(mexico|nacional|ciclismo mexicano|vuelta a mexico)/i,
      responses: ["El ciclismo en México tiene muchísima historia, desde las grandes Vueltas a México del pasado hasta el auge brutal del MTB y Gravel en los últimos años. Aquí en The Garage apoyamos esa pasión. ¿Tú ruedas en ruta o en senderos?"] },

    // 2. COMPONENTES Y TECNOLOGÍA EXPERTA
    { pattern: /(shimano|sram|campagnolo|transmision|cambios)/i,
      responses: ["¡Las transmisiones son el corazón de la bici! Shimano domina con su durabilidad (desde un Deore hasta el XTR o Dura-Ace), mientras que SRAM lidera en innovación inalámbrica con su ecosistema AXS. Campagnolo es purismo italiano. ¿Buscas armar o mejorar tu bici con alguno en especial?"] },
    { pattern: /(suspension|fox|rockshox|horquilla|amortiguador)/i,
      responses: ["En suspensiones, el eterno debate: FOX con su legendario tacto Kashima o RockShox con su confiabilidad y tecnología Flight Attendant. En nuestro taller especializado damos servicio a ambas marcas. ¿Estás buscando mejorar tu suspensión o necesitas mantenimiento?"] },
    { pattern: /(frenos|hidraulicos|discos)/i,
      responses: ["Unos buenos frenos hidráulicos (ya sean Shimano XT, SRAM Code o Magura) te cambian la vida en los descensos. ¿Sientes que a tus frenos les falta potencia o necesitas un purgado?"] },
    { pattern: /(carbono|carbon|aluminio|cuadro|peso)/i,
      responses: ["El debate de los materiales: el aluminio moderno es súper rígido y aguantador, pero el carbono absorbe mejor las vibraciones y te ahorra gramos vitalales en las subidas. Manejamos ambos materiales en gamas altas. ¿Qué presupuesto tienes en mente?"] },

    // 3. MARCAS COMERCIALES (LAS QUE VENDEMOS)
    { pattern: /(lee cougan|merida|basso|giant|trek|specialized|pinarello|cervelo|bmc|alubike)/i,
      responses: ["¡Traes muy buen gusto! Somos distribuidores de esa línea. Traen excelente geometría y valor por tu dinero. ¿Me pasas tu WhatsApp (10 dígitos) para mandarte las fotos reales y los precios de las que tenemos listas en piso?"] },
    
    // 4. MARCAS COMERCIALES (LAS QUE NO VENDEMOS)
    { pattern: /(sunpeed|canyon|scott|orbea|cannondale|santa cruz|yeti|benotto)/i,
      responses: ["Fíjate que esa marca es excelente, pero nosotros decidimos enfocarnos en distribuir opciones como Merida, Giant, Trek o Basso, que nos permiten darte mejor garantía local y un valor brutal en componentes. ¿Qué tipo de rutas haces normalmente para recomendarte una alternativa superior?"] },

    // 5. INTENCIÓN DE COMPRA Y PRECIOS
    { pattern: /(barata|economica|menor precio|accesible|oferta|descuento)/i,
      responses: ["En The Garage cuidamos mucho la calidad. Nuestras opciones de entrada más accesibles y confiables arrancan desde los $7,900 MXN, ¡ya armadas y con el primer servicio incluido! ¿Te mando fotos de los modelos económicos por WhatsApp?"] },
    { pattern: /(precio|cuesta|costo|cuanto|presupuesto)/i,
      responses: ["Manejamos desde bicis de entrada súper confiables hasta súper-máquinas de competencia. Para darte un precio exacto necesito conocer tus gustos. ¿Me pasas tu WhatsApp para platicar mejor y mandarte el catálogo?"] },
    { pattern: /(meses|msi|tarjeta|credito|financiamiento|pagos)/i,
      responses: ["¡Totalmente! Tenemos 3, 6, 9 y hasta 12 Meses Sin Intereses con tarjetas participantes. Es la mejor forma de llevarte una bici superior sin descapitalizarte. ¿Ya viste algún modelo que te haya gustado?"] },
    { pattern: /(comprar|quiero una|busco una|me interesa|disponible|entrega inmediata)/i,
      responses: ["¡Estás en el lugar indicado! Tenemos modelos de Ruta, Gravel y Montaña listos para salir a rodar hoy mismo. ¿Qué disciplina te apasiona más?"] },

    // 6. ACCESORIOS Y TALLER
    { pattern: /(casco|cascos|zapatillas|pedales|luces|ropa|jersey|guantes|candado|llantas|rines)/i,
      responses: ["Claro, tenemos una boutique completa para ciclistas. Desde cascos con tecnología MIPS hasta zapatillas de carbono y luces de alta potencia. ¿Buscas alguna talla o marca en específico?"] },
    { pattern: /(garantia|servicio|taller|mantenimiento|purgado|ajuste|mecanico|reparacion)/i,
      responses: ["Nuestro taller especializado es la joya de The Garage. Estamos certificados para mantenimientos profundos, purgados, suspensiones y ajustes milimétricos. ¿Te gustaría agendar una cita para consentir a tu bici?"] },

    // 7. LOGÍSTICA
    { pattern: /(envio|envios|mandan|republica|mexico|enviar|paqueteria)/i,
      responses: ["¡Enviamos a todo México de forma 100% segura! Las mandamos en su caja original, ultra protegidas. ¿A qué estado o código postal te la mandaríamos?"] },
    { pattern: /(donde|ubicacion|direccion|tienda|local|horario|abierto)/i,
      responses: ["Nuestra base de operaciones está en Av. Ich Xeel CASA 19, Cataluña, Playa del Carmen. ¡Nos encantaría recibirte de lunes a sábado! ¿Quieres que te mande la ubicación por WhatsApp?"] },

    // 8. TALLAS Y TIPOS DE CICLISTA
    { pattern: /(talla|medida|mido|estatura|chica|mediana|grande|s|m|l|xl)/i,
      responses: ["El fit es lo más importante para evitar lesiones. Manejamos todas las tallas. ¿Exactamente cuánto mides para decirte tu talla ideal y qué modelos tenemos para ti?"] },
    { pattern: /(niños|infantil|rueditas|niño|niña|dama|mujer)/i,
      responses: ["¡Claro! El ciclismo es para todos. Tenemos geometrías específicas para dama y bicicletas rodada 16, 20 y 24 para los futuros campeones. ¿Qué estatura tiene la persona que la va a usar?"] },
    { pattern: /(nuevo|principiante|empezando|no se|ayuda|recomiendame|diario|ciudad|urbana)/i,
      responses: ["¡No te preocupes, para eso estamos los expertos! Todos empezamos desde cero. Si vas a rodar en ciudad o terracerías ligeras, una bici Híbrida o una Gravel son opciones comodísimas y muy versátiles. ¿Qué presupuesto te gustaría invertir para tu primera bici?"] },

    // 9. FLUJOS DE CONVERSACIÓN (WHATSAPP, ETC)
    { pattern: /(mejor por whatsapp|te paso mi numero|mi numero es|pasame el tuyo|por whats)/i,
      responses: ["¡Excelente decisión! Por WhatsApp la atención es muchísimo más rápida y te puedo mandar audios y fotos reales. Pásame tu número a 10 dígitos aquí mismo y yo te contacto enseguida."] },
    { pattern: /(solo estoy viendo|mirando|curioseando|viendo|checar)/i,
      responses: ["¡Disfruta la vista! Navega todo lo que quieras por el catálogo. Si ves un componente raro o te surge una duda técnica sobre alguna geometría, escríbeme. Aquí estoy para resolver dudas de experto a ciclista."] },
    { pattern: /(^|\\s)(si|sí|claro|por supuesto|dale|va|me parece bien|ok|okay|vale|simon|sipi)(\\s|$|\\.|,|\\?|!)/i,
      responses: ["¡Perfecto! Pásame tu número de WhatsApp (10 dígitos) para darte seguimiento personalizado. Un asesor experto se pondrá en contacto contigo de inmediato."] },
    { pattern: /(^|\\s)(no|nop|nel|ahorita no|despues|luego)(\\s|$|\\.|,|\\?)/i,
      responses: ["¡Totalmente comprensible! Guardaremos tu preferencia. Si más adelante necesitas ayuda técnica, refacciones o simplemente quieres hablar de bicis, The Garage es tu casa."] },
    { pattern: /(hola|buenas|que tal|hols|buenos dias|buenas tardes)/i, 
      responses: ["¡Hola, un gusto! Soy Diego, asesor especializado. Ya sea que busques armar una bici desde cero, un servicio de taller o simplemente tengas dudas sobre marcas, ¿en qué te puedo ayudar hoy?"] }
  ];

  function processIntelligentEngine(text) {
    let t = text.toLowerCase();
    
    // Captura estricta de nombres para evitar errores tontos
    let prefix = "";
    const nameMatch = t.match(/\\b(me llamo|mi nombre es)\\s+([a-záéíóúñ]+)/i);
    if (nameMatch) {
      const extractedName = nameMatch[2].charAt(0).toUpperCase() + nameMatch[2].slice(1);
      prefix = \`¡Qué tal, \${extractedName}! \`;
      t = t.replace(nameMatch[0], "");
    }

    // Buscador masivo de intenciones
    for (let i = 0; i < knowledgeBase.length; i++) {
      if (knowledgeBase[i].pattern.test(t)) {
        let options = knowledgeBase[i].responses;
        return prefix + options[Math.floor(Math.random() * options.length)];
      }
    }
    
    if (prefix) return prefix + "Soy todo oídos. ¿En qué tema de ciclismo te puedo asesorar hoy?";
    
    // Respaldo conversacional de experto si el cliente escribe algo rarísimo
    return "Fíjate que esa es una pregunta súper interesante, y como asesor experto me gusta dar respuestas precisas, no genéricas. ¿Te importaría dejarme tu WhatsApp a 10 dígitos para contactarte y platicar a detalle sobre esto?";
  }

  function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    showTyping();
    
    const phoneRegex = /\\b\\d{10}\\b/;
    const emailRegex = /\\S+@\\S+\\.\\S+/;
    if (phoneRegex.test(text) || emailRegex.test(text)) {
      let match = text.match(phoneRegex) || text.match(emailRegex);
      captureCRMContact(match[0]);
    }

    // Tiempo de "razonamiento" dinámico
    let delay = Math.random() * 800 + 1000;
    
    setTimeout(() => {
      hideTyping();
      const reply = processIntelligentEngine(text);
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
        const score = getCRMScore();
        const initialGreeting = score > 45 
          ? "¡Hola de nuevo! Ya sabes que si necesitas asesoría técnica o fotos reales de los equipos, aquí estoy."
          : "¡Bienvenido a The Garage! Soy Diego, asesor especializado. Si tienes dudas con componentes, modelos o la industria del ciclismo en general, escríbeme.";
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
</script>`;

content = content.replace(scriptRegex, newScript);

fs.writeFileSync('src/components/GarageBot.astro', content);
