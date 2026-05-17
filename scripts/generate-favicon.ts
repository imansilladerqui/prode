import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const faviconPath = join(root, 'public/favicon.svg')
const wcSvgPath = join(root, 'public/wc2026.svg')

// Square crop of the official WC26 mark (663×1024 PNG in public/wc2026-loader.png).
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="FIFA World Cup 2026">
  <image href="wc2026-loader.png" width="32" height="32" preserveAspectRatio="xMidYMid slice"/>
</svg>
`

writeFileSync(faviconPath, svg)
writeFileSync(wcSvgPath, svg)

// Verify source asset exists when run manually.
readFileSync(join(root, 'public/wc2026-loader.png'))
console.log(`Wrote ${faviconPath} and ${wcSvgPath}`)
