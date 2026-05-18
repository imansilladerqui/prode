import type { DraftScore, GroupLetter, Match, MatchResult, Prediction, ResolvedMatch } from '../types'
import { emptyDraft } from '../types/draft'

export const leaderboardMedalForPosition = (position: number): string | null => {
  if (position === 1) return '🥇'
  if (position === 2) return '🥈'
  if (position === 3) return '🥉'
  return null
}

export const groupLetterFromMatch = (match: Match | undefined): GroupLetter | null => {
  if (!match?.group_name) return null
  const letter = match.group_name.replace('Grupo ', '').trim()
  if (letter.length === 1 && letter >= 'A' && letter <= 'L') return letter as GroupLetter
  return null
}

export const draftScoreFromResult = (result: MatchResult | undefined): DraftScore => {
  if (!result) return emptyDraft()
  return {
    a: String(result.score_a),
    b: String(result.score_b),
    advanceSide: result.advance_side,
  }
}

export const resolvedMatchesById = (
  resolvedMatches: ResolvedMatch[],
): Map<string, ResolvedMatch> => {
  const map = new Map<string, ResolvedMatch>()
  for (const r of resolvedMatches) map.set(r.id, r)
  return map
}

export const buildOrderedMatchIds = (
  matches: Match[],
  predictions: Map<string, Prediction>,
): string[] => {
  const sorted = [...matches].sort((a, b) => a.match_number - b.match_number)
  const pending = sorted.filter((m) => !predictions.has(m.id))
  const done = sorted.filter((m) => predictions.has(m.id))
  return [...pending, ...done].map((m) => m.id)
}
