import { useCallback, useMemo, useState } from 'react'
import type { Match, Prediction } from '../types'
import { buildOrderedMatchIds } from '../utils/helpers'

export const useMatchQueue = (matches: Match[], predictions: Map<string, Prediction>) => {
  const orderedIds = useMemo(
    () => buildOrderedMatchIds(matches, predictions),
    [matches, predictions],
  )

  const [currentIndex, setCurrentIndex] = useState(0)

  const safeIndex =
    orderedIds.length === 0 ? 0 : Math.min(currentIndex, orderedIds.length - 1)

  const currentMatchId = orderedIds[safeIndex] ?? null
  const total = orderedIds.length
  const predictedCount = matches.filter((m) => predictions.has(m.id)).length
  const pendingCount = total - predictedCount

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, Math.max(0, orderedIds.length - 1)))
  }, [orderedIds.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  const jumpToStageOrGroup = useCallback(
    (key: string) => {
      const idx = orderedIds.findIndex((id) => {
        const m = matches.find((x) => x.id === id)
        if (!m) return false
        if (key.startsWith('Grupo ')) return m.group_name === key
        return m.stage === key
      })
      if (idx >= 0) setCurrentIndex(idx)
    },
    [orderedIds, matches],
  )

  return {
    orderedIds,
    currentIndex: safeIndex,
    currentMatchId,
    total,
    predictedCount,
    pendingCount,
    goNext,
    goPrev,
    jumpToStageOrGroup,
    setCurrentIndex,
  }
}
