import { useMemo } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { Match, Prediction } from '../types'

export const useNavPendingCounts = (
  matches: Match[],
  predictions: Map<string, Prediction>,
) => {
  const { t } = useI18n()

  const pendingByKey = useMemo(() => {
    const counts = new Map<string, number>()
    for (const m of matches) {
      if (predictions.has(m.id)) continue
      const key = m.stage === 'group' && m.group_name ? m.group_name : m.stage
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [matches, predictions])

  return { pendingByKey, t }
}
