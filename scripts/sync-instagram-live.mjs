import puppeteer from 'puppeteer-core';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public/img/instagram');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Status: ' + res.statusCode));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function syncInstagram() {
  console.log('🤖 AGENTE AUTÓNOMO: Iniciando sincronización en vivo con @thegarage.pdc...');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  await page.goto('https://www.instagram.com/thegarage.pdc/', { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 4000));

  const posts = await page.evaluate(() => {
    const results = [];
    const links = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
    links.forEach(a => {
      const href = a.getAttribute('href');
      const img = a.querySelector('img');
      const src = img ? (img.getAttribute('src') || '') : '';
      const alt = img ? (img.getAttribute('alt') || '') : '';
      if (href && src && !results.some(r => r.permalink === href)) {
        results.push({
          permalink: 'https://www.instagram.com' + href,
          shortcode: href.replace(/\/(p|reel)\//, '').replace(/\//g, ''),
          imgSrc: src,
          alt: alt
        });
      }
    });
    return results;
  });

  await browser.close();
  console.log(`📸 Publicaciones detectadas en vivo: ${posts.length}`);

  let newDownloads = 0;
  for (const p of posts) {
    const filename = `live-ig-${p.shortcode}.jpg`;
    const localPath = path.join(outDir, filename);
    if (!fs.existsSync(localPath)) {
      try {
        await downloadFile(p.imgSrc, localPath);
        newDownloads++;
        console.log(`✓ Nueva foto original descargada: ${filename}`);
      } catch (err) {
        console.error(`Error descargando ${p.imgSrc}:`, err.message);
      }
    }
    p.localImage = `/img/instagram/${filename}`;
  }

  fs.writeFileSync(path.join(outDir, 'live_feed.json'), JSON.stringify(posts, null, 2));

  console.log('🚀 Compilando y sincronizando con Cloudflare Pages...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  execSync('git add . && git commit -m "Auto-sync: Actualizar feed de Instagram en vivo" && git push origin main', { cwd: rootDir, stdio: 'inherit' });

  console.log('🎉 ¡Sincronización completada con éxito! La web está 100% al día en Cloudflare.');
}

syncInstagram().catch(console.error);
