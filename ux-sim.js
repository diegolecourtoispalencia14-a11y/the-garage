#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════
 *  UX SIMULATOR — The Garage Bike Experts
 *  1,000,000 sesiones Monte Carlo + Análisis estructural
 * ═══════════════════════════════════════════════════════
 *
 * MÓDULOS:
 *  A. Análisis estructural de HTML (16 páginas)
 *     A1. Links internos rotos
 *     A2. Jerarquía de headings (H1→H2→H3)
 *     A3. CTAs por página — presencia y claridad
 *     A4. Formularios — labels, inputs, accesibilidad
 *     A5. Tap targets — botones con texto < 4 chars
 *     A6. Páginas sin salida (dead-ends)
 *     A7. Contenido vacío / placeholders
 *     A8. Legibilidad de copy (densidad, longitud de párrafos)
 *
 *  B. Simulación Monte Carlo — 1,000,000 sesiones
 *     B1. 7 arquetipos de usuario con distribución realista
 *     B2. Journeys probabilísticos por arquetipo
 *     B3. Score de conversión por sesión (usa los mismos pesos que BehaviorTracker)
 *     B4. Funnel analysis — dónde se pierden los usuarios
 *     B5. Conversion rate por arquetipo y por entry point
 *     B6. Drop-off analysis — qué páginas tienen mayor abandono
 *     B7. WhatsApp CTR simulado
 *     B8. Lead capture rate
 *
 *  C. Reporte consolidado de oportunidades
 */

const fs   = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const SRC  = path.join(__dirname, 'src');

/* ════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════ */
function read(fp) { return fs.readFileSync(fp, 'utf8'); }
function rel(fp)  { return fp.replace(DIST, ''); }

function htmlFiles() {
  const result = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      const st = fs.statSync(fp);
      if (st.isDirectory()) walk(fp);
      else if (f.endsWith('.html')
        && !fp.includes('/admin/crm.html')
        && !fp.includes('/admin/index.html')) result.push(fp);
    }
  }
  walk(DIST);
  return result;
}

function section(name) {
  console.log('\n\x1b[1m\x1b[34m' + '═'.repeat(55) + '\x1b[0m');
  console.log('\x1b[1m\x1b[34m  ' + name + '\x1b[0m');
  console.log('\x1b[1m\x1b[34m' + '═'.repeat(55) + '\x1b[0m');
}
function ok(msg)   { console.log('\x1b[32m  ✓\x1b[0m', msg); }
function bad(msg)  { console.log('\x1b[31m  ✗\x1b[0m', msg); ISSUES.push(msg); }
function info(msg) { console.log('\x1b[36m  →\x1b[0m', msg); }
function warn(msg) { console.log('\x1b[33m  ⚠\x1b[0m', msg); WARNINGS.push(msg); }

const ISSUES   = [];
const WARNINGS = [];

/* Page map: slug → content */
const pages = {};
const htmlList = htmlFiles().filter(f => !f.includes('/admin/'));

htmlList.forEach(fp => {
  const slug = rel(fp).replace('/index.html','') || '/';
  pages[slug] = read(fp);
});

const pageSlugs = Object.keys(pages);

/* ════════════════════════════════════════════════════════
   A. ANÁLISIS ESTRUCTURAL
════════════════════════════════════════════════════════ */

/* ── A1: Links internos rotos ── */
section('A1. LINKS INTERNOS ROTOS');

const HREF_RE = /href="(\/[^"#?]*)[#?]?[^"]*"/g;
let brokenLinks = 0;

for (const [slug, content] of Object.entries(pages)) {
  let m;
  HREF_RE.lastIndex = 0;
  while ((m = HREF_RE.exec(content)) !== null) {
    const target = m[1].replace(/\/$/, '') || '/';
    // Known valid external-ish but relative paths
    if (target.startsWith('/img') || target.startsWith('/_astro')) continue;
    // Check if target page exists
    const exists = pageSlugs.includes(target) || pageSlugs.includes(target + '/');
    if (!exists && target !== '/') {
      bad(`Link roto: "${target}" en ${slug}`);
      brokenLinks++;
    }
  }
}
if (brokenLinks === 0) ok('Cero links internos rotos');

/* ── A2: Jerarquía de headings ── */
section('A2. JERARQUÍA DE HEADINGS (H1 → H2 → H3)');

const H_RE = /<(h[1-6])[^>]*>/gi;
let hierIssues = 0;

for (const [slug, content] of Object.entries(pages)) {
  if (slug.includes('/admin')) continue;
  const tags = [];
  let m;
  H_RE.lastIndex = 0;
  while ((m = H_RE.exec(content)) !== null) tags.push(parseInt(m[1][1]));

  const h1count = tags.filter(t => t === 1).length;
  if (h1count === 0) { bad(`Sin H1 en ${slug}`); hierIssues++; }
  if (h1count > 1)   { warn(`Múltiples H1 (${h1count}) en ${slug}`); }

  // Check for skipped levels
  for (let i = 1; i < tags.length; i++) {
    if (tags[i] > tags[i-1] + 1) {
      warn(`Salto de heading H${tags[i-1]}→H${tags[i]} en ${slug}`);
    }
  }
}
if (hierIssues === 0) ok('H1 presente en todas las páginas');

/* ── A3: CTAs por página ── */
section('A3. CTAs — PRESENCIA Y DENSIDAD');

// Count key CTA patterns
const CTA_PATTERNS = [
  { label: 'WhatsApp', re: /wa\.me/g },
  { label: 'Btn primario', re: /class="btn[^"]*btn-primary[^"]*"/g },
  { label: 'Form submit', re: /<button[^>]*type="submit"/g },
  { label: 'Link interno', re: /href="\/[^"]+"/g },
];

for (const [slug, content] of Object.entries(pages)) {
  if (slug.includes('/admin')) continue;
  const stripped = content.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  const counts = {};
  for (const p of CTA_PATTERNS) {
    p.re.lastIndex = 0;
    counts[p.label] = (stripped.match(p.re) || []).length;
  }
  const hasCTA = counts['WhatsApp'] > 0 || counts['Btn primario'] > 0;
  if (!hasCTA) {
    bad(`Página sin CTA claro: ${slug}`);
  } else {
    info(`${slug} → WA:${counts['WhatsApp']} BtnPrimario:${counts['Btn primario']} Submit:${counts['Form submit']}`);
  }
}

/* ── A4: Formularios — accesibilidad ── */
section('A4. FORMULARIOS — LABELS Y ACCESIBILIDAD');

const FORM_INPUT_RE = /<input(?![^>]*type="hidden")[^>]*>/gi;
const FORM_LABEL_RE = /<label[^>]*>/gi;
const ARIA_RE       = /aria-label="[^"]+"/i;
const PLACEHOLDER_RE = /placeholder="[^"]+"/i;

let formIssues = 0;
for (const [slug, content] of Object.entries(pages)) {
  if (slug.includes('/admin')) continue;
  let m;
  FORM_INPUT_RE.lastIndex = 0;
  const inputs = [];
  while ((m = FORM_INPUT_RE.exec(content)) !== null) inputs.push(m[0]);

  FORM_LABEL_RE.lastIndex = 0;
  const labels = (content.match(FORM_LABEL_RE) || []).length;

  for (const input of inputs) {
    if (!ARIA_RE.test(input) && !PLACEHOLDER_RE.test(input) && labels === 0) {
      bad(`Input sin label/aria-label/placeholder en ${slug}`);
      formIssues++;
    }
  }
  if (inputs.length > 0) {
    ok(`${slug} — ${inputs.length} inputs, ${labels} labels`);
  }
}
if (formIssues === 0) ok('Todos los inputs tienen identificación accesible');

/* ── A5: Tap targets — texto demasiado corto ── */
section('A5. TAP TARGETS — TEXTO DE BOTONES');

const BTN_TEXT_RE = /<button[^>]*>([\s\S]*?)<\/button>/gi;
const ANCH_TEXT_RE = /<a[^>]*class="btn[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
const stripTags = s => s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

let tapIssues = 0;
for (const [slug, content] of Object.entries(pages)) {
  if (slug.includes('/admin')) continue;
  let m;
  BTN_TEXT_RE.lastIndex = 0;
  while ((m = BTN_TEXT_RE.exec(content)) !== null) {
    const text = stripTags(m[1]);
    if (text.length > 0 && text.length < 3 && !m[0].includes('aria-label')) {
      warn(`Botón con texto muy corto "${text}" en ${slug}`);
      tapIssues++;
    }
  }
  ANCH_TEXT_RE.lastIndex = 0;
  while ((m = ANCH_TEXT_RE.exec(content)) !== null) {
    const text = stripTags(m[1]);
    if (text.length > 0 && text.length < 3 && !m[0].includes('aria-label')) {
      warn(`Link-btn con texto muy corto "${text}" en ${slug}`);
      tapIssues++;
    }
  }
}
if (tapIssues === 0) ok('Todos los botones tienen texto descriptivo');

/* ── A6: Dead-ends — páginas sin links de salida ── */
section('A6. DEAD-ENDS — PÁGINAS SIN SALIDA');

for (const [slug, content] of Object.entries(pages)) {
  if (slug.includes('/admin')) continue;
  const stripped = content.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  const internalLinks = (stripped.match(/href="\/[^"]+"/g) || []).length;
  const externalLinks = (stripped.match(/href="https?:\/\//g) || []).length;
  if (internalLinks === 0 && externalLinks === 0) {
    bad(`Dead-end: ${slug} no tiene links de salida`);
  } else {
    ok(`${slug} — ${internalLinks} links internos, ${externalLinks} externos`);
  }
}

/* ── A7: Contenido vacío / text density ── */
section('A7. DENSIDAD DE CONTENIDO');

for (const [slug, content] of Object.entries(pages)) {
  if (slug.includes('/admin')) continue;
  const stripped = content
    .replace(/<script[\s\S]*?<\/script>/gi,'')
    .replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/<[^>]+>/g,' ')
    .replace(/\s+/g,' ').trim();
  const wordCount = stripped.split(' ').filter(w => w.length > 2).length;
  if (wordCount < 50) {
    warn(`Contenido muy escaso: ${slug} — ${wordCount} palabras visibles`);
  } else {
    ok(`${slug} — ${wordCount} palabras`);
  }
}

/* ── A8: Legibilidad — párrafos muy largos ── */
section('A8. LEGIBILIDAD — LONGITUD DE PÁRRAFOS');

const P_RE = /<p[^>]*>([\s\S]*?)<\/p>/gi;
let longParas = 0;
for (const [slug, content] of Object.entries(pages)) {
  if (slug.includes('/admin')) continue;
  let m;
  P_RE.lastIndex = 0;
  while ((m = P_RE.exec(content)) !== null) {
    const text = stripTags(m[1]);
    if (text.split(' ').length > 60) {
      warn(`Párrafo largo (${text.split(' ').length} palabras) en ${slug}: "${text.substring(0,60)}..."`);
      longParas++;
    }
  }
}
if (longParas === 0) ok('Todos los párrafos dentro de límite de legibilidad');


/* ════════════════════════════════════════════════════════
   B. SIMULACIÓN MONTE CARLO — 1,000,000 SESIONES
════════════════════════════════════════════════════════ */
section('B. MONTE CARLO — 1,000,000 SESIONES');

console.log('  Calculando...\n');

/*
  Score weights (idénticos a BehaviorTracker.astro para coherencia)
*/
const WEIGHTS = {
  page_view:2, scroll_50:5, scroll_75:8, scroll_90:10,
  time_3min:8, time_5min:12, return_visit:20,
  matchmaker_step1:6, matchmaker_step2:10, matchmaker_complete:22,
  bike_detail_view:14, inventory_view:6, guide_complete:7, paddock_open:6,
  whatsapp_click:25, lead_form_submit:30, google_login:35, utm_social:8
};

/*
  User archetypes — distribución realista para una tienda boutique en Playa del Carmen.
  Source: datos típicos de e-commerce local MX + perfil turístico Riviera Maya.

  Arquetipo          | Peso | Intención          | Canal típico
  ───────────────────|──────|────────────────────|─────────────
  Turista Activo     | 22%  | Alta curiosidad     | Instagram
  Ciclista Local     | 18%  | Alta intención      | Directo / Google
  Buscador de Bici   | 20%  | Comprará pronto     | Google
  Curioso Pasivo     | 25%  | Baja intención      | Instagram / Redes
  Ex-cliente         | 8%   | Regresa a comprar   | Directo
  Corredor Ruta      | 4%   | Muy alta intención  | Búsqueda específica
  Expedicionario MTB | 3%   | Alta, nicho         | Referido
*/

const ARCHETYPES = [
  {
    name: 'Turista Activo',
    weight: 0.22,
    device: { mobile: 0.75, desktop: 0.25 },
    utm: { instagram: 0.5, direct: 0.3, google: 0.2 },
    journeyProb: {
      visits_inventory:     0.55,
      visits_bike_detail:   0.30,
      completes_matchmaker: 0.20,
      scrolls_deep:         0.45,
      clicks_whatsapp:      0.12,
      submits_lead:         0.08,
      is_returning:         0.10,
      spends_3min:          0.40,
      opens_paddock:        0.25,
      google_login:         0.04,
    }
  },
  {
    name: 'Ciclista Local',
    weight: 0.18,
    device: { mobile: 0.55, desktop: 0.45 },
    utm: { direct: 0.5, google: 0.4, instagram: 0.1 },
    journeyProb: {
      visits_inventory:     0.80,
      visits_bike_detail:   0.65,
      completes_matchmaker: 0.45,
      scrolls_deep:         0.70,
      clicks_whatsapp:      0.35,
      submits_lead:         0.25,
      is_returning:         0.40,
      spends_3min:          0.65,
      opens_paddock:        0.35,
      google_login:         0.12,
    }
  },
  {
    name: 'Buscador de Bici',
    weight: 0.20,
    device: { mobile: 0.60, desktop: 0.40 },
    utm: { google: 0.70, direct: 0.20, instagram: 0.10 },
    journeyProb: {
      visits_inventory:     0.90,
      visits_bike_detail:   0.75,
      completes_matchmaker: 0.55,
      scrolls_deep:         0.60,
      clicks_whatsapp:      0.28,
      submits_lead:         0.20,
      is_returning:         0.30,
      spends_3min:          0.55,
      opens_paddock:        0.20,
      google_login:         0.10,
    }
  },
  {
    name: 'Curioso Pasivo',
    weight: 0.25,
    device: { mobile: 0.85, desktop: 0.15 },
    utm: { instagram: 0.60, tiktok: 0.20, direct: 0.20 },
    journeyProb: {
      visits_inventory:     0.30,
      visits_bike_detail:   0.10,
      completes_matchmaker: 0.05,
      scrolls_deep:         0.20,
      clicks_whatsapp:      0.03,
      submits_lead:         0.01,
      is_returning:         0.05,
      spends_3min:          0.15,
      opens_paddock:        0.08,
      google_login:         0.01,
    }
  },
  {
    name: 'Ex-Cliente',
    weight: 0.08,
    device: { mobile: 0.50, desktop: 0.50 },
    utm: { direct: 0.75, google: 0.25 },
    journeyProb: {
      visits_inventory:     0.85,
      visits_bike_detail:   0.70,
      completes_matchmaker: 0.30,
      scrolls_deep:         0.60,
      clicks_whatsapp:      0.50,
      submits_lead:         0.35,
      is_returning:         0.95, // siempre es returning
      spends_3min:          0.55,
      opens_paddock:        0.40,
      google_login:         0.20,
    }
  },
  {
    name: 'Corredor Ruta',
    weight: 0.04,
    device: { mobile: 0.40, desktop: 0.60 },
    utm: { google: 0.60, direct: 0.30, strava: 0.10 },
    journeyProb: {
      visits_inventory:     0.95,
      visits_bike_detail:   0.90,
      completes_matchmaker: 0.70,
      scrolls_deep:         0.80,
      clicks_whatsapp:      0.55,
      submits_lead:         0.40,
      is_returning:         0.50,
      spends_3min:          0.75,
      opens_paddock:        0.50,
      google_login:         0.20,
    }
  },
  {
    name: 'Expedicionario MTB',
    weight: 0.03,
    device: { mobile: 0.60, desktop: 0.40 },
    utm: { instagram: 0.40, direct: 0.30, google: 0.30 },
    journeyProb: {
      visits_inventory:     0.90,
      visits_bike_detail:   0.85,
      completes_matchmaker: 0.65,
      scrolls_deep:         0.75,
      clicks_whatsapp:      0.48,
      submits_lead:         0.35,
      is_returning:         0.45,
      spends_3min:          0.70,
      opens_paddock:        0.45,
      google_login:         0.15,
    }
  }
];

// Validate weights sum to 1
const wSum = ARCHETYPES.reduce((a, b) => a + b.weight, 0);
if (Math.abs(wSum - 1) > 0.01) throw new Error('Weights must sum to 1. Got ' + wSum);

function pickArchetype() {
  const r = Math.random();
  let cum = 0;
  for (const a of ARCHETYPES) {
    cum += a.weight;
    if (r < cum) return a;
  }
  return ARCHETYPES[ARCHETYPES.length - 1];
}

function calcScore(events) {
  const ONE_TIME = ['scroll_50','scroll_75','scroll_90','time_3min','time_5min',
    'return_visit','matchmaker_complete','lead_form_submit','google_login','utm_social'];
  let score = 0, seen = {};
  for (const e of events) {
    if (ONE_TIME.includes(e)) { if (seen[e]) continue; seen[e] = true; }
    score += (WEIGHTS[e] || 0);
  }
  return Math.min(100, score);
}

function simulateSession(archetype) {
  const p = archetype.journeyProb;
  const events = [];

  // Page view (always)
  events.push('page_view');

  // Return visit
  if (Math.random() < p.is_returning) events.push('return_visit');

  // UTM social
  const utmKeys = Object.keys(archetype.utm);
  const utmR = Math.random();
  let utmCum = 0, utm = 'direct';
  for (const k of utmKeys) { utmCum += archetype.utm[k]; if (utmR < utmCum) { utm = k; break; } }
  if (['instagram','facebook','tiktok'].includes(utm)) events.push('utm_social');

  // Scroll
  if (Math.random() < p.scrolls_deep) {
    events.push('scroll_50');
    if (Math.random() < 0.7) events.push('scroll_75');
    if (Math.random() < 0.5) events.push('scroll_90');
  }

  // Time on page
  if (Math.random() < p.spends_3min) {
    events.push('time_3min');
    if (Math.random() < 0.4) events.push('time_5min');
  }

  // Inventory
  if (Math.random() < p.visits_inventory) events.push('inventory_view');

  // Bike detail
  if (Math.random() < p.visits_bike_detail) events.push('bike_detail_view');

  // Matchmaker
  if (Math.random() < p.completes_matchmaker * 1.5) events.push('matchmaker_step1');
  if (Math.random() < p.completes_matchmaker * 1.1) events.push('matchmaker_step2');
  if (Math.random() < p.completes_matchmaker)       events.push('matchmaker_complete');

  // Paddock
  if (Math.random() < p.opens_paddock) events.push('paddock_open');

  // WhatsApp
  const didWA = Math.random() < p.clicks_whatsapp;
  if (didWA) events.push('whatsapp_click');

  // Lead submit
  const didLead = Math.random() < p.submits_lead;
  if (didLead) events.push('lead_form_submit');

  // Google login
  const didLogin = Math.random() < p.google_login;
  if (didLogin) events.push('google_login');

  const score  = calcScore(events);
  const device = Math.random() < archetype.device.mobile ? 'mobile' : 'desktop';

  return { archetype: archetype.name, events, score, device, utm,
           converted: didLead || didLogin || didWA,
           lead: didLead || didLogin };
}

/* ── Run the simulation ── */
const N = 1_000_000;
const results = {
  total: N,
  byArchetype: {},
  scores:      new Array(101).fill(0),  // score distribution 0-100
  converted:   0,
  leads:       0,
  waClicks:    0,
  mobile:      0,
  desktop:     0,
  funnelSteps: {
    page_view:           0,
    inventory_view:      0,
    bike_detail_view:    0,
    matchmaker_step1:    0,
    matchmaker_complete: 0,
    whatsapp_click:      0,
    lead_form_submit:    0,
    google_login:        0,
  },
  avgScoreByArchetype:   {},
  convRateByArchetype:   {},
  dropoffAfterInventory: 0,
  dropoffAfterDetail:    0,
};

ARCHETYPES.forEach(a => {
  results.byArchetype[a.name]        = 0;
  results.avgScoreByArchetype[a.name] = 0;
  results.convRateByArchetype[a.name] = 0;
});

const ARCHETYPE_TOTALS = {};
ARCHETYPES.forEach(a => { ARCHETYPE_TOTALS[a.name] = 0; });

for (let i = 0; i < N; i++) {
  const arch    = pickArchetype();
  const session = simulateSession(arch);

  results.byArchetype[arch.name]++;
  ARCHETYPE_TOTALS[arch.name]++;
  results.avgScoreByArchetype[arch.name] += session.score;
  results.scores[session.score]++;

  if (session.converted) {
    results.converted++;
    results.convRateByArchetype[arch.name]++;
  }
  if (session.lead)    results.leads++;
  if (session.events.includes('whatsapp_click')) results.waClicks++;
  if (session.device === 'mobile') results.mobile++;
  else                             results.desktop++;

  for (const step of Object.keys(results.funnelSteps)) {
    if (session.events.includes(step)) results.funnelSteps[step]++;
  }

  // Drop-off after inventory (visited inventory but NOT bike detail)
  if (session.events.includes('inventory_view') && !session.events.includes('bike_detail_view')) {
    results.dropoffAfterInventory++;
  }
  // Drop-off after detail (visited detail but NOT WA/form)
  if (session.events.includes('bike_detail_view') && !session.events.includes('whatsapp_click') && !session.events.includes('lead_form_submit')) {
    results.dropoffAfterDetail++;
  }
}

// Finalize averages
for (const name of Object.keys(results.avgScoreByArchetype)) {
  const total = ARCHETYPE_TOTALS[name] || 1;
  results.avgScoreByArchetype[name] = (results.avgScoreByArchetype[name] / total).toFixed(1);
  results.convRateByArchetype[name] = ((results.convRateByArchetype[name] / total) * 100).toFixed(2);
}

/* ── B1: Resumen por arquetipo ── */
section('B1. DISTRIBUCIÓN POR ARQUETIPO');
for (const [name, count] of Object.entries(results.byArchetype)) {
  const pct = ((count / N) * 100).toFixed(1);
  info(`${name.padEnd(20)} ${count.toLocaleString().padStart(9)} sesiones (${pct}%) | Score prom: ${results.avgScoreByArchetype[name]} | CVR: ${results.convRateByArchetype[name]}%`);
}

/* ── B2: Funnel de conversión ── */
section('B2. FUNNEL DE CONVERSIÓN');
const funnel = results.funnelSteps;
const steps = [
  ['Sesión iniciada',         N],
  ['Visitaron inventario',    funnel.inventory_view],
  ['Vieron detalle de bici',  funnel.bike_detail_view],
  ['Iniciaron Matchmaker',    funnel.matchmaker_step1],
  ['Completaron Matchmaker',  funnel.matchmaker_complete],
  ['Clickearon WhatsApp',     funnel.whatsapp_click],
  ['Enviaron formulario',     funnel.lead_form_submit],
  ['Login con Google',        funnel.google_login],
];

for (let i = 0; i < steps.length; i++) {
  const [label, count] = steps[i];
  const pct     = ((count / N) * 100).toFixed(2);
  const dropPct = i > 0 ? (((steps[i-1][1] - count) / steps[i-1][1]) * 100).toFixed(1) : '—';
  const bar     = '█'.repeat(Math.round(parseFloat(pct) / 2));
  const dropStr = i > 0 ? `  ↓ perdió ${dropPct}%` : '';
  info(`${label.padEnd(28)} ${count.toLocaleString().padStart(9)}  (${pct.padStart(6)}%)  ${bar}${dropStr}`);
}

/* ── B3: Métricas globales ── */
section('B3. MÉTRICAS GLOBALES');
info(`Total sesiones simuladas:    ${N.toLocaleString()}`);
info(`Conversiones (WA/Lead/Login): ${results.converted.toLocaleString()}  (${((results.converted/N)*100).toFixed(2)}%)`);
info(`Leads con contacto:          ${results.leads.toLocaleString()}  (${((results.leads/N)*100).toFixed(2)}%)`);
info(`Clicks a WhatsApp:           ${results.waClicks.toLocaleString()}  (${((results.waClicks/N)*100).toFixed(2)}%)`);
info(`Dispositivos — Móvil:        ${((results.mobile/N)*100).toFixed(1)}% | Escritorio: ${((results.desktop/N)*100).toFixed(1)}%`);

/* ── B4: Score distribution ── */
section('B4. DISTRIBUCIÓN DE SCORES');
const bins = {
  'Anónimo  (0–19)':  0,
  'Interesado(20–44)': 0,
  'Calificado(45–69)': 0,
  'Comprador (70–100)': 0,
};
for (let s = 0; s <= 100; s++) {
  const count = results.scores[s];
  if (s < 20)       bins['Anónimo  (0–19)']    += count;
  else if (s < 45)  bins['Interesado(20–44)']  += count;
  else if (s < 70)  bins['Calificado(45–69)']  += count;
  else              bins['Comprador (70–100)']  += count;
}
for (const [label, count] of Object.entries(bins)) {
  const pct = ((count / N) * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(parseFloat(pct) / 2));
  info(`${label.padEnd(20)} ${count.toLocaleString().padStart(9)}  (${pct.padStart(5)}%)  ${bar}`);
}

/* ── B5: Drop-off ── */
section('B5. ANÁLISIS DE ABANDONO (OPORTUNIDADES)');

const dropInv  = results.dropoffAfterInventory;
const dropDet  = results.dropoffAfterDetail;
info(`Visitaron inventario y NO vieron detalle: ${dropInv.toLocaleString()} (${((dropInv/N)*100).toFixed(1)}%)`);
info(`  → Oportunidad: mejorar thumbnails y CTAs en /inventario`);
info(`Vieron detalle y NO convirtieron:         ${dropDet.toLocaleString()} (${((dropDet/N)*100).toFixed(1)}%)`);
info(`  → Oportunidad: añadir urgencia / social proof en páginas de bici`);

/* ── B6: Estimación de impacto de mejoras ── */
section('B6. IMPACTO ESTIMADO DE MEJORAS (Análisis Marginal)');

const baseLeads = results.leads;

// What if we improved Matchmaker completion rate by 10%?
let simImproved = 0;
for (let i = 0; i < 100_000; i++) {
  const arch = pickArchetype();
  const p    = { ...arch.journeyProb };
  p.completes_matchmaker = Math.min(1, p.completes_matchmaker * 1.10); // +10%
  const sess = simulateSession({ ...arch, journeyProb: p });
  if (sess.lead) simImproved++;
}
const improvePct = (((simImproved - baseLeads / 10) / (baseLeads / 10)) * 100).toFixed(1);
info(`Si Matchmaker completa +10% → leads ${improvePct > 0 ? '+' : ''}${improvePct}% adicionales`);

// What if WhatsApp CTA is more prominent (+15% clicks)?
let simWABoost = 0;
for (let i = 0; i < 100_000; i++) {
  const arch = pickArchetype();
  const p    = { ...arch.journeyProb };
  p.clicks_whatsapp = Math.min(1, p.clicks_whatsapp * 1.15);
  const sess = simulateSession({ ...arch, journeyProb: p });
  if (sess.converted) simWABoost++;
}
const waBoostPct = (((simWABoost - results.converted / 10) / (results.converted / 10)) * 100).toFixed(1);
info(`Si WhatsApp CTR +15% → conversiones ${waBoostPct > 0 ? '+' : ''}${waBoostPct}% adicionales`);

// What if exit intent One-Tap captures 3% of abandoners?
const exitAbandoners = N - results.converted;
const oneTapCapture  = Math.round(exitAbandoners * 0.03);
info(`Si Google One-Tap captura 3% de abandonos → ${oneTapCapture.toLocaleString()} leads adicionales/millón`);

/* ════════════════════════════════════════════════════════
   C. REPORTE CONSOLIDADO
════════════════════════════════════════════════════════ */
section('C. REPORTE CONSOLIDADO DE OPORTUNIDADES');

const ALL_ISSUES = [...ISSUES];
const ALL_WARNS  = [...WARNINGS];

if (ALL_ISSUES.length === 0) {
  ok('Sin errores críticos de UX');
} else {
  console.log('\n\x1b[31m  ERRORES CRÍTICOS:\x1b[0m');
  ALL_ISSUES.forEach(i => console.log('  ✗', i));
}

if (ALL_WARNS.length === 0) {
  ok('Sin advertencias');
} else {
  console.log('\n\x1b[33m  ADVERTENCIAS:\x1b[0m');
  ALL_WARNS.forEach(w => console.log('  ⚠', w));
}

console.log('\n\x1b[1m\x1b[34m  TOP OPORTUNIDADES DE CONVERSIÓN:\x1b[0m');

// Sort archetypes by CVR
const sortedArch = Object.entries(results.convRateByArchetype)
  .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

console.log('\n  Arquetipos con mayor CVR (priorizar captación):');
sortedArch.forEach(([name, cvr]) => {
  console.log(`    ${name.padEnd(22)} CVR: ${cvr}%`);
});

console.log('\n\x1b[1m\x1b[34m  MÉTRICAS FINALES:\x1b[0m');
console.log(`  Sesiones simuladas:   ${N.toLocaleString()}`);
console.log(`  CVR global estimado:  ${((results.converted/N)*100).toFixed(2)}%`);
console.log(`  Lead rate estimado:   ${((results.leads/N)*100).toFixed(2)}%`);
console.log(`  Errores UX:           ${ISSUES.length}`);
console.log(`  Advertencias UX:      ${ALL_WARNS.length}`);
console.log('');
console.log('\x1b[1m' + '═'.repeat(55) + '\x1b[0m');
console.log('\x1b[1m\x1b[32m  SIMULACIÓN COMPLETA\x1b[0m');
console.log('\x1b[1m' + '═'.repeat(55) + '\x1b[0m\n');
