import { describe, expect, it } from 'vitest'
import {
  getMostCommonPrediction,
  removeFromCommunityPredictions,
  replaceInCommunityPredictions,
} from './commonResult'

describe('removeFromCommunityPredictions', () => {
  const all = [
    { match_id: 'm1', score_a: 2, score_b: 1 },
    { match_id: 'm1', score_a: 2, score_b: 1 },
    { match_id: 'm1', score_a: 0, score_b: 0 },
  ]

  it('removes one matching entry', () => {
    const next = removeFromCommunityPredictions(all, 'm1', 2, 1)
    expect(next).toHaveLength(2)
    expect(next.filter((p) => p.score_a === 2 && p.score_b === 1)).toHaveLength(1)
  })

  it('leaves list unchanged when no match', () => {
    expect(removeFromCommunityPredictions(all, 'm1', 9, 9)).toEqual(all)
  })
})

describe('getMostCommonPrediction after reset', () => {
  it('recalculates when one vote is removed', () => {
    const all = [
      { match_id: 'm1', score_a: 2, score_b: 1 },
      { match_id: 'm1', score_a: 2, score_b: 1 },
      { match_id: 'm1', score_a: 2, score_b: 1 },
    ]
    const afterReset = removeFromCommunityPredictions(all, 'm1', 2, 1)
    expect(getMostCommonPrediction(afterReset, 'm1')).toEqual({
      scoreA: 2,
      scoreB: 1,
      count: 2,
      source: 'community',
    })
  })

  it('returns null when last vote for a match is removed', () => {
    const all = [{ match_id: 'm1', score_a: 1, score_b: 0 }]
    const afterReset = removeFromCommunityPredictions(all, 'm1', 1, 0)
    expect(getMostCommonPrediction(afterReset, 'm1')).toBeNull()
  })
})

describe('replaceInCommunityPredictions', () => {
  it('swaps previous score for new score', () => {
    const all = [
      { match_id: 'm1', score_a: 3, score_b: 0 },
      { match_id: 'm1', score_a: 2, score_b: 1 },
    ]
    const previous = { match_id: 'm1', score_a: 2, score_b: 1 }
    const next = replaceInCommunityPredictions(all, 'm1', previous, 3, 0)
    expect(getMostCommonPrediction(next, 'm1')).toEqual({
      scoreA: 3,
      scoreB: 0,
      count: 2,
      source: 'community',
    })
  })
})
