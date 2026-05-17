import type { ResolvedMatch } from '../lib/bracketResolver'
import { useI18n } from '../i18n/useI18n'
import type { AdvanceSide } from '../types/database'
import { MatchHeroCard } from './MatchHeroCard'

type Props = {
  match: ResolvedMatch | null
  matchIndex: number
  totalMatches: number
  draftA: string
  draftB: string
  advanceSide: AdvanceSide | null
  communityPredictions: Pick<import('../types/database').Prediction, 'match_id' | 'score_a' | 'score_b'>[]
  isSaving: boolean
  justSaved: boolean
  canGoPrev: boolean
  canGoNext: boolean
  predictionLocked: boolean
  onDraftChange: (side: 'a' | 'b', value: string) => void
  onAdvanceSideSelect: (side: AdvanceSide) => void
  onApplyCommon: (scoreA: number, scoreB: number) => void
  onSaveAndNext: () => void
  onPrev: () => void
  onNext: () => void
}

export const SwipeMatchDeck = ({
  match,
  matchIndex,
  totalMatches,
  draftA,
  draftB,
  advanceSide,
  communityPredictions,
  isSaving,
  justSaved,
  canGoPrev,
  canGoNext,
  predictionLocked,
  onDraftChange,
  onAdvanceSideSelect,
  onApplyCommon,
  onSaveAndNext,
  onPrev,
  onNext,
}: Props) => {
  const { t } = useI18n()
  const canSave = draftA !== '' && draftB !== ''

  if (!match) {
    return (
      <div className="match-deck empty-deck">
        <p className="muted">{t('match.empty')}</p>
      </div>
    )
  }

  return (
    <section className="match-deck" aria-label={t('match.aria')}>
      <MatchHeroCard
        match={match}
        matchIndex={matchIndex}
        totalMatches={totalMatches}
        draftA={draftA}
        draftB={draftB}
        advanceSide={advanceSide}
        communityPredictions={communityPredictions}
        isSaving={isSaving}
        justSaved={justSaved}
        predictionLocked={predictionLocked}
        onDraftChange={onDraftChange}
        onAdvanceSideSelect={onAdvanceSideSelect}
        onApplyCommon={onApplyCommon}
      />
      <div className="deck-actions">
        <button type="button" className="btn-secondary" disabled={!canGoPrev} onClick={onPrev}>
          {t('match.prev')}
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={!canSave || isSaving || predictionLocked}
          onClick={onSaveAndNext}
        >
          {isSaving ? t('match.saving') : t('match.save')}
        </button>
        <button type="button" className="btn-secondary" disabled={!canGoNext} onClick={onNext}>
          {t('match.next')}
        </button>
      </div>
    </section>
  )
}
