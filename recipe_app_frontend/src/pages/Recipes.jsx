import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RecipeGrid from '../components/RecipeGrid';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getRecipes } from '../api/recipesApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function getFavorites() {
  try {
    const raw = localStorage.getItem('favorites') || '[]';
    return new Set(JSON.parse(raw).map(String));
  } catch {
    return new Set();
  }
}

function setFavorites(set) {
  try {
    localStorage.setItem('favorites', JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * Recipes page displays a list/grid of recipes.
 * - Reads search param "q"
 * - Uses backend if REACT_APP_API_BASE is set, otherwise mock data
 */
function Recipes() {
  const query = useQuery().get('q') || '';
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [favorites, setFavState] = useState(getFavorites());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr('');
      try {
        const items = await getRecipes({ q: query });
        if (!cancelled) setRecipes(items);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Failed to load recipes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const onToggleFavorite = (id) => {
    const key = String(id);
    const copy = new Set(favorites);
    if (copy.has(key)) copy.delete(key);
    else copy.add(key);
    setFavState(copy);
    setFavorites(copy);
  };

  return (
    <section className="container" style={{ display: 'grid', gap: 16 }}>
      <div style={{ position: 'sticky', top: 64, zIndex: 5, background: 'var(--bg-primary)', paddingTop: 8 }}>
        <SearchBar placeholder="Search in recipes..." defaultQuery={query} />
      </div>

      {loading ? (
        <Loading text="Finding tasty recipes..." />
      ) : err ? (
        <ErrorMessage message={err} />
      ) : recipes.length === 0 ? (
        <EmptyState
          title="No recipes found"
          description="Try a different search term or browse popular recipes."
        />
      ) : (
        <RecipeGrid recipes={recipes} favorites={favorites} onToggleFavorite={onToggleFavorite} />
      )}
    </section>
  );
}

export default Recipes;
