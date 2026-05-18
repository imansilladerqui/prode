import type { CommunityPrediction, CommonPredictionResult } from '../types'

export const removeFromCommunityPredictions = (
  all: CommunityPrediction[],
  matchId: string,
  scoreA: number,
  scoreB: number,
): CommunityPrediction[] => {
  let removed = false
  return all.filter((p) => {
    if (removed) return true
    if (p.match_id === matchId && p.score_a === scoreA && p.score_b === scoreB) {
      removed = true
      return false
    }
    return true
  })
}

export const replaceInCommunityPredictions = (
  all: CommunityPrediction[],
  matchId: string,
  previous: CommunityPrediction | undefined,
  scoreA: number,
  scoreB: number,
): CommunityPrediction[] => {
  const withoutPrevious =
    previous != null
      ? removeFromCommunityPredictions(all, matchId, previous.score_a, previous.score_b)
      : all
  return [...withoutPrevious, { match_id: matchId, score_a: scoreA, score_b: scoreB }]
}

export const getMostCommonPrediction = (
  allPredictions: CommunityPrediction[],
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
