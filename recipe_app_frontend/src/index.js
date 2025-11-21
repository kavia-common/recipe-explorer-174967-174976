import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme/theme.css';
import './index.css';
import App from './App';
import { RecipesProvider } from './state/RecipesContext';
import { BrowserRouter } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Application entrypoint.
 * Note: BrowserRouter is provided here. Child routing components (like AppRouter)
 * must not create their own BrowserRouter to avoid double-router issues.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RecipesProvider>
        <App />
      </RecipesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
