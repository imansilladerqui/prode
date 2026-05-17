export type Locale = 'es' | 'en'

export const LOCALE_STORAGE_KEY = 'prode_locale'

const es = {
  'app.loading': 'Cargando…',
  'app.loadError': 'Error al cargar datos',
  'app.title': 'Prode',
  'app.event': 'FIFA World Cup',
  'app.hosts': 'USA · México · Canadá',
  'lang.switch': 'Idioma',
  'lang.es': 'ES',
  'lang.en': 'EN',

  'name.prompt': 'Ingresá tu nombre para empezar',
  'name.label': 'Tu nombre',
  'name.placeholder': 'Ej: Juan',
  'name.submit': 'Entrar al prode',
  'name.required': 'Ingresá un nombre',
  'name.saveError': 'No se pudo guardar el nombre',

  'tab.play': 'Jugar',
  'tab.standings': 'Tablas',
  'tab.qualified': 'Clasificados',
  'tab.ranking': 'Ranking',
  'tab.admin': 'Admin',

  'admin.title': 'Resultados oficiales',
  'admin.colNum': '#',
  'admin.colMatch': 'Partido',
  'admin.colExact': 'Exacto',
  'admin.colWinner': 'Ganador',
  'admin.colAction': '',
  'admin.filterPending': 'Sin cargar',
  'admin.filterAll': 'Todos',
  'admin.save': 'Guardar',
  'admin.saving': 'Guardando…',
  'admin.saved': 'Cargado',
  'admin.empty': 'No hay partidos en este filtro.',
  'admin.saveError': 'No se pudo guardar el resultado',

  'nav.groups': 'Grupos',
  'nav.knockout': 'Eliminatorias',
  'nav.phases': 'Fases',
  'nav.group': 'Grupo {letter}',
  'nav.aria': 'Grupos y fases',
  'nav.jumpAria': 'Saltar a grupo o fase',

  'stage.group': 'Fase de grupos',
  'stage.r32': 'Dieciseisavos de final',
  'stage.r16': 'Octavos de final',
  'stage.qf': 'Cuartos de final',
  'stage.sf': 'Semifinal',
  'stage.third': 'Tercer puesto',
  'stage.final': 'Final',
  'stage.qfShort': 'Cuartos',
  'stage.sfShort': 'Semis',
  'stage.thirdShort': '3° puesto',

  'match.empty': 'No hay partidos cargados.',
  'match.aria': 'Pronóstico del partido',
  'match.counter': 'Partido {current} / {total}',
  'match.prev': 'Anterior',
  'match.next': 'Siguiente',
  'match.save': 'Guardar',
  'match.saving': 'Guardando…',
  'match.saved': 'Guardado',
  'match.common': 'Más usado · {scoreA}–{scoreB} ({count})',
  'match.lock':
    'Pronósticos cerrados: faltan menos de 24 horas para el partido.',
  'match.knockoutHint':
    'Eliminatorias: podés pronosticar empate; si empatan, elegí quién pasa por penales.',
  'match.penaltiesTitle': '¿Quién pasa por penales?',
  'match.penaltiesHint':
    'Empate en el tiempo reglamentario. Elegí el equipo que avanza en la serie.',
  'match.penaltiesPicker': 'Pasa por penales',
  'match.penaltiesCancel': 'Cancelar',

  'live.title': 'Tabla en vivo · Grupo {group}',

  'standings.groupTable': 'Tabla Grupo {group}',
  'standings.predictions': '{done}/{total} pronósticos',
  'standings.team': 'Equipo',
  'standings.played': 'PJ',
  'standings.points': 'PTS',
  'standings.goalDiff': 'DG',

  'qualified.title': 'Tus clasificados a eliminatorias',
  'qualified.incomplete':
    'Completá los pronósticos de fase de grupos ({done}/{total}) para calcular los 32 clasificados según tus resultados.',
  'qualified.complete': '32 equipos según tus pronósticos',

  'ranking.loading': 'Cargando ranking…',
  'ranking.loadError': 'Error al cargar ranking',
  'ranking.empty':
    'Esperá al inicio del Mundial. El ranking se actualizará cuando haya resultados oficiales.',
  'ranking.player': 'Jugador',
  'ranking.points': 'Pts',
  'ranking.exact': 'Exactos',
  'ranking.nonExact': 'No exacto',
  'ranking.pointsLegendTitle': 'Cómo se suman los puntos',
  'ranking.pointsLegendExact': 'pts marcador exacto',
  'ranking.pointsLegendWinner': 'pt ganador o empate/penales (no exacto)',
  'ranking.pointsLegendMiss': 'si fallás',

  'error.fillGoals': 'Completá ambos goles',
  'error.negativeGoals': 'Los goles no pueden ser negativos',
  'error.knockoutAdvanceRequired':
    'En empate tenés que elegir quién pasa por penales',
  'error.savePrediction': 'No se pudo guardar el pronóstico',
} as const

const en: Record<keyof typeof es, string> = {
  'app.loading': 'Loading…',
  'app.loadError': 'Failed to load data',
  'app.title': 'Prode',
  'app.event': 'FIFA World Cup',
  'app.hosts': 'USA · Mexico · Canada',
  'lang.switch': 'Language',
  'lang.es': 'ES',
  'lang.en': 'EN',

  'name.prompt': 'Enter your name to get started',
  'name.label': 'Your name',
  'name.placeholder': 'e.g. Alex',
  'name.submit': 'Enter pool',
  'name.required': 'Please enter a name',
  'name.saveError': 'Could not save name',

  'tab.play': 'Play',
  'tab.standings': 'Tables',
  'tab.qualified': 'Qualified',
  'tab.ranking': 'Ranking',
  'tab.admin': 'Admin',

  'admin.title': 'Official results',
  'admin.colNum': '#',
  'admin.colMatch': 'Match',
  'admin.colExact': 'Exact',
  'admin.colWinner': 'Winner',
  'admin.colAction': '',
  'admin.filterPending': 'Pending',
  'admin.filterAll': 'All',
  'admin.save': 'Save',
  'admin.saving': 'Saving…',
  'admin.saved': 'Saved',
  'admin.empty': 'No matches in this filter.',
  'admin.saveError': 'Could not save result',

  'nav.groups': 'Groups',
  'nav.knockout': 'Knockout',
  'nav.phases': 'Phases',
  'nav.group': 'Group {letter}',
  'nav.aria': 'Groups and stages',
  'nav.jumpAria': 'Jump to group or stage',

  'stage.group': 'Group stage',
  'stage.r32': 'Round of 32',
  'stage.r16': 'Round of 16',
  'stage.qf': 'Quarter-finals',
  'stage.sf': 'Semi-final',
  'stage.third': 'Third place',
  'stage.final': 'Final',
  'stage.qfShort': 'Quarters',
  'stage.sfShort': 'Semis',
  'stage.thirdShort': '3rd place',

  'match.empty': 'No matches loaded.',
  'match.aria': 'Match prediction',
  'match.counter': 'Match {current} / {total}',
  'match.prev': 'Previous',
  'match.next': 'Next',
  'match.save': 'Save',
  'match.saving': 'Saving…',
  'match.saved': 'Saved',
  'match.common': 'Most picked · {scoreA}–{scoreB} ({count})',
  'match.lock': 'Predictions closed: less than 24 hours until kickoff.',
  'match.knockoutHint':
    'Knockout: you can predict a draw; if tied, pick who advances on penalties.',
  'match.penaltiesTitle': 'Who advances on penalties?',
  'match.penaltiesHint':
    'Draw after full time. Pick the team that wins the tie on penalties.',
  'match.penaltiesPicker': 'Advances on penalties',
  'match.penaltiesCancel': 'Cancel',

  'live.title': 'Live table · Group {group}',

  'standings.groupTable': 'Group {group} table',
  'standings.predictions': '{done}/{total} predictions',
  'standings.team': 'Team',
  'standings.played': 'P',
  'standings.points': 'Pts',
  'standings.goalDiff': 'GD',

  'qualified.title': 'Your knockout qualifiers',
  'qualified.incomplete':
    'Complete group-stage predictions ({done}/{total}) to calculate all 32 qualifiers from your results.',
  'qualified.complete': '32 teams from your predictions',

  'ranking.loading': 'Loading leaderboard…',
  'ranking.loadError': 'Failed to load leaderboard',
  'ranking.empty':
    'Wait until the World Cup starts. The leaderboard will update once official results are in.',
  'ranking.player': 'Player',
  'ranking.points': 'Pts',
  'ranking.exact': 'Exact',
  'ranking.nonExact': 'Non-exact',
  'ranking.pointsLegendTitle': 'How points are scored',
  'ranking.pointsLegendExact': 'pts exact score',
  'ranking.pointsLegendWinner': 'pt winner or pens/tie-break (non-exact)',
  'ranking.pointsLegendMiss': 'if wrong',

  'error.fillGoals': 'Enter both scores',
  'error.negativeGoals': 'Scores cannot be negative',
  'error.knockoutAdvanceRequired': 'On a draw you must pick who advances on penalties',
  'error.savePrediction': 'Could not save prediction',
}

export type MessageKey = keyof typeof es

export const translations: Record<Locale, Record<MessageKey, string>> = { es, en }

export const interpolate = (
  template: string,
  vars: Record<string, string | number>,
): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
