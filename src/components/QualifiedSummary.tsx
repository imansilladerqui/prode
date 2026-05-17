import { useI18n } from '../i18n/useI18n'
import { TeamFlag } from './TeamFlag'

type Props = {
  teams: string[]
  complete: boolean
  groupMatchesDone: number
  groupMatchesTotal: number
}

export const QualifiedSummary = ({
  teams,
  complete,
  groupMatchesDone,
  groupMatchesTotal,
}: Props) => {
  const { t } = useI18n()

  return (
    <section className="qualified-banner card">
      <h2>{t('qualified.title')}</h2>
      {!complete ? (
        <p className="muted">
          {t('qualified.incomplete', {
            done: groupMatchesDone,
            total: groupMatchesTotal,
          })}
        </p>
      ) : (
        <>
          <p className="qualified-count">{t('qualified.complete')}</p>
          <ul className="qualified-list">
            {teams.map((team) => (
              <li key={team}>
                <TeamFlag teamName={team} flagSize={18} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
