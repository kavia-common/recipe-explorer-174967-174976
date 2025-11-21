import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Recipes from '../pages/Recipes';
import RecipeDetails from '../pages/RecipeDetails';
import Favorites from '../pages/Favorites';
import Header from '../components/Header';

/**
 * PUBLIC_INTERFACE
 * AppRouter sets up client-side routing for the Recipe App.
 * This component assumes it is rendered within a Router provider (e.g., BrowserRouter).
 * Routes:
 * - "/": Home page with prominent search
 * - "/recipes": Recipes list with optional query param ?q=
 * - "/recipes/:id": Recipe details view
 * - "/favorites": Favorites list stored locally
 */
function AppRouter() {
  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </>
  );
}

export default AppRouter;
