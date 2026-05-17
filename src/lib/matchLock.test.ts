import { describe, expect, it } from 'vitest'
import { canEditPrediction, PREDICTION_LOCK_MS } from './matchLock'

describe('canEditPrediction', () => {
  const kickoff = '2026-06-15T19:00:00.000Z'
  const kickoffMs = Date.parse(kickoff)

  it('allows edit more than 24h before kickoff', () => {
    expect(canEditPrediction(kickoff, kickoffMs - PREDICTION_LOCK_MS - 1)).toBe(true)
  })

  it('blocks edit exactly 24h before kickoff', () => {
    expect(canEditPrediction(kickoff, kickoffMs - PREDICTION_LOCK_MS)).toBe(false)
  })

  it('blocks edit less than 24h before kickoff', () => {
    expect(canEditPrediction(kickoff, kickoffMs - 1)).toBe(false)
  })

  it('returns false for invalid date', () => {
    expect(canEditPrediction('not-a-date')).toBe(false)
  })
})
