import { GROUP_LETTERS } from '../data/wc2026-groups'
import type { GroupLetter, TeamStanding, ThirdPlaceEntry } from '../types'
import { compareThirdPlaceFifa } from './standingsRank'

/** Article 13: eight best third-placed teams (all group matches; no head-to-head). */
export const rankThirdPlaces = (
  standingsByGroup: Record<GroupLetter, TeamStanding[]>,
): ThirdPlaceEntry[] => {
  const thirds: ThirdPlaceEntry[] = []
  for (const g of GROUP_LETTERS) {
    const table = standingsByGroup[g]
    const third = table[2]
    if (!third) continue
    thirds.push({
      group: g,
      team: third.team,
      slot: third.slot,
      points: third.points,
      goalDiff: third.goalDiff,
      goalsFor: third.goalsFor,
    })
  }
  return thirds.sort(compareThirdPlaceFifa)
}
