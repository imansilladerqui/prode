const PLAYER_ID_KEY = 'prode_player_id'
const NAME_LOCKED_KEY = 'prode_name_locked'

export const getOrCreatePlayerId = (): string => {
  const existing = localStorage.getItem(PLAYER_ID_KEY)
  if (existing) return existing

  const id = crypto.randomUUID()
  localStorage.setItem(PLAYER_ID_KEY, id)
  return id
}

export const isNameLocked = (): boolean => localStorage.getItem(NAME_LOCKED_KEY) === '1'

export const setNameLocked = (): void => {
  localStorage.setItem(NAME_LOCKED_KEY, '1')
}
