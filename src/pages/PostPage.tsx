import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
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
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  getAdminTableInteractiveRowSx,
} from '../components/common/AdminTable';
import { PowerBiEmbed } from '../components/common/PowerBiEmbed';
import { useAdminPosts } from '../hooks/usePosts';
import { formatPostAuthors, hasPostIframe, type AdminPost } from '../types/posts';

export const PostPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useAdminPosts();
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null);

  const sortedPosts = useMemo(
    () => [...(data ?? [])].sort((first, second) => second.id - first.id),
    [data],
  );

  const closePreviewDialog = () => {
    setSelectedPost(null);
  };

  const openPreviewDialog = (post: AdminPost) => {
    if (!hasPostIframe(post)) {
      return;
    }

    setSelectedPost(post);
  };

  const renderPostTitle = (post: AdminPost): string => {
    if (post.title.trim().length > 0) {
      return post.title;
    }

    return t('pages.post.table.untitled');
  };

  const renderAuthors = (post: AdminPost): string => {
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
                <AdminTableHeadCell>{t('pages.post.table.report')}</AdminTableHeadCell>
              </AdminTableHeadRow>
            </TableHead>
            <TableBody>
              {sortedPosts.map((post) => {
                const postHasIframe = hasPostIframe(post);
                const postTitle = renderPostTitle(post);

                return (
                  <TableRow
                    key={post.id}
                    hover
                    sx={getAdminTableInteractiveRowSx(postHasIframe)}
                    onClick={() => openPreviewDialog(post)}
                  >
                    <TableCell>{post.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 320 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {postTitle}
                        </Typography>
                        {postHasIframe && (
                          <OpenInNewOutlinedIcon
                            fontSize="small"
                            color="primary"
                            aria-hidden="true"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 420 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {renderAuthors(post)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {postHasIframe ? (
                        <Chip
                          icon={<BarChartOutlinedIcon />}
                          label={t('pages.post.table.viewReport')}
                          size="small"
                          color="primary"
                          variant="outlined"
                          clickable
                          onClick={(event) => {
                            event.stopPropagation();
                            openPreviewDialog(post);
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('pages.post.table.notAvailable')}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminTableContainer>
      )}

      <Dialog
        open={selectedPost !== null && hasPostIframe(selectedPost)}
        onClose={closePreviewDialog}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle sx={{ pr: 6 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <BarChartOutlinedIcon color="primary" />
            <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
              {selectedPost ? renderPostTitle(selectedPost) : ''}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          {selectedPost && hasPostIframe(selectedPost) && (
            <PowerBiEmbed title={renderPostTitle(selectedPost)} embedUrl={selectedPost.iframeUrl} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};
