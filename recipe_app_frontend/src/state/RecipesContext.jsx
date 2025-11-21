import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { recipesReducer, initialState, actionTypes } from './recipesReducer';
import useFavorites from './useFavorites';

/**
 * PUBLIC_INTERFACE
 * RecipesContext provides global application state for recipes listing, query, loading/error,
 * and favorites management. It exposes state and dispatchable action creators.
 */
const RecipesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * RecipesProvider wraps the app and provides state via React Context.
 * It manages fetch lifecycle, query updates, and persisted favorites.
 */
export function RecipesProvider({ children }) {
  const [state, dispatch] = useReducer(recipesReducer, initialState);
  const { favorites, toggleFavorite, setFavoritesDirect } = useFavorites();

  // Keep reducer state favorites in sync with persisted favorites
  useEffect(() => {
    dispatch({ type: actionTypes.FAVORITES_SYNC, payload: favorites });
  }, [favorites]);

  // PUBLIC_INTERFACE
  const setQuery = (q) => {
    dispatch({ type: actionTypes.SET_QUERY, payload: q });
  };

  // PUBLIC_INTERFACE
  const triggerFetch = async (query) => {
    dispatch({ type: actionTypes.FETCH_START });
    const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;

    // Simple mock data as fallback when no backend is configured
    const MOCK_RECIPES = [
      { id: '1', title: 'Spaghetti Carbonara', image: 'https://picsum.photos/seed/carbonara/600/400', description: 'Classic Italian pasta with eggs, cheese, pancetta, and pepper.' },
      { id: '2', title: 'Grilled Chicken Salad', image: 'https://picsum.photos/seed/chicken/600/400', description: 'Healthy salad with grilled chicken, greens, and a zesty dressing.' },
      { id: '3', title: 'Avocado Toast', image: 'https://picsum.photos/seed/avocado/600/400', description: 'Crunchy sourdough topped with smashed avocado and chili flakes.' },
      { id: '4', title: 'Tomato Soup', image: 'https://picsum.photos/seed/tomato/600/400', description: 'Creamy tomato soup with basil and a hint of garlic.' },
    ];

    try {
      if (base) {
        const url = `${base.replace(/\/$/, '')}/recipes${query ? `?q=${encodeURIComponent(query)}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data?.items || [];
        dispatch({ type: actionTypes.FETCH_SUCCESS, payload: items });
      } else {
        // mock fallback with simple filter
        const q = (query || '').toLowerCase();
        const items = !q
          ? MOCK_RECIPES
          : MOCK_RECIPES.filter(
              (r) =>
                r.title.toLowerCase().includes(q) ||
                (r.description || '').toLowerCase().includes(q)
            );
        dispatch({ type: actionTypes.FETCH_SUCCESS, payload: items });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_FAILURE,
        payload: e?.message || 'Failed to load recipes',
      });
    }
  };

  // PUBLIC_INTERFACE
  const toggleFavoriteAction = (id) => {
    toggleFavorite(id);
    // reducer updates are synced by the favorites effect above
  };

  // PUBLIC_INTERFACE
  const setFavorites = (idsSet) => {
    setFavoritesDirect(idsSet);
  };

  const value = useMemo(
    () => ({
      state,
      dispatch,
      actions: {
        setQuery,
        triggerFetch,
        toggleFavorite: toggleFavoriteAction,
        setFavorites,
      },
    }),
    [state]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useRecipesContext is a convenience hook to consume RecipesContext.
 */
export function useRecipesContext() {
  const ctx = useContext(RecipesContext);
  if (!ctx) {
    throw new Error('useRecipesContext must be used within a RecipesProvider');
  }
  return ctx;
}

export default RecipesContext;
