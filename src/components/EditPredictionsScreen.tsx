import { useMemo, useState } from 'react'
import type { ResolvedMatch } from '../lib/bracketResolver'
import { formatMatchDate } from '../lib/formatMatchDate'
import { canEditPrediction } from '../lib/matchLock'
import { isKnockoutDraw } from '../lib/knockoutAdvance'
import { getStageLabel } from '../lib/stageLabels'
import { useI18n } from '../i18n/useI18n'
import type { AdvanceSide, Match, Prediction } from '../types/database'
import { emptyDraft, type DraftScore } from '../types/draft'
import { KnockoutAdvancePicker } from './KnockoutAdvancePicker'
import { TeamFlag } from './TeamFlag'

type Filter = 'editable' | 'closed'

type Props = {
  matches: Match[]
  resolvedMatches: ResolvedMatch[]
  predictions: Map<string, Prediction>
  draftScores: Map<string, DraftScore>
  savingMatchId: string | null
  deletingMatchId: string | null
  onDraftChange: (matchId: string, side: 'a' | 'b', value: string) => void
  onAdvanceSideChange: (matchId: string, side: AdvanceSide) => void
  onSave: (matchId: string) => Promise<boolean>
  onDelete: (matchId: string) => Promise<boolean>
}

export const EditPredictionsScreen = ({
  matches,
  resolvedMatches,
  predictions,
  draftScores,
  savingMatchId,
  deletingMatchId,
  onDraftChange,
  onAdvanceSideChange,
  onSave,
  onDelete,
}: Props) => {
  const { t, intlLocaleTag } = useI18n()
  const [filter, setFilter] = useState<Filter>('editable')

  const resolvedById = useMemo(() => {
    const map = new Map<string, ResolvedMatch>()
    for (const r of resolvedMatches) map.set(r.id, r)
    return map
  }, [resolvedMatches])

  const savedMatches = useMemo(
    () =>
      [...matches]
        .filter((m) => predictions.has(m.id))
        .sort((a, b) => a.match_number - b.match_number),
    [matches, predictions],
  )

  const visible = useMemo(() => {
    if (filter === 'closed') {
      return savedMatches.filter((m) => !canEditPrediction(m.match_date))
    }
    return savedMatches.filter((m) => canEditPrediction(m.match_date))
  }, [savedMatches, filter])

  return (
    <div className="leaderboard-wrap edit-predictions">
      <div
        className="leaderboard-legend leaderboard-legend--warning"
        role="note"
        aria-label={t('edit.hintAria')}
      >
        <p className="leaderboard-legend__message">{t('edit.hint')}</p>
      </div>

      <div className="edit-predictions__filters" role="group" aria-label={t('edit.filtersAria')}>
        <button
          type="button"
          className={filter === 'editable' ? 'tab tab--active' : 'tab'}
          onClick={() => setFilter('editable')}
        >
          {t('edit.filterEditable')}
        </button>
        <button
          type="button"
          className={filter === 'closed' ? 'tab tab--active' : 'tab'}
          onClick={() => setFilter('closed')}
        >
          {t('edit.filterClosed')}
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="leaderboard-empty">
          <p className="leaderboard-empty__message">{t('edit.empty')}</p>
        </div>
      ) : (
        <table className="leaderboard-table edit-predictions-table">
          <thead>
            <tr>
              <th scope="col">{t('admin.colNum')}</th>
              <th scope="col">{t('edit.colKickoff')}</th>
              <th scope="col">{t('admin.colMatch')}</th>
              <th scope="col">{t('edit.colResult')}</th>
              <th scope="col">{t('edit.colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((match) => {
              const resolved = resolvedById.get(match.id)
              const teamA = resolved?.resolvedTeamA ?? match.team_a
              const teamB = resolved?.resolvedTeamB ?? match.team_b
              const draft = draftScores.get(match.id) ?? emptyDraft()
              const locked = !canEditPrediction(match.match_date)
              const isKnockout = match.stage !== 'group'
              const showPens =
                isKnockout &&
                draft.a !== '' &&
                draft.b !== '' &&
                isKnockoutDraw(Number(draft.a), Number(draft.b))
              const label = match.group_name ?? getStageLabel(match.stage, t)
              const isBusy = savingMatchId === match.id || deletingMatchId === match.id

              return (
                <tr
                  key={match.id}
                  className={locked ? 'edit-predictions__row--locked' : undefined}
                >
                  <td className="edit-predictions-table__num">
                    <span>{match.match_number}</span>
                    <span className="edit-predictions-table__badge">{label}</span>
                  </td>
                  <td className="edit-predictions__kickoff">
                    <time dateTime={match.match_date}>
                      {formatMatchDate(match.match_date, intlLocaleTag)}
                    </time>
                    {locked && (
                      <span className="edit-predictions__locked-badge">{t('edit.locked')}</span>
                    )}
                  </td>
                  <td className="edit-predictions-table__match">
                    <div className="edit-predictions-table__match-inner">
                      <TeamFlag teamName={teamA} flagSize={18} className="team-line--compact" />
                      <span className="edit-predictions-table__vs">vs</span>
                      <TeamFlag teamName={teamB} flagSize={18} className="team-line--compact" />
                    </div>
                  </td>
                  <td className="edit-predictions__result">
                    <div className="edit-predictions__scores">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="score-input score-input--sm"
                        aria-label={teamA}
                        value={draft.a}
                        disabled={locked}
                        readOnly={locked}
                        onChange={(e) => onDraftChange(match.id, 'a', e.target.value)}
                      />
                      <span>–</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="score-input score-input--sm"
                        aria-label={teamB}
                        value={draft.b}
                        disabled={locked}
                        readOnly={locked}
                        onChange={(e) => onDraftChange(match.id, 'b', e.target.value)}
                      />
                    </div>
                    {showPens && (
                      <KnockoutAdvancePicker
                        teamA={teamA}
                        teamB={teamB}
                        selected={draft.advanceSide}
                        compact
                        disabled={locked}
                        onSelect={(side) => onAdvanceSideChange(match.id, side)}
                      />
                    )}
                  </td>
                  <td className="edit-predictions-table__action">
                    {!locked ? (
                      <div className="edit-predictions-table__actions">
                        <button
                          type="button"
                          className="btn-danger edit-predictions__reset"
                          disabled={isBusy}
                          onClick={() => void onDelete(match.id)}
                        >
                          {deletingMatchId === match.id ? t('edit.resetting') : t('edit.reset')}
                        </button>
                        <button
                          type="button"
                          className="btn-primary edit-predictions__save"
                          disabled={
                            isBusy ||
                            draft.a === '' ||
                            draft.b === '' ||
                            (showPens && !draft.advanceSide)
                          }
                          onClick={() => void onSave(match.id)}
                        >
                          {savingMatchId === match.id ? t('match.saving') : t('match.save')}
                        </button>
                      </div>
                    ) : (
                      <span className="edit-predictions-table__na">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
