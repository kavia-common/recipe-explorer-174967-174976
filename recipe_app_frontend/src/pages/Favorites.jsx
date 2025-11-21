import React, { useEffect, useState } from 'react';
import RecipeGrid from '../components/RecipeGrid';
import EmptyState from '../components/EmptyState';
import { getRecipes } from '../api/recipesApi';

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

    async function resolve() {
      if (!ids.length) {
        setRecipes([]);
        return;
      }

      // First try a batch via query params; recipesApi will route to base/mock
      try {
        const items = await getRecipes({ page: 1, pageSize: 1000 });
        // Filter client-side to favorites, as not all APIs support ids query
        setRecipes(items.filter((r) => ids.includes(String(r.id))));
      } catch {
        // If even that fails, show nothing (or could keep previous); keeping empty for now
        setRecipes([]);
      }
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
