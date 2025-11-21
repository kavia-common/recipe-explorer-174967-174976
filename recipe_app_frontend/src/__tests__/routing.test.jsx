import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { RecipesProvider } from '../state/RecipesContext';

// Ensure env resolver will return empty base URL to trigger mock mode for routing tests as well.
const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  delete process.env.REACT_APP_API_BASE;
  delete process.env.REACT_APP_BACKEND_URL;
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

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
  test('Home route "/" renders Home page content', async () => {
    renderAt('/');
    expect(screen.getByText(/Recipe Explorer/i)).toBeInTheDocument();
    // Use findBy* to await initial rendering that might depend on effects
    expect(await screen.findByText(/Discover delicious recipes/i)).toBeInTheDocument();
    // Home has big search bar
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  test('Recipes route "/recipes" renders Recipes page content', async () => {
    renderAt('/recipes');
    // Loading indicator first
    expect(await screen.findByRole('status')).toHaveTextContent(/finding tasty recipes/i);
    // After mock fetch completes, a known recipe should appear
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

    const user = userEvent.setup();

    // Links in header
    const homeLink = screen.getByRole('link', { name: /home/i });
    const recipesLink = screen.getByRole('link', { name: /recipes/i });
    const favoritesLink = screen.getByRole('link', { name: /favorites/i });

    expect(homeLink).toBeInTheDocument();
    expect(recipesLink).toBeInTheDocument();
    expect(favoritesLink).toBeInTheDocument();

    // Click Favorites and expect Favorites page
    await user.click(favoritesLink);
    expect(await screen.findByText(/Your Favorites/i)).toBeInTheDocument();

    // Click Home and expect home hero text
    await user.click(homeLink);
    expect(await screen.findByText(/Discover delicious recipes/i)).toBeInTheDocument();

    // Click Recipes and expect a known recipe
    await user.click(recipesLink);
    expect(await screen.findByText(/Spaghetti Carbonara/i)).toBeInTheDocument();
  });
});
