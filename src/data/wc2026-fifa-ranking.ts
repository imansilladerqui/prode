/**
 * FIFA/Coca-Cola Men's World Ranking snapshot for tiebreakers (Article 13 g/h, e/f).
 * Lower index = better rank. Update when FIFA publishes a new edition before the tournament.
 * Source: FIFA ranking (April 2026 edition — approximate order for participating nations).
 */
export const FIFA_RANKING_PUBLICATION = '2026-04-01'

/** Best rank first; teams not listed sort after all listed (index = length). */
export const FIFA_RANKING_ORDER: readonly string[] = [
  'Francia',
  'Argentina',
  'España',
  'Inglaterra',
  'Brasil',
  'Portugal',
  'Países Bajos',
  'Bélgica',
  'Alemania',
  'Croacia',
  'Marruecos',
  'Colombia',
  'Uruguay',
  'Suiza',
  'Estados Unidos',
  'México',
  'Japón',
  'Senegal',
  'Irán',
  'Corea del Sur',
  'Australia',
  'Austria',
  'Noruega',
  'Escocia',
  'Ecuador',
  'Egipto',
  'Túnez',
  'Argelia',
  'Arabia Saudita',
  'Paraguay',
  'Turquía',
  'Chequia',
  'Canadá',
  'Qatar',
  'Bosnia y Herzegovina',
  'Sudáfrica',
  'Ghana',
  'Panamá',
  'Costa de Marfil',
  'Rep. Dem. del Congo',
  'Uzbekistán',
  'Jordania',
  'Irak',
  'Nueva Zelanda',
  'Haití',
  'Cabo Verde',
  'Curaçao',
  'Suecia',
] as const

const rankIndex = new Map<string, number>(
  FIFA_RANKING_ORDER.map((team, i) => [team, i]),
)

/** Lower = better FIFA rank; unknown teams share worst tier. */
export const fifaRankingIndex = (team: string): number =>
  rankIndex.get(team) ?? FIFA_RANKING_ORDER.length
