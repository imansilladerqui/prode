import { createContext } from 'react'
import type { Locale, MessageKey } from './translations'

export type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  intlLocaleTag: string
}

export const I18nContext = createContext<I18nContextValue | null>(null)
