import React from 'react';
import SearchBar from '../components/SearchBar';

/**
 * PUBLIC_INTERFACE
 * Home page promotes searching recipes with a large search bar.
 */
function Home() {
  return (
    <section
      className="container"
      style={{
        display: 'grid',
        gap: 20,
        paddingTop: 40,
        paddingBottom: 20,
      }}
    >
      <h1 className="title" style={{ marginBottom: 8 }}>
        Discover delicious recipes
      </h1>
      <p className="subtitle" style={{ marginTop: 0, color: 'var(--text-muted)' }}>
        Search by ingredients, cuisine, or dish name.
      </p>
      <SearchBar size="lg" />
    </section>
  );
}

export default Home;
