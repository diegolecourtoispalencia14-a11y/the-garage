const fs = require('fs');
let content = fs.readFileSync('src/components/GarageBot.astro', 'utf8');

const oldNameCapture = `    // 2. Name Capture Heuristics
    // If we asked for their name, or they say "soy X", "me llamo X"
    const nameMatch = t.match(/\\b(soy|me llamo|mi nombre es)\\s+([a-záéíóúñ]+)/i);
    if (nameMatch) {
      saveCRMName(nameMatch[2]);
      return \`¡Mucho gusto, \${nameMatch[2].charAt(0).toUpperCase() + nameMatch[2].slice(1)}! ¿Qué tipo de bici tienes en mente?\`;
    }

    // 3. Match Intents
    for (let i = 0; i < intents.length; i++) {
      if (intents[i].pattern.test(t)) {
        let options = intents[i].responses;
        return options[Math.floor(Math.random() * options.length)];
      }
    }`;

const newNameCapture = `    // 2. Name Capture Heuristics (Non-blocking)
    let prefix = "";
    const nameMatch = t.match(/\\b(soy|me llamo|mi nombre es)\\s+([a-záéíóúñ]+)/i);
    if (nameMatch) {
      const extractedName = nameMatch[2].charAt(0).toUpperCase() + nameMatch[2].slice(1);
      saveCRMName(extractedName);
      prefix = \`¡Mucho gusto, \${extractedName}! \`;
      // Remove the name part so we can parse the rest of the sentence
      t = t.replace(nameMatch[0], "");
    }

    // 3. Match Intents
    for (let i = 0; i < intents.length; i++) {
      if (intents[i].pattern.test(t)) {
        let options = intents[i].responses;
        return prefix + options[Math.floor(Math.random() * options.length)];
      }
    }
    
    // If we had a name but no other intent matched:
    if (prefix) {
      return prefix + "¿En qué te puedo ayudar hoy con tu próxima bicicleta?";
    }`;

content = content.replace(oldNameCapture, newNameCapture);

fs.writeFileSync('src/components/GarageBot.astro', content);
