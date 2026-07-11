/**
 * Generates the app's brand PNG assets from the "Trade with Shafy" blue logo
 * (mirrors public/favicon.svg on the web). Requires sharp (already a transitive
 * dependency). Run: node scripts/generate-assets.js
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const BLUE_A = '#3B82F6'
const BLUE_B = '#2563EB'
const BLUE_C = '#1D4ED8'

/** The trend-arrow glyph, drawn in a 48×48 coordinate space. */
function glyph(stroke = '#ffffff') {
  return `
    <path d="M12 31.5 L20.5 23 L27 28 L36 15" stroke="${stroke}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M29 15 L36 15 L36 22" stroke="${stroke}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="12" cy="31.5" r="2.7" fill="${stroke}"/>`
}

const gradientDefs = `
  <defs>
    <linearGradient id="b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BLUE_A}"/>
      <stop offset="55%" stop-color="${BLUE_B}"/>
      <stop offset="100%" stop-color="${BLUE_C}"/>
    </linearGradient>
    <linearGradient id="s" x1="0%" y1="0%" x2="0%" y2="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>`

/** iOS app icon — full-bleed blue gradient, glyph centered (OS rounds corners). */
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <rect width="1024" height="1024" fill="url(#b)"/>
  <rect width="1024" height="1024" fill="url(#s)"/>
  <g transform="translate(128 140) scale(16)">${glyph()}</g>
</svg>`

/** Android adaptive foreground — glyph only, inside the 66% safe zone, transparent bg. */
const adaptiveSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(266 278) scale(10.2)">${glyph()}</g>
</svg>`

/** Splash — white canvas, blue rounded-square mark centered. */
const splashSvg = `
<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <rect width="1284" height="2778" fill="#ffffff"/>
  <g transform="translate(482 1229)">
    <rect width="320" height="320" rx="88" fill="url(#b)"/>
    <rect width="320" height="320" rx="88" fill="url(#s)"/>
    <g transform="translate(0 4) scale(6.667)">${glyph()}</g>
  </g>
</svg>`

/** Notification icon — white silhouette on transparent (Android tints it). */
const notificationSvg = `
<svg width="96" height="96" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  ${glyph('#ffffff')}
</svg>`

/** Horizontal lockup — blue mark + ink wordmark on transparent (light backgrounds). */
const logoSvg = `
<svg width="996" height="216" viewBox="0 0 332 72" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <g transform="translate(12 12)">
    <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#b)"/>
    <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#s)"/>
    ${glyph()}
  </g>
  <text x="74" y="45" font-family="Segoe UI, Arial, sans-serif" font-size="26" letter-spacing="-0.6">
    <tspan fill="#10131a" fill-opacity="0.82" font-weight="600">Trade with</tspan><tspan dx="7" fill="#10131a" font-weight="800">Shafy</tspan>
  </text>
</svg>`

const dir = path.resolve(__dirname, '..', 'assets')
fs.mkdirSync(dir, { recursive: true })

async function render(name, svg, w, h) {
  const buf = await sharp(Buffer.from(svg)).resize(w, h).png().toBuffer()
  fs.writeFileSync(path.join(dir, name), buf)
  console.log(`✓ assets/${name}  (${w}×${h}, ${(buf.length / 1024).toFixed(1)} KB)`)
}

;(async () => {
  await render('icon.png', iconSvg, 1024, 1024)
  await render('adaptive-icon.png', adaptiveSvg, 1024, 1024)
  await render('splash.png', splashSvg, 1284, 2778)
  await render('notification-icon.png', notificationSvg, 96, 96)
  await render('logo.png', logoSvg, 996, 216)
  console.log('\nAll brand assets generated (blue "Clarity" theme).')
})()
