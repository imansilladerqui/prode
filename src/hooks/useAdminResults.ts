import { useMemo, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { AdvanceSide, DraftScore, Match, MatchResult, ResolvedMatch } from '../types'
import { emptyDraft, isDraftDraw } from '../types/draft'
import { draftScoreFromResult } from '../utils/helpers'
import { useResolvedMatchesById } from './useResolvedMatchesById'

type AdminFilter = 'pending' | 'all'

export const useAdminResults = (
  matches: Match[],
  resolvedMatches: ResolvedMatch[],
  results: Map<string, MatchResult>,
  savingMatchId: string | null,
  onSaveResult: (
    matchId: string,
    scoreA: number,
    scoreB: number,
    advanceSide: AdvanceSide | null,
  ) => Promise<boolean>,
) => {
  const { t } = useI18n()
  const [filter, setFilter] = useState<AdminFilter>('pending')
  const [drafts, setDrafts] = useState<Map<string, DraftScore>>(() => {
    const initial = new Map<string, DraftScore>()
    for (const m of matches) {
      initial.set(m.id, draftScoreFromResult(results.get(m.id)))
    }
    return initial
  })

  const resolvedById = useResolvedMatchesById(resolvedMatches)

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

  return {
    filter,
    setFilter,
    resolvedById,
    visible,
    drafts,
    updateDraft,
    setAdvance,
    handleSave,
    savingMatchId,
    t,
  }
}
