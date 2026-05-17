import { describe, expect, it } from 'vitest'
import { computeTournamentState } from './useTournamentState'
import type { Match, Prediction } from '../types/database'

const groupMatch = (id: string, n: number, group: string): Match => ({
  id,
  team_a: 'A',
  team_b: 'B',
  match_date: '2026-06-11T19:00:00Z',
  group_name: `Grupo ${group}`,
  stage: 'group',
  venue: null,
  match_number: n,
  home_slot: `${group}1`,
  away_slot: `${group}2`,
})

const r32ThirdSlot = (id: string, n: number, awaySlot: string): Match => ({
  id,
  team_a: '1º Grupo E',
  team_b: 'Mejor 3º',
  match_date: '2026-06-29T17:00:00Z',
  group_name: null,
  stage: 'r32',
  venue: null,
  match_number: n,
  home_slot: '1E',
  away_slot: awaySlot,
})

describe('computeTournamentState', () => {
  it('assigns third-place bracket slots before all group matches are predicted', () => {
    const matches: Match[] = [
      groupMatch('g1', 1, 'A'),
      groupMatch('g2', 2, 'B'),
      r32ThirdSlot('k74', 74, '3@74'),
    ]
    const predictions = new Map<string, Prediction>([
      [
        'g1',
        {
          id: 'p1',
          user_id: 'u',
          match_id: 'g1',
          score_a: 1,
          score_b: 0,
          advance_side: null,
          created_at: '',
        },
      ],
    ])

    const state = computeTournamentState(matches, predictions)

    expect(state.topThirds).toHaveLength(8)
    expect(state.slotMap.get('3@74')).toBeTruthy()
    const r32 = state.resolvedMatches.find((m) => m.match_number === 74)
    expect(r32?.slotsResolved).toBe(true)
  })
})
