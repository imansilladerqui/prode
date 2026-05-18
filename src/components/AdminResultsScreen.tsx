import { isKnockoutDraw } from '../lib/knockoutAdvance'
import { getStageLabel } from '../lib/stageLabels'
import { useAdminResults } from '../hooks/useAdminResults'
import type { AdminResultsScreenProps } from '../types'
import { emptyDraft } from '../types/draft'
import { KnockoutAdvancePicker } from './KnockoutAdvancePicker'
import { TeamFlag } from './TeamFlag'

export const AdminResultsScreen = ({
  matches,
  resolvedMatches,
  results,
  savingMatchId,
  onSaveResult,
}: AdminResultsScreenProps) => {
  const {
    filter,
    setFilter,
    resolvedById,
    visible,
    drafts,
    updateDraft,
    setAdvance,
    handleSave,
    savingMatchId: savingId,
    t,
  } = useAdminResults(matches, resolvedMatches, results, savingMatchId, onSaveResult)

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
                        savingId === match.id ||
                        (showPens && !draft.advanceSide)
                      }
                      onClick={() => void handleSave(match)}
                    >
                      {savingId === match.id ? t('admin.saving') : t('admin.save')}
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
