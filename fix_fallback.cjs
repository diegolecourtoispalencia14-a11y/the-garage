const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const oldFallback = `      if (data.error) {
        console.error("AI FSM Error:", data.error);
        // Fallback de Emergencia FSM
        addMessage('bot', "Tengo una respuesta súper completa para eso, pero ¿qué te parece si mejor platicamos los detalles finos por WhatsApp? Pásame tu número a 10 dígitos.");
        updateState('STATE_AWAITING_LEAD_INFO');
      }`;

const newFallback = `      if (data.error) {
        console.error("AI FSM Error:", data.error);
        
        // Fallback local hiper-inteligente por si Cloudflare AI falla
        let localReply = "";
        const lower = text.toLowerCase();
        
        if (fsmState === 'STATE_IDLE_NEW') {
            if (/hola|buenas|que tal/.test(lower)) {
                localReply = "¡Hola! Qué gusto saludarte. Soy Diego, asesor especializado de The Garage. ¿Buscas alguna bici en especial o necesitas taller?";
                updateState('STATE_QUALIFYING_DISCIPLINE');
            } else {
                localReply = "¡Bienvenido! Entiendo. Para darte la mejor recomendación, ¿qué disciplina te gusta más? ¿Ruta, Montaña, o Urbana?";
                updateState('STATE_QUALIFYING_DISCIPLINE');
            }
        } else if (fsmState === 'STATE_QUALIFYING_DISCIPLINE') {
            localReply = "¡Excelente elección! Tenemos modelos increíbles para eso. Oye, y para perfilarte bien, ¿eres principiante o ya traes experiencia rodando?";
            updateState('STATE_QUALIFYING_EXPERIENCE');
        } else if (fsmState === 'STATE_QUALIFYING_EXPERIENCE') {
            localReply = "Súper bien. Con eso en mente, lo ideal es basarnos en tu estatura para darte la talla correcta. ¿Cuánto mides exactamente?";
            updateState('STATE_GATHERING_FIT_DATA');
        } else {
            localReply = "Ese es un gran punto. Fíjate que para no darte información a medias y poder mandarte fotos reales del piso, prefiero que lo veamos por WhatsApp. Pásame tu número a 10 dígitos aquí mismo.";
            updateState('STATE_AWAITING_LEAD_INFO');
        }
        
        addMessage('bot', localReply);
      }`;

content = content.replace(oldFallback, newFallback);
fs.writeFileSync('src/components/GarageBot.astro', content);
