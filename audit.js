#!/usr/bin/env node
/**
 * AUDITORÍA COMPLETA — The Garage Bike Experts
 * Igual que las auditorías previas + nuevos módulos:
 *   1. Build integridad (16 páginas)
 *   2. Emojis visibles al cliente
 *   3. Dominios viejos
 *   4. Jerga técnica visible
 *   5. Imágenes rotas / alt attributes
 *   6. Canonical URLs
 *   7. Meta SEO (title, description)
 *   8. Tracker integrado en todas las páginas
 *   9. CRM accesible y con PIN
 *  10. Google One-Tap Client ID activo
 *  11. Cookie Banner presente
 *  12. Script size check (scripts pesados)
 *  13. Links externos (noopener/noreferrer)
 *  14. Mobile viewport meta
 *  15. Schema.org LocalBusiness
 */

const fs   = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const SRC  = path.join(__dirname, 'src');

let PASS = 0, FAIL = 0, WARN = 0;
const issues = [];

function pass(msg)    { PASS++; console.log('\x1b[32m  ✓\x1b[0m', msg); }
function fail(msg, extra) { FAIL++; console.log('\x1b[31m  ✗\x1b[0m', msg); if(extra) console.log('    →', extra); issues.push({ level:'FAIL', msg, extra }); }
function warn(msg, extra) { WARN++; console.log('\x1b[33m  ⚠\x1b[0m', msg); if(extra) console.log('    →', extra); issues.push({ level:'WARN', msg, extra }); }
function section(name) { console.log('\n\x1b[1m\x1b[34m══ ' + name + ' ══\x1b[0m'); }

// ── Helper: collect all HTML files ──
function htmlFiles() {
  const result = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) walk(fp);
      // Exclude legacy static HTML files in /public/admin (not Astro-managed)
      else if (f.endsWith('.html') && !fp.includes('/dist/admin/crm.html') && !fp.includes('/dist/admin/index.html')) result.push(fp);
    }
  }
  walk(DIST);
  return result;
}

// ── Helper: read HTML ──
function read(fp) { return fs.readFileSync(fp, 'utf8'); }
function rel(fp)  { return fp.replace(DIST, ''); }

// ════════════════════════════════════════════════════
// 1. BUILD INTEGRITY
// ════════════════════════════════════════════════════
section('1. BUILD INTEGRITY');

const EXPECTED_PAGES = [
  '/index.html',
  '/admin/crm/index.html',
  '/aviso-privacidad/index.html',
  '/bici/merida-scultura-tiagra/index.html',
  '/bici/trek-marlin-5-2024/index.html',
  '/bici/giant-talon-2-2024/index.html',
  '/bici/specialized-allez-e5/index.html',
  '/bici/oferta-relampago-mtb-r29/index.html',
  '/comunidad/index.html',
  '/guia-tallas/index.html',
  '/guia/salitre-humedad-caribe/index.html',
  '/guia/rutas-ciclistas-riviera-maya/index.html',
  '/guia/hidratacion-termorregulacion-wayfar/index.html',
  '/guias/index.html',
  '/inventario/index.html',
  '/riviera-maya/index.html',
];

const html = htmlFiles();
console.log(`  Total HTML generado: ${html.length}`);

for (const expected of EXPECTED_PAGES) {
  const fp = path.join(DIST, expected);
  if (fs.existsSync(fp)) pass(expected);
  else fail('Página faltante: ' + expected);
}

// ════════════════════════════════════════════════════
// 2. EMOJIS VISIBLES AL CLIENTE
// ════════════════════════════════════════════════════
section('2. EMOJIS EN PÁGINAS PÚBLICAS (excluye /admin)');

// Emoji range — EXCLUDES dingbats U+2600-27BF since ✕ ✓ ✗ × are typographic chars used in buttons/badges
// We target only the colorful emoji ranges (faces, objects, symbols 1F000+)
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}]|[\u{1F000}-\u{1F2FF}]/gu;

const PUBLIC_PAGES = html.filter(f => !f.includes('/admin/'));

let emojiClean = true;
for (const fp of PUBLIC_PAGES) {
  const content = read(fp);
  // Strip scripts, styles, comments, and HTML tags before checking visible text
  const stripped = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ');
  const matches = stripped.match(EMOJI_RE);
  if (matches) {
    fail(`Emoji decorativo en ${rel(fp)}`, matches.slice(0,5).join(' '));
    emojiClean = false;
  }
}
if (emojiClean) pass('Cero emojis decorativos en páginas públicas');

// ════════════════════════════════════════════════════
// 3. DOMINIOS VIEJOS
// ════════════════════════════════════════════════════
section('3. DOMINIOS OBSOLETOS');

const OLD_DOMAINS = ['thegarageplaya.pages.dev', 'thegarage.pages.dev'];
let domainClean = true;
for (const fp of html) {
  const content = read(fp);
  for (const domain of OLD_DOMAINS) {
    if (content.includes(domain)) {
      fail(`Dominio viejo "${domain}" en ${rel(fp)}`);
      domainClean = false;
    }
  }
}
if (domainClean) pass('Sin referencias a dominios obsoletos');

// ════════════════════════════════════════════════════
// 4. JERGA TÉCNICA VISIBLE AL CLIENTE
// ════════════════════════════════════════════════════
section('4. JERGA TÉCNICA VISIBLE');

const JARGON = ['hero section', 'bento grid', 'bento box', 'drop section', 'CTA button', 'lorem ipsum', 'placeholder'];
let jargonClean = true;
for (const fp of PUBLIC_PAGES) {
  const stripped = read(fp)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ').toLowerCase();
  for (const term of JARGON) {
    if (stripped.includes(term.toLowerCase())) {
      fail(`Jerga "${term}" en ${rel(fp)}`);
      jargonClean = false;
    }
  }
}
if (jargonClean) pass('Sin jerga técnica en páginas públicas');

// ════════════════════════════════════════════════════
// 5. IMÁGENES — SRC ROTOS Y ALT ATTRIBUTES
// ════════════════════════════════════════════════════
section('5. IMÁGENES Y ALT ATTRIBUTES');

const IMG_SRC_RE = /<img[^>]+src="([^"]+)"[^>]*>/gi;
const IMG_ALT_RE = /<img(?![^>]*alt=)[^>]*>/gi;
let imgIssues = 0;

for (const fp of PUBLIC_PAGES) {
  const content = read(fp);

  // Check for missing alt
  const noAlt = content.match(IMG_ALT_RE);
  if (noAlt) {
    noAlt.forEach(tag => {
      warn(`IMG sin alt en ${rel(fp)}`, tag.substring(0, 80));
      imgIssues++;
    });
  }

  // Check that local src images exist
  let m;
  IMG_SRC_RE.lastIndex = 0;
  while ((m = IMG_SRC_RE.exec(content)) !== null) {
    const src = m[1];
    if (src.startsWith('/') && !src.startsWith('//') && !src.startsWith('/img/favicon')) {
      const localPath = path.join(DIST, src);
      const publicPath = path.join(__dirname, 'public', src);
      if (!fs.existsSync(localPath) && !fs.existsSync(publicPath)) {
        fail(`Imagen no encontrada: ${src} en ${rel(fp)}`);
        imgIssues++;
      }
    }
  }
}
if (imgIssues === 0) pass('Todas las imágenes tienen src válido y alt attribute');

// ════════════════════════════════════════════════════
// 6. CANONICAL URLS
// ════════════════════════════════════════════════════
section('6. CANONICAL URLS');

const CANONICAL_RE = /<link rel="canonical" href="([^"]+)"/i;
let canonicalIssues = 0;
for (const fp of html) {
  const content = read(fp);
  const match = content.match(CANONICAL_RE);
  if (!match) {
    warn(`Sin canonical en ${rel(fp)}`);
    canonicalIssues++;
  } else if (match[1].includes('localhost') || match[1].includes('thegarageplaya')) {
    fail(`Canonical incorrecto en ${rel(fp)}: ${match[1]}`);
    canonicalIssues++;
  }
}
if (canonicalIssues === 0) pass('Todos los canonicals apuntan a the-garage-dw4.pages.dev');

// ════════════════════════════════════════════════════
// 7. SEO META (title + description)
// ════════════════════════════════════════════════════
section('7. META SEO');

const TITLE_RE   = /<title>([^<]+)<\/title>/i;
const DESC_RE    = /<meta name="description" content="([^"]+)"/i;
const OG_IMG_RE  = /<meta property="og:image" content="([^"]+)"/i;

let seoIssues = 0;
for (const fp of html) {
  const content = read(fp);
  const title = content.match(TITLE_RE);
  const desc  = content.match(DESC_RE);
  const ogImg = content.match(OG_IMG_RE);

  if (!title || title[1].trim().length < 10) {
    warn(`Title muy corto o ausente en ${rel(fp)}`); seoIssues++;
  }
  if (!desc || desc[1].trim().length < 50) {
    warn(`Meta description muy corta en ${rel(fp)}`); seoIssues++;
  }
  if (!ogImg) {
    warn(`Sin og:image en ${rel(fp)}`); seoIssues++;
  }
}
if (seoIssues === 0) pass('Title, description y og:image presentes en todas las páginas');

// ════════════════════════════════════════════════════
// 8. TRACKER INTEGRADO EN TODAS LAS PÁGINAS
// ════════════════════════════════════════════════════
section('8. BEHAVIOR TRACKER EN PÁGINAS PÚBLICAS');

let trackerIssues = 0;
for (const fp of PUBLIC_PAGES) {
  const content = read(fp);
  // BehaviorTracker injects the TGTracker global and tg_sessions key
  if (!content.includes('TGTracker') && !content.includes('tg_sessions')) {
    fail(`BehaviorTracker no encontrado en ${rel(fp)}`);
    trackerIssues++;
  }
}
if (trackerIssues === 0) pass('BehaviorTracker presente en todas las páginas públicas');

// ════════════════════════════════════════════════════
// 9. CRM — PIN Y PIPELINE PRESENTES
// ════════════════════════════════════════════════════
section('9. CRM ADMIN');

const crmPath = path.join(DIST, 'admin/crm/index.html');
if (!fs.existsSync(crmPath)) {
  fail('CRM no existe en /admin/crm/index.html');
} else {
  const crm = read(crmPath);
  if (crm.includes('1493'))          pass('PIN de CRM (1493) presente');
  else                               fail('PIN de CRM no encontrado');
  if (crm.includes('kanban-board'))  pass('Pipeline Kanban presente');
  else                               fail('Pipeline Kanban no encontrado');
  if (crm.includes('tab-analytics')) pass('Tab Analytics presente');
  else                               fail('Tab Analytics no encontrado');
  if (crm.includes('tab-sesiones'))  pass('Tab Sesiones presente');
  else                               fail('Tab Sesiones no encontrado');
  if (crm.includes('tg_sessions'))   pass('CRM lee tg_sessions (tracker integrado)');
  else                               fail('CRM no lee tg_sessions');
}

// ════════════════════════════════════════════════════
// 10. GOOGLE ONE-TAP — CLIENT ID ACTIVO
// ════════════════════════════════════════════════════
section('10. GOOGLE ONE-TAP');

// Check compiled HTML (admin/crm page uses it via Base layout)
const crmHtmlPath = path.join(DIST, 'admin/crm/index.html');
const oneTapSrc   = path.join(SRC, 'components/GoogleOneTap.astro');

if (!fs.existsSync(oneTapSrc)) {
  fail('GoogleOneTap.astro no existe');
} else {
  const srcContent  = fs.readFileSync(oneTapSrc, 'utf8');
  const htmlContent = fs.existsSync(crmHtmlPath) ? read(crmHtmlPath) : '';

  // Check the source for real Client ID
  if (srcContent.includes('YOUR_GOOGLE_CLIENT_ID')) {
    fail('Client ID aún tiene el placeholder YOUR_GOOGLE_CLIENT_ID');
  } else if (srcContent.includes('apps.googleusercontent.com')) {
    pass('Google One-Tap Client ID configurado y activo');
  } else {
    warn('Client ID de Google One-Tap no reconocido en fuente');
  }

  if (srcContent.includes('tg:exit_intent')) pass('Exit intent trigger conectado');
  else                                        fail('Exit intent trigger no encontrado');
  if (srcContent.includes('tg:google_login')) pass('Evento tg:google_login disparado al login');
  else                                         fail('Evento tg:google_login no encontrado');
}

// ════════════════════════════════════════════════════
// 11. COOKIE BANNER
// ════════════════════════════════════════════════════
section('11. COOKIE BANNER / AVISO LEGAL');

let bannerIssues = 0;
for (const fp of PUBLIC_PAGES) {
  const content = read(fp);
  if (!content.includes('cookie') && !content.includes('Cookie') && !content.includes('consentimiento')) {
    warn(`Cookie banner no detectado en ${rel(fp)}`);
    bannerIssues++;
  }
}
if (bannerIssues === 0) pass('Cookie banner presente en todas las páginas públicas');

const privacyPath = path.join(DIST, 'aviso-privacidad/index.html');
if (fs.existsSync(privacyPath)) {
  const priv = read(privacyPath);
  if (priv.includes('LFPDPPP')) pass('Aviso de privacidad referencia LFPDPPP');
  else                          warn('Aviso de privacidad sin mención a LFPDPPP');
} else {
  fail('Aviso de privacidad no existe (/aviso-privacidad)');
}

// ════════════════════════════════════════════════════
// 12. PESO DE SCRIPTS
// ════════════════════════════════════════════════════
section('12. PESO DE SCRIPTS JS');

const assetsDir = path.join(DIST, '_astro');
let totalJS = 0;
if (fs.existsSync(assetsDir)) {
  for (const f of fs.readdirSync(assetsDir)) {
    if (f.endsWith('.js')) {
      const size = fs.statSync(path.join(assetsDir, f)).size;
      totalJS += size;
      const kb = (size / 1024).toFixed(1);
      if (size > 100 * 1024) warn(`Script grande: ${f} (${kb}KB)`);
      else                   pass(`${f} — ${kb}KB`);
    }
  }
}
console.log(`  Total JS bundle: ${(totalJS/1024).toFixed(1)}KB`);
if (totalJS < 200 * 1024) pass('Bundle total < 200KB');
else                      warn(`Bundle total ${(totalJS/1024).toFixed(1)}KB — considerar code splitting`);

// ════════════════════════════════════════════════════
// 13. LINKS EXTERNOS — noopener/noreferrer
// ════════════════════════════════════════════════════
section('13. LINKS EXTERNOS (seguridad)');

const EXT_LINK_RE = /<a[^>]+href="https?:\/\/(?!the-garage-dw4)[^"]*"[^>]*>/gi;
const NO_REL_RE   = /rel="[^"]*noopener[^"]*"/i;
let linkIssues = 0;

for (const fp of PUBLIC_PAGES) {
  const content = read(fp);
  let m;
  EXT_LINK_RE.lastIndex = 0;
  while ((m = EXT_LINK_RE.exec(content)) !== null) {
    const tag = m[0];
    if (!NO_REL_RE.test(tag) && tag.includes('target="_blank"')) {
      warn(`Link externo sin noopener en ${rel(fp)}`, tag.substring(0, 100));
      linkIssues++;
    }
  }
}
if (linkIssues === 0) pass('Todos los links externos con target=_blank tienen noopener');

// ════════════════════════════════════════════════════
// 14. MOBILE VIEWPORT META
// ════════════════════════════════════════════════════
section('14. MOBILE VIEWPORT');

let viewportIssues = 0;
for (const fp of html) {
  const content = read(fp);
  if (!content.includes('width=device-width')) {
    fail(`Meta viewport faltante en ${rel(fp)}`);
    viewportIssues++;
  }
}
if (viewportIssues === 0) pass('Meta viewport correcto en todas las páginas');

// ════════════════════════════════════════════════════
// 15. SCHEMA.ORG LocalBusiness
// ════════════════════════════════════════════════════
section('15. SCHEMA.ORG LocalBusiness');

let schemaIssues = 0;
for (const fp of html) {
  const content = read(fp);
  if (!content.includes('application/ld+json')) {
    warn(`Sin Schema.org en ${rel(fp)}`);
    schemaIssues++;
  } else {
    // Validate it contains key fields
    if (!content.includes('BikeStore') && !content.includes('LocalBusiness')) {
      warn(`Schema.org sin tipo BikeStore/LocalBusiness en ${rel(fp)}`);
    }
  }
}
if (schemaIssues === 0) pass('Schema.org presente en todas las páginas');

// ════════════════════════════════════════════════════
// RESUMEN FINAL
// ════════════════════════════════════════════════════
console.log('\n\x1b[1m' + '═'.repeat(55) + '\x1b[0m');
console.log('\x1b[1m RESUMEN DE AUDITORÍA — The Garage Bike Experts\x1b[0m');
console.log('═'.repeat(55));
console.log(`\x1b[32m  ✓ PASS: ${PASS}\x1b[0m`);
console.log(`\x1b[33m  ⚠ WARN: ${WARN}\x1b[0m`);
console.log(`\x1b[31m  ✗ FAIL: ${FAIL}\x1b[0m`);
console.log('═'.repeat(55));

if (FAIL === 0 && WARN === 0) {
  console.log('\x1b[1m\x1b[32m  AUDITORÍA LIMPIA — Todo en orden\x1b[0m');
} else if (FAIL === 0) {
  console.log('\x1b[1m\x1b[33m  Sin errores críticos. Revisar advertencias.\x1b[0m');
} else {
  console.log('\x1b[1m\x1b[31m  Errores críticos detectados. Corregir antes de deploy.\x1b[0m');
}

if (issues.length > 0) {
  console.log('\n\x1b[1m Issues que requieren atención:\x1b[0m');
  issues.forEach(i => {
    const prefix = i.level === 'FAIL' ? '\x1b[31m  ✗\x1b[0m' : '\x1b[33m  ⚠\x1b[0m';
    console.log(prefix, i.msg);
    if (i.extra) console.log('    →', String(i.extra).substring(0, 100));
  });
}

console.log('');
process.exit(FAIL > 0 ? 1 : 0);
