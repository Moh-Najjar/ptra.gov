import { Box, CircularProgress, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PowerBiEmbedProps {
  /** Accessible title passed to the iframe element. */
  title: string;
  /** Public Power BI view URL. */
  embedUrl: string;
}

/** Minimum iframe height so reports remain usable on smaller screens. */
const MIN_EMBED_HEIGHT = 560;

export const PowerBiEmbed = ({ title, embedUrl }: PowerBiEmbedProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  // Hide the loading overlay once the iframe content finishes loading.
  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Surface a friendly message if the iframe fails to load.
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasLoadError(true);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: MIN_EMBED_HEIGHT,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            zIndex: 1,
          }}
        >
          <CircularProgress aria-label={t('powerBi.loading')} />
        </Box>
      )}

      {hasLoadError ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: MIN_EMBED_HEIGHT,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" color="error">
            {t('powerBi.loadError')}
          </Typography>
        </Box>
      ) : (
        <Box
          component="iframe"
          title={title}
          src={embedUrl}
          onLoad={handleLoad}
          onError={handleError}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sx={{
            display: 'block',
            width: '100%',
            minHeight: MIN_EMBED_HEIGHT,
            height: { xs: '70vh', md: '80vh' },
            border: 0,
          }}
        />
      )}
    </Box>
  );
};
