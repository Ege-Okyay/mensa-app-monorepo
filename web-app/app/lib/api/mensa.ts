import { api } from "./client";
import type { Mensa } from "./types";

export const mensaApi = {
  /**
   * Fetches all mensas without their current menu data.
   */
  getAll: () =>
    api.get<Mensa[]>(`/mensa`),

  /** 
   * Fetches the mensa with its current menu data by its slug.
   */
  getMensaWithMenu: (slug: string) =>
    api.get<Mensa>(`/mensa/${slug}`)
};
