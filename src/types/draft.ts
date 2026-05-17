import type { AdvanceSide } from './database'

export type DraftScore = {
  a: string
  b: string
  advanceSide: AdvanceSide | null
}

export const emptyDraft = (): DraftScore => ({ a: '', b: '', advanceSide: null })

export const isDraftDraw = (draft: DraftScore): boolean =>
  draft.a !== '' && draft.b !== '' && Number(draft.a) === Number(draft.b)
