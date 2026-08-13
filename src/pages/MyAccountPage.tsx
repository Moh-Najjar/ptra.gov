import {
  Alert,
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import { PowerBiEmbed } from '../components/common/PowerBiEmbed';
import { useAuthoredPosts } from '../hooks/queries/useAuthoredPosts';
import type { AuthoredPost } from '../types/posts';

const hasIframeUrl = (post: AuthoredPost): post is AuthoredPost & { iframeUrl: string } =>
  typeof post.iframeUrl === 'string' && post.iframeUrl.trim().length > 0;

export const MyAccountPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useAuthoredPosts();

  const postsWithIframe = useMemo(
    () => (data ?? []).filter(hasIframeUrl),
    [data],
  );

  const postsWithoutIframe = useMemo(
    () => (data ?? []).filter((post) => !hasIframeUrl(post)),
    [data],
  );

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

      <Stack spacing={5}>
        {postsWithIframe.map((post) => (
          <Box key={post.id}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              {post.title}
            </Typography>
            <PowerBiEmbed title={post.title} embedUrl={post.iframeUrl} />
          </Box>
        ))}
      </Stack>

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
