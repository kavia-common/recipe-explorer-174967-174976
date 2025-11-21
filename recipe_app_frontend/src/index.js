import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme/theme.css';
import './index.css';
import App from './App';
import { RecipesProvider } from './state/RecipesContext';
import { BrowserRouter } from 'react-router-dom';

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
