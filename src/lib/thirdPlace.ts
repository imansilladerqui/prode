import type { GroupLetter } from '../data/wc2026-groups'
import { GROUP_LETTERS } from '../data/wc2026-groups'
import type { TeamStanding } from './standings'

export type ThirdPlaceEntry = {
  group: GroupLetter
  team: string
  slot: string
  points: number
  goalDiff: number
  goalsFor: number
}

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
  return thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return a.group.localeCompare(b.group)
  })
}

export const topEightThirdPlaces = (ranked: ThirdPlaceEntry[]): ThirdPlaceEntry[] => ranked.slice(0, 8)
