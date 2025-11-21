import { getRecipes, getRecipeById } from '../api/recipesApi';
import mockData from '../mocks/recipes.mock.json';

// Ensure env resolver will return empty base URL to trigger mock mode.
// The env.js getEnv reads process.env; CRA tests run with process.env.* available.
// We explicitly clear possible API base variables for this test file scope.
const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  // Ensure mock mode
  delete process.env.REACT_APP_API_BASE;
  delete process.env.REACT_APP_BACKEND_URL;
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('recipesApi mock mode (no api base configured)', () => {
  test('getRecipes returns all items by default and supports pagination', async () => {
    const all = await getRecipes();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
    // Our mock has at least 4 items. Page 1 size 2 returns first two.
    const page1 = await getRecipes({ page: 1, pageSize: 2 });
    expect(page1).toHaveLength(2);
    expect(page1[0].id).toBe(mockData[0].id);
    expect(page1[1].id).toBe(mockData[1].id);

    const page2 = await getRecipes({ page: 2, pageSize: 2 });
    expect(page2).toHaveLength(2);
    expect(page2[0].id).toBe(mockData[2].id);
    expect(page2[1].id).toBe(mockData[3].id);
  });

  test('getRecipes filters by query q (searches title/description)', async () => {
    const term = 'Chicken';
    const results = await getRecipes({ q: term });
    expect(results.length).toBeGreaterThan(0);
    // Ensure all results contain the term in either title or description (case-insensitive)
    for (const r of results) {
      const hay = `${r.title ?? ''} ${r.description ?? ''}`.toLowerCase();
      expect(hay).toContain(term.toLowerCase());
    }
  });

  test('getRecipeById returns the correct item or null', async () => {
    const target = mockData[1]; // "2" Grilled Chicken Salad
    const found = await getRecipeById(target.id);
    expect(found).toBeTruthy();
    expect(found.id).toBe(target.id);
    expect(found.title).toBe(target.title);

    const missing = await getRecipeById('non-existent-id-zzz');
    expect(missing).toBeNull();
  });

  test('getRecipeById throws when id is not provided', async () => {
    await expect(getRecipeById()).rejects.toMatchObject({
      message: expect.stringMatching(/required/i),
      status: 400,
    });
  });
});
