fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ role: 'model', parts: [{ text: "hola" }] }, { role: 'user', parts: [{ text: "hola" }] }] })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
