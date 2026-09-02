const fs = require('fs');
let content = fs.readFileSync('src/components/BiciCard.astro', 'utf8');

// Add data-tilt attributes
content = content.replace('<article\n  class="card-bici-tile"', '<article\n  class="card-bici-tile"\n  data-tilt data-tilt-max="5" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.2"');

// Inject the Tilt script if not there
if (!content.includes('vanilla-tilt.min.js')) {
  content += `\n<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js"></script>\n`;
}

// Add animation to the card entry
const cardCSS = `
  .card-bici-tile {
    animation: fade-up 0.6s var(--ease-spring) both;
  }
  @keyframes fade-up {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;
content = content.replace('.card-bici-tile {', cardCSS + '\n  .card-bici-tile {');

// Fix syntax in replacement if necessary (the replace above puts animation before the existing block)
fs.writeFileSync('src/components/BiciCard.astro', content);
