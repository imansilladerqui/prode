import { useI18n } from '../i18n/useI18n'
import type { Locale } from '../types'

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useI18n()

  const pick = (next: Locale) => {
    if (next !== locale) setLocale(next)
  }

  return (
    <div className="lang-switcher" role="group" aria-label={t('lang.switch')}>
      {(['es', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          className={locale === code ? 'lang-switcher__btn lang-switcher__btn--active' : 'lang-switcher__btn'}
          aria-pressed={locale === code}
          onClick={() => pick(code)}
        >
          {t(code === 'es' ? 'lang.es' : 'lang.en')}
        </button>
      ))}
    </div>
  )
}
