import { es } from '../i18n/messages/es'

export type Locale = 'es' | 'en'

export type MessageKey = keyof typeof es

export type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  intlLocaleTag: string
}
