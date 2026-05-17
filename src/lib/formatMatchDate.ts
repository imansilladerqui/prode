export const formatMatchDate = (iso: string, localeTag = 'es-AR'): string =>
  new Intl.DateTimeFormat(localeTag, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

export const formatMatchTime = (iso: string, localeTag = 'es-AR'): string =>
  new Intl.DateTimeFormat(localeTag, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

export const formatMatchDay = (iso: string, localeTag = 'es-AR'): string =>
  new Intl.DateTimeFormat(localeTag, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso))
