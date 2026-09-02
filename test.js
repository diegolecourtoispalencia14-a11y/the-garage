const fetch = require('node-fetch');
(async () => {
  const payload = {
    systemInstruction: { parts: [{ text: "Eres Diego." }] },
    contents: [{ role: "user", parts: [{ text: "quiero comprar una bici" }] }],
  };
  // We need an API key to test directly. I don't have the user's API key.
})();
