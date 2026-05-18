import { LOCALE_STORAGE_KEY } from './translations'
import type { Locale } from '../types'

export const getStoredLocale = (): Locale => {
  const raw = localStorage.getItem(LOCALE_STORAGE_KEY)
  return raw === 'en' ? 'en' : 'es'
}

export const setStoredLocale = (locale: Locale): void => {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

export const intlLocale = (locale: Locale): string => (locale === 'en' ? 'en-US' : 'es-AR')
