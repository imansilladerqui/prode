import { useMemo } from 'react'
import { GROUP_LETTERS } from '../data/wc2026-groups'
import { useI18n } from '../i18n/useI18n'
import { getStageLabel } from '../lib/stageLabels'
import type { Match, MatchStage, Prediction } from '../types/database'

type Props = {
  matches: Match[]
  predictions: Map<string, Prediction>
  activeKey: string | null
  onJump: (key: string) => void
  variant?: 'desktop' | 'mobile' | 'both'
}

export const NavSidebar = ({
  matches,
  predictions,
  activeKey,
  onJump,
  variant = 'both',
}: Props) => {
  const showDesktop = variant === 'desktop' || variant === 'both'
  const showMobile = variant === 'mobile' || variant === 'both'
  const { t } = useI18n()

  const knockoutNav: { key: MatchStage; short?: boolean }[] = [
    { key: 'r32' },
    { key: 'r16' },
    { key: 'qf', short: true },
    { key: 'sf', short: true },
    { key: 'third', short: true },
    { key: 'final' },
  ]

  const pendingByKey = useMemo(() => {
    const counts = new Map<string, number>()
    for (const m of matches) {
      if (predictions.has(m.id)) continue
      const key = m.stage === 'group' && m.group_name ? m.group_name : m.stage
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [matches, predictions])

  const renderItem = (key: string, label: string) => {
    const pending = pendingByKey.get(key) ?? 0
    const isActive = activeKey === key
    return (
      <button
        key={key}
        type="button"
        className={isActive ? 'nav-item nav-item--active' : 'nav-item'}
        onClick={() => onJump(key)}
      >
        <span className="nav-item__label">{label}</span>
        {pending > 0 && <span className="nav-item__badge">{pending}</span>}
      </button>
    )
  }

  return (
    <nav className="nav-sidebar" aria-label={t('nav.aria')}>
      {showDesktop && (
      <div className="nav-sidebar__panel nav-sidebar__desktop">
        <p className="nav-sidebar__heading">{t('nav.groups')}</p>
        <div className="nav-sidebar__list">
          {GROUP_LETTERS.map((letter) => {
            const key = `Grupo ${letter}`
            return renderItem(key, t('nav.group', { letter }))
          })}
        </div>
        <p className="nav-sidebar__heading">{t('nav.knockout')}</p>
        <div className="nav-sidebar__list">
          {knockoutNav.map(({ key, short }) =>
            renderItem(key, getStageLabel(key, t, short ?? false)),
          )}
        </div>
      </div>
      )}

      {showMobile && (
      <div
        className="nav-sidebar__panel nav-sidebar__mobile"
        role="navigation"
        aria-label={t('nav.jumpAria')}
      >
        <div className="nav-pills">
          {GROUP_LETTERS.map((letter) => {
            const key = `Grupo ${letter}`
            const pending = pendingByKey.get(key) ?? 0
            const isActive = activeKey === key
            return (
              <button
                key={key}
                type="button"
                className={isActive ? 'nav-pill nav-pill--active' : 'nav-pill'}
                onClick={() => onJump(key)}
              >
                {letter}
                {pending > 0 && <span className="nav-pill__dot" />}
              </button>
            )
          })}
          {knockoutNav.map(({ key, short }) => {
            const pending = pendingByKey.get(key) ?? 0
            const isActive = activeKey === key
            return (
              <button
                key={key}
                type="button"
                className={isActive ? 'nav-pill nav-pill--active' : 'nav-pill'}
                onClick={() => onJump(key)}
              >
                {getStageLabel(key, t, short ?? false)}
                {pending > 0 && <span className="nav-pill__dot" />}
              </button>
            )
          })}
        </div>
      </div>
      )}
    </nav>
  )
}
