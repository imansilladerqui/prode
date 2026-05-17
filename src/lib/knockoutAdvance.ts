import type { AdvanceSide, Match, Prediction } from '../types/database'

export type KnockoutWinner = {
  slot: string
  team: string
}

export type KnockoutValidationError = 'error.negativeGoals' | 'error.knockoutAdvanceRequired'

export const winnerSlotForMatch = (matchNumber: number): string => `W${matchNumber}`

export const loserSlotForMatch = (matchNumber: number): string => `L${matchNumber}`

export const isKnockoutDraw = (scoreA: number, scoreB: number): boolean => scoreA === scoreB

export const getKnockoutAdvancingTeam = (
  match: Match,
  prediction: Prediction,
  slotMap: Map<string, string>,
): string | null => {
  const homeTeam = slotMap.get(match.home_slot) ?? match.team_a
  const awayTeam = slotMap.get(match.away_slot) ?? match.team_b
  const { score_a: a, score_b: b, advance_side: advance } = prediction

  if (a > b) return homeTeam
  if (b > a) return awayTeam
  if (advance === 'a') return homeTeam
  if (advance === 'b') return awayTeam
  return null
}

export const getKnockoutWinner = (
  match: Match,
  prediction: Prediction | undefined,
  slotMap: Map<string, string>,
): KnockoutWinner | null => {
  if (!prediction) return null
  const team = getKnockoutAdvancingTeam(match, prediction, slotMap)
  if (!team) return null
  return { slot: winnerSlotForMatch(match.match_number), team }
}

export const getKnockoutLoser = (
  match: Match,
  prediction: Prediction,
  slotMap: Map<string, string>,
): string | null => {
  const homeTeam = slotMap.get(match.home_slot) ?? match.team_a
  const awayTeam = slotMap.get(match.away_slot) ?? match.team_b
  const winner = getKnockoutAdvancingTeam(match, prediction, slotMap)
  if (!winner) return null
  return winner === homeTeam ? awayTeam : homeTeam
}

export const applyKnockoutResults = (
  matches: Match[],
  predictions: Map<string, Prediction>,
  baseSlots: Map<string, string>,
): Map<string, string> => {
  const slots = new Map(baseSlots)
  const koMatches = [...matches]
    .filter((m) => m.stage !== 'group')
    .sort((a, b) => a.match_number - b.match_number)

  for (const m of koMatches) {
    const home = slots.get(m.home_slot) ?? m.team_a
    const away = slots.get(m.away_slot) ?? m.team_b
    slots.set(m.home_slot, home)
    slots.set(m.away_slot, away)

    const pred = predictions.get(m.id)
    const winner = getKnockoutWinner(m, pred, slots)
    if (!winner) continue

    slots.set(winner.slot, winner.team)

    if (m.stage === 'sf' && pred) {
      const loserTeam = getKnockoutLoser(m, pred, slots)
      if (loserTeam) slots.set(loserSlotForMatch(m.match_number), loserTeam)
    }
  }

  return slots
}

export const getKnockoutValidationError = (
  scoreA: number,
  scoreB: number,
  advanceSide: AdvanceSide | null | undefined,
): KnockoutValidationError | null => {
  if (scoreA < 0 || scoreB < 0) return 'error.negativeGoals'
  if (isKnockoutDraw(scoreA, scoreB) && !advanceSide) return 'error.knockoutAdvanceRequired'
  return null
}
