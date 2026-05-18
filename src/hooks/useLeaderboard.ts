import { useEffect, useState } from 'react'
import { fetchLeaderboard } from '../lib/api'
import { useI18n } from '../i18n/useI18n'
import type { LeaderboardRow } from '../types'

export const useLeaderboard = (active: boolean) => {
  const { t, locale } = useI18n()
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!active) return
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchLeaderboard()
        if (!cancelled) setRows(data)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t('ranking.loadError'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [active, locale, t])

  return { rows, loading, error, t }
}
