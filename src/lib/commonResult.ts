import type { Prediction } from '../types/database'

export type CommonPredictionResult = {
  scoreA: number
  scoreB: number
  count: number
  source: 'community'
}

export const getMostCommonPrediction = (
  allPredictions: Pick<Prediction, 'match_id' | 'score_a' | 'score_b'>[],
  matchId: string,
): CommonPredictionResult | null => {
  const forMatch = allPredictions.filter((p) => p.match_id === matchId)
  if (forMatch.length === 0) return null

  const counts = new Map<string, { scoreA: number; scoreB: number; count: number }>()
  for (const p of forMatch) {
    const key = `${p.score_a}-${p.score_b}`
    const cur = counts.get(key) ?? { scoreA: p.score_a, scoreB: p.score_b, count: 0 }
    cur.count += 1
    counts.set(key, cur)
  }

  let best: { scoreA: number; scoreB: number; count: number } | null = null
  for (const v of counts.values()) {
    if (!best || v.count > best.count) best = v
    else if (v.count === best.count && v.scoreA + v.scoreB < best.scoreA + best.scoreB) best = v
  }

  if (!best) return null
  return { scoreA: best.scoreA, scoreB: best.scoreB, count: best.count, source: 'community' }
}
