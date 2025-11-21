import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RecipeGrid from '../components/RecipeGrid';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

// Simple mock data as fallback when no backend is configured
const MOCK_RECIPES = [
  { id: '1', title: 'Spaghetti Carbonara', image: 'https://picsum.photos/seed/carbonara/600/400', description: 'Classic Italian pasta with eggs, cheese, pancetta, and pepper.' },
  { id: '2', title: 'Grilled Chicken Salad', image: 'https://picsum.photos/seed/chicken/600/400', description: 'Healthy salad with grilled chicken, greens, and a zesty dressing.' },
  { id: '3', title: 'Avocado Toast', image: 'https://picsum.photos/seed/avocado/600/400', description: 'Crunchy sourdough topped with smashed avocado and chili flakes.' },
  { id: '4', title: 'Tomato Soup', image: 'https://picsum.photos/seed/tomato/600/400', description: 'Creamy tomato soup with basil and a hint of garlic.' },
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Search helper for mock data
function filterMock(query) {
  if (!query) return MOCK_RECIPES;
  const q = query.toLowerCase();
  return MOCK_RECIPES.filter((r) => r.title.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
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
        const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
        if (base) {
          const url = `${base.replace(/\/$/, '')}/recipes${query ? `?q=${encodeURIComponent(query)}` : ''}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`API error ${res.status}`);
          const data = await res.json();
          if (!cancelled) setRecipes(Array.isArray(data) ? data : data?.items || []);
        } else {
          // mock fallback
          const filtered = filterMock(query);
          if (!cancelled) setRecipes(filtered);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to load recipes');
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
