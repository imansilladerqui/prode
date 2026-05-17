import type { AdvanceSide } from '../types/database'
import { useI18n } from '../i18n/useI18n'
import { TeamFlag } from './TeamFlag'

type Props = {
  teamA: string
  teamB: string
  selected: AdvanceSide | null
  disabled?: boolean
  compact?: boolean
  onSelect: (side: AdvanceSide) => void
}

export const KnockoutAdvancePicker = ({
  teamA,
  teamB,
  selected,
  disabled,
  compact,
  onSelect,
}: Props) => {
  const { t } = useI18n()

  return (
    <fieldset
      className={compact ? 'ko-advance-picker ko-advance-picker--compact' : 'ko-advance-picker'}
      disabled={disabled}
    >
      {!compact && (
        <legend className="ko-advance-picker__legend">{t('match.penaltiesPicker')}</legend>
      )}
      <div className="ko-advance-picker__choices">
        <button
          type="button"
          className={
            selected === 'a' ? 'ko-advance-picker__btn ko-advance-picker__btn--active' : 'ko-advance-picker__btn'
          }
          aria-pressed={selected === 'a'}
          onClick={() => onSelect('a')}
        >
          <TeamFlag teamName={teamA} flagSize={compact ? 18 : 22} />
        </button>
        <button
          type="button"
          className={
            selected === 'b' ? 'ko-advance-picker__btn ko-advance-picker__btn--active' : 'ko-advance-picker__btn'
          }
          aria-pressed={selected === 'b'}
          onClick={() => onSelect('b')}
        >
          <TeamFlag teamName={teamB} flagSize={compact ? 18 : 22} />
        </button>
      </div>
    </fieldset>
  )
}
