import { useMemo } from 'react'
import { useI18n } from '../i18n/useI18n'
import { canEditPrediction } from '../lib/matchLock'
import { countGroupMatchesPredicted } from '../lib/standings'
import type { DraftScore, Match, MatchesScreenTab, Prediction, TournamentState } from '../types'
import { emptyDraft } from '../types/draft'
import { groupLetterFromMatch } from '../utils/helpers'
import { useResolvedMatchesById } from './useResolvedMatchesById'
import type { useMatchQueue } from './useMatchQueue'

export const useMatchesPlayTab = (
  tournament: TournamentState,
  matches: Match[],
  predictions: Map<string, Prediction>,
  draftScores: Map<string, DraftScore>,
  queue: ReturnType<typeof useMatchQueue>,
  tab: MatchesScreenTab,
  onSave: (matchId: string) => Promise<boolean>,
) => {
  const { t } = useI18n()
  const resolvedById = useResolvedMatchesById(tournament.resolvedMatches)

  const currentMatch = queue.currentMatchId ? resolvedById.get(queue.currentMatchId) : null
  const rawMatch = matches.find((m) => m.id === queue.currentMatchId)
  const currentGroup = groupLetterFromMatch(rawMatch)
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

  const liveStandings = useMemo(() => {
    if (!currentGroup || tab !== 'play') return null
    const progress = countGroupMatchesPredicted(currentGroup, matches, predictions)
    return {
      group: currentGroup,
      standings: tournament.standingsByGroup[currentGroup],
      topThirds: tournament.topThirds,
      done: progress.done,
      total: progress.total,
    }
  }, [currentGroup, tab, tournament, matches, predictions])

  const liveStandingsTitle = liveStandings
    ? t('live.title', { group: liveStandings.group })
    : null

  return {
    resolvedById,
    currentMatch,
    rawMatch,
    currentGroup,
    draft,
    activeNavKey,
    predictionLocked,
    handleSaveAndNext,
    liveStandings,
    liveStandingsTitle,
  }
}
