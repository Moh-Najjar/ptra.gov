import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Link,
  Snackbar,
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
import {
  AdminDialog,
  AdminDialogCancelButton,
  AdminDialogContent,
  AdminDialogDangerButton,
  AdminDialogFooter,
  AdminDialogHeader,
  AdminDialogSection,
} from '../components/common/AdminDialog';
import { PowerBiEmbed } from '../components/common/PowerBiEmbed';
import { PostAuthorsDialog } from '../components/posts/PostAuthorsDialog';
import { PostFormDialog } from '../components/posts/PostFormDialog';
import { USER_ROLES } from '../constants/userRoles';
import { useAuth } from '../hooks/useAuth';
import {
  useAdminPosts,
  useCreatePost,
  useDeletePost,
  useUpdatePost,
} from '../hooks/usePosts';
import {
  buildPostPayload,
  createEmptyPostFormValues,
  formatPostAuthors,
  hasPostIframe,
  isPostFormValid,
  mapAdminPostToFormValues,
  type AdminPost,
  type PostFormValues,
} from '../types/posts';
import { getApiErrorMessage } from '../utils/apiErrors';
import { userHasAnyRole } from '../utils/roles';
import { rem } from '../theme/rem';

type PostDialogMode = 'add' | 'edit';

interface PostNotice {
  severity: 'success' | 'error';
  message: string;
}

export const PostPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError } = useAdminPosts();
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const [previewPost, setPreviewPost] = useState<AdminPost | null>(null);
  const [authorsPost, setAuthorsPost] = useState<AdminPost | null>(null);
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null);
  const [formMode, setFormMode] = useState<PostDialogMode>('add');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<PostFormValues>(createEmptyPostFormValues());
  const [notice, setNotice] = useState<PostNotice | null>(null);

  const canManagePosts = userHasAnyRole(user, [USER_ROLES.ADMINISTRATOR]);
  const isSaving =
    createPostMutation.isPending ||
    updatePostMutation.isPending ||
    deletePostMutation.isPending;

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

  const openAddDialog = () => {
    setFormMode('add');
    setSelectedPost(null);
    setFormValues(createEmptyPostFormValues());
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (post: AdminPost) => {
    setFormMode('edit');
    setSelectedPost(post);
    setFormValues(mapAdminPostToFormValues(post));
    setIsFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setSelectedPost(null);
    setFormValues(createEmptyPostFormValues());
  };

  const openDeleteDialog = (post: AdminPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPost(null);
  };

  const updateFormValue = <K extends keyof PostFormValues>(
    field: K,
    value: PostFormValues[K],
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleSaveForm = async () => {
    if (!isPostFormValid(formValues)) {
      setNotice({ severity: 'error', message: t('pages.post.validationError') });
      return;
    }

    const payload = buildPostPayload(formValues);

    try {
      if (formMode === 'add') {
        await createPostMutation.mutateAsync(payload);
        setNotice({ severity: 'success', message: t('pages.post.createSuccess') });
      } else if (selectedPost !== null) {
        await updatePostMutation.mutateAsync({
          postId: selectedPost.id,
          payload,
        });
        setNotice({ severity: 'success', message: t('pages.post.updateSuccess') });
      }

      closeFormDialog();
    } catch (error) {
      setNotice({
        severity: 'error',
        message: getApiErrorMessage(
          error,
          formMode === 'add' ? t('pages.post.createError') : t('pages.post.updateError'),
        ),
      });
    }
  };

  const handleDeletePost = async () => {
    if (selectedPost === null) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(selectedPost.id);
      closeDeleteDialog();
      setNotice({ severity: 'success', message: t('pages.post.deleteSuccess') });
    } catch (error) {
      setNotice({
        severity: 'error',
        message: getApiErrorMessage(error, t('pages.post.deleteError')),
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.post.title')}</Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4, justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {t('pages.post.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t('pages.post.description')}
          </Typography>
        </Box>

        {canManagePosts && (
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={openAddDialog}
            disabled={isSaving}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, flexShrink: 0 }}
          >
            {t('pages.post.addPost')}
          </Button>
        )}
      </Stack>

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
                    <TableCell sx={{ fontWeight: 600, maxWidth: rem(320) }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {postTitle}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: rem(420) }}>
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
                        {canManagePosts && (
                          <>
                            <Tooltip title={t('pages.post.editPost')}>
                              <IconButton
                                size="small"
                                color="primary"
                                aria-label={t('pages.post.editPost')}
                                onClick={() => openEditDialog(post)}
                                disabled={isSaving}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('pages.post.table.manageAuthors')}>
                              <IconButton
                                size="small"
                                color="primary"
                                aria-label={t('pages.post.table.manageAuthors')}
                                onClick={() => setAuthorsPost(post)}
                                disabled={isSaving}
                              >
                                <GroupOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('pages.post.deletePost')}>
                              <IconButton
                                size="small"
                                color="error"
                                aria-label={t('pages.post.deletePost')}
                                onClick={() => openDeleteDialog(post)}
                                disabled={isSaving}
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
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

      <PostFormDialog
        open={isFormDialogOpen}
        mode={formMode}
        formValues={formValues}
        isSaving={
          formMode === 'add' ? createPostMutation.isPending : updatePostMutation.isPending
        }
        onClose={closeFormDialog}
        onSave={() => {
          void handleSaveForm();
        }}
        onChange={updateFormValue}
      />

      <AdminDialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <AdminDialogHeader
          title={t('pages.post.deletePost')}
          subtitle={selectedPost ? renderPostTitle(selectedPost) : undefined}
          icon={DeleteOutlineOutlinedIcon}
          tone="error"
          onClose={closeDeleteDialog}
          closeLabel={t('pages.post.form.cancel')}
          closeDisabled={deletePostMutation.isPending}
        />
        <AdminDialogContent>
          <AdminDialogSection>
            <Typography variant="body1">
              {t('pages.post.deleteConfirm', {
                name: selectedPost ? renderPostTitle(selectedPost) : '',
              })}
            </Typography>
          </AdminDialogSection>
        </AdminDialogContent>
        <AdminDialogFooter>
          <AdminDialogCancelButton
            onClick={closeDeleteDialog}
            disabled={deletePostMutation.isPending}
          >
            {t('pages.post.form.cancel')}
          </AdminDialogCancelButton>
          <AdminDialogDangerButton
            onClick={() => {
              void handleDeletePost();
            }}
            disabled={deletePostMutation.isPending}
          >
            {deletePostMutation.isPending
              ? t('pages.post.form.deleting')
              : t('pages.post.form.delete')}
          </AdminDialogDangerButton>
        </AdminDialogFooter>
      </AdminDialog>

      <PostAuthorsDialog post={authorsPost} onClose={() => setAuthorsPost(null)} />

      <AdminDialog
        open={previewPost !== null && hasPostIframe(previewPost)}
        onClose={() => setPreviewPost(null)}
        fullWidth
        maxWidth="xl"
      >
        <AdminDialogHeader
          title={previewPost ? renderPostTitle(previewPost) : ''}
          subtitle={t('pages.post.table.viewReport')}
          icon={BarChartOutlinedIcon}
          onClose={() => setPreviewPost(null)}
          closeLabel={t('pages.post.authors.close')}
        />
        <AdminDialogContent disablePadding>
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
            {previewPost && hasPostIframe(previewPost) && (
              <PowerBiEmbed title={renderPostTitle(previewPost)} embedUrl={previewPost.iframeUrl} />
            )}
          </Box>
        </AdminDialogContent>
        <AdminDialogFooter>
          <AdminDialogCancelButton onClick={() => setPreviewPost(null)}>
            {t('pages.post.authors.close')}
          </AdminDialogCancelButton>
        </AdminDialogFooter>
      </AdminDialog>

      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notice?.severity ?? 'success'}
          onClose={() => setNotice(null)}
          sx={{ width: '100%' }}
        >
          {notice?.message ?? ''}
        </Alert>
      </Snackbar>
    </Container>
  );
};
