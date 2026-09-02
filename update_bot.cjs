const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

// 1. Enlarge sizes for Desktop
content = content.replace('width: 340px;', 'width: 380px;');
content = content.replace('height: 480px;', 'height: 600px;');
content = content.replace('font-size: 0.85rem;', 'font-size: 0.95rem;');
content = content.replace('font-size: 0.8rem;', 'font-size: 0.9rem;'); // input

// 2. Add Typing Indicator HTML
const typingHTML = `
    <div id="gb-typing" class="gb-msg gb-msg-bot" style="display:none; width:45px; padding: 0.4rem 0.85rem;">
      <span class="dot-bounce"></span><span class="dot-bounce" style="animation-delay:0.2s"></span><span class="dot-bounce" style="animation-delay:0.4s"></span>
    </div>
`;
content = content.replace('<!-- Los mensajes se inyectan por JS -->', '<!-- Los mensajes se inyectan por JS -->\n' + typingHTML);

const typingCSS = `
  .dot-bounce { display:inline-block; width:6px; height:6px; background:#e4e4e7; border-radius:50%; margin:0 2px; animation: gb-bounce 1.4s infinite ease-in-out both; }
  @keyframes gb-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
`;
content = content.replace('</style>', typingCSS + '\n</style>');

// 3. Make Bot Logic more sophisticated
const oldHandleUser = `  function handleUserInput(text) {
    addMessage('user', text);
    input.value = '';
    
    // Simulate delay
    setTimeout(() => {
      processBotLogic(text);
    }, 600);
  }`;

const newHandleUser = `  function handleUserInput(text) {
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

content = content.replace(oldHandleUser, newHandleUser);

// 4. Update processBotLogic for Objections & Closing
const oldLogic = `    // Fallback based on CRM if no specific logic triggered
    const name = getCRMName();
    if (!name && botState !== 'ASKING_NAME') {
      botState = 'ASKING_NAME';
      localStorage.setItem('tg_bot_state', botState);
      addMessage('bot', 'Para poder darte información más específica, ¿con quién tengo el gusto?');
      return;
    }`;

const newLogic = `    if (t.includes('caro') || t.includes('descuento') || t.includes('rebaja')) {
      addMessage('bot', 'Te entiendo. Nuestras bicis son de gama alta y se entregan 100% ajustadas. Si estás listo para cerrar hoy, pásame tu WhatsApp y le pregunto a mi gerente si te podemos dar envío gratis o algún accesorio.');
      return;
    }
    if (t.includes('duda') || t.includes('garantia')) {
      addMessage('bot', 'Todas nuestras bicis tienen garantía de taller. Además somos centro de servicio especializado. ¿Tienes alguna marca en mente o quieres que te asesore por WhatsApp?');
      return;
    }
    
    const name = getCRMName();
    if (!name && botState !== 'ASKING_NAME') {
      botState = 'ASKING_NAME';
      localStorage.setItem('tg_bot_state', botState);
      addMessage('bot', 'Para poder darte una atención VIP y enviarte el catálogo que se ajusta a lo que buscas, ¿cómo te llamas?');
      return;
    }`;

content = content.replace(oldLogic, newLogic);

fs.writeFileSync('src/components/GarageBot.astro', content);
