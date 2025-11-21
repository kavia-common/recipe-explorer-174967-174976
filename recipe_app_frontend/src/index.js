import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme/theme.css';
import './index.css';
import App from './App';
import { RecipesProvider } from './state/RecipesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecipesProvider>
      <App />
    </RecipesProvider>
  </React.StrictMode>
);
