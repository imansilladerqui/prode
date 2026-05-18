import { useMemo } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { MatchesScreenTab } from '../types'

export type TabConfig = {
  id: MatchesScreenTab
  label: string
  shortLabel: string
  ariaLabel: string
}

export const useMatchesTabs = (showAdmin: boolean): TabConfig[] => {
  const { t } = useI18n()

  return useMemo(
    () => {
      const tabs: TabConfig[] = [
        {
          id: 'play',
          label: t('tab.play'),
          shortLabel: t('tab.playShort'),
          ariaLabel: t('tab.play'),
        },
        {
          id: 'edit',
          label: t('tab.edit'),
          shortLabel: t('tab.editShort'),
          ariaLabel: t('tab.edit'),
        },
        {
          id: 'standings',
          label: t('tab.standings'),
          shortLabel: t('tab.standingsShort'),
          ariaLabel: t('tab.standings'),
        },
        {
          id: 'ranking',
          label: t('tab.ranking'),
          shortLabel: t('tab.rankingShort'),
          ariaLabel: t('tab.ranking'),
        },
      ]
      if (showAdmin) {
        tabs.push({
          id: 'admin',
          label: t('tab.admin'),
          shortLabel: t('tab.adminShort'),
          ariaLabel: t('tab.admin'),
        })
      }
      return tabs
    },
    [showAdmin, t],
  )
}
