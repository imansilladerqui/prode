import { useContext } from 'react'
import type { I18nContextValue } from '../types'
import { I18nContext } from './context'

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
