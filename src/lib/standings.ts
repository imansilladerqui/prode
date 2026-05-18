import { GROUP_LETTERS, WC2026_GROUPS } from '../data/wc2026-groups'
import type { GroupLetter, GroupMatchResult, TeamStanding } from '../types'
import type { Match, Prediction } from '../types'
import { rankGroupStandings } from './standingsRank'

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

const collectGroupMatchResults = (
  group: GroupLetter,
  matches: Match[],
  predictions: Map<string, Prediction>,
): GroupMatchResult[] => {
  const groupMatches = matches.filter((m) => m.stage === 'group' && m.group_name === `Grupo ${group}`)
  const results: GroupMatchResult[] = []

  for (const m of groupMatches) {
    const pred = predictions.get(m.id)
    if (!pred) continue
    results.push({
      homeSlot: m.home_slot,
      awaySlot: m.away_slot,
      homeGoals: pred.score_a,
      awayGoals: pred.score_b,
    })
  }
  return results
}

export const computeGroupStandings = (
  group: GroupLetter,
  matches: Match[],
  predictions: Map<string, Prediction>,
): TeamStanding[] => {
  const table = new Map<string, TeamStanding>()
  WC2026_GROUPS[group].forEach((_, i) => {
    table.set(`${group}${i + 1}`, emptyStanding(group, i))
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

  const standings = [...table.values()].map((t) => ({
    ...t,
    goalDiff: t.goalsFor - t.goalsAgainst,
  }))

  const matchResults = collectGroupMatchResults(group, matches, predictions)
  return rankGroupStandings(standings, matchResults)
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
