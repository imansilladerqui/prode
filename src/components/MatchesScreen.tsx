import { useMemo, useState } from 'react'
import type { GroupLetter } from '../data/wc2026-groups'
import { useMatchQueue } from '../hooks/useMatchQueue'
import { useI18n } from '../i18n/useI18n'
import { canEditPrediction } from '../lib/matchLock'
import { countGroupMatchesPredicted } from '../lib/standings'
import type { TournamentState } from '../lib/useTournamentState'
import type { AdvanceSide, Match, MatchResult, Prediction } from '../types/database'
import { emptyDraft, type DraftScore } from '../types/draft'
import { AllStandingsGrid } from './AllStandingsGrid'
import { GroupStandings } from './GroupStandings'
import { LanguageSwitcher } from './LanguageSwitcher'
import { LeaderboardScreen } from './LeaderboardScreen'
import { NavSidebar } from './NavSidebar'
import { AdminResultsScreen } from './AdminResultsScreen'
import { QualifiedSummary } from './QualifiedSummary'
import { SwipeMatchDeck } from './SwipeMatchDeck'
type Tab = 'play' | 'standings' | 'qualified' | 'ranking' | 'admin'

type Props = {
  playerId: string
  userName: string
  showAdmin: boolean
  matches: Match[]
  predictions: Map<string, Prediction>
  matchResults: Map<string, MatchResult>
  communityPredictions: Pick<Prediction, 'match_id' | 'score_a' | 'score_b'>[]
  tournament: TournamentState
  draftScores: Map<string, DraftScore>
  error: string | null
  savingMatchId: string | null
  savingResultMatchId: string | null
  savedMatchId: string | null
  onDraftChange: (matchId: string, side: 'a' | 'b', value: string) => void
  onAdvanceSideChange: (matchId: string, side: AdvanceSide) => void
  onApplyCommon: (matchId: string, scoreA: number, scoreB: number) => void
  onSave: (matchId: string) => Promise<boolean>
  onSaveResult: (
    matchId: string,
    scoreA: number,
    scoreB: number,
    advanceSide: AdvanceSide | null,
  ) => Promise<boolean>
}

const groupFromMatch = (match: Match | undefined): GroupLetter | null => {
  if (!match?.group_name) return null
  const letter = match.group_name.replace('Grupo ', '').trim()
  if (letter.length === 1 && letter >= 'A' && letter <= 'L') return letter as GroupLetter
  return null
}

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
  savingResultMatchId,
  savedMatchId,
  onDraftChange,
  onAdvanceSideChange,
  onApplyCommon,
  onSave,
  onSaveResult,
}: Props) => {
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>('play')
  const queue = useMatchQueue(matches, predictions)

  const tabs: {
    id: Tab
    labelKey: 'tab.play' | 'tab.standings' | 'tab.qualified' | 'tab.ranking' | 'tab.admin'
  }[] = [
    { id: 'play', labelKey: 'tab.play' },
    { id: 'standings', labelKey: 'tab.standings' },
    { id: 'qualified', labelKey: 'tab.qualified' },
    { id: 'ranking', labelKey: 'tab.ranking' },
    ...(showAdmin ? [{ id: 'admin' as const, labelKey: 'tab.admin' as const }] : []),
  ]

  const resolvedById = useMemo(() => {
    const m = new Map<string, (typeof tournament.resolvedMatches)[0]>()
    for (const r of tournament.resolvedMatches) m.set(r.id, r)
    return m
  }, [tournament])

  const currentMatch = queue.currentMatchId ? resolvedById.get(queue.currentMatchId) : null
  const rawMatch = matches.find((m) => m.id === queue.currentMatchId)
  const currentGroup = groupFromMatch(rawMatch)
  const draft = queue.currentMatchId
    ? (draftScores.get(queue.currentMatchId) ?? emptyDraft())
    : emptyDraft()

  const activeNavKey =
    rawMatch?.stage === 'group' && rawMatch.group_name
      ? rawMatch.group_name
      : rawMatch?.stage ?? null

  const predictionLocked =
    rawMatch != null && !canEditPrediction(rawMatch.match_date)

  const handleSaveAndNext = async () => {
    if (!queue.currentMatchId) return
    const ok = await onSave(queue.currentMatchId)
    if (ok) queue.goNext()
  }

  const liveStandings =
    currentGroup && tab === 'play' ? (
      <section className="live-standings" aria-live="polite" aria-atomic="true">
        <h2 className="live-standings__title">
          {t('live.title', { group: currentGroup })}
        </h2>
        <GroupStandings
          group={currentGroup}
          standings={tournament.standingsByGroup[currentGroup]}
          topThirds={tournament.topThirds}
          done={countGroupMatchesPredicted(currentGroup, matches, predictions).done}
          total={countGroupMatchesPredicted(currentGroup, matches, predictions).total}
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
        {tabs.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? 'tab tab--active' : 'tab'}
            onClick={() => setTab(id)}
          >
            {t(labelKey)}
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
                activeKey={activeNavKey}
                onJump={queue.jumpToStageOrGroup}
              />
            </div>
            <main className="app-shell__main">
              <NavSidebar
                variant="mobile"
                matches={matches}
                predictions={predictions}
                activeKey={activeNavKey}
                onJump={queue.jumpToStageOrGroup}
              />
              <SwipeMatchDeck
                match={currentMatch ?? null}
                matchIndex={queue.currentIndex}
                totalMatches={queue.total}
                draftA={draft.a}
                draftB={draft.b}
                advanceSide={draft.advanceSide}
                communityPredictions={communityPredictions}
                isSaving={savingMatchId === queue.currentMatchId}
                justSaved={savedMatchId === queue.currentMatchId}
                canGoPrev={queue.currentIndex > 0}
                canGoNext={queue.currentIndex < queue.total - 1}
                predictionLocked={predictionLocked}
                onDraftChange={(side, v) =>
                  queue.currentMatchId && onDraftChange(queue.currentMatchId, side, v)
                }
                onAdvanceSideSelect={(side) =>
                  queue.currentMatchId && onAdvanceSideChange(queue.currentMatchId, side)
                }
                onApplyCommon={(a, b) =>
                  queue.currentMatchId && onApplyCommon(queue.currentMatchId, a, b)
                }
                onSaveAndNext={() => void handleSaveAndNext()}
                onPrev={queue.goPrev}
                onNext={queue.goNext}
              />
              {currentMatch && currentMatch.stage !== 'group' && (
                <p className="knockout-hint muted">{t('match.knockoutHint')}</p>
              )}
              <div className="live-standings--mobile">{liveStandings}</div>
            </main>
            <aside className="app-shell__aside">{liveStandings}</aside>
          </div>
        )}

        {tab === 'standings' && (
          <AllStandingsGrid matches={matches} predictions={predictions} tournament={tournament} />
        )}

        {tab === 'qualified' && (
          <QualifiedSummary
            teams={tournament.qualifiedTeams}
            complete={tournament.groupStageComplete}
            groupMatchesDone={matches.filter((m) => m.stage === 'group' && predictions.has(m.id)).length}
            groupMatchesTotal={matches.filter((m) => m.stage === 'group').length}
          />
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
