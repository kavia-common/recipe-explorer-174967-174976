/**
 * Recipes API module.
 * Provides methods for retrieving recipe lists and single recipe details.
 * Uses http client; falls back to mock data when apiBaseURL is not configured.
 */

import { getEnv } from '../config/env';
import { httpFetch } from './client';
// Importing JSON as a module is supported by bundlers in CRA context
import mockData from '../mocks/recipes.mock.json';

/**
 * PUBLIC_INTERFACE
 * getRecipes fetches a list of recipes.
 * Options:
 * - q?: string search query
 * - page?: number
 * - pageSize?: number
 * - ingredients?: string[] list of ingredient names
 *
 * Returns: Promise<Array<Recipe>>
 * Throws normalized error { message, status, data } which callers can surface via error UI.
 */
export async function getRecipes({ q = '', page = 1, pageSize = 20, ingredients = [] } = {}) {
  const { apiBaseURL } = getEnv();

  // When no baseURL configured, return filtered mock items
  if (!apiBaseURL) {
    const query = (q || '').toLowerCase();
    let items = Array.isArray(mockData) ? mockData : [];
    if (query) {
      items = items.filter(
        (r) =>
          r.title?.toLowerCase().includes(query) ||
          (r.description || '').toLowerCase().includes(query)
      );
    }
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      // naive ingredient filter: look inside title/description text
      const igs = ingredients.map((x) => String(x).toLowerCase());
      items = items.filter((r) => {
        const text = `${r.title || ''} ${r.description || ''}`.toLowerCase();
        return igs.every((ig) => text.includes(ig));
      });
    }
    const start = (Number(page) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    return items.slice(start, end);
  }

  // Build query string
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (page) params.set('page', String(page));
  if (pageSize) params.set('pageSize', String(pageSize));
  if (Array.isArray(ingredients) && ingredients.length) {
    params.set('ingredients', ingredients.join(','));
  }

  const path = `recipes${params.toString() ? `?${params.toString()}` : ''}`;
  const { data } = await httpFetch(path, { method: 'GET' });
  return Array.isArray(data) ? data : data?.items || [];
}

/**
 * PUBLIC_INTERFACE
 * getRecipeById fetches a single recipe by ID.
 * Returns: Promise<Recipe | null>
 */
export async function getRecipeById(id) {
  const { apiBaseURL } = getEnv();

  if (!id) {
    throw { message: 'Recipe id is required', status: 400, data: null };
  }

  if (!apiBaseURL) {
    const found = (Array.isArray(mockData) ? mockData : []).find(
      (r) => String(r.id) === String(id)
    );
    return found || null;
  }

  const { data } = await httpFetch(`recipes/${encodeURIComponent(String(id))}`, {
    method: 'GET',
  });
  return data ?? null;
}

export default {
  getRecipes,
  getRecipeById,
};
