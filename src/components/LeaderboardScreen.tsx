import { useLeaderboard } from '../hooks/useLeaderboard'
import type { LeaderboardScreenProps } from '../types'
import { leaderboardMedalForPosition } from '../utils/helpers'

export const LeaderboardScreen = ({ playerId, active }: LeaderboardScreenProps) => {
  const { rows, loading, error, t } = useLeaderboard(active)

  if (loading) return null

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
                <td>{leaderboardMedalForPosition(pos) ?? pos}</td>
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
