import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * SearchBar provides a text input that on submit navigates to "/recipes?q=<query>".
 * Props:
 * - placeholder?: string
 * - defaultQuery?: string (falls back to current search param q)
 * - size?: 'lg' | 'md'
 */
function SearchBar({ placeholder = 'Search recipes, e.g. pasta, chicken...', defaultQuery = '', size = 'md' }) {
  const [searchParams] = useSearchParams();
  const initial = defaultQuery || searchParams.get('q') || '';
  const [query, setQuery] = useState(initial);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/recipes?q=${encodeURIComponent(trimmed)}` : '/recipes');
  };

  const pad = size === 'lg' ? '14px 16px' : '10px 12px';
  const fontSize = size === 'lg' ? 18 : 16;

  return (
    <form onSubmit={onSubmit} role="search" style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: 8,
          width: '100%',
          alignItems: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: pad,
          boxShadow: 'var(--shadow-sm)',
          transition: 'box-shadow var(--transition)',
        }}
      >
        <span aria-hidden style={{ color: 'var(--color-primary)' }}>🔎</span>
        <input
          aria-label="Search recipes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize,
            background: 'transparent',
            color: 'var(--text)',
          }}
        />
        <button
          type="submit"
          className="btn"
          style={{
            borderRadius: '10px',
            padding: size === 'lg' ? '10px 14px' : '8px 12px',
          }}
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
