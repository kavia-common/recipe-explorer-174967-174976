import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getRecipeById } from '../api/recipesApi';

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
 * RecipeDetails page shows the detailed information for a recipe.
 */
function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [favorites, setFavState] = useState(getFavorites());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr('');
      try {
        const data = await getRecipeById(id);
        if (!cancelled) setRecipe(data);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Failed to load recipe');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const isFavorite = favorites.has(String(id));
  const toggleFavorite = () => {
    const copy = new Set(favorites);
    const key = String(id);
    if (copy.has(key)) copy.delete(key);
    else copy.add(key);
    setFavState(copy);
    setFavorites(copy);
  };

  if (loading) return <Loading text="Preparing recipe details..." />;
  if (err) return <ErrorMessage message={err} />;
  if (!recipe) return <ErrorMessage message="Recipe not found." />;

  return (
    <article className="container" style={{ display: 'grid', gap: 16 }}>
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
        }}
      >
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : null}
      </div>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>{recipe.title}</h1>
        <button
          onClick={toggleFavorite}
          aria-pressed={isFavorite}
          className="btn"
          style={{
            marginLeft: 'auto',
            background: isFavorite ? '#F59E0B' : '#2563EB',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
        </button>
      </header>
      <section>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>About this recipe</h2>
        <p style={{ color: '#374151' }}>{recipe.description || 'No description provided.'}</p>
      </section>
    </article>
  );
}

export default RecipeDetails;
