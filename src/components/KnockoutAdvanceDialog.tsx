import type { AdvanceSide } from '../types/database'
import { useI18n } from '../i18n/useI18n'
import { TeamFlag } from './TeamFlag'

type Props = {
  open: boolean
  teamA: string
  teamB: string
  onPick: (side: AdvanceSide) => void
  onCancel: () => void
}

export const KnockoutAdvanceDialog = ({ open, teamA, teamB, onPick, onCancel }: Props) => {
  const { t } = useI18n()

  if (!open) return null

  return (
    <div className="ko-advance-backdrop" role="presentation" onClick={onCancel}>
      <dialog
        className="ko-advance-dialog"
        open
        aria-labelledby="ko-advance-title"
        onClick={(e) => e.stopPropagation()}
        onCancel={(e) => {
          e.preventDefault()
          onCancel()
        }}
      >
        <h2 id="ko-advance-title" className="ko-advance-dialog__title">
          {t('match.penaltiesTitle')}
        </h2>
        <p className="ko-advance-dialog__hint">{t('match.penaltiesHint')}</p>
        <div className="ko-advance-dialog__choices">
          <button type="button" className="ko-advance-dialog__team" onClick={() => onPick('a')}>
            <TeamFlag teamName={teamA} flagSize={28} />
          </button>
          <button type="button" className="ko-advance-dialog__team" onClick={() => onPick('b')}>
            <TeamFlag teamName={teamB} flagSize={28} />
          </button>
        </div>
        <button type="button" className="btn-secondary ko-advance-dialog__cancel" onClick={onCancel}>
          {t('match.penaltiesCancel')}
        </button>
      </dialog>
    </div>
  )
}
