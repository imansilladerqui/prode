import { useMemo, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { canEditPrediction } from '../lib/matchLock'
import type { EditPredictionsFilter, Match, Prediction, ResolvedMatch } from '../types'
import { useResolvedMatchesById } from './useResolvedMatchesById'

export const useEditPredictionsList = (
  matches: Match[],
  resolvedMatches: ResolvedMatch[],
  predictions: Map<string, Prediction>,
) => {
  const { t, intlLocaleTag } = useI18n()
  const [filter, setFilter] = useState<EditPredictionsFilter>('editable')
  const resolvedById = useResolvedMatchesById(resolvedMatches)

  const savedMatches = useMemo(
    () =>
      [...matches]
        .filter((m) => predictions.has(m.id))
        .sort((a, b) => a.match_number - b.match_number),
    [matches, predictions],
  )

  const visible = useMemo(() => {
    if (filter === 'closed') {
      return savedMatches.filter((m) => !canEditPrediction(m.match_date))
    }
    return savedMatches.filter((m) => canEditPrediction(m.match_date))
  }, [savedMatches, filter])

  return { filter, setFilter, resolvedById, visible, t, intlLocaleTag }
}
