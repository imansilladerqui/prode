import type { MatchStage, MessageKey } from '../types'

const STAGE_KEYS: Record<MatchStage, MessageKey> = {
  group: 'stage.group',
  r32: 'stage.r32',
  r16: 'stage.r16',
  qf: 'stage.qf',
  sf: 'stage.sf',
  third: 'stage.third',
  final: 'stage.final',
}

const STAGE_SHORT_KEYS: Partial<Record<MatchStage, MessageKey>> = {
  qf: 'stage.qfShort',
  sf: 'stage.sfShort',
  third: 'stage.thirdShort',
}

export const getStageLabel = (
  stage: MatchStage,
  t: (key: MessageKey) => string,
  short = false,
): string => {
  if (short && STAGE_SHORT_KEYS[stage]) return t(STAGE_SHORT_KEYS[stage]!)
  return t(STAGE_KEYS[stage])
}

export const STAGE_ORDER: MatchStage[] = ['group', 'r32', 'r16', 'qf', 'sf', 'third', 'final']
