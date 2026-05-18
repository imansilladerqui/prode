import { formatMatchDay, formatMatchTime } from '../lib/formatMatchDate'
import { useI18n } from '../i18n/useI18n'
import type { EditPredictionMobileCardProps } from '../types'
import { KnockoutAdvancePicker } from './KnockoutAdvancePicker'
import { TeamFlag } from './TeamFlag'

export const EditPredictionMobileCard = ({
  match,
  teamA,
  teamB,
  draft,
  locked,
  showPens,
  label,
  isBusy,
  isSaving,
  isDeleting,
  onDraftChange,
  onAdvanceSideChange,
  onSave,
  onDelete,
}: EditPredictionMobileCardProps) => {
  const { t, intlLocaleTag } = useI18n()

  return (
    <article
      role="listitem"
      className={locked ? 'edit-pred-card edit-pred-card--locked' : 'edit-pred-card'}
      aria-labelledby={`edit-pred-${match.id}-title`}
    >
      <header className="edit-pred-card__head">
        <div className="edit-pred-card__meta" id={`edit-pred-${match.id}-title`}>
          <span className="edit-pred-card__num">#{match.match_number}</span>
          <span className="edit-pred-card__stage">{label}</span>
        </div>
        <time className="edit-pred-card__when" dateTime={match.match_date}>
          <span className="edit-pred-card__day">{formatMatchDay(match.match_date, intlLocaleTag)}</span>
          <span className="edit-pred-card__clock">{formatMatchTime(match.match_date, intlLocaleTag)}</span>
          {locked && <span className="edit-pred-card__locked">{t('edit.locked')}</span>}
        </time>
      </header>

      <div className="edit-pred-card__body">
        <div className="edit-pred-card__teams">
          <div className="edit-pred-card__team">
            <TeamFlag teamName={teamA} flagSize={32} className="team-line--card" />
          </div>
          <span className="edit-pred-card__vs">vs</span>
          <div className="edit-pred-card__team">
            <TeamFlag teamName={teamB} flagSize={32} className="team-line--card" />
          </div>
        </div>

        <div className="edit-pred-card__score-panel">
          <div className="edit-pred-card__scores">
            <input
              type="text"
              inputMode="numeric"
              className="score-input"
              aria-label={teamA}
              value={draft.a}
              disabled={locked}
              readOnly={locked}
              onChange={(e) => onDraftChange(match.id, 'a', e.target.value)}
            />
            <span className="edit-pred-card__dash" aria-hidden>
              –
            </span>
            <input
              type="text"
              inputMode="numeric"
              className="score-input"
              aria-label={teamB}
              value={draft.b}
              disabled={locked}
              readOnly={locked}
              onChange={(e) => onDraftChange(match.id, 'b', e.target.value)}
            />
          </div>
          {showPens && (
            <KnockoutAdvancePicker
              teamA={teamA}
              teamB={teamB}
              selected={draft.advanceSide}
              disabled={locked}
              onSelect={(side) => onAdvanceSideChange(match.id, side)}
            />
          )}
        </div>
      </div>

      {!locked && (
        <footer className="edit-pred-card__foot">
          <div className="edit-predictions-table__actions">
            <button
              type="button"
              className="btn-danger edit-predictions__reset"
              disabled={isBusy}
              onClick={() => void onDelete(match.id)}
            >
              {isDeleting ? t('edit.resetting') : t('edit.reset')}
            </button>
            <button
              type="button"
              className="btn-primary edit-predictions__save"
              disabled={
                isBusy || draft.a === '' || draft.b === '' || (showPens && !draft.advanceSide)
              }
              onClick={() => void onSave(match.id)}
            >
              {isSaving ? t('edit.saving') : t('edit.save')}
            </button>
          </div>
        </footer>
      )}
    </article>
  )
}
