import { getMostCommonPrediction } from '../lib/commonResult'
import { formatMatchDay, formatMatchTime } from '../lib/formatMatchDate'
import { getStageLabel } from '../lib/stageLabels'
import { useI18n } from '../i18n/useI18n'
import { isKnockoutDraw } from '../lib/knockoutAdvance'
import type { ResolvedMatch } from '../lib/bracketResolver'
import type { AdvanceSide } from '../types/database'
import { KnockoutAdvancePicker } from './KnockoutAdvancePicker'
import { TeamFlag } from './TeamFlag'

type Props = {
  match: ResolvedMatch
  matchIndex: number
  totalMatches: number
  draftA: string
  draftB: string
  advanceSide: AdvanceSide | null
  communityPredictions: Pick<import('../types/database').Prediction, 'match_id' | 'score_a' | 'score_b'>[]
  isSaving: boolean
  justSaved: boolean
  predictionLocked: boolean
  onDraftChange: (side: 'a' | 'b', value: string) => void
  onAdvanceSideSelect: (side: AdvanceSide) => void
  onApplyCommon: (scoreA: number, scoreB: number) => void
}

export const MatchHeroCard = ({
  match,
  matchIndex,
  totalMatches,
  draftA,
  draftB,
  advanceSide,
  communityPredictions,
  isSaving,
  justSaved,
  predictionLocked,
  onDraftChange,
  onAdvanceSideSelect,
  onApplyCommon,
}: Props) => {
  const { t, intlLocaleTag } = useI18n()
  const common = getMostCommonPrediction(communityPredictions, match.id)
  const locked = predictionLocked
  const showPenaltiesPicker =
    match.stage !== 'group' &&
    draftA !== '' &&
    draftB !== '' &&
    isKnockoutDraw(Number(draftA), Number(draftB))

  const badge =
    match.stage === 'group' && match.group_name
      ? match.group_name
      : getStageLabel(match.stage, t)

  return (
    <article className="hero-card">
      <div className="hero-card__meta">
        <span className="badge">{badge}</span>
        <span className="match-counter">
          {t('match.counter', { current: matchIndex + 1, total: totalMatches })}
        </span>
      </div>

      <div className="hero-card__datetime">
        <time className="hero-card__day" dateTime={match.match_date}>
          {formatMatchDay(match.match_date, intlLocaleTag)}
        </time>
        <span className="hero-card__time">{formatMatchTime(match.match_date, intlLocaleTag)}</span>
      </div>

      {match.venue && <p className="hero-card__venue">{match.venue}</p>}

      {locked && <p className="prediction-locked-hint">{t('match.lock')}</p>}

      <div className="hero-card__teams">
        <div className="hero-card__team">
          <TeamFlag teamName={match.resolvedTeamA} flagSize={24} className="hero-card__team-name" />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="score-input"
            aria-label={match.resolvedTeamA}
            value={draftA}
            disabled={locked}
            readOnly={locked}
            onChange={(e) => onDraftChange('a', e.target.value)}
          />
        </div>
        <span className="hero-card__vs">vs</span>
        <div className="hero-card__team">
          <TeamFlag teamName={match.resolvedTeamB} flagSize={24} className="hero-card__team-name" />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="score-input"
            aria-label={match.resolvedTeamB}
            value={draftB}
            disabled={locked}
            readOnly={locked}
            onChange={(e) => onDraftChange('b', e.target.value)}
          />
        </div>
      </div>

      {showPenaltiesPicker && (
        <KnockoutAdvancePicker
          teamA={match.resolvedTeamA}
          teamB={match.resolvedTeamB}
          selected={advanceSide}
          disabled={locked}
          onSelect={onAdvanceSideSelect}
        />
      )}

      {common && !locked && (
        <button
          type="button"
          className="chip-btn"
          onClick={() => onApplyCommon(common.scoreA, common.scoreB)}
        >
          {t('match.common', {
            scoreA: common.scoreA,
            scoreB: common.scoreB,
            count: common.count,
          })}
        </button>
      )}

      {justSaved && (
        <p className="saved-hint" role="status">
          {t('match.saved')}
        </p>
      )}
      {isSaving && (
        <p className="saved-hint" role="status">
          {t('match.saving')}
        </p>
      )}
    </article>
  )
}
