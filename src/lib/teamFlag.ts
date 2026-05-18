import { TEAM_FLAG_CODES } from '../data/team-flags'

export const getTeamFlagCode = (teamName: string): string | null =>
  TEAM_FLAG_CODES[teamName] ?? null

/** Local SVG in public/flags/. */
export const teamFlagSrc = (isoCode: string): string => {
  const base = import.meta.env.BASE_URL
  return `${base}flags/${isoCode.toLowerCase()}.svg`
}
