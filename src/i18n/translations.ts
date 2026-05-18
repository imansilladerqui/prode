import { en } from './messages/en'
import { es } from './messages/es'
import type { Locale, MessageKey } from '../types/i18n'

export const LOCALE_STORAGE_KEY = 'prode_locale'

export const translations: Record<Locale, Record<MessageKey, string>> = { es, en }

export const interpolate = (
  template: string,
  vars: Record<string, string | number>,
): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
