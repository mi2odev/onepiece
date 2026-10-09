// Renders ad.html frame-by-frame with Playwright.
//   node render.mjs frames <outDir> [fps] [worker] [workers] → frames as JPEG (worker i renders every n-th frame)
//   node render.mjs stills <outDir> t1 t2 ...  → preview stills at given seconds
import { createRequire } from 'node:module';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const here = path.dirname(fileURLToPath(import.meta.url));
const [mode = 'frames', outDir = 'frames', ...rest] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const browser = await playwright.chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const tlPath = path.join(here, 'timeline.json');
if (existsSync(tlPath)) await page.addInitScript(`window.TIMELINE = ${readFileSync(tlPath, 'utf8')};`);
await page.goto('file://' + path.join(here, 'ad.html'));
await page.evaluate(() => window.__ready);

const shot = async (t, file) => {
  await page.evaluate(tt => window.render(tt), t);
  await page.screenshot(file.endsWith('.png') ? { path: file, type: 'png' } : { path: file, type: 'jpeg', quality: 94 });
};

if (mode === 'stills') {
  for (const t of rest.map(Number)) await shot(t, path.join(outDir, `t${t.toFixed(2)}.png`));
} else {
  const fps = Number(rest[0] || 30);
  const worker = Number(rest[1] || 0), workers = Number(rest[2] || 1);
  const dur = await page.evaluate(() => (window.TIMELINE || {}).DUR || 30.6);
  const n = Math.round(dur * fps);
  for (let i = worker; i < n; i += workers) {
    await shot(i / fps, path.join(outDir, `f${String(i).padStart(5, '0')}.jpg`));
    if (i % 120 === worker) console.log(`frame ${i}/${n}`);
  }
}
await browser.close();
