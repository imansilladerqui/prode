import { useState } from 'react'
import { useMatchQueue } from '../hooks/useMatchQueue'
import { useMatchesPlayTab } from '../hooks/useMatchesPlayTab'
import { useMatchesTabs } from '../hooks/useMatchesTabs'
import { useI18n } from '../i18n/useI18n'
import type { MatchesScreenProps, MatchesScreenTab } from '../types'
import { AllStandingsGrid } from './AllStandingsGrid'
import { GroupStandings } from './GroupStandings'
import { LanguageSwitcher } from './LanguageSwitcher'
import { LeaderboardScreen } from './LeaderboardScreen'
import { NavSidebar } from './NavSidebar'
import { AdminResultsScreen } from './AdminResultsScreen'
import { EditPredictionsScreen } from './EditPredictionsScreen'
import { SwipeMatchDeck } from './SwipeMatchDeck'
export const MatchesScreen = ({
  playerId,
  userName,
  showAdmin,
  matches,
  predictions,
  matchResults,
  communityPredictions,
  tournament,
  draftScores,
  error,
  savingMatchId,
  deletingMatchId,
  savingResultMatchId,
  savedMatchId,
  onDraftChange,
  onAdvanceSideChange,
  onApplyCommon,
  onSave,
  onDelete,
  onSaveResult,
}: MatchesScreenProps) => {
  const { t } = useI18n()
  const [tab, setTab] = useState<MatchesScreenTab>('play')
  const queue = useMatchQueue(matches, predictions)
  const tabs = useMatchesTabs(showAdmin)
  const play = useMatchesPlayTab(
    tournament,
    matches,
    predictions,
    draftScores,
    queue,
    tab,
    onSave,
  )

  const liveStandings =
    play.liveStandings ? (
      <section className="live-standings" aria-live="polite" aria-atomic="true">
        <h2 className="live-standings__title">{play.liveStandingsTitle}</h2>
        <GroupStandings
          group={play.liveStandings.group}
          standings={play.liveStandings.standings}
          topThirds={play.liveStandings.topThirds}
          done={play.liveStandings.done}
          total={play.liveStandings.total}
        />
      </section>
    ) : null

  return (
    <div className="app-shell">
      <div className="app-shell__chrome">
        <header className="top-bar">
          <div className="top-bar__brand">
          <span className="wc-mark" aria-hidden>
            26
          </span>
          <div>
            <h1>{t('app.title')}</h1>
            <span className="top-bar__event">{t('app.event')}</span>
          </div>
        </div>
        <div className="top-bar__actions">
          <LanguageSwitcher />
          <p className="top-bar__user">{userName}</p>
        </div>
      </header>

        <nav className="tabs" role="tablist">
        {tabs.map(({ id, label, shortLabel, ariaLabel }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-label={ariaLabel}
            className={tab === id ? 'tab tab--active' : 'tab'}
            onClick={() => setTab(id)}
          >
            <span className="tab__label tab__label--full">{label}</span>
            <span className="tab__label tab__label--short">{shortLabel}</span>
          </button>
        ))}
        </nav>

        {error && <p className="error banner">{error}</p>}
      </div>

      <div className="app-shell__body">
        {tab === 'play' && (
          <div className="app-shell__play">
            <div className="app-shell__nav">
              <NavSidebar
                variant="desktop"
                matches={matches}
                predictions={predictions}
                activeKey={play.activeNavKey}
                onJump={queue.jumpToStageOrGroup}
              />
            </div>
            <main className="app-shell__main">
              <NavSidebar
                variant="mobile"
                matches={matches}
                predictions={predictions}
                activeKey={play.activeNavKey}
                onJump={queue.jumpToStageOrGroup}
              />
              <SwipeMatchDeck
                match={play.currentMatch ?? null}
                matchIndex={queue.currentIndex}
                totalMatches={queue.total}
                draftA={play.draft.a}
                draftB={play.draft.b}
                advanceSide={play.draft.advanceSide}
                communityPredictions={communityPredictions}
                isSaving={savingMatchId === queue.currentMatchId}
                justSaved={savedMatchId === queue.currentMatchId}
                canGoPrev={queue.currentIndex > 0}
                canGoNext={queue.currentIndex < queue.total - 1}
                predictionLocked={play.predictionLocked}
                onDraftChange={(side, v) =>
                  queue.currentMatchId && onDraftChange(queue.currentMatchId, side, v)
                }
                onAdvanceSideSelect={(side) =>
                  queue.currentMatchId && onAdvanceSideChange(queue.currentMatchId, side)
                }
                onApplyCommon={(a, b) =>
                  queue.currentMatchId && onApplyCommon(queue.currentMatchId, a, b)
                }
                onSaveAndNext={() => void play.handleSaveAndNext()}
                onPrev={queue.goPrev}
                onNext={queue.goNext}
              />
              {play.currentMatch && play.currentMatch.stage !== 'group' && (
                <p className="knockout-hint muted">{t('match.knockoutHint')}</p>
              )}
              <div className="live-standings--mobile">{liveStandings}</div>
            </main>
            <aside className="app-shell__aside">{liveStandings}</aside>
          </div>
        )}

        {tab === 'edit' && (
          <EditPredictionsScreen
            matches={matches}
            resolvedMatches={tournament.resolvedMatches}
            predictions={predictions}
            draftScores={draftScores}
            savingMatchId={savingMatchId}
            deletingMatchId={deletingMatchId}
            onDraftChange={onDraftChange}
            onAdvanceSideChange={onAdvanceSideChange}
            onSave={onSave}
            onDelete={onDelete}
          />
        )}

        {tab === 'standings' && (
          <AllStandingsGrid matches={matches} predictions={predictions} tournament={tournament} />
        )}

        {tab === 'ranking' && (
          <LeaderboardScreen playerId={playerId} active={tab === 'ranking'} />
        )}

        {tab === 'admin' && showAdmin && (
          <AdminResultsScreen
            matches={matches}
            resolvedMatches={tournament.resolvedMatches}
            results={matchResults}
            savingMatchId={savingResultMatchId}
            onSaveResult={onSaveResult}
          />
        )}
      </div>
    </div>
  )
}
