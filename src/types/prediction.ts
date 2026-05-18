import type { Prediction } from './database'

export type CommunityPrediction = Pick<Prediction, 'match_id' | 'score_a' | 'score_b'>

export type CommonPredictionResult = {
  scoreA: number
  scoreB: number
  count: number
  source: 'community'
}
