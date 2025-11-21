export const actionTypes = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  SET_QUERY: 'SET_QUERY',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE', // reserved if needed locally
  FAVORITES_SYNC: 'FAVORITES_SYNC',
};

export const initialState = {
  query: '',
  items: [],
  loading: false,
  error: '',
  favorites: new Set(), // store as Set<string>
};

/**
 * PUBLIC_INTERFACE
 * recipesReducer handles actions for fetching, query updates, and favorites sync.
 */
export function recipesReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_QUERY:
      return { ...state, query: action.payload };

    case actionTypes.FETCH_START:
      return { ...state, loading: true, error: '' };

    case actionTypes.FETCH_SUCCESS:
      return { ...state, loading: false, error: '', items: action.payload || [] };

    case actionTypes.FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload || 'Unknown error' };

    case actionTypes.FAVORITES_SYNC: {
      // ensure Set<string>
      const set = action.payload instanceof Set
        ? action.payload
        : new Set((Array.isArray(action.payload) ? action.payload : []).map(String));
      return { ...state, favorites: set };
    }

    // Optional: local toggle (not used directly because persistence handled in hook)
    case actionTypes.TOGGLE_FAVORITE: {
      const id = String(action.payload);
      const next = new Set(state.favorites);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...state, favorites: next };
    }

    default:
      return state;
  }
}
