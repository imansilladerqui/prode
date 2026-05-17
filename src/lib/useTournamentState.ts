import { useMemo } from 'react'
import type { GroupLetter } from '../data/wc2026-groups'
import { resolveAllMatches } from './bracketResolver'
import { applyKnockoutResults } from './knockoutAdvance'
import { buildSlotMap } from './qualification'
import { computeAllGroupStandings } from './standings'
import { rankThirdPlaces } from './thirdPlace'
import type { Match, Prediction } from '../types/database'
import type { TeamStanding } from './standings'
import type { ThirdPlaceEntry } from './thirdPlace'
import type { ResolvedMatch } from './bracketResolver'

export type TournamentState = {
  standingsByGroup: Record<GroupLetter, TeamStanding[]>
  topThirds: ThirdPlaceEntry[]
  slotMap: Map<string, string>
  resolvedMatches: ResolvedMatch[]
}

export const computeTournamentState = (
  matches: Match[],
  predictions: Map<string, Prediction>,
): TournamentState => {
  const standingsByGroup = computeAllGroupStandings(matches, predictions)
  const topThirds = rankThirdPlaces(standingsByGroup).slice(0, 8)

  let slotMap = buildSlotMap(standingsByGroup, topThirds)
  slotMap = applyKnockoutResults(matches, predictions, slotMap)

  const resolvedMatches = resolveAllMatches(matches, slotMap)

  return {
    standingsByGroup,
    topThirds,
    slotMap,
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
