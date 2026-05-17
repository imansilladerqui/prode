import { WC2026_GROUPS } from './wc2026-groups'

/** ISO codes (lowercase filenames in public/flags) — keys match Spanish team names in WC2026_GROUPS. */
export const TEAM_FLAG_CODES: Record<string, string> = {
  México: 'mx',
  Sudáfrica: 'za',
  'Corea del Sur': 'kr',
  Chequia: 'cz',
  Canadá: 'ca',
  'Bosnia y Herzegovina': 'ba',
  Qatar: 'qa',
  Suiza: 'ch',
  Brasil: 'br',
  Marruecos: 'ma',
  Haití: 'ht',
  Escocia: 'gb-sct',
  'Estados Unidos': 'us',
  Paraguay: 'py',
  Australia: 'au',
  Turquía: 'tr',
  Alemania: 'de',
  Curaçao: 'cw',
  'Costa de Marfil': 'ci',
  Ecuador: 'ec',
  'Países Bajos': 'nl',
  Japón: 'jp',
  Suecia: 'se',
  Túnez: 'tn',
  Bélgica: 'be',
  Egipto: 'eg',
  Irán: 'ir',
  'Nueva Zelanda': 'nz',
  España: 'es',
  'Cabo Verde': 'cv',
  'Arabia Saudita': 'sa',
  Uruguay: 'uy',
  Francia: 'fr',
  Senegal: 'sn',
  Irak: 'iq',
  Noruega: 'no',
  Argentina: 'ar',
  Argelia: 'dz',
  Austria: 'at',
  Jordania: 'jo',
  Portugal: 'pt',
  'Rep. Dem. del Congo': 'cd',
  Uzbekistán: 'uz',
  Colombia: 'co',
  Inglaterra: 'gb-eng',
  Croacia: 'hr',
  Ghana: 'gh',
  Panamá: 'pa',
}

const allTeams = Object.values(WC2026_GROUPS).flat()
for (const team of allTeams) {
  if (!TEAM_FLAG_CODES[team]) {
    throw new Error(`Missing flag code for team: ${team}`)
  }
}
