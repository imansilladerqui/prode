export interface User {
  id: string
  name: string
  created_at: string
}

export type MatchStage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final'

/** Home (team A) or away (team B) advances on penalties after a draw. */
export type AdvanceSide = 'a' | 'b'

export interface Match {
  id: string
  team_a: string
  team_b: string
  match_date: string
  group_name: string | null
  stage: MatchStage
  venue: string | null
  match_number: number
  home_slot: string
  away_slot: string
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  score_a: number
  score_b: number
  advance_side: AdvanceSide | null
  created_at: string
}

export interface MatchResult {
  match_id: string
  score_a: number
  score_b: number
  advance_side: AdvanceSide | null
  entered_at: string
}

export interface LeaderboardRow {
  user_id: string
  user_name: string
  exact_hits: number
  winner_hits: number
  total_points: number
  predictions_made: number
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Pick<User, 'id' | 'name'> & { created_at?: string }
        Update: Partial<Pick<User, 'name'>>
      }
      matches: {
        Row: Match
        Insert: Omit<Match, 'id'> & { id?: string }
        Update: Partial<Omit<Match, 'id'>>
      }
      predictions: {
        Row: Prediction
        Insert: {
          user_id: string
          match_id: string
          score_a: number
          score_b: number
          advance_side?: AdvanceSide | null
          id?: string
          created_at?: string
        }
        Update: Partial<Pick<Prediction, 'score_a' | 'score_b' | 'advance_side'>>
      }
      match_results: {
        Row: MatchResult
        Insert: MatchResult
        Update: Partial<Pick<MatchResult, 'score_a' | 'score_b'>>
      }
    }
    Views: {
      leaderboard: {
        Row: LeaderboardRow
      }
    }
  }
}
