import { fifaRankingIndex } from '../data/wc2026-fifa-ranking'
import type { TeamStanding } from './standings'

export type GroupMatchResult = {
  homeSlot: string
  awaySlot: string
  homeGoals: number
  awayGoals: number
}

type MiniStanding = {
  points: number
  goalDiff: number
  goalsFor: number
}

const emptyMini = (): MiniStanding => ({ points: 0, goalDiff: 0, goalsFor: 0 })

const buildMiniStats = (
  slots: Set<string>,
  matches: GroupMatchResult[],
): Map<string, MiniStanding> => {
  const stats = new Map<string, MiniStanding>()
  for (const slot of slots) stats.set(slot, emptyMini())

  for (const m of matches) {
    if (!slots.has(m.homeSlot) || !slots.has(m.awaySlot)) continue
    const home = stats.get(m.homeSlot)!
    const away = stats.get(m.awaySlot)!
    const ga = m.homeGoals
    const gb = m.awayGoals

    home.goalsFor += ga
    away.goalsFor += gb
    home.goalDiff += ga - gb
    away.goalDiff += gb - ga

    if (ga > gb) {
      home.points += 3
    } else if (ga < gb) {
      away.points += 3
    } else {
      home.points += 1
      away.points += 1
    }
  }
  return stats
}

const compareMini = (a: MiniStanding, b: MiniStanding): number => {
  if (b.points !== a.points) return b.points - a.points
  if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
  return 0
}

const compareFifaRanking = (a: TeamStanding, b: TeamStanding): number =>
  fifaRankingIndex(a.team) - fifaRankingIndex(b.team)

/** Article 13 step 3 (g): most recent FIFA ranking; (h) uses same snapshot when only one edition is stored. */
const compareFifaRankingCascade = (a: TeamStanding, b: TeamStanding): number => {
  const diff = compareFifaRanking(a, b)
  if (diff !== 0) return diff
  return a.team.localeCompare(b.team)
}

const peelByCriterion = (
  teams: TeamStanding[],
  valueOf: (t: TeamStanding) => number,
  remainingCriteria: ((t: TeamStanding) => number)[],
): TeamStanding[] => {
  if (teams.length <= 1) return teams

  const sorted = [...teams].sort((a, b) => valueOf(b) - valueOf(a))
  const result: TeamStanding[] = []
  let i = 0

  while (i < sorted.length) {
    let j = i + 1
    const v = valueOf(sorted[i]!)
    while (j < sorted.length && valueOf(sorted[j]!) === v) j++
    const bucket = sorted.slice(i, j)

    if (bucket.length === 1) {
      result.push(bucket[0]!)
    } else if (remainingCriteria.length > 0) {
      const [next, ...rest] = remainingCriteria
      result.push(...peelByCriterion(bucket, next!, rest))
    } else {
      result.push(...[...bucket].sort(compareFifaRankingCascade))
    }
    i = j
  }
  return result
}

/** Article 13 step 2: overall group GD (d), goals for (e); fair play (f) omitted (no card data). */
const applyOverallTiebreakers = (teams: TeamStanding[]): TeamStanding[] =>
  peelByCriterion(teams, (t) => t.goalDiff, [(t) => t.goalsFor])

/**
 * Head-to-head ranking (Article 13 step 1 a–c) with recursive re-application to tied subsets.
 */
const rankByHeadToHead = (
  teams: TeamStanding[],
  matches: GroupMatchResult[],
): TeamStanding[] => {
  if (teams.length <= 1) return teams

  const slots = new Set(teams.map((t) => t.slot))
  const stats = buildMiniStats(slots, matches)

  const sorted = [...teams].sort((a, b) => {
    const cmp = compareMini(stats.get(a.slot)!, stats.get(b.slot)!)
    if (cmp !== 0) return cmp
    return compareFifaRankingCascade(a, b)
  })

  const groups: TeamStanding[][] = []
  for (const team of sorted) {
    const last = groups[groups.length - 1]
    if (last && compareMini(stats.get(last[0]!.slot)!, stats.get(team.slot)!) === 0) {
      last.push(team)
    } else {
      groups.push([team])
    }
  }

  const result: TeamStanding[] = []
  for (const group of groups) {
    if (group.length === 1) {
      result.push(group[0]!)
    } else if (group.length < teams.length) {
      result.push(...rankByHeadToHead(group, matches))
    } else {
      result.push(...applyOverallTiebreakers(group))
    }
  }
  return result
}

/** Rank teams in a group per FIFA Regulations Article 13 (group stage). */
export const rankGroupStandings = (
  standings: TeamStanding[],
  matches: GroupMatchResult[],
): TeamStanding[] => {
  const byPoints = new Map<number, TeamStanding[]>()
  for (const t of standings) {
    const list = byPoints.get(t.points) ?? []
    list.push(t)
    byPoints.set(t.points, list)
  }

  const pointTotals = [...byPoints.keys()].sort((a, b) => b - a)
  const ranked: TeamStanding[] = []

  for (const pts of pointTotals) {
    const bucket = byPoints.get(pts)!
    if (bucket.length === 1) {
      ranked.push(bucket[0]!)
    } else {
      ranked.push(...rankByHeadToHead(bucket, matches))
    }
  }
  return ranked
}

export const compareThirdPlaceFifa = (
  a: { team: string; points: number; goalDiff: number; goalsFor: number },
  b: { team: string; points: number; goalDiff: number; goalsFor: number },
): number => {
  if (b.points !== a.points) return b.points - a.points
  if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
  const rankDiff = fifaRankingIndex(a.team) - fifaRankingIndex(b.team)
  if (rankDiff !== 0) return rankDiff
  return a.team.localeCompare(b.team)
}
