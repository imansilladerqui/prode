import { GROUP_LETTERS } from '../data/wc2026-groups'
import type { GroupLetter } from '../data/wc2026-groups'
import type { TournamentState } from '../lib/useTournamentState'
import type { Match, Prediction } from '../types/database'
import { countGroupMatchesPredicted } from '../lib/standings'
import { GroupStandings } from './GroupStandings'

type Props = {
  matches: Match[]
  predictions: Map<string, Prediction>
  tournament: TournamentState
}

export const AllStandingsGrid = ({ matches, predictions, tournament }: Props) => (
  <div className="standings-grid">
    {GROUP_LETTERS.map((g: GroupLetter) => {
      const prog = countGroupMatchesPredicted(g, matches, predictions)
      return (
        <div key={g} className="standings-grid__item">
          <GroupStandings
            group={g}
            standings={tournament.standingsByGroup[g]}
            topThirds={tournament.topThirds}
            done={prog.done}
            total={prog.total}
          />
        </div>
      )
    })}
  </div>
)
