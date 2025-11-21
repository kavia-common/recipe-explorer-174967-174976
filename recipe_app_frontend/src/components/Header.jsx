import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Header renders the top navigation bar with links to Home, Recipes, and Favorites.
 */
function Header() {
  const navigate = useNavigate();

  return (
    <header
      className="navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'saturate(180%) blur(8px)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(249,250,251,0.8))',
        borderBottom: '1px solid var(--border-color)',
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
        }}
      >
        <div
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          />
          <strong style={{ color: 'var(--text-primary)' }}>Recipe Explorer</strong>
        </div>

        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#2563EB' : 'var(--text-primary)',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: 8,
              background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              transition: 'all .2s ease',
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/recipes"
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#2563EB' : 'var(--text-primary)',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: 8,
              background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              transition: 'all .2s ease',
            })}
          >
            Recipes
          </NavLink>
          <NavLink
            to="/favorites"
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#2563EB' : 'var(--text-primary)',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: 8,
              background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              transition: 'all .2s ease',
            })}
          >
            Favorites
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
