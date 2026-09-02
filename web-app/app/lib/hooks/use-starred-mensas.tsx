import { useState, useEffect } from "react";

const STORAGE_KEY = "starred-mensas";

export function useStarredMensas() {
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]; }
    catch { return []; }
  });

  // useEffect(() => {
  //   const stored = localStorage.getItem(STORAGE_KEY);
  //   if (stored) {
  //     try {
  //       setStarredIds(JSON.parse(stored));
  //     } catch (e) {
  //       console.error("Failed to parse starred mensas from localStorage", e);
  //     }
  //   }
  // }, []);

  const toggleStar = (id: string) => {
    setStarredIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isStarred = (id: string) => starredIds.includes(id);

  return { starredIds, toggleStar, isStarred };
}
