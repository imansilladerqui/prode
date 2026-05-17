/** Draw oficial Mundial 2026 — 12 grupos × 4 equipos (slots 1–4 por grupo). */
export const WC2026_GROUPS = {
  A: ['México', 'Sudáfrica', 'Corea del Sur', 'Chequia'],
  B: ['Canadá', 'Bosnia y Herzegovina', 'Qatar', 'Suiza'],
  C: ['Brasil', 'Marruecos', 'Haití', 'Escocia'],
  D: ['Estados Unidos', 'Paraguay', 'Australia', 'Turquía'],
  E: ['Alemania', 'Curaçao', 'Costa de Marfil', 'Ecuador'],
  F: ['Países Bajos', 'Japón', 'Suecia', 'Túnez'],
  G: ['Bélgica', 'Egipto', 'Irán', 'Nueva Zelanda'],
  H: ['España', 'Cabo Verde', 'Arabia Saudita', 'Uruguay'],
  I: ['Francia', 'Senegal', 'Irak', 'Noruega'],
  J: ['Argentina', 'Argelia', 'Austria', 'Jordania'],
  K: ['Portugal', 'Rep. Dem. del Congo', 'Uzbekistán', 'Colombia'],
  L: ['Inglaterra', 'Croacia', 'Ghana', 'Panamá'],
} as const

export type GroupLetter = keyof typeof WC2026_GROUPS

export const GROUP_LETTERS = Object.keys(WC2026_GROUPS) as GroupLetter[]

export const teamFromSlot = (slot: string): string | null => {
  const m = /^([A-L])([1-4])$/.exec(slot)
  if (!m) return null
  const g = m[1] as GroupLetter
  const idx = Number(m[2]) - 1
  return WC2026_GROUPS[g][idx] ?? null
}

export const slotFromTeam = (group: GroupLetter, teamName: string): string | null => {
  const teams = WC2026_GROUPS[group] as readonly string[]
  const idx = teams.indexOf(teamName)
  if (idx < 0) return null
  return `${group}${idx + 1}`
}
