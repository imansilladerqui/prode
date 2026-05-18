import { GROUP_LETTERS } from '../data/wc2026-groups'
import { getStageLabel } from '../lib/stageLabels'
import { useNavPendingCounts } from '../hooks/useNavPendingCounts'
import type { MatchStage, NavSidebarProps } from '../types'

export const NavSidebar = ({
  matches,
  predictions,
  activeKey,
  onJump,
  variant = 'both',
}: NavSidebarProps) => {
  const showDesktop = variant === 'desktop' || variant === 'both'
  const showMobile = variant === 'mobile' || variant === 'both'
  const { pendingByKey, t } = useNavPendingCounts(matches, predictions)

  const knockoutNav: { key: MatchStage; short?: boolean }[] = [
    { key: 'r32' },
    { key: 'r16' },
    { key: 'qf', short: true },
    { key: 'sf', short: true },
    { key: 'third', short: true },
    { key: 'final' },
  ]

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
        <p className="nav-sidebar__heading nav-sidebar__heading--mobile">{t('nav.phases')}</p>
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
