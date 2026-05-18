import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { I18nContext } from './context'
import { getStoredLocale, intlLocale, setStoredLocale } from './locale'
import type { Locale, MessageKey } from '../types'
import { interpolate, translations } from './translations'

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)

  const setLocale = useCallback((next: Locale) => {
    setStoredLocale(next)
    setLocaleState(next)
    document.documentElement.lang = next
  }, [])

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const template = translations[locale][key] ?? translations.es[key] ?? key
      return vars ? interpolate(template, vars) : template
    },
    [locale],
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      intlLocaleTag: intlLocale(locale),
    }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
