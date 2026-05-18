import { describe, expect, it } from 'vitest'
import type { Match, MatchResult, Prediction } from '../types'
import {
  buildOrderedMatchIds,
  draftScoreFromResult,
  groupLetterFromMatch,
  leaderboardMedalForPosition,
  resolvedMatchesById,
} from './helpers'

const match = (overrides: Partial<Match> = {}): Match => ({
  id: 'm1',
  team_a: 'A',
  team_b: 'B',
  match_date: '2026-06-01T18:00:00Z',
  group_name: 'Grupo A',
  stage: 'group',
  venue: null,
  match_number: 1,
  home_slot: 'A1',
  away_slot: 'A2',
  ...overrides,
})

describe('leaderboardMedalForPosition', () => {
  it('returns medals for top three', () => {
    expect(leaderboardMedalForPosition(1)).toBe('🥇')
    expect(leaderboardMedalForPosition(2)).toBe('🥈')
    expect(leaderboardMedalForPosition(3)).toBe('🥉')
  })

  it('returns null for other positions', () => {
    expect(leaderboardMedalForPosition(4)).toBeNull()
    expect(leaderboardMedalForPosition(0)).toBeNull()
  })
})

describe('groupLetterFromMatch', () => {
  it('parses Grupo A', () => {
    expect(groupLetterFromMatch(match())).toBe('A')
  })

  it('returns null for invalid or missing group', () => {
    expect(groupLetterFromMatch(undefined)).toBeNull()
    expect(groupLetterFromMatch(match({ group_name: null }))).toBeNull()
    expect(groupLetterFromMatch(match({ group_name: 'Grupo Z' }))).toBeNull()
    expect(groupLetterFromMatch(match({ group_name: 'Grupo AB' }))).toBeNull()
  })
})

describe('draftScoreFromResult', () => {
  it('returns empty draft when result is undefined', () => {
    expect(draftScoreFromResult(undefined)).toEqual({ a: '', b: '', advanceSide: null })
  })

  it('maps result scores to draft strings', () => {
    const result: MatchResult = {
      match_id: 'm1',
      score_a: 2,
      score_b: 1,
      advance_side: null,
      entered_at: '2026-01-01',
    }
    expect(draftScoreFromResult(result)).toEqual({
      a: '2',
      b: '1',
      advanceSide: null,
    })
  })
})

describe('resolvedMatchesById', () => {
  it('indexes resolved matches by id', () => {
    const map = resolvedMatchesById([
      {
        ...match(),
        id: 'a',
        resolvedTeamA: 'X',
        resolvedTeamB: 'Y',
        slotsResolved: true,
      },
    ])
    expect(map.get('a')?.resolvedTeamA).toBe('X')
  })
})

describe('buildOrderedMatchIds', () => {
  it('puts pending matches before predicted ones', () => {
    const matches: Match[] = [
      match({ id: 'done', match_number: 1 }),
      match({ id: 'pending', match_number: 2 }),
    ]
    const predictions = new Map<string, Prediction>([
      [
        'done',
        {
          id: 'p1',
          user_id: 'u1',
          match_id: 'done',
          score_a: 1,
          score_b: 0,
          advance_side: null,
          created_at: '',
        },
      ],
    ])
    expect(buildOrderedMatchIds(matches, predictions)).toEqual(['pending', 'done'])
  })
})
