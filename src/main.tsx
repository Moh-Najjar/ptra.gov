import { applyFontSizeLevel, getStoredFontSizeLevel } from './constants/fontSize';
import { AppProviders } from './app/providers/AppProviders';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './app/App';

import '@fontsource/cairo/400.css';
import '@fontsource/cairo/600.css';
import '@fontsource/cairo/700.css';
import './index.css';
import './i18n';

applyFontSizeLevel(getStoredFontSizeLevel());

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  );
}
