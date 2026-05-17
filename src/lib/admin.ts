/** UUID del usuario que ve la pestaña de backoffice (tu `prode_player_id` en localStorage). */
export const getAdminUserId = (): string | undefined =>
  import.meta.env.VITE_ADMIN_USER_ID?.trim() || undefined

export const isAdmin = (playerId: string): boolean => {
  const adminId = getAdminUserId()
  return Boolean(adminId && playerId === adminId)
}
