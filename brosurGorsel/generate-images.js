const puppeteer = require('puppeteer');
const path = require('path');

const pages = [
  { file: 'gorsel-01-linkedin-post.html', output: 'quvex-linkedin-1200x628.png', width: 1200, height: 628, selector: '.card' },
  { file: 'gorsel-02-instagram-kare.html', output: 'quvex-instagram-1080x1080.png', width: 1080, height: 1080, selector: '.card' },
  { file: 'gorsel-03-sunum-slayt.html', output: 'quvex-sunum-1920x1080.png', width: 1920, height: 1080, selector: '.slide' },
  { file: 'gorsel-04-a4-poster.html', output: 'quvex-poster-A4.png', width: 794, height: 1123, selector: '.poster' },
  { file: 'gorsel-05-kartvizit-banner.html', output: null, width: 1584, height: 1600, selector: null },
  // Brosurler
  { file: 'brosur-01-yonetici-ozeti.html', output: 'quvex-brosur-yonetici.png', width: 1100, height: null, selector: '.page' },
  { file: 'brosur-04-tek-sayfa.html', output: 'quvex-brosur-tek-sayfa.png', width: 900, height: null, selector: '.page' },
];

// gorsel-05 has multiple elements
const multiElements = [
  { file: 'gorsel-05-kartvizit-banner.html', selector: '.banner', output: 'quvex-twitter-header-1584x396.png' },
  { file: 'gorsel-05-kartvizit-banner.html', selector: '.bizcard', output: 'quvex-kartvizit-1050x600.png' },
  { file: 'gorsel-05-kartvizit-banner.html', selector: '.email-sig', output: 'quvex-email-imza-600x200.png' },
];

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const outputDir = path.join(__dirname, 'images');
  const fs = require('fs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Single element pages
  for (const p of pages) {
    if (!p.output) continue;
    console.log(`Generating ${p.output}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: p.width, height: p.height || 2000, deviceScaleFactor: 2 });
    await page.goto('file:///' + path.join(__dirname, p.file).replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector(p.selector, { timeout: 10000 });

    if (p.height) {
      const el = await page.$(p.selector);
      await el.screenshot({ path: path.join(outputDir, p.output), type: 'png' });
    } else {
      const el = await page.$(p.selector);
      await el.screenshot({ path: path.join(outputDir, p.output), type: 'png' });
    }
    await page.close();
    console.log(`  -> ${p.output} OK`);
  }

  // Multi-element page (gorsel-05)
  for (const m of multiElements) {
    console.log(`Generating ${m.output}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1800, height: 2000, deviceScaleFactor: 2 });
    await page.goto('file:///' + path.join(__dirname, m.file).replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector(m.selector, { timeout: 10000 });
    const el = await page.$(m.selector);
    await el.screenshot({ path: path.join(outputDir, m.output), type: 'png' });
    await page.close();
    console.log(`  -> ${m.output} OK`);
  }

  await browser.close();
  console.log('\nTum gorseller /docs/images/ klasorune kaydedildi.');
}

main().catch(e => { console.error(e); process.exit(1); });
