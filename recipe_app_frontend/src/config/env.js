//
// PUBLIC_INTERFACE
// getEnv returns resolved environment values for the frontend.
// It centralizes resolution of API base URL using REACT_APP_API_BASE or REACT_APP_BACKEND_URL.
//
export function getEnv() {
  /**
   * PUBLIC_INTERFACE
   * resolveBaseURL resolves the API base URL from environment variables.
   * Order of preference:
   * - REACT_APP_API_BASE
   * - REACT_APP_BACKEND_URL
   * Returns empty string when not configured, which signals "mock mode".
   */
  // PUBLIC_INTERFACE
  function resolveBaseURL() {
    const fromBase = process?.env?.REACT_APP_API_BASE;
    const fromBackend = process?.env?.REACT_APP_BACKEND_URL;
    const url = (fromBase || fromBackend || '').trim();
    // normalize: remove trailing slashes
    return url.replace(/\/+$/, '');
  }

  return {
    apiBaseURL: resolveBaseURL(),
    nodeEnv: process?.env?.REACT_APP_NODE_ENV || process?.env?.NODE_ENV || 'development',
  };
}

export default getEnv;
