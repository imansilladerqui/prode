export const PREDICTION_LOCK_MS = 24 * 60 * 60 * 1000

export const canEditPrediction = (matchDateIso: string, now = Date.now()): boolean => {
  const kickoff = Date.parse(matchDateIso)
  if (Number.isNaN(kickoff)) return false
  return kickoff - PREDICTION_LOCK_MS > now
}

