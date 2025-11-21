import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test: mounts the app and confirms Header and nav links render
test('renders header brand and navigation links', () => {
  render(<App />);

  // Brand title
  expect(screen.getByText(/Recipe Explorer/i)).toBeInTheDocument();

  // Navigation links
  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /recipes/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument();
});
