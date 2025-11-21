import React from 'react';
import RecipeCard from './RecipeCard';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid renders a responsive grid of RecipeCard components.
 * Props:
 * - recipes: array of recipe objects
 * - favorites: Set<string|number>
 * - onToggleFavorite: (id) => void
 */
function RecipeGrid({ recipes = [], favorites = new Set(), onToggleFavorite }) {
  if (!recipes.length) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px',
      }}
    >
      {recipes.map((r) => (
        <RecipeCard
          key={r.id}
          recipe={r}
          isFavorite={favorites.has(String(r.id))}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default RecipeGrid;
