import { describe, expect, it } from 'vitest'
import { fifaRankingIndex } from '../data/wc2026-fifa-ranking'
import {
  compareThirdPlaceFifa,
  rankGroupStandings,
  type GroupMatchResult,
} from './standingsRank'
import type { TeamStanding } from './standings'

const standing = (
  slot: string,
  team: string,
  points: number,
  goalsFor: number,
  goalsAgainst: number,
): TeamStanding => ({
  slot,
  team,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor,
  goalsAgainst,
  goalDiff: goalsFor - goalsAgainst,
  points,
})

describe('rankGroupStandings', () => {
  it('ranks by total points first', () => {
    const teams = [
      standing('A1', 'Alpha', 3, 2, 0),
      standing('A2', 'Beta', 1, 1, 1),
    ]
    const ranked = rankGroupStandings(teams, [])
    expect(ranked[0]!.team).toBe('Alpha')
  })

  it('uses head-to-head before overall goal difference when two teams are tied on points', () => {
    const teams = [
      standing('A1', 'México', 3, 5, 1),
      standing('A2', 'Sudáfrica', 3, 2, 2),
    ]
    const matches: GroupMatchResult[] = [
      { homeSlot: 'A2', awaySlot: 'A1', homeGoals: 1, awayGoals: 0 },
    ]
    const ranked = rankGroupStandings(teams, matches)
    expect(ranked[0]!.team).toBe('Sudáfrica')
    expect(ranked[1]!.team).toBe('México')
  })

  it('resolves a three-team tie on head-to-head mini-league stats', () => {
    const teams = [
      standing('A1', 'México', 3, 3, 1),
      standing('A2', 'Sudáfrica', 3, 2, 3),
      standing('A3', 'Corea del Sur', 3, 1, 2),
    ]
    const matches: GroupMatchResult[] = [
      { homeSlot: 'A1', awaySlot: 'A2', homeGoals: 3, awayGoals: 0 },
      { homeSlot: 'A2', awaySlot: 'A3', homeGoals: 2, awayGoals: 0 },
      { homeSlot: 'A3', awaySlot: 'A1', homeGoals: 1, awayGoals: 0 },
    ]
    const ranked = rankGroupStandings(teams, matches)
    expect(ranked.map((t) => t.team)).toEqual(['México', 'Sudáfrica', 'Corea del Sur'])
  })

  it('falls back to overall goal difference when head-to-head does not separate teams', () => {
    const teams = [
      standing('A1', 'México', 4, 4, 2),
      standing('A2', 'Sudáfrica', 4, 2, 2),
      standing('A3', 'Corea del Sur', 4, 2, 2),
      standing('A4', 'Chequia', 1, 1, 3),
    ]
    const matches: GroupMatchResult[] = [
      { homeSlot: 'A1', awaySlot: 'A2', homeGoals: 1, awayGoals: 1 },
      { homeSlot: 'A2', awaySlot: 'A3', homeGoals: 1, awayGoals: 1 },
      { homeSlot: 'A3', awaySlot: 'A1', homeGoals: 1, awayGoals: 1 },
      { homeSlot: 'A1', awaySlot: 'A4', homeGoals: 2, awayGoals: 0 },
      { homeSlot: 'A2', awaySlot: 'A4', homeGoals: 0, awayGoals: 1 },
      { homeSlot: 'A3', awaySlot: 'A4', homeGoals: 0, awayGoals: 0 },
    ]
    const ranked = rankGroupStandings(teams, matches)
    expect(ranked[0]!.team).toBe('México')
    expect(ranked.slice(1, 3).map((t) => t.team).sort()).toEqual(['Corea del Sur', 'Sudáfrica'])
  })
})

describe('compareThirdPlaceFifa', () => {
  it('uses FIFA ranking when stats are equal', () => {
    const a = { team: 'Francia', points: 4, goalDiff: 2, goalsFor: 5 }
    const b = { team: 'Curaçao', points: 4, goalDiff: 2, goalsFor: 5 }
    expect(compareThirdPlaceFifa(a, b)).toBeLessThan(0)
    expect(fifaRankingIndex('Francia')).toBeLessThan(fifaRankingIndex('Curaçao'))
  })
})
