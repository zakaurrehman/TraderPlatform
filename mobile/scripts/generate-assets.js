/**
 * Generates placeholder PNG assets required by app.config.ts.
 * Uses only Node built-ins (zlib) — no extra dependencies needed.
 * Run: node scripts/generate-assets.js
 */
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

// ── CRC32 ────────────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  crcTable[n] = c
}
function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

// ── PNG helpers ───────────────────────────────────────────────────────────────
function chunk(type, data) {
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(td))
  return Buffer.concat([lenBuf, td, crcBuf])
}

function makePNG(w, h, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr.writeUInt8(8, 8) // bit depth
  ihdr.writeUInt8(2, 9) // color type: RGB

  // One filter byte (0x00 = None) + RGB per pixel, per row
  const stride = 1 + w * 3
  const raw = Buffer.alloc(stride * h)
  for (let y = 0; y < h; y++) {
    const base = y * stride
    // raw[base] = 0 already (filter = None)
    for (let x = 0; x < w; x++) {
      raw[base + 1 + x * 3] = r
      raw[base + 2 + x * 3] = g
      raw[base + 3 + x * 3] = b
    }
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Write files ───────────────────────────────────────────────────────────────
const dir = path.resolve(__dirname, '..', 'assets')
fs.mkdirSync(dir, { recursive: true })

const specs = [
  // [filename, w, h, R, G, B]
  ['icon.png',               1024, 1024, 245, 197,  24], // gold #f5c518
  ['adaptive-icon.png',      1024, 1024, 245, 197,  24], // gold
  ['splash.png',             1284, 2778,  10,  10,  15], // dark #0a0a0f
  ['notification-icon.png',    96,   96, 245, 197,  24], // gold
]

for (const [name, w, h, r, g, b] of specs) {
  const png = makePNG(w, h, r, g, b)
  fs.writeFileSync(path.join(dir, name), png)
  console.log(`✓ assets/${name}  (${w}×${h}, ${(png.length / 1024).toFixed(1)} KB)`)
}

console.log('\nAll placeholder assets generated. Replace with final artwork before store submission.')
