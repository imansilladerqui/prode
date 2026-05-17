import { useMemo, useState } from 'react'
import type { ResolvedMatch } from '../lib/bracketResolver'
import { isKnockoutDraw } from '../lib/knockoutAdvance'
import { getStageLabel } from '../lib/stageLabels'
import { useI18n } from '../i18n/useI18n'
import type { AdvanceSide, Match, MatchResult } from '../types/database'
import { emptyDraft, isDraftDraw, type DraftScore } from '../types/draft'
import { KnockoutAdvancePicker } from './KnockoutAdvancePicker'
import { TeamFlag } from './TeamFlag'

type Props = {
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

const draftFromResult = (result: MatchResult | undefined): DraftScore => {
  if (!result) return emptyDraft()
  return {
    a: String(result.score_a),
    b: String(result.score_b),
    advanceSide: result.advance_side,
  }
}

export const AdminResultsScreen = ({
  matches,
  resolvedMatches,
  results,
  savingMatchId,
  onSaveResult,
}: Props) => {
  const { t } = useI18n()
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')
  const [drafts, setDrafts] = useState<Map<string, DraftScore>>(() => {
    const initial = new Map<string, DraftScore>()
    for (const m of matches) {
      initial.set(m.id, draftFromResult(results.get(m.id)))
    }
    return initial
  })

  const resolvedById = useMemo(() => {
    const map = new Map<string, ResolvedMatch>()
    for (const r of resolvedMatches) map.set(r.id, r)
    return map
  }, [resolvedMatches])

  const visible = useMemo(() => {
    const sorted = [...matches].sort((a, b) => a.match_number - b.match_number)
    if (filter === 'all') return sorted
    return sorted.filter((m) => !results.has(m.id))
  }, [matches, filter, results])

  const updateDraft = (matchId: string, side: 'a' | 'b', value: string) => {
    if (value !== '' && !/^\d+$/.test(value)) return
    setDrafts((prev) => {
      const next = new Map(prev)
      const current = next.get(matchId) ?? emptyDraft()
      const a = side === 'a' ? value : current.a
      const b = side === 'b' ? value : current.b
      const updated: DraftScore = { a, b, advanceSide: current.advanceSide }
      if (!isDraftDraw(updated)) updated.advanceSide = null
      next.set(matchId, updated)
      return next
    })
  }

  const setAdvance = (matchId: string, side: AdvanceSide) => {
    setDrafts((prev) => {
      const next = new Map(prev)
      const current = next.get(matchId) ?? emptyDraft()
      next.set(matchId, { ...current, advanceSide: side })
      return next
    })
  }

  const handleSave = async (match: Match) => {
    const draft = drafts.get(match.id) ?? emptyDraft()
    if (draft.a === '' || draft.b === '') return
    const scoreA = Number(draft.a)
    const scoreB = Number(draft.b)
    const advanceSide =
      match.stage !== 'group' && scoreA === scoreB ? draft.advanceSide : null
    const ok = await onSaveResult(match.id, scoreA, scoreB, advanceSide)
    if (ok) {
      setDrafts((prev) => {
        const next = new Map(prev)
        next.set(match.id, { a: draft.a, b: draft.b, advanceSide })
        return next
      })
    }
  }

  return (
    <section className="admin-results">
      <header className="admin-results__header">
        <h2 className="admin-results__title">{t('admin.title')}</h2>
        <div className="admin-results__filters">
          <button
            type="button"
            className={filter === 'pending' ? 'tab tab--active' : 'tab'}
            onClick={() => setFilter('pending')}
          >
            {t('admin.filterPending')}
          </button>
          <button
            type="button"
            className={filter === 'all' ? 'tab tab--active' : 'tab'}
            onClick={() => setFilter('all')}
          >
            {t('admin.filterAll')}
          </button>
        </div>
      </header>

      <div className="admin-results-table-wrap">
        <table className="admin-results-table">
          <thead>
            <tr>
              <th scope="col">{t('admin.colNum')}</th>
              <th scope="col">{t('admin.colMatch')}</th>
              <th scope="col">{t('admin.colExact')}</th>
              <th scope="col">{t('admin.colWinner')}</th>
              <th scope="col">{t('admin.colAction')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((match) => {
              const resolved = resolvedById.get(match.id)
              const teamA = resolved?.resolvedTeamA ?? match.team_a
              const teamB = resolved?.resolvedTeamB ?? match.team_b
              const draft = drafts.get(match.id) ?? emptyDraft()
              const saved = results.get(match.id)
              const isKnockout = match.stage !== 'group'
              const showPens =
                isKnockout &&
                draft.a !== '' &&
                draft.b !== '' &&
                isKnockoutDraw(Number(draft.a), Number(draft.b))
              const label = match.group_name ?? getStageLabel(match.stage, t)

              return (
                <tr key={match.id} className={saved ? 'admin-results-table__row--saved' : undefined}>
                  <td className="admin-results-table__num">
                    <span>{match.match_number}</span>
                    <span className="admin-results-table__badge">{label}</span>
                  </td>
                  <td className="admin-results-table__match">
                    <TeamFlag teamName={teamA} flagSize={18} />
                    <span className="admin-results-table__vs">vs</span>
                    <TeamFlag teamName={teamB} flagSize={18} />
                  </td>
                  <td className="admin-results-table__exact">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="score-input score-input--sm"
                      aria-label={`${teamA} ${t('admin.colExact')}`}
                      value={draft.a}
                      onChange={(e) => updateDraft(match.id, 'a', e.target.value)}
                    />
                    <span>–</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="score-input score-input--sm"
                      aria-label={`${teamB} ${t('admin.colExact')}`}
                      value={draft.b}
                      onChange={(e) => updateDraft(match.id, 'b', e.target.value)}
                    />
                  </td>
                  <td className="admin-results-table__winner">
                    {showPens ? (
                      <KnockoutAdvancePicker
                        teamA={teamA}
                        teamB={teamB}
                        selected={draft.advanceSide}
                        compact
                        onSelect={(side) => setAdvance(match.id, side)}
                      />
                    ) : (
                      <span className="admin-results-table__na">—</span>
                    )}
                  </td>
                  <td className="admin-results-table__action">
                    <button
                      type="button"
                      className="btn-primary admin-results__save"
                      disabled={
                        draft.a === '' ||
                        draft.b === '' ||
                        savingMatchId === match.id ||
                        (showPens && !draft.advanceSide)
                      }
                      onClick={() => void handleSave(match)}
                    >
                      {savingMatchId === match.id ? t('admin.saving') : t('admin.save')}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <p className="muted admin-results__empty">{t('admin.empty')}</p>
      )}
    </section>
  )
}
