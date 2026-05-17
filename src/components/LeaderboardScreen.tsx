import { useEffect, useState } from 'react'
import { Loader } from './Loader'
import { fetchLeaderboard } from '../lib/api'
import { useI18n } from '../i18n/useI18n'
import type { LeaderboardRow } from '../types/database'

type Props = {
  playerId: string
  active: boolean
}

const medal = (pos: number): string | null => {
  if (pos === 1) return '🥇'
  if (pos === 2) return '🥈'
  if (pos === 3) return '🥉'
  return null
}

export const LeaderboardScreen = ({ playerId, active }: Props) => {
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

  if (loading) {
    return (
      <div className="leaderboard-wrap leaderboard-wrap--loading">
        <Loader className="loader--on-surface" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="leaderboard-wrap">
        <p className="error">{error}</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="leaderboard-wrap leaderboard-empty">
        <p className="leaderboard-empty__message">{t('ranking.empty')}</p>
      </div>
    )
  }

  return (
    <div className="leaderboard-wrap">
      <div className="leaderboard-legend" role="note" aria-label={t('ranking.pointsLegendTitle')}>
        <p className="leaderboard-legend__title">{t('ranking.pointsLegendTitle')}</p>
        <ul className="leaderboard-legend__list">
          <li>
            <span className="leaderboard-legend__pts leaderboard-legend__pts--exact">3</span>
            <span>{t('ranking.pointsLegendExact')}</span>
          </li>
          <li>
            <span className="leaderboard-legend__pts leaderboard-legend__pts--winner">1</span>
            <span>{t('ranking.pointsLegendWinner')}</span>
          </li>
          <li>
            <span className="leaderboard-legend__pts leaderboard-legend__pts--miss">0</span>
            <span>{t('ranking.pointsLegendMiss')}</span>
          </li>
        </ul>
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">{t('ranking.player')}</th>
            <th scope="col">{t('ranking.points')}</th>
            <th scope="col">{t('ranking.exact')}</th>
            <th scope="col">{t('ranking.nonExact')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const pos = i + 1
            const isMe = row.user_id === playerId
            return (
              <tr key={row.user_id} className={isMe ? 'leaderboard-row--me' : undefined}>
                <td>{medal(pos) ?? pos}</td>
                <td>{row.user_name}</td>
                <td>{row.total_points}</td>
                <td>{row.exact_hits}</td>
                <td>{row.winner_hits}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
