import type { GroupLetter } from '../data/wc2026-groups'
import { GROUP_LETTERS, WC2026_GROUPS } from '../data/wc2026-groups'
import type { Match, Prediction } from '../types/database'

export type TeamStanding = {
  slot: string
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

const emptyStanding = (group: GroupLetter, index: number): TeamStanding => ({
  slot: `${group}${index + 1}`,
  team: WC2026_GROUPS[group][index],
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDiff: 0,
  points: 0,
})

const compareStandings = (a: TeamStanding, b: TeamStanding): number => {
  if (b.points !== a.points) return b.points - a.points
  if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
  return a.team.localeCompare(b.team)
}

export const computeGroupStandings = (
  group: GroupLetter,
  matches: Match[],
  predictions: Map<string, Prediction>,
): TeamStanding[] => {
  const table = new Map<string, TeamStanding>()
  GROUP_LETTERS.forEach((g) => {
    if (g === group) {
      WC2026_GROUPS[g].forEach((_, i) => {
        table.set(`${g}${i + 1}`, emptyStanding(g, i))
      })
    }
  })

  const groupMatches = matches.filter((m) => m.stage === 'group' && m.group_name === `Grupo ${group}`)

  for (const m of groupMatches) {
    const pred = predictions.get(m.id)
    if (!pred) continue

    const home = table.get(m.home_slot)
    const away = table.get(m.away_slot)
    if (!home || !away) continue

    const ga = pred.score_a
    const gb = pred.score_b

    home.played += 1
    away.played += 1
    home.goalsFor += ga
    home.goalsAgainst += gb
    away.goalsFor += gb
    away.goalsAgainst += ga

    if (ga > gb) {
      home.won += 1
      home.points += 3
      away.lost += 1
    } else if (ga < gb) {
      away.won += 1
      away.points += 3
      home.lost += 1
    } else {
      home.drawn += 1
      away.drawn += 1
      home.points += 1
      away.points += 1
    }
  }

  return [...table.values()]
    .map((t) => ({ ...t, goalDiff: t.goalsFor - t.goalsAgainst }))
    .sort(compareStandings)
}

export const computeAllGroupStandings = (
  matches: Match[],
  predictions: Map<string, Prediction>,
): Record<GroupLetter, TeamStanding[]> => {
  const out = {} as Record<GroupLetter, TeamStanding[]>
  for (const g of GROUP_LETTERS) {
    out[g] = computeGroupStandings(g, matches, predictions)
  }
  return out
}

export const countGroupMatchesPredicted = (
  group: GroupLetter,
  matches: Match[],
  predictions: Map<string, Prediction>,
): { done: number; total: number } => {
  const groupMatches = matches.filter((m) => m.stage === 'group' && m.group_name === `Grupo ${group}`)
  const done = groupMatches.filter((m) => predictions.has(m.id)).length
  return { done, total: groupMatches.length }
}

export const allGroupMatchesPredicted = (matches: Match[], predictions: Map<string, Prediction>): boolean => {
  const groupMatches = matches.filter((m) => m.stage === 'group')
  return groupMatches.length > 0 && groupMatches.every((m) => predictions.has(m.id))
}
