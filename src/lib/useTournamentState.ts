import { useMemo } from 'react'
import type { GroupLetter } from '../data/wc2026-groups'
import { resolveAllMatches } from './bracketResolver'
import { applyKnockoutResults } from './knockoutAdvance'
import { buildSlotMap, getQualifiedTeams } from './qualification'
import { allGroupMatchesPredicted, computeAllGroupStandings } from './standings'
import { rankThirdPlaces, topEightThirdPlaces } from './thirdPlace'
import type { Match, Prediction } from '../types/database'
import type { TeamStanding } from './standings'
import type { ThirdPlaceEntry } from './thirdPlace'
import type { ResolvedMatch } from './bracketResolver'

export type TournamentState = {
  standingsByGroup: Record<GroupLetter, TeamStanding[]>
  thirdPlaceRanked: ThirdPlaceEntry[]
  topThirds: ThirdPlaceEntry[]
  slotMap: Map<string, string>
  qualifiedTeams: string[]
  groupStageComplete: boolean
  resolvedMatches: ResolvedMatch[]
}

export const computeTournamentState = (
  matches: Match[],
  predictions: Map<string, Prediction>,
): TournamentState => {
  const standingsByGroup = computeAllGroupStandings(matches, predictions)
  const thirdPlaceRanked = rankThirdPlaces(standingsByGroup)
  const topThirds = topEightThirdPlaces(thirdPlaceRanked)
  const groupStageComplete = allGroupMatchesPredicted(matches, predictions)

  let slotMap = buildSlotMap(standingsByGroup, groupStageComplete ? topThirds : [])
  slotMap = applyKnockoutResults(matches, predictions, slotMap)

  const qualifiedTeams = groupStageComplete ? getQualifiedTeams(buildSlotMap(standingsByGroup, topThirds)) : []
  const resolvedMatches = resolveAllMatches(matches, slotMap)

  return {
    standingsByGroup,
    thirdPlaceRanked,
    topThirds,
    slotMap,
    qualifiedTeams,
    groupStageComplete,
    resolvedMatches,
  }
}

export const useTournamentState = (
  matches: Match[],
  predictions: Map<string, Prediction>,
): TournamentState =>
  useMemo(() => computeTournamentState(matches, predictions), [matches, predictions])

export const isThirdInTopEight = (group: GroupLetter, topThirds: ThirdPlaceEntry[]): boolean =>
  topThirds.some((t) => t.group === group)
