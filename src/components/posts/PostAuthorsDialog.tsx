import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AdminDialog,
  AdminDialogCancelButton,
  AdminDialogContent,
  AdminDialogFooter,
  AdminDialogHeader,
  AdminDialogPrimaryButton,
  AdminDialogSection,
} from '../common/AdminDialog';
import {
  useAssignPostAuthor,
  usePostAuthors,
  useRemovePostAuthor,
  useSearchPostAuthors,
} from '../../hooks/usePosts';
import type { AdminPost, PostAuthor, SearchablePostAuthor } from '../../types/posts';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { rem } from '../../theme/rem';

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

  return (
    <>
      <AdminDialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <AdminDialogHeader
          title={t('pages.post.authors.title')}
          subtitle={postTitle}
          icon={GroupOutlinedIcon}
          onClose={onClose}
          closeLabel={t('pages.post.authors.close')}
          closeDisabled={isActionPending}
        />

        <AdminDialogContent>
          <Stack spacing={2.5}>
            <AdminDialogSection
              title={t('pages.post.authors.currentAuthors')}
              icon={GroupOutlinedIcon}
              action={
                !isAuthorsLoading && !isAuthorsError ? (
                  <Chip
                    label={authors.length}
                    size="small"
                    color="primary"
                    sx={{ height: rem(22), fontWeight: 700 }}
                  />
                ) : undefined
              }
            >
              {isAuthorsLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={rem(24)} aria-label={t('pages.post.authors.loading')} />
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
                      sx={(theme) => ({
                        bgcolor: theme.palette.mode === 'dark' ? 'transparent' : undefined,
                        fontWeight: 600,
                      })}
                    />
                  ))}
                </Stack>
              )}
            </AdminDialogSection>

            <AdminDialogSection
              title={t('pages.post.authors.assignAuthor')}
              icon={PersonAddOutlinedIcon}
            >
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
            </AdminDialogSection>
          </Stack>
        </AdminDialogContent>

        <AdminDialogFooter>
          <AdminDialogCancelButton onClick={onClose} disabled={isActionPending}>
            {t('pages.post.authors.close')}
          </AdminDialogCancelButton>
          <AdminDialogPrimaryButton
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => {
              void handleAssignAuthor();
            }}
            disabled={selectedAuthor === null || isActionPending}
          >
            {assignAuthorMutation.isPending
              ? t('pages.post.authors.assigning')
              : t('pages.post.authors.assign')}
          </AdminDialogPrimaryButton>
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
    </>
  );
};
