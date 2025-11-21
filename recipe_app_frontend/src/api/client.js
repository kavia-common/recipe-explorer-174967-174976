/**
 * Lightweight fetch wrapper with baseURL, timeout, JSON parsing, and error normalization.
 */

import { getEnv } from '../config/env';

// Default timeout for network requests (in ms)
const DEFAULT_TIMEOUT = 15000;

/**
 * Internal: build URL by combining baseURL and path safely.
 */
function buildURL(baseURL, path) {
  if (!baseURL) {
    // no baseURL configured; return path as-is (could be absolute or relative)
    return path;
  }
  const base = baseURL.replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${base}/${p}`;
}

/**
 * PUBLIC_INTERFACE
 * httpFetch performs a fetch request with:
 * - baseURL resolution
 * - JSON body parsing (if content-type is JSON)
 * - abort/timeout support
 * - normalized error object
 *
 * Params:
 * - path: string (api path without leading slash or with; both supported)
 * - options?: RequestInit
 * - config?: { timeout?: number }
 *
 * Returns:
 * - { ok, status, headers, data } or throws normalized error { message, status, data }
 */
export async function httpFetch(path, options = {}, config = {}) {
  const { apiBaseURL } = getEnv();
  const timeout = typeof config.timeout === 'number' ? config.timeout : DEFAULT_TIMEOUT;

  const url = buildURL(apiBaseURL, path);

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  let res;
  try {
    res = await fetch(url, {
      // sensible defaults
      credentials: options.credentials || 'same-origin',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
      ...options,
    });
  } catch (err) {
    clearTimeout(id);
    // Normalize fetch/abort errors
    const isAbort = err?.name === 'AbortError';
    const message = isAbort ? 'Request timed out' : (err?.message || 'Network error');
    const norm = { message, status: 0, data: null, cause: err };
    throw norm;
  } finally {
    clearTimeout(id);
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let data = null;
  try {
    data = isJson ? await res.json() : await res.text();
  } catch {
    // ignore parse errors; keep data as null or text
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const norm = { message, status: res.status, data };
    throw norm;
  }

  return {
    ok: true,
    status: res.status,
    headers: res.headers,
    data,
  };
}

export default httpFetch;
