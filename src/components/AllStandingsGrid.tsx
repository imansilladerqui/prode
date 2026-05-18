import { GROUP_LETTERS } from '../data/wc2026-groups'
import { countGroupMatchesPredicted } from '../lib/standings'
import type { AllStandingsGridProps, GroupLetter } from '../types'
import { GroupStandings } from './GroupStandings'

export const AllStandingsGrid = ({ matches, predictions, tournament }: AllStandingsGridProps) => (
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
