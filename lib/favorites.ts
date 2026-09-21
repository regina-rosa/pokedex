const STORAGE_KEY = "pokedex.favorites";

export function loadFavorites(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: number): number[] {
  const favorites = loadFavorites();
  const updated = favorites.includes(id)
    ? favorites.filter((f) => f !== id)
    : [...favorites, id];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage can be unavailable in private windows; keep the UI responsive.
  }
  return updated;
}
