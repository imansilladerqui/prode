import { useMemo } from 'react'
import type { ResolvedMatch } from '../types'
import { resolvedMatchesById } from '../utils/helpers'

export const useResolvedMatchesById = (resolvedMatches: ResolvedMatch[]) =>
  useMemo(() => resolvedMatchesById(resolvedMatches), [resolvedMatches])
