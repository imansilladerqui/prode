import { WC2026_GROUPS } from '../data/wc2026-groups'
import type { Match } from './database'

export type GroupLetter = keyof typeof WC2026_GROUPS

export type TeamStanding = {
  slot: string
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export type GroupMatchResult = {
  homeSlot: string
  awaySlot: string
  homeGoals: number
  awayGoals: number
}

export type MiniStanding = {
  points: number
  goalDiff: number
  goalsFor: number
}

export type ThirdPlaceEntry = {
  group: GroupLetter
  team: string
  slot: string
  points: number
  goalDiff: number
  goalsFor: number
}

export type SlotMap = Map<string, string>

export type ResolvedMatch = Match & {
  resolvedTeamA: string
  resolvedTeamB: string
  slotsResolved: boolean
}

export type TournamentState = {
  standingsByGroup: Record<GroupLetter, TeamStanding[]>
  topThirds: ThirdPlaceEntry[]
  slotMap: SlotMap
  resolvedMatches: ResolvedMatch[]
}
