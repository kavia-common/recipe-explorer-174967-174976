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
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 6px 18px rgba(0,0,0,0.07)',
        transition: 'transform .15s ease, box-shadow .15s ease',
      }}
    >
      <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ width: '100%', aspectRatio: '16/10', background: '#e5e7eb' }}>
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>
      </Link>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{recipe.title}</h3>
        </Link>
        {recipe.description ? (
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
            {recipe.description.length > 100 ? `${recipe.description.slice(0, 97)}...` : recipe.description}
          </p>
        ) : null}
        <div style={{ display: 'flex', marginTop: 'auto' }}>
          <button
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => onToggleFavorite && onToggleFavorite(recipe.id)}
            className="btn"
            style={{
              marginLeft: 'auto',
              background: isFavorite ? '#F59E0B' : '#2563EB',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '8px 12px',
              fontWeight: 600,
              cursor: 'pointer',
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
