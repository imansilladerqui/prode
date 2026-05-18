import { useI18n } from '../i18n/useI18n'
import { isThirdInTopEight } from '../lib/tournamentState'
import type { GroupStandingsProps } from '../types'
import { TeamFlag } from './TeamFlag'

export const GroupStandings = ({ group, standings, topThirds, done, total }: GroupStandingsProps) => {
  const { t } = useI18n()

  return (
    <div className="standings-wrap">
      <div className="standings-header">
        <span>{t('standings.groupTable', { group })}</span>
        <span className="standings-progress">
          {t('standings.predictions', { done, total })}
        </span>
      </div>
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('standings.team')}</th>
            <th>{t('standings.played')}</th>
            <th>{t('standings.points')}</th>
            <th>{t('standings.goalsFor')}</th>
            <th>{t('standings.goalsAgainst')}</th>
            <th>{t('standings.goalDiff')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const pos = i + 1
            const qualifiesThird = pos === 3 && isThirdInTopEight(group, topThirds)
            const rowClass = [
              pos <= 2 && 'qualify-direct',
              qualifiesThird && 'qualify-third',
              pos === 3 && !qualifiesThird && 'out',
              pos === 4 && 'standings-row--fourth',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <tr key={row.slot} className={rowClass}>
                <td>{pos}</td>
                <td>
                  <TeamFlag teamName={row.team} flagSize={16} className="team-line--compact" />
                </td>
                <td>{row.played}</td>
                <td>{row.points}</td>
                <td>{row.goalsFor}</td>
                <td>{row.goalsAgainst}</td>
                <td>{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
