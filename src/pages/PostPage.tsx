import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
} from '../components/common/AdminTable';
import { PowerBiEmbed } from '../components/common/PowerBiEmbed';
import { PostAuthorsDialog } from '../components/posts/PostAuthorsDialog';
import { useAdminPosts } from '../hooks/usePosts';
import { formatPostAuthors, hasPostIframe, type AdminPost } from '../types/posts';

export const PostPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useAdminPosts();
  const [previewPost, setPreviewPost] = useState<AdminPost | null>(null);
  const [authorsPost, setAuthorsPost] = useState<AdminPost | null>(null);

  const sortedPosts = useMemo(
    () => [...(data ?? [])].sort((first, second) => second.id - first.id),
    [data],
  );

  const renderPostTitle = (post: AdminPost): string => {
    if (post.title.trim().length > 0) {
      return post.title;
    }

    return t('pages.post.table.untitled');
  };

  const renderAuthorsSummary = (post: AdminPost): string => {
    const authorsText = formatPostAuthors(post.authors);
    if (authorsText.length === 0) {
      return t('pages.post.table.notAvailable');
    }

    return authorsText;
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.post.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t('pages.post.title')}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
        {t('pages.post.description')}
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress aria-label={t('pages.post.loading')} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('pages.post.loadError')}
        </Alert>
      )}

      {!isLoading && !isError && sortedPosts.length === 0 && (
        <Alert severity="info">{t('pages.post.noData')}</Alert>
      )}

      {!isLoading && !isError && sortedPosts.length > 0 && (
        <AdminTableContainer>
          <Table aria-label={t('pages.post.title')}>
            <TableHead>
              <AdminTableHeadRow>
                <AdminTableHeadCell>{t('pages.post.table.id')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.post.table.title')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.post.table.authors')}</AdminTableHeadCell>
                <AdminTableHeadCell align="center">
                  {t('pages.post.table.actions')}
                </AdminTableHeadCell>
              </AdminTableHeadRow>
            </TableHead>
            <TableBody>
              {sortedPosts.map((post) => {
                const postHasIframe = hasPostIframe(post);
                const postTitle = renderPostTitle(post);

                return (
                  <TableRow key={post.id} hover>
                    <TableCell>{post.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 320 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {postTitle}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 420 }}>
                      {post.authors.length > 0 ? (
                        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
                          {post.authors.map((author) => (
                            <Chip
                              key={author.id}
                              label={author.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {renderAuthorsSummary(post)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                        <Tooltip title={t('pages.post.table.manageAuthors')}>
                          <IconButton
                            size="small"
                            color="primary"
                            aria-label={t('pages.post.table.manageAuthors')}
                            onClick={() => setAuthorsPost(post)}
                          >
                            <GroupOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            postHasIframe
                              ? t('pages.post.table.viewReport')
                              : t('pages.post.table.reportUnavailable')
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              aria-label={t('pages.post.table.viewReport')}
                              disabled={!postHasIframe}
                              onClick={() => setPreviewPost(post)}
                            >
                              <BarChartOutlinedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminTableContainer>
      )}

      <PostAuthorsDialog post={authorsPost} onClose={() => setAuthorsPost(null)} />

      <Dialog
        open={previewPost !== null && hasPostIframe(previewPost)}
        onClose={() => setPreviewPost(null)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle sx={{ pr: 6 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <BarChartOutlinedIcon color="primary" />
            <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
              {previewPost ? renderPostTitle(previewPost) : ''}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          {previewPost && hasPostIframe(previewPost) && (
            <PowerBiEmbed title={renderPostTitle(previewPost)} embedUrl={previewPost.iframeUrl} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};
