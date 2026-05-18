import { describe, expect, it } from 'vitest'
import { computeGroupStandings } from './standings'
import type { Match, Prediction } from '../types'

const groupMatch = (
  id: string,
  home: string,
  away: string,
  teamA: string,
  teamB: string,
): Match => ({
  id,
  team_a: teamA,
  team_b: teamB,
  match_date: '2026-06-11T19:00:00Z',
  group_name: 'Grupo A',
  stage: 'group',
  venue: 'Test',
  match_number: 1,
  home_slot: home,
  away_slot: away,
})

describe('computeGroupStandings', () => {
  it('orders by points when teams are not tied', () => {
    const matches: Match[] = [
      groupMatch('1', 'A1', 'A2', 'México', 'Sudáfrica'),
      groupMatch('2', 'A3', 'A4', 'Corea del Sur', 'Chequia'),
    ]
    const preds = new Map<string, Prediction>([
      ['1', { id: 'p1', user_id: 'u', match_id: '1', score_a: 2, score_b: 0, advance_side: null, created_at: '' }],
      ['2', { id: 'p2', user_id: 'u', match_id: '2', score_a: 1, score_b: 1, advance_side: null, created_at: '' }],
    ])
    const table = computeGroupStandings('A', matches, preds)
    expect(table[0]!.team).toBe('México')
    expect(table[0]!.points).toBe(3)
    expect(table[1]!.points).toBe(1)
  })

  it('prefers head-to-head over overall goal difference when two teams tie on points', () => {
    const matches: Match[] = [
      groupMatch('1', 'A2', 'A1', 'Sudáfrica', 'México'),
      groupMatch('2', 'A1', 'A3', 'México', 'Corea del Sur'),
    ]
    const preds = new Map<string, Prediction>([
      ['1', { id: 'p1', user_id: 'u', match_id: '1', score_a: 1, score_b: 0, advance_side: null, created_at: '' }],
      ['2', { id: 'p2', user_id: 'u', match_id: '2', score_a: 5, score_b: 0, advance_side: null, created_at: '' }],
    ])
    const table = computeGroupStandings('A', matches, preds)
    const mexico = table.find((r) => r.team === 'México')!
    const southAfrica = table.find((r) => r.team === 'Sudáfrica')!
    expect(mexico.points).toBe(3)
    expect(southAfrica.points).toBe(3)
    expect(mexico.goalDiff).toBeGreaterThan(southAfrica.goalDiff)
    const firstOfTied = table.filter((r) => r.points === 3)[0]!
    expect(firstOfTied.team).toBe('Sudáfrica')
  })
})
