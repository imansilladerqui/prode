import type { GroupLetter } from '../data/wc2026-groups'
import { GROUP_LETTERS } from '../data/wc2026-groups'
import type { TeamStanding } from './standings'
import { compareThirdPlaceFifa } from './standingsRank'

export type ThirdPlaceEntry = {
  group: GroupLetter
  team: string
  slot: string
  points: number
  goalDiff: number
  goalsFor: number
}

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
