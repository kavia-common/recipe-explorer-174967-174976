import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useFavorites from '../state/useFavorites';

// Simple localStorage mock for tests to ensure isolation and persistence behavior.
function createLocalStorageMock() {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    // Expose for asserts if necessary
    _dump: () => ({ ...store }),
  };
}

describe('useFavorites hook', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  test('initializes from empty localStorage as empty Set', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites instanceof Set).toBe(true);
    expect(result.current.favorites.size).toBe(0);
  });

  test('toggleFavorite adds and removes ids; persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('1');
    });
    expect(result.current.favorites.has('1')).toBe(true);

    // localStorage should have been updated
    const raw = window.localStorage.getItem('favorites');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed).toContain('1');

    act(() => {
      result.current.toggleFavorite('1');
    });
    expect(result.current.favorites.has('1')).toBe(false);

    const raw2 = window.localStorage.getItem('favorites');
    const parsed2 = JSON.parse(raw2);
    expect(parsed2).not.toContain('1');
  });

  test('setFavoritesDirect accepts Set and array; normalizes to strings; persists', () => {
    const { result, rerender } = renderHook(() => useFavorites());

    act(() => {
      result.current.setFavoritesDirect(new Set([1, 2]));
    });
    expect(result.current.favorites.has('1')).toBe(true);
    expect(result.current.favorites.has('2')).toBe(true);

    // Simulate re-render to confirm state holds and localStorage persisted
    rerender();
    const stored = JSON.parse(window.localStorage.getItem('favorites'));
    expect(stored).toEqual(expect.arrayContaining(['1', '2']));

    act(() => {
      result.current.setFavoritesDirect(['3', 4]);
    });
    expect(result.current.favorites.has('3')).toBe(true);
    expect(result.current.favorites.has('4')).toBe(true);
    const stored2 = JSON.parse(window.localStorage.getItem('favorites'));
    expect(stored2).toEqual(expect.arrayContaining(['3', '4']));
  });

  test('favorites persist across hook re-instantiation (re-read from localStorage)', () => {
    // First mount and add a favorite
    let hook = renderHook(() => useFavorites());
    act(() => {
      hook.result.current.setFavoritesDirect(['42']);
    });
    expect(hook.result.current.favorites.has('42')).toBe(true);

    // Unmount and mount again; should read persisted value
    hook.unmount();
    hook = renderHook(() => useFavorites());
    expect(hook.result.current.favorites.has('42')).toBe(true);
  });
});
