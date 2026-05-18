import { useI18n } from '../i18n/useI18n'
import type { SwipeMatchDeckProps } from '../types'
import { MatchHeroCard } from './MatchHeroCard'

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
}: SwipeMatchDeckProps) => {
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
