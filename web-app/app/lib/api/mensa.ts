import { api } from "./client"
import type { MensaWithMenu, Mensa, MenuData } from "./types"

export const mensaApi = {
  /**
   * Fetches all mensas
   * includeMenu: If true, fetches today's menu for each mensa
   */
  getAll: (includeMenu = false) =>
    api.get<Mensa[] | MensaWithMenu[]>(`/mensa${includeMenu ? "?include=menu" : ""}`),

  /** 
   * Fetches the mensa with its menu by its slug
   */
  getMenu: (slug: string) =>
    api.get<MenuData>(`/mensa/menu/${slug}`)
}
