import { LanguageSwitcher } from './LanguageSwitcher'
import { useI18n } from '../i18n/useI18n'

type Props = {
  nameInput: string
  error: string | null
  onNameChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const NameScreen = ({ nameInput, error, onNameChange, onSubmit }: Props) => {
  const { t } = useI18n()

  return (
    <div className="app">
      <div className="app__lang">
        <LanguageSwitcher />
      </div>
      <header className="header">
        <div className="wc-hero-lockup">
          <span className="wc-mark wc-mark--hero" aria-hidden>
            26
          </span>
          <div>
            <p className="top-bar__event">{t('app.event')}</p>
            <h1>{t('app.title')}</h1>
            <p className="subtitle">{t('app.hosts')}</p>
          </div>
        </div>
        <p className="subtitle">{t('name.prompt')}</p>
      </header>
      <form className="card name-form" onSubmit={onSubmit}>
        <label htmlFor="name">{t('name.label')}</label>
        <input
          id="name"
          type="text"
          value={nameInput}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t('name.placeholder')}
          maxLength={80}
          autoFocus
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{t('name.submit')}</button>
      </form>
    </div>
  )
}
