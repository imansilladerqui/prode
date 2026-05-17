import { useEffect, useState } from 'react'
import { KnockoutAdvanceDialog } from './components/KnockoutAdvanceDialog'
import { MatchesScreen } from './components/MatchesScreen'
import { NameScreen } from './components/NameScreen'
import { I18nProvider } from './i18n/I18nProvider'
import { useI18n } from './i18n/useI18n'
import {
  fetchAllPredictions,
  fetchMatchResults,
  fetchMatches,
  fetchPredictions,
  fetchUser,
  insertUser,
  upsertMatchResult,
  upsertPrediction,
} from './lib/api'
import { isAdmin } from './lib/admin'
import { canEditPrediction } from './lib/matchLock'
import { getKnockoutValidationError } from './lib/knockoutAdvance'
import { getOrCreatePlayerId, isNameLocked, setNameLocked } from './lib/playerId'
import { useTournamentState } from './lib/useTournamentState'
import type { AdvanceSide, Match, MatchResult, Prediction } from './types/database'
import { emptyDraft, isDraftDraw, type DraftScore } from './types/draft'
import './App.css'

type Screen = 'loading' | 'name' | 'matches'

const AppContent = () => {
  const { t } = useI18n()
  const playerId = getOrCreatePlayerId()
  const [screen, setScreen] = useState<Screen>('loading')
  const [userName, setUserName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<Map<string, Prediction>>(new Map())
  const [communityPredictions, setCommunityPredictions] = useState<
    Pick<Prediction, 'match_id' | 'score_a' | 'score_b'>[]
  >([])
  const [draftScores, setDraftScores] = useState<Map<string, DraftScore>>(new Map())
  const [error, setError] = useState<string | null>(null)
  const [matchResults, setMatchResults] = useState<Map<string, MatchResult>>(new Map())
  const [savingMatchId, setSavingMatchId] = useState<string | null>(null)
  const [savingResultMatchId, setSavingResultMatchId] = useState<string | null>(null)
  const [savedMatchId, setSavedMatchId] = useState<string | null>(null)
  const showAdmin = isAdmin(playerId)
  const [penaltiesDialog, setPenaltiesDialog] = useState<{
    matchId: string
    teamA: string
    teamB: string
  } | null>(null)

  const tournament = useTournamentState(matches, predictions)

  const loadMatchesData = async () => {
    const [matchList, predictionList, allPreds, resultsList] = await Promise.all([
      fetchMatches(),
      fetchPredictions(playerId),
      fetchAllPredictions(),
      fetchMatchResults(),
    ])
    setMatches(matchList)
    setCommunityPredictions(allPreds)
    const predMap = new Map(predictionList.map((p) => [p.match_id, p]))
    setPredictions(predMap)
    setMatchResults(new Map(resultsList.map((r) => [r.match_id, r])))
    const drafts = new Map<string, DraftScore>()
    for (const m of matchList) {
      const p = predMap.get(m.id)
      drafts.set(m.id, {
        a: p != null ? String(p.score_a) : '',
        b: p != null ? String(p.score_b) : '',
        advanceSide: p?.advance_side ?? null,
      })
    }
    setDraftScores(drafts)
  }

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        setError(null)
        if (isNameLocked()) {
          const user = await fetchUser(playerId)
          if (cancelled) return
          if (user?.name) {
            setUserName(user.name)
            await loadMatchesData()
            if (!cancelled) setScreen('matches')
            return
          }
        }

        const user = await fetchUser(playerId)
        if (cancelled) return

        if (user?.name) {
          setNameLocked()
          setUserName(user.name)
          await loadMatchesData()
          if (!cancelled) setScreen('matches')
        } else {
          setScreen('name')
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t('app.loadError'))
          if (!isNameLocked()) setScreen('name')
          else setScreen('matches')
        }
      }
    }

    void init()
    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- init solo al montar / cambiar playerId
  }, [playerId, t])

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setError(t('name.required'))
      return
    }

    try {
      setError(null)
      await insertUser(playerId, trimmed)
      setNameLocked()
      setUserName(trimmed)
      await loadMatchesData()
      setScreen('matches')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('name.saveError'))
    }
  }

  const updateDraft = (matchId: string, side: 'a' | 'b', value: string) => {
    if (value !== '' && !/^\d+$/.test(value)) return
    setDraftScores((prev) => {
      const next = new Map(prev)
      const current = next.get(matchId) ?? emptyDraft()
      const a = side === 'a' ? value : current.a
      const b = side === 'b' ? value : current.b
      const nextDraft: DraftScore = { a, b, advanceSide: current.advanceSide }
      if (!isDraftDraw(nextDraft)) nextDraft.advanceSide = null
      next.set(matchId, nextDraft)
      return next
    })
    setSavedMatchId(null)
  }

  const updateAdvanceSide = (matchId: string, advanceSide: AdvanceSide) => {
    setDraftScores((prev) => {
      const next = new Map(prev)
      const current = next.get(matchId) ?? emptyDraft()
      next.set(matchId, { ...current, advanceSide })
      return next
    })
    setSavedMatchId(null)
  }

  const applyCommon = (matchId: string, scoreA: number, scoreB: number) => {
    setDraftScores((prev) => {
      const next = new Map(prev)
      next.set(matchId, {
        a: String(scoreA),
        b: String(scoreB),
        advanceSide: scoreA === scoreB ? (prev.get(matchId)?.advanceSide ?? null) : null,
      })
      return next
    })
    setSavedMatchId(null)
  }

  const handleSavePrediction = async (
    matchId: string,
    overrideAdvance?: AdvanceSide,
  ): Promise<boolean> => {
    const draft = draftScores.get(matchId)
    if (!draft || draft.a === '' || draft.b === '') {
      setError(t('error.fillGoals'))
      return false
    }

    const scoreA = Number(draft.a)
    const scoreB = Number(draft.b)
    const match = matches.find((m) => m.id === matchId)
    if (!match) return false

    if (!canEditPrediction(match.match_date)) {
      setError(t('match.lock'))
      return false
    }

    const advanceSide =
      match.stage !== 'group' && scoreA === scoreB
        ? (overrideAdvance ?? draft.advanceSide)
        : null

    if (match.stage !== 'group') {
      const koErr = getKnockoutValidationError(scoreA, scoreB, advanceSide)
      if (koErr) {
        if (koErr === 'error.knockoutAdvanceRequired') {
          const resolved = tournament.resolvedMatches.find((m) => m.id === matchId)
          if (resolved) {
            setPenaltiesDialog({
              matchId,
              teamA: resolved.resolvedTeamA,
              teamB: resolved.resolvedTeamB,
            })
            return false
          }
        }
        setError(t(koErr))
        return false
      }
    } else if (scoreA < 0 || scoreB < 0) {
      setError(t('error.negativeGoals'))
      return false
    }

    try {
      setError(null)
      setSavingMatchId(matchId)
      await upsertPrediction(playerId, matchId, scoreA, scoreB, advanceSide)
      const existing = predictions.get(matchId)
      const updated: Prediction = {
        id: existing?.id ?? crypto.randomUUID(),
        user_id: playerId,
        match_id: matchId,
        score_a: scoreA,
        score_b: scoreB,
        advance_side: advanceSide,
        created_at: existing?.created_at ?? new Date().toISOString(),
      }
      setPredictions((prev) => new Map(prev).set(matchId, updated))
      const allPreds = await fetchAllPredictions()
      setCommunityPredictions(allPreds)
      setSavedMatchId(matchId)
      window.setTimeout(() => setSavedMatchId((id) => (id === matchId ? null : id)), 2000)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.savePrediction'))
      return false
    } finally {
      setSavingMatchId(null)
    }
  }

  if (screen === 'loading') {
    return (
      <div className="app">
        <p className="muted">{t('app.loading')}</p>
      </div>
    )
  }

  const handleSaveResult = async (
    matchId: string,
    scoreA: number,
    scoreB: number,
    advanceSide: AdvanceSide | null,
  ): Promise<boolean> => {
    if (!showAdmin) return false

    const match = matches.find((m) => m.id === matchId)
    if (!match) return false

    if (match.stage !== 'group' && scoreA === scoreB && !advanceSide) {
      setError(t('error.knockoutAdvanceRequired'))
      return false
    }
    if (scoreA < 0 || scoreB < 0) {
      setError(t('error.negativeGoals'))
      return false
    }

    try {
      setError(null)
      setSavingResultMatchId(matchId)
      const savedAdvance = match.stage !== 'group' && scoreA === scoreB ? advanceSide : null
      await upsertMatchResult(matchId, scoreA, scoreB, savedAdvance)
      setMatchResults((prev) => {
        const next = new Map(prev)
        next.set(matchId, {
          match_id: matchId,
          score_a: scoreA,
          score_b: scoreB,
          advance_side: savedAdvance,
          entered_at: new Date().toISOString(),
        })
        return next
      })
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.saveError'))
      return false
    } finally {
      setSavingResultMatchId(null)
    }
  }

  if (screen === 'name') {
    return (
      <NameScreen
        nameInput={nameInput}
        error={error}
        onNameChange={setNameInput}
        onSubmit={(e) => void handleSaveName(e)}
      />
    )
  }

  return (
    <>
      <MatchesScreen
        playerId={playerId}
        userName={userName}
        showAdmin={showAdmin}
        matches={matches}
        predictions={predictions}
        matchResults={matchResults}
        communityPredictions={communityPredictions}
        tournament={tournament}
        draftScores={draftScores}
        error={error}
        savingMatchId={savingMatchId}
        savingResultMatchId={savingResultMatchId}
        savedMatchId={savedMatchId}
        onDraftChange={updateDraft}
        onAdvanceSideChange={updateAdvanceSide}
        onApplyCommon={applyCommon}
        onSave={handleSavePrediction}
        onSaveResult={handleSaveResult}
      />
      <KnockoutAdvanceDialog
        open={penaltiesDialog != null}
        teamA={penaltiesDialog?.teamA ?? ''}
        teamB={penaltiesDialog?.teamB ?? ''}
        onPick={(side) => {
          if (!penaltiesDialog) return
          const { matchId } = penaltiesDialog
          updateAdvanceSide(matchId, side)
          setPenaltiesDialog(null)
          void handleSavePrediction(matchId, side)
        }}
        onCancel={() => setPenaltiesDialog(null)}
      />
    </>
  )
}

const App = () => (
  <I18nProvider>
    <AppContent />
  </I18nProvider>
)

export default App
