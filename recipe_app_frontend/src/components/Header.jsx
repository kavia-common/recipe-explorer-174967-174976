import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Header renders the top navigation bar with links to Home, Recipes, and Favorites.
 * - Uses NavLink to highlight the active route
 * - Responsive layout: links wrap on smaller screens
 * - Accessible semantics via role="navigation" and aria-label
 * - Styled using Ocean Professional theme variables
 */
function Header() {
  const navigate = useNavigate();

  // Shared link style factory to keep styles consistent and themed
  const linkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? 'var(--color-primary)' : 'var(--text)',
    fontWeight: 600,
    padding: '8px 12px',
    borderRadius: '10px',
    background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
    transition: 'all var(--transition-fast)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  });

  return (
    <header
      className="navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'saturate(180%) blur(8px)',
        background: 'var(--gradient-primary)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          paddingTop: 12,
          paddingBottom: 12,
          flexWrap: 'wrap', // allow wrapping on small screens
        }}
      >
        <div
          onClick={() => navigate('/')}
          role="button"
          aria-label="Go to Home"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '10px',
            transition: 'background var(--transition)',
          }}
        >
          <div
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--color-primary), #60A5FA)',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          />
          <strong style={{ color: 'var(--text)', whiteSpace: 'nowrap' }}>Recipe Explorer</strong>
        </div>

        <nav
          role="navigation"
          aria-label="Primary"
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexWrap: 'wrap', // mobile-friendly wrapping
          }}
        >
          <NavLink to="/" style={linkStyle} className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
            <span aria-hidden>🏠</span>
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/recipes"
            style={linkStyle}
            className={({ isActive }) => (isActive ? 'nav-active' : undefined)}
          >
            <span aria-hidden>🍝</span>
            <span>Recipes</span>
          </NavLink>

          <NavLink
            to="/favorites"
            style={linkStyle}
            className={({ isActive }) => (isActive ? 'nav-active' : undefined)}
          >
            <span aria-hidden>⭐</span>
            <span>Favorites</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
