import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * RecipeCard displays a single recipe summary.
 * Props:
 * - recipe: { id, title, image, description? }
 * - isFavorite?: boolean
 * - onToggleFavorite?: (id) => void
 */
function RecipeCard({ recipe, isFavorite = false, onToggleFavorite }) {
  return (
    <div
      role="article"
      aria-label={recipe.title}
      className="card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ width: '100%', aspectRatio: '16/10', background: '#e5e7eb' }}>
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : null}
        </div>
      </Link>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{recipe.title}</h3>
        </Link>
        {recipe.description ? (
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>
            {recipe.description.length > 100 ? `${recipe.description.slice(0, 97)}...` : recipe.description}
          </p>
        ) : null}
        <div style={{ display: 'flex', marginTop: 'auto' }}>
          <button
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => onToggleFavorite && onToggleFavorite(recipe.id)}
            className={`btn ${isFavorite ? 'btn-amber' : ''}`}
            style={{
              marginLeft: 'auto',
              borderRadius: '10px',
              padding: '8px 12px',
            }}
          >
            {isFavorite ? '★ Favorite' : '☆ Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
