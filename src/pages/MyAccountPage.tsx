import {
  Alert,
  Box,
  Breadcrumbs,
  Container,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import { PowerBiEmbed } from '../components/common/PowerBiEmbed';
import { useAuthoredPosts } from '../hooks/usePosts';
import type { AuthoredPost } from '../types/posts';

const hasIframeUrl = (post: AuthoredPost): post is AuthoredPost & { iframeUrl: string } =>
  typeof post.iframeUrl === 'string' && post.iframeUrl.trim().length > 0;

export const MyAccountPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useAuthoredPosts();
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const postsWithIframe = useMemo(
    () => (data ?? []).filter(hasIframeUrl),
    [data],
  );

  const postsWithoutIframe = useMemo(
    () => (data ?? []).filter((post) => !hasIframeUrl(post)),
    [data],
  );

  const selectedPost = useMemo(() => {
    if (selectedPostId === null) {
      return null;
    }

    return postsWithIframe.find((post) => post.id === selectedPostId) ?? null;
  }, [postsWithIframe, selectedPostId]);

  useEffect(() => {
    if (postsWithIframe.length === 0) {
      setSelectedPostId(null);
      return;
    }

    const selectedStillExists = postsWithIframe.some((post) => post.id === selectedPostId);
    if (!selectedStillExists) {
      setSelectedPostId(postsWithIframe[0].id);
    }
  }, [postsWithIframe, selectedPostId]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.myAccount.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t('pages.myAccount.title')}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
        {t('pages.myAccount.description')}
      </Typography>

      {isLoading && (
        <Typography variant="body1" color="text.secondary">
          {t('pages.myAccount.loading')}
        </Typography>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('pages.myAccount.loadError')}
        </Alert>
      )}

      {!isLoading && !isError && postsWithIframe.length === 0 && (
        <Alert severity="info">{t('pages.myAccount.noReports')}</Alert>
      )}

      {!isLoading && !isError && postsWithIframe.length > 0 && (
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={3}
          sx={{ alignItems: 'stretch' }}
        >
          <Paper
            variant="outlined"
            sx={{
              width: { xs: '100%', lg: 320 },
              flexShrink: 0,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {t('pages.myAccount.reportsList')}
              </Typography>
            </Box>
            <List disablePadding>
              {postsWithIframe.map((post) => {
                const isSelected = post.id === selectedPostId;

                return (
                  <ListItemButton
                    key={post.id}
                    selected={isSelected}
                    onClick={() => setSelectedPostId(post.id)}
                    sx={{
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemText
                      primary={post.title}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? 'primary.main' : 'text.primary',
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {selectedPost && (
              <>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  {selectedPost.title}
                </Typography>
                <PowerBiEmbed title={selectedPost.title} embedUrl={selectedPost.iframeUrl} />
              </>
            )}
          </Box>
        </Stack>
      )}

      {postsWithoutIframe.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            {t('pages.myAccount.unavailableReportsTitle')}
          </Typography>
          <Stack spacing={1}>
            {postsWithoutIframe.map((post) => (
              <Typography key={post.id} variant="body2" color="text.secondary">
                {`${post.title} — ${t('pages.myAccount.noIframe')}`}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}
    </Container>
  );
};
