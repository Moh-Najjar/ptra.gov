import { type ReactNode, useEffect, useMemo } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { getDirection } from '../../i18n/types';
import { useColorMode } from '../../hooks/useColorMode';
import { createAppTheme } from '../../theme';
import { ColorModeProvider } from './ColorModeProvider';
import { FontSizeProvider } from './FontSizeProvider';
import { queryClient } from './queryClient';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer],
});

interface AppProvidersProps {
  children: ReactNode;
}

const ThemedApp = ({ children }: AppProvidersProps) => {
  const { i18n, t } = useTranslation();
  const { mode } = useColorMode();
  const direction = getDirection(i18n.language === 'en' ? 'en' : 'ar');

  const theme = useMemo(() => createAppTheme(direction, mode), [direction, mode]);
  const cache = direction === 'rtl' ? cacheRtl : cacheLtr;

  useEffect(() => {
    document.title = t('meta.title');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'));
    }
  }, [i18n.language, t]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FontSizeProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ColorModeProvider>
    <ThemedApp>{children}</ThemedApp>
  </ColorModeProvider>
);
