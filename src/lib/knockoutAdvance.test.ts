import { describe, expect, it } from 'vitest'
import {
  getKnockoutAdvancingTeam,
  getKnockoutValidationError,
  getKnockoutWinner,
} from './knockoutAdvance'
import type { Match, Prediction } from '../types'

const koMatch = (overrides: Partial<Match> = {}): Match => ({
  id: 'm1',
  team_a: 'Brasil',
  team_b: 'Argentina',
  match_date: '2026-07-01T00:00:00.000Z',
  group_name: null,
  stage: 'qf',
  venue: null,
  match_number: 89,
  home_slot: 'W73',
  away_slot: 'W74',
  ...overrides,
})

const pred = (scoreA: number, scoreB: number, advance: Prediction['advance_side'] = null): Prediction => ({
  id: 'p1',
  user_id: 'u1',
  match_id: 'm1',
  score_a: scoreA,
  score_b: scoreB,
  advance_side: advance,
  created_at: '',
})

describe('knockoutAdvance', () => {
  const slots = new Map<string, string>([
    ['W73', 'Brasil'],
    ['W74', 'Argentina'],
  ])

  it('picks winner from score when not a draw', () => {
    expect(getKnockoutAdvancingTeam(koMatch(), pred(2, 1), slots)).toBe('Brasil')
    expect(getKnockoutAdvancingTeam(koMatch(), pred(0, 1), slots)).toBe('Argentina')
  })

  it('picks winner from advance_side on draw', () => {
    expect(getKnockoutAdvancingTeam(koMatch(), pred(1, 1, 'a'), slots)).toBe('Brasil')
    expect(getKnockoutAdvancingTeam(koMatch(), pred(2, 2, 'b'), slots)).toBe('Argentina')
  })

  it('returns null on draw without advance_side', () => {
    expect(getKnockoutAdvancingTeam(koMatch(), pred(0, 0), slots)).toBeNull()
    expect(getKnockoutWinner(koMatch(), pred(1, 1), slots)).toBeNull()
  })

  it('validates knockout saves', () => {
    expect(getKnockoutValidationError(1, 1, null)).toBe('error.knockoutAdvanceRequired')
    expect(getKnockoutValidationError(1, 1, 'a')).toBeNull()
    expect(getKnockoutValidationError(2, 0, null)).toBeNull()
  })
})
