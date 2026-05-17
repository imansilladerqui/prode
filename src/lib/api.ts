import { supabase } from './supabase'
import type { AdvanceSide, LeaderboardRow, Match, MatchResult, Prediction, User } from '../types/database'

export const fetchUser = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as User | null
}

export const insertUser = async (id: string, name: string): Promise<User> => {
  const { data, error } = await supabase.from('users').insert({ id, name } as User).select().single()
  if (error) throw error
  return data as User
}

export const fetchMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('match_number', { ascending: true })
  if (error) throw error
  return (data ?? []) as Match[]
}

export const fetchPredictions = async (userId: string): Promise<Prediction[]> => {
  const { data, error } = await supabase.from('predictions').select('*').eq('user_id', userId)
  if (error) throw error
  return (data ?? []) as Prediction[]
}

export const fetchAllPredictions = async (): Promise<Pick<Prediction, 'match_id' | 'score_a' | 'score_b'>[]> => {
  const { data, error } = await supabase.from('predictions').select('match_id, score_a, score_b')
  if (error) throw error
  return (data ?? []) as Pick<Prediction, 'match_id' | 'score_a' | 'score_b'>[]
}

export const fetchMatchResults = async (): Promise<MatchResult[]> => {
  const { data, error } = await supabase.from('match_results').select('*')
  if (error) throw error
  return (data ?? []) as MatchResult[]
}

export const fetchLeaderboard = async (): Promise<LeaderboardRow[]> => {
  const { data, error } = await supabase.from('leaderboard').select('*')
  if (error) throw error
  return (data ?? []) as LeaderboardRow[]
}

export const upsertMatchResult = async (
  matchId: string,
  scoreA: number,
  scoreB: number,
  advanceSide: AdvanceSide | null = null,
): Promise<void> => {
  const row = {
    match_id: matchId,
    score_a: scoreA,
    score_b: scoreB,
    advance_side: advanceSide,
    entered_at: new Date().toISOString(),
  }
  const { error } = await supabase
    .from('match_results')
    .upsert(row as MatchResult, { onConflict: 'match_id' })
  if (error) throw error
}

export const upsertPrediction = async (
  userId: string,
  matchId: string,
  scoreA: number,
  scoreB: number,
  advanceSide: AdvanceSide | null = null,
): Promise<Prediction> => {
  const row = {
    user_id: userId,
    match_id: matchId,
    score_a: scoreA,
    score_b: scoreB,
    advance_side: advanceSide,
  }
  const { data, error } = await supabase
    .from('predictions')
    .upsert(row, { onConflict: 'user_id,match_id' })
    .select()
    .single()
  if (error) throw error
  if (!data) throw new Error('Prediction was not saved to the database')
  return data as Prediction
}

export const deletePrediction = async (userId: string, matchId: string): Promise<void> => {
  const { data, error } = await supabase
    .from('predictions')
    .delete()
    .eq('user_id', userId)
    .eq('match_id', matchId)
    .select('match_id')
  if (error) throw error
  if (!data?.length) {
    throw new Error('Prediction was not deleted from the database')
  }
}
