import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pngPath = join(root, 'public/wc2026-loader.png')
const outPath = join(root, 'src/assets/wc2026-loader.lottie.json')

const png = readFileSync(pngPath)
const base64 = png.toString('base64')
const w = 663
const h = 1024
const fr = 60
const op = 120
const cx = w / 2
const cy = h / 2

const easeInOut = {
  i: { x: [0.42], y: [1] },
  o: { x: [0.58], y: [0] },
}

const animation = {
  v: '5.7.4',
  fr,
  ip: 0,
  op,
  w,
  h,
  nm: 'WC2026 Loader',
  ddd: 0,
  assets: [
    {
      id: 'image_0',
      w,
      h,
      u: '',
      p: `data:image/png;base64,${base64}`,
      e: 1,
    },
  ],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 2,
      nm: 'Logo',
      refId: 'image_0',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [cx, cy, 0] },
        a: { a: 0, k: [cx, cy, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], ...easeInOut },
            { t: 60, s: [104, 104, 100], ...easeInOut },
            { t: 120, s: [100, 100, 100] },
          ],
        },
      },
      ip: 0,
      op,
      st: 0,
    },
  ],
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(animation))
console.log(`Wrote ${outPath} (${(JSON.stringify(animation).length / 1024).toFixed(1)} KB)`)
