const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const oldLogic = `    if (t.includes('caro') || t.includes('descuento') || t.includes('rebaja')) {
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
    }

    addMessage('bot', 'Entiendo. Como experto en bicicletas, mi mejor recomendación es que charlemos por WhatsApp para enviarte fotos reales y asesorarte a fondo. ¿Me compartes tu número a 10 dígitos?');`;

const newLogic = `
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
      addMessage('bot', 'Perdón, mi sistema de IA está fuera de línea. Si dejas tu WhatsApp un humano te contactará.');
    });`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/GarageBot.astro', content);
