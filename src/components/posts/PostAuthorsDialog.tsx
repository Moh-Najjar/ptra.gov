import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAssignPostAuthor,
  usePostAuthors,
  useRemovePostAuthor,
  useSearchPostAuthors,
} from '../../hooks/usePosts';
import type { AdminPost, PostAuthor, SearchablePostAuthor } from '../../types/posts';
import { getApiErrorMessage } from '../../utils/apiErrors';

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

interface AuthorNotice {
  severity: 'success' | 'error';
  message: string;
}

interface PostAuthorsDialogProps {
  post: AdminPost | null;
  onClose: () => void;
}

export const PostAuthorsDialog = ({ post, onClose }: PostAuthorsDialogProps) => {
  const { t } = useTranslation();
  const isOpen = post !== null;
  const postId = post?.id ?? null;

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<SearchablePostAuthor | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<AuthorNotice | null>(null);
  const [removingAuthorId, setRemovingAuthorId] = useState<number | null>(null);

  const {
    data: authors = [],
    isLoading: isAuthorsLoading,
    isError: isAuthorsError,
  } = usePostAuthors(postId, isOpen);

  const {
    data: searchResults = [],
    isFetching: isSearching,
    isError: isSearchError,
  } = useSearchPostAuthors(debouncedSearch, isOpen);

  const assignAuthorMutation = useAssignPostAuthor();
  const removeAuthorMutation = useRemovePostAuthor();

  const isActionPending =
    assignAuthorMutation.isPending || removeAuthorMutation.isPending || removingAuthorId !== null;

  useEffect(() => {
    if (!isOpen) {
      setSearchInput('');
      setDebouncedSearch('');
      setSelectedAuthor(null);
      setActionError(null);
      setNotice(null);
      setRemovingAuthorId(null);
      return;
    }

    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen, searchInput]);

  const assignedAuthorIds = useMemo(
    () => new Set(authors.map((author) => author.id)),
    [authors],
  );

  const availableSearchResults = useMemo(
    () => searchResults.filter((author) => !assignedAuthorIds.has(author.id)),
    [assignedAuthorIds, searchResults],
  );

  const handleAssignAuthor = async () => {
    if (!post || selectedAuthor === null) {
      return;
    }

    const assignedAuthorName = selectedAuthor.name;
    setActionError(null);

    try {
      await assignAuthorMutation.mutateAsync({
        postId: post.id,
        payload: { userId: selectedAuthor.id },
      });
      setSelectedAuthor(null);
      setSearchInput('');
      setDebouncedSearch('');
      setNotice({
        severity: 'success',
        message: t('pages.post.authors.assignSuccess', { name: assignedAuthorName }),
      });
    } catch (error) {
      setActionError(getApiErrorMessage(error, t('pages.post.authors.assignError')));
    }
  };

  const handleRemoveAuthor = async (author: PostAuthor) => {
    if (!post) {
      return;
    }

    setActionError(null);
    setRemovingAuthorId(author.id);

    try {
      await removeAuthorMutation.mutateAsync({
        postId: post.id,
        userId: author.id,
      });
      setNotice({
        severity: 'success',
        message: t('pages.post.authors.removeSuccess', { name: author.name }),
      });
    } catch (error) {
      setActionError(getApiErrorMessage(error, t('pages.post.authors.removeError')));
    } finally {
      setRemovingAuthorId(null);
    }
  };

  const postTitle =
    post && post.title.trim().length > 0 ? post.title : t('pages.post.table.untitled');

  const sectionSurfaceSx = {
    p: 2,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: (theme: { palette: { primary: { main: string }; mode: string } }) =>
      alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.05),
  } as const;

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: (theme) => `0 16px 40px ${alpha(theme.palette.primary.main, 0.18)}`,
            },
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            px: 3,
            py: 2.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <IconButton
            aria-label={t('pages.post.authors.close')}
            onClick={onClose}
            disabled={isActionPending}
            sx={{
              position: 'absolute',
              top: 8,
              insetInlineEnd: 8,
              color: 'inherit',
              bgcolor: alpha('#FFFFFF', 0.12),
              '&:hover': {
                bgcolor: alpha('#FFFFFF', 0.22),
              },
            }}
          >
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', pe: 5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: alpha('#FFFFFF', 0.16),
                border: '1px solid',
                borderColor: alpha('#FFFFFF', 0.28),
              }}
            >
              <GroupOutlinedIcon />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                {t('pages.post.authors.title')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.92, mt: 0.25 }} noWrap>
                {postTitle}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <DialogContent
          sx={{
            px: 3,
            py: 3,
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.06 : 0.025),
          }}
        >
          <Stack spacing={2.5}>
            <Box sx={sectionSurfaceSx}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', mb: 1.5, color: 'primary.main' }}
              >
                <GroupOutlinedIcon fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('pages.post.authors.currentAuthors')}
                </Typography>
                {!isAuthorsLoading && !isAuthorsError && (
                  <Chip
                    label={authors.length}
                    size="small"
                    color="primary"
                    sx={{ height: 22, fontWeight: 700 }}
                  />
                )}
              </Stack>

              {isAuthorsLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} aria-label={t('pages.post.authors.loading')} />
                </Box>
              )}

              {isAuthorsError && (
                <Alert severity="error">{t('pages.post.authors.loadError')}</Alert>
              )}

              {!isAuthorsLoading && !isAuthorsError && authors.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  {t('pages.post.authors.noAuthors')}
                </Typography>
              )}

              {!isAuthorsLoading && !isAuthorsError && authors.length > 0 && (
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {authors.map((author) => (
                    <Chip
                      key={author.id}
                      label={author.name}
                      size="small"
                      color="primary"
                      variant="outlined"
                      disabled={isActionPending}
                      onDelete={() => {
                        void handleRemoveAuthor(author);
                      }}
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Box sx={sectionSurfaceSx}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', mb: 1.5, color: 'primary.main' }}
              >
                <PersonAddOutlinedIcon fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('pages.post.authors.assignAuthor')}
                </Typography>
              </Stack>

              <Autocomplete
                options={availableSearchResults}
                value={selectedAuthor}
                inputValue={searchInput}
                loading={isSearching}
                disabled={isActionPending}
                filterOptions={(options) => options}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                isOptionEqualToValue={(firstOption, secondOption) =>
                  firstOption.id === secondOption.id
                }
                noOptionsText={
                  debouncedSearch.length < MIN_SEARCH_LENGTH
                    ? t('pages.post.authors.searchHint')
                    : t('pages.post.authors.noSearchResults')
                }
                onInputChange={(_event, nextInputValue) => {
                  setSearchInput(nextInputValue);
                  setActionError(null);
                }}
                onChange={(_event, nextValue) => {
                  setSelectedAuthor(nextValue);
                  setActionError(null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('pages.post.authors.searchLabel')}
                    placeholder={t('pages.post.authors.searchPlaceholder')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'background.paper',
                      },
                    }}
                  />
                )}
              />

              {isSearchError && (
                <Alert severity="error" sx={{ mt: 1.5 }}>
                  {t('pages.post.authors.searchError')}
                </Alert>
              )}

              {actionError && (
                <Alert severity="error" sx={{ mt: 1.5 }}>
                  {actionError}
                </Alert>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1,
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.04),
          }}
        >
          <Button
            onClick={onClose}
            disabled={isActionPending}
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            {t('pages.post.authors.close')}
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => {
              void handleAssignAuthor();
            }}
            disabled={selectedAuthor === null || isActionPending}
            sx={{
              px: 2.5,
              fontWeight: 700,
              boxShadow: (theme) => `0 8px 20px ${alpha(theme.palette.primary.main, 0.28)}`,
            }}
          >
            {assignAuthorMutation.isPending
              ? t('pages.post.authors.assigning')
              : t('pages.post.authors.assign')}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};
