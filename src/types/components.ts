import type { FormEvent } from 'react'
import type { AdvanceSide, Match, MatchResult, Prediction } from './database'
import type { DraftScore } from './draft'
import type { CommunityPrediction } from './prediction'
import type { GroupLetter, ResolvedMatch, ThirdPlaceEntry, TeamStanding, TournamentState } from './tournament'

export type AppScreen = 'loading' | 'name' | 'matches'

export type MatchesScreenTab = 'play' | 'edit' | 'standings' | 'ranking' | 'admin'

export type EditPredictionsFilter = 'editable' | 'closed'

export type NavSidebarVariant = 'desktop' | 'mobile' | 'both'

export type MatchesScreenProps = {
  playerId: string
  userName: string
  showAdmin: boolean
  matches: Match[]
  predictions: Map<string, Prediction>
  matchResults: Map<string, MatchResult>
  communityPredictions: CommunityPrediction[]
  tournament: TournamentState
  draftScores: Map<string, DraftScore>
  error: string | null
  savingMatchId: string | null
  deletingMatchId: string | null
  savingResultMatchId: string | null
  savedMatchId: string | null
  onDraftChange: (matchId: string, side: 'a' | 'b', value: string) => void
  onAdvanceSideChange: (matchId: string, side: AdvanceSide) => void
  onApplyCommon: (matchId: string, scoreA: number, scoreB: number) => void
  onSave: (matchId: string) => Promise<boolean>
  onDelete: (matchId: string) => Promise<boolean>
  onSaveResult: (
    matchId: string,
    scoreA: number,
    scoreB: number,
    advanceSide: AdvanceSide | null,
  ) => Promise<boolean>
}

export type EditPredictionsScreenProps = {
  matches: Match[]
  resolvedMatches: ResolvedMatch[]
  predictions: Map<string, Prediction>
  draftScores: Map<string, DraftScore>
  savingMatchId: string | null
  deletingMatchId: string | null
  onDraftChange: (matchId: string, side: 'a' | 'b', value: string) => void
  onAdvanceSideChange: (matchId: string, side: AdvanceSide) => void
  onSave: (matchId: string) => Promise<boolean>
  onDelete: (matchId: string) => Promise<boolean>
}

export type AdminResultsScreenProps = {
  matches: Match[]
  resolvedMatches: ResolvedMatch[]
  results: Map<string, MatchResult>
  savingMatchId: string | null
  onSaveResult: (
    matchId: string,
    scoreA: number,
    scoreB: number,
    advanceSide: AdvanceSide | null,
  ) => Promise<boolean>
}

export type LeaderboardScreenProps = {
  playerId: string
  active: boolean
}

export type NameScreenProps = {
  nameInput: string
  error: string | null
  onNameChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

export type LoaderProps = {
  className?: string
}

export type MatchHeroCardProps = {
  match: ResolvedMatch
  matchIndex: number
  totalMatches: number
  draftA: string
  draftB: string
  advanceSide: AdvanceSide | null
  communityPredictions: CommunityPrediction[]
  isSaving: boolean
  justSaved: boolean
  predictionLocked: boolean
  onDraftChange: (side: 'a' | 'b', value: string) => void
  onAdvanceSideSelect: (side: AdvanceSide) => void
  onApplyCommon: (scoreA: number, scoreB: number) => void
}

export type SwipeMatchDeckProps = {
  match: ResolvedMatch | null
  matchIndex: number
  totalMatches: number
  draftA: string
  draftB: string
  advanceSide: AdvanceSide | null
  communityPredictions: CommunityPrediction[]
  isSaving: boolean
  justSaved: boolean
  canGoPrev: boolean
  canGoNext: boolean
  predictionLocked: boolean
  onDraftChange: (side: 'a' | 'b', value: string) => void
  onAdvanceSideSelect: (side: AdvanceSide) => void
  onApplyCommon: (scoreA: number, scoreB: number) => void
  onSaveAndNext: () => void
  onPrev: () => void
  onNext: () => void
}

export type EditPredictionMobileCardProps = {
  match: Match
  teamA: string
  teamB: string
  draft: DraftScore
  locked: boolean
  showPens: boolean
  label: string
  isBusy: boolean
  isSaving: boolean
  isDeleting: boolean
  onDraftChange: (matchId: string, side: 'a' | 'b', value: string) => void
  onAdvanceSideChange: (matchId: string, side: AdvanceSide) => void
  onSave: (matchId: string) => Promise<boolean>
  onDelete: (matchId: string) => Promise<boolean>
}

export type AllStandingsGridProps = {
  matches: Match[]
  predictions: Map<string, Prediction>
  tournament: TournamentState
}

export type GroupStandingsProps = {
  group: GroupLetter
  standings: TeamStanding[]
  topThirds: ThirdPlaceEntry[]
  done: number
  total: number
}

export type NavSidebarProps = {
  matches: Match[]
  predictions: Map<string, Prediction>
  activeKey: string | null
  onJump: (key: string) => void
  variant?: NavSidebarVariant
}

export type KnockoutAdvanceDialogProps = {
  open: boolean
  teamA: string
  teamB: string
  onPick: (side: AdvanceSide) => void
  onCancel: () => void
}

export type KnockoutAdvancePickerProps = {
  teamA: string
  teamB: string
  selected: AdvanceSide | null
  disabled?: boolean
  compact?: boolean
  onSelect: (side: AdvanceSide) => void
}

export type TeamFlagProps = {
  teamName: string
  flagSize?: number
  className?: string
}
