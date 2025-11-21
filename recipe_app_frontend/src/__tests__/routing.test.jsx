import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { RecipesProvider } from '../state/RecipesContext';

// Utility to render the App with a MemoryRouter starting at the given route
function renderAt(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <RecipesProvider>
        <App />
      </RecipesProvider>
    </MemoryRouter>
  );
}

describe('Routing and Header navigation', () => {
  test('Home route "/" renders Home page content', () => {
    renderAt('/');
    expect(screen.getByText(/Recipe Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Discover delicious recipes/i)).toBeInTheDocument();
    // Home has big search bar
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  test('Recipes route "/recipes" renders Recipes page content', async () => {
    renderAt('/recipes');
    // Loading indicator first
    expect(await screen.findByText(/Finding tasty recipes/i)).toBeInTheDocument();
    // After mock fetch completes, since mock runs sync in our code path with no API, loading will be replaced
    // The page will either show grid or empty state. We can assert the empty state is not shown for default mock.
    // We have mock data with items, so we expect any of those titles to appear.
    expect(await screen.findByText(/Spaghetti Carbonara/i)).toBeInTheDocument();
  });

  test('Favorites route "/favorites" renders Favorites page layout', async () => {
    renderAt('/favorites');
    expect(screen.getByText(/Your Favorites/i)).toBeInTheDocument();
    // With no favorites stored, shows empty state message
    expect(await screen.findByText(/No favorites yet/i)).toBeInTheDocument();
  });

  test('Header links navigate to Home, Recipes, and Favorites', async () => {
    renderAt('/recipes');

    // Links in header
    const homeLink = screen.getByRole('link', { name: /home/i });
    const recipesLink = screen.getByRole('link', { name: /recipes/i });
    const favoritesLink = screen.getByRole('link', { name: /favorites/i });

    expect(homeLink).toBeInTheDocument();
    expect(recipesLink).toBeInTheDocument();
    expect(favoritesLink).toBeInTheDocument();

    // Click Favorites and expect Favorites page
    favoritesLink.click();
    expect(await screen.findByText(/Your Favorites/i)).toBeInTheDocument();

    // Click Home and expect home hero text
    homeLink.click();
    expect(await screen.findByText(/Discover delicious recipes/i)).toBeInTheDocument();

    // Click Recipes and expect a known recipe
    recipesLink.click();
    expect(await screen.findByText(/Spaghetti Carbonara/i)).toBeInTheDocument();
  });
});
