import React, { useEffect, useState } from 'react';
import RecipeGrid from '../components/RecipeGrid';
import EmptyState from '../components/EmptyState';

const MOCK_RECIPES = [
  { id: '1', title: 'Spaghetti Carbonara', image: 'https://picsum.photos/seed/carbonara/600/400', description: 'Classic Italian pasta with eggs, cheese, pancetta, and pepper.' },
  { id: '2', title: 'Grilled Chicken Salad', image: 'https://picsum.photos/seed/chicken/600/400', description: 'Healthy salad with grilled chicken, greens, and a zesty dressing.' },
  { id: '3', title: 'Avocado Toast', image: 'https://picsum.photos/seed/avocado/600/400', description: 'Crunchy sourdough topped with smashed avocado and chili flakes.' },
  { id: '4', title: 'Tomato Soup', image: 'https://picsum.photos/seed/tomato/600/400', description: 'Creamy tomato soup with basil and a hint of garlic.' },
];

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
 * Favorites page lists recipes that user marked as favorite using localStorage.
 */
function Favorites() {
  const [favorites, setFavState] = useState(getFavorites());
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // try to resolve favorite items
    const ids = Array.from(favorites);
    const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;

    async function resolve() {
      if (!ids.length) {
        setRecipes([]);
        return;
      }
      if (base) {
        // attempt batch fetch: /recipes?ids=1,2,3 else fetch individually
        const url = `${base.replace(/\/$/, '')}/recipes?ids=${encodeURIComponent(ids.join(','))}`;
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            setRecipes(Array.isArray(data) ? data : data?.items || []);
            return;
          }
        } catch {
          // fallback to individual fetch or mock
        }
      }
      // fallback: mock lookup
      setRecipes(MOCK_RECIPES.filter((r) => ids.includes(String(r.id))));
    }

    resolve();
  }, [favorites]);

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
      <h1 style={{ margin: 0 }}>Your Favorites</h1>
      {!recipes.length ? (
        <EmptyState
          title="No favorites yet"
          description="Mark recipes as favorites to quickly find them here."
        />
      ) : (
        <RecipeGrid recipes={recipes} favorites={favorites} onToggleFavorite={onToggleFavorite} />
      )}
    </section>
  );
}

export default Favorites;
