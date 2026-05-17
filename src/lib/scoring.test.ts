import { describe, expect, it } from 'vitest'
import { computePoints, getOutcome } from './scoring'

describe('getOutcome', () => {
  it('detects winner and draw', () => {
    expect(getOutcome(2, 1)).toBe('A')
    expect(getOutcome(0, 3)).toBe('B')
    expect(getOutcome(1, 1)).toBe('draw')
  })
})

describe('computePoints', () => {
  it('awards 3 for exact score', () => {
    expect(computePoints({ score_a: 2, score_b: 1 }, { score_a: 2, score_b: 1 })).toBe(3)
  })

  it('awards 1 for correct winner', () => {
    expect(computePoints({ score_a: 2, score_b: 0 }, { score_a: 1, score_b: 0 })).toBe(1)
    expect(computePoints({ score_a: 1, score_b: 1 }, { score_a: 0, score_b: 0 })).toBe(1)
  })

  it('awards 0 for wrong winner', () => {
    expect(computePoints({ score_a: 2, score_b: 1 }, { score_a: 0, score_b: 1 })).toBe(0)
  })
})
