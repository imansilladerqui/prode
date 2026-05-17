import type { GroupLetter } from '../data/wc2026-groups'
import { GROUP_LETTERS } from '../data/wc2026-groups'
import { THIRD_PLACE_CANDIDATES, THIRD_PLACE_MATCH_ORDER } from '../data/third-place-slots'
import type { ThirdPlaceEntry } from './thirdPlace'
import type { TeamStanding } from './standings'

export type SlotMap = Map<string, string>

/** Map each 3@ match to a qualified third-placed group (FIFA Annex C candidate pools). */
const assignThirdPlaceMatches = (topThirds: ThirdPlaceEntry[]): Map<number, GroupLetter> => {
  const assignment = new Map<number, GroupLetter>()
  const used = new Set<GroupLetter>()

  const tryAssign = (index: number): boolean => {
    if (index >= THIRD_PLACE_MATCH_ORDER.length) return true
    const matchNum = THIRD_PLACE_MATCH_ORDER[index]!
    const pool = THIRD_PLACE_CANDIDATES[matchNum] ?? []

    for (const entry of topThirds) {
      if (used.has(entry.group) || !pool.includes(entry.group)) continue
      used.add(entry.group)
      assignment.set(matchNum, entry.group)
      if (tryAssign(index + 1)) return true
      used.delete(entry.group)
      assignment.delete(matchNum)
    }
    return false
  }

  tryAssign(0)
  return assignment
}

export const buildSlotMap = (
  standingsByGroup: Record<GroupLetter, TeamStanding[]>,
  topThirds: ThirdPlaceEntry[],
): SlotMap => {
  const slots: SlotMap = new Map()

  for (const g of GROUP_LETTERS) {
    const table = standingsByGroup[g]
    if (table[0]) slots.set(`1${g}`, table[0].team)
    if (table[1]) slots.set(`2${g}`, table[1].team)
  }

  const thirdByGroup = new Map(topThirds.map((t) => [t.group, t]))
  const thirdPlaceMatches = assignThirdPlaceMatches(topThirds)

  for (const [matchNum, group] of thirdPlaceMatches) {
    const entry = thirdByGroup.get(group)
    if (entry) slots.set(`3@${matchNum}`, entry.team)
  }

  return slots
}
