import { fifaRankingIndex } from '../data/wc2026-fifa-ranking'
import type { GroupMatchResult, MiniStanding, TeamStanding } from '../types'

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

/** Draw slot order (B1 before B4) — used when no group match is predicted yet. */
const slotDrawOrder = (slot: string): number => {
  const m = /^([A-L])([1-4])$/.exec(slot)
  if (!m) return 999
  return (m[1]!.charCodeAt(0) - 65) * 10 + Number(m[2])
}

const allYetToPlay = (teams: TeamStanding[]): boolean => teams.every((t) => t.played === 0)

/**
 * FIFA ranking (g/h) only after at least one group result exists.
 * With 0 pts and 0 played for everyone, keep official draw order (slot 1–4).
 */
const compareFinalTiebreak = (a: TeamStanding, b: TeamStanding, pool: TeamStanding[]): number => {
  if (allYetToPlay(pool)) return slotDrawOrder(a.slot) - slotDrawOrder(b.slot)
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
      result.push(...[...bucket].sort((a, b) => compareFinalTiebreak(a, b, bucket)))
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
    return compareFinalTiebreak(a, b, teams)
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
