import { useCallback, useEffect, useState } from 'react';

const FAVORITES_KEY = 'favorites';

// Safely read favorites from localStorage
function readFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY) || '[]';
    const arr = JSON.parse(raw);
    return new Set((Array.isArray(arr) ? arr : []).map(String));
  } catch {
    return new Set();
  }
}

// Safely write favorites to localStorage
function writeFavorites(set) {
  try {
    const arr = Array.from(set);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
  } catch {
    // ignore persistence failures
  }
}

/**
 * PUBLIC_INTERFACE
 * useFavorites manages a Set of favorite recipe IDs with localStorage persistence.
 * Returns:
 * - favorites: Set<string>
 * - toggleFavorite: (id) => void
 * - setFavoritesDirect: (Set<string>|string[]) => void
 */
export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => readFavorites());

  // Persist on change
  useEffect(() => {
    writeFavorites(favorites);
  }, [favorites]);

  // PUBLIC_INTERFACE
  const toggleFavorite = useCallback((id) => {
    const key = String(id);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // PUBLIC_INTERFACE
  const setFavoritesDirect = useCallback((value) => {
    if (value instanceof Set) {
      setFavorites(new Set(Array.from(value).map(String)));
    } else if (Array.isArray(value)) {
      setFavorites(new Set(value.map(String)));
    } else {
      setFavorites(new Set());
    }
  }, []);

  return { favorites, toggleFavorite, setFavoritesDirect };
}
