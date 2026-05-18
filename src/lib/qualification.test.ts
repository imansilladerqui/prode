import { describe, expect, it } from 'vitest'
import { THIRD_PLACE_CANDIDATES, THIRD_PLACE_MATCH_ORDER } from '../data/third-place-slots'
import type { GroupLetter } from '../types'
import { buildSlotMap } from './qualification'
import type { TeamStanding, ThirdPlaceEntry } from '../types'

const standing = (group: GroupLetter, team: string, points: number): TeamStanding => ({
  slot: `${group}3`,
  team,
  played: 3,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: points,
  goalsAgainst: 0,
  goalDiff: points,
  points,
})

const emptyStandings = (): Record<GroupLetter, TeamStanding[]> => {
  const letters = 'ABCDEFGHIJKL'.split('') as GroupLetter[]
  return Object.fromEntries(
    letters.map((g) => [
      g,
      [
        standing(g, `${g}-1st`, 9),
        standing(g, `${g}-2nd`, 6),
        standing(g, `${g}-3rd`, 3),
      ],
    ]),
  ) as Record<GroupLetter, TeamStanding[]>
}

const third = (group: GroupLetter, team: string): ThirdPlaceEntry => ({
  group,
  team,
  slot: `${group}3`,
  points: 4,
  goalDiff: 1,
  goalsFor: 3,
})

describe('THIRD_PLACE_MATCH_ORDER', () => {
  it('lists exactly eight third-place R32 matches', () => {
    expect(THIRD_PLACE_MATCH_ORDER).toHaveLength(8)
    expect(new Set(THIRD_PLACE_MATCH_ORDER).size).toBe(8)
  })

  it('does not use runner-up-only R32 matches', () => {
    const runnerUpOnly = [78, 83, 86, 88]
    for (const n of THIRD_PLACE_MATCH_ORDER) {
      expect(runnerUpOnly).not.toContain(n)
    }
  })
})

describe('buildSlotMap third-place assignment', () => {
  it('fills every 3@ R32 slot when eight thirds can be matched to candidate pools', () => {
    const standings = emptyStandings()
    const topThirds: ThirdPlaceEntry[] = [
      third('A', 'Team-A'),
      third('D', 'Team-D'),
      third('F', 'Team-F'),
      third('J', 'Team-J'),
      third('B', 'Team-B'),
      third('I', 'Team-I'),
      third('G', 'Team-G'),
      third('L', 'Team-L'),
    ]

    const slots = buildSlotMap(standings, topThirds)
    const assignedTeams = new Set<string>()

    for (const matchNum of THIRD_PLACE_MATCH_ORDER) {
      const team = slots.get(`3@${matchNum}`)
      expect(team, `3@${matchNum} should be filled`).toBeTruthy()
      assignedTeams.add(team!)
    }

    expect(assignedTeams.size).toBe(8)
  })

  it('only assigns groups that are candidates for each match', () => {
    const standings = emptyStandings()
    const topThirds: ThirdPlaceEntry[] = [
      third('A', 'Team-A'),
      third('D', 'Team-D'),
      third('F', 'Team-F'),
      third('J', 'Team-J'),
      third('B', 'Team-B'),
      third('I', 'Team-I'),
      third('G', 'Team-G'),
      third('L', 'Team-L'),
    ]
    const slots = buildSlotMap(standings, topThirds)
    const groupForTeam = (team: string) => topThirds.find((t) => t.team === team)!.group

    for (const matchNum of THIRD_PLACE_MATCH_ORDER) {
      const candidates = THIRD_PLACE_CANDIDATES[matchNum]
      expect(candidates).toBeDefined()
      expect(candidates!.length).toBeGreaterThan(0)
      const team = slots.get(`3@${matchNum}`)
      expect(candidates).toContain(groupForTeam(team!))
    }
  })
})
