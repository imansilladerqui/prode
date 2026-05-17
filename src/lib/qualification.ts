import type { GroupLetter } from '../data/wc2026-groups'
import { GROUP_LETTERS } from '../data/wc2026-groups'
import { THIRD_PLACE_CANDIDATES, THIRD_PLACE_MATCH_ORDER } from '../data/third-place-slots'
import type { ThirdPlaceEntry } from './thirdPlace'
import type { TeamStanding } from './standings'

export type SlotMap = Map<string, string>

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

  const qualifiedGroups = new Set(topThirds.map((t) => t.group))
  const assignedThirdGroups = new Set<GroupLetter>()

  for (const matchNum of THIRD_PLACE_MATCH_ORDER) {
    const candidates = THIRD_PLACE_CANDIDATES[matchNum] ?? []
    const entry = topThirds.find(
      (t) =>
        candidates.includes(t.group) &&
        qualifiedGroups.has(t.group) &&
        !assignedThirdGroups.has(t.group),
    )
    if (entry) {
      slots.set(`3@${matchNum}`, entry.team)
      assignedThirdGroups.add(entry.group)
    }
  }

  for (const t of topThirds) {
    if (!assignedThirdGroups.has(t.group)) {
      slots.set(`3${t.group}`, t.team)
    }
  }

  return slots
}

export const getQualifiedTeams = (slots: SlotMap): string[] => {
  const teams = new Set<string>()
  for (const v of slots.values()) teams.add(v)
  return [...teams].sort((a, b) => a.localeCompare(b))
}
