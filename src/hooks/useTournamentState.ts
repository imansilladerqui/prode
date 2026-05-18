import { useMemo } from 'react'
import { computeTournamentState } from '../lib/tournamentState'
import type { Match, Prediction, TournamentState } from '../types'

export const useTournamentState = (
  matches: Match[],
  predictions: Map<string, Prediction>,
): TournamentState =>
  useMemo(() => computeTournamentState(matches, predictions), [matches, predictions])
