import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { recipesReducer, initialState, actionTypes } from './recipesReducer';
import useFavorites from './useFavorites';
import { getRecipes } from '../api/recipesApi';

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
    try {
      const items = await getRecipes({ q: query });
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: items });
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
