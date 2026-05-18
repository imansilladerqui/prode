import type { Outcome } from '../types'

export const getOutcome = (a: number, b: number): Outcome =>
  a > b ? 'A' : b > a ? 'B' : 'draw'

export const computePoints = (
  pred: { score_a: number; score_b: number },
  result: { score_a: number; score_b: number },
): 0 | 1 | 3 => {
  if (pred.score_a === result.score_a && pred.score_b === result.score_b) return 3
  if (getOutcome(pred.score_a, pred.score_b) === getOutcome(result.score_a, result.score_b)) return 1
  return 0
}
