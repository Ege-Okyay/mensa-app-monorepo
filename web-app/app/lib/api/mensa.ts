import { api } from "./client"
import type { Mensa, MenuData } from "./types"

export const mensaApi = {
  /**
   * Fetches all mensas
   */
  getAll: () =>
    api.get<Mensa[]>(`/mensa`),

  /** 
   * Fetches the mensa with its menu by its slug
   */
  getMenu: (slug: string) =>
    api.get<MenuData>(`/mensa/menu/${slug}`)
}
