import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';

// Apply saved theme on startup
try {
  const t = localStorage.getItem('app_theme');
  if (t && t !== 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (err) {
  // ignore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
