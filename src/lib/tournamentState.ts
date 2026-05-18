import { resolveAllMatches } from './bracketResolver'
import { applyKnockoutResults } from './knockoutAdvance'
import { buildSlotMap } from './qualification'
import { computeAllGroupStandings } from './standings'
import { rankThirdPlaces } from './thirdPlace'
import type { GroupLetter, Match, Prediction, ThirdPlaceEntry, TournamentState } from '../types'

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

export const isThirdInTopEight = (group: GroupLetter, topThirds: ThirdPlaceEntry[]): boolean =>
  topThirds.some((t) => t.group === group)
