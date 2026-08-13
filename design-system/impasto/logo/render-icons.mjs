import { chromium } from 'playwright'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const dir = path.dirname(fileURLToPath(import.meta.url))
const outDir = process.argv[2] || dir

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

async function render(svgPath, size, outPath) {
  const svg = readFileSync(path.join(dir, svgPath), 'utf-8')
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
  await page.setContent(`<!doctype html><html><body style="margin:0;padding:0;">${svg}</body></html>`)
  await page.evaluate((s) => {
    const el = document.querySelector('svg')
    el.setAttribute('width', String(s))
    el.setAttribute('height', String(s))
  }, size)
  await page.screenshot({ path: path.join(outDir, outPath), omitBackground: false })
  await page.close()
  console.log(`wrote ${outPath} (${size}x${size})`)
}

await render('logo-mark.svg', 180, 'apple-touch-icon.png')
await render('logo-mark.svg', 192, 'icon-192.png')
await render('logo-mark.svg', 512, 'icon-512.png')
await render('logo-mark-maskable.svg', 512, 'icon-512-maskable.png')
await render('logo-mark.svg', 32, 'favicon-32.png')

await browser.close()
