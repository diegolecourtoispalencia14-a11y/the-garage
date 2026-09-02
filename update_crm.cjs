const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/crm.astro', 'utf8');

// 1. Increase general fonts
content = content.replace('font-size:0.75rem', 'font-size:0.9rem'); // Tabs & Session Rows
content = content.replace('font-size:0.75rem', 'font-size:0.9rem'); // Maybe multiple hits? We will use Regex.
content = content.replace(/font-size:0\.75rem/g, 'font-size:0.85rem');
content = content.replace(/font-size:0\.65rem/g, 'font-size:0.75rem');
content = content.replace(/font-size:0\.7rem/g, 'font-size:0.8rem');
content = content.replace(/font-size:0\.78rem/g, 'font-size:0.9rem'); // Table
content = content.replace(/font-size:0\.8rem/g, 'font-size:0.95rem'); // General inputs
content = content.replace(/font-size:0\.6rem/g, 'font-size:0.75rem'); // KPI labels
content = content.replace(/font-size:2rem/g, 'font-size:2.8rem'); // KPI numbers

// 2. Fix the Table Name & Phone merge
// We replaced this earlier:
// contact:      ext.name || l.contact, // Use profile name if available
// We want:
// contact:      (ext.name ? (ext.name + ' <br><small style="color:#71717a">' + l.contact + '</small>') : l.contact),
content = content.replace(
  "contact:      ext.name || l.contact,",
  "contact:      (ext.name ? (ext.name + '<br><small style=\"color:#71717a\">' + (l.contact||'') + '</small>') : l.contact),"
);

fs.writeFileSync('src/pages/admin/crm.astro', content);
