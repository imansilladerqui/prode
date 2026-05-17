import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { TEAM_FLAG_CODES } from '../src/data/team-flags'

const toFileCode = (code: string): string =>
  code.split('-').map((part) => part.toUpperCase()).join('-')

const srcBase = join(import.meta.dirname, '../node_modules/country-flag-icons/3x2')
const destBase = join(import.meta.dirname, '../public/flags')

mkdirSync(destBase, { recursive: true })

const seen = new Set<string>()
for (const code of Object.values(TEAM_FLAG_CODES)) {
  if (seen.has(code)) continue
  seen.add(code)
  const fileCode = toFileCode(code)
  const src = join(srcBase, `${fileCode}.svg`)
  const dest = join(destBase, `${code}.svg`)
  if (!existsSync(src)) throw new Error(`Flag SVG not found: ${src}`)
  copyFileSync(src, dest)
}

console.log(`Copied ${seen.size} flags to public/flags/`)
