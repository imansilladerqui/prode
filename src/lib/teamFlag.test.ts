import { describe, expect, it } from 'vitest'
import { WC2026_GROUPS } from '../data/wc2026-groups'
import { TEAM_FLAG_CODES } from '../data/team-flags'
import { getTeamFlagCode, teamFlagSrc } from './teamFlag'

describe('team flags', () => {
  it('maps all 48 World Cup teams', () => {
    const teams = Object.values(WC2026_GROUPS).flat()
    expect(teams).toHaveLength(48)
    for (const team of teams) {
      expect(TEAM_FLAG_CODES[team], team).toBeTruthy()
      expect(getTeamFlagCode(team)).toBe(TEAM_FLAG_CODES[team])
    }
  })

  it('returns null for unknown team', () => {
    expect(getTeamFlagCode('Equipo Inventado')).toBeNull()
  })

  it('builds local flag path', () => {
    expect(teamFlagSrc('mx')).toContain('flags/mx.svg')
    expect(teamFlagSrc('gb-eng')).toContain('flags/gb-eng.svg')
  })
})
