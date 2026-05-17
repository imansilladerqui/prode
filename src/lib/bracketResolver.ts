import { teamFromSlot } from '../data/wc2026-groups'
import type { Match } from '../types/database'
import type { SlotMap } from './qualification'

const resolveSlot = (slot: string, slotMap: SlotMap): string | null => {
  if (slotMap.has(slot)) return slotMap.get(slot) ?? null
  const team = teamFromSlot(slot)
  if (team) return team
  if (/^W\d+$/.test(slot) || /^L\d+$/.test(slot) || /^3@/.test(slot)) return null
  return null
}

export type ResolvedMatch = Match & {
  resolvedTeamA: string
  resolvedTeamB: string
  slotsResolved: boolean
}

export const resolveMatchTeams = (match: Match, slotMap: SlotMap): ResolvedMatch => {
  const a = resolveSlot(match.home_slot, slotMap) ?? match.team_a
  const b = resolveSlot(match.away_slot, slotMap) ?? match.team_b
  return {
    ...match,
    resolvedTeamA: a,
    resolvedTeamB: b,
    slotsResolved: Boolean(resolveSlot(match.home_slot, slotMap) && resolveSlot(match.away_slot, slotMap)),
  }
}

export const resolveAllMatches = (matches: Match[], slotMap: SlotMap): ResolvedMatch[] =>
  matches.map((m) => resolveMatchTeams(m, slotMap))
