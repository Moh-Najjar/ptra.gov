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
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAssignPostAuthor,
  usePostAuthors,
  useSearchPostAuthors,
} from '../../hooks/usePosts';
import type { AdminPost, SearchablePostAuthor } from '../../types/posts';
import { getApiErrorMessage } from '../../utils/apiErrors';

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

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

  useEffect(() => {
    if (!isOpen) {
      setSearchInput('');
      setDebouncedSearch('');
      setSelectedAuthor(null);
      setActionError(null);
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

    setActionError(null);

    try {
      await assignAuthorMutation.mutateAsync({
        postId: post.id,
        payload: { userId: selectedAuthor.id },
      });
      setSelectedAuthor(null);
      setSearchInput('');
      setDebouncedSearch('');
    } catch (error) {
      setActionError(getApiErrorMessage(error, t('pages.post.authors.assignError')));
    }
  };

  const postTitle =
    post && post.title.trim().length > 0 ? post.title : t('pages.post.table.untitled');

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('pages.post.authors.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {`${t('pages.post.authors.postLabel')}: ${postTitle}`}
          </Typography>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              {t('pages.post.authors.currentAuthors')}
            </Typography>

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
                  <Chip key={author.id} label={author.name} size="small" variant="outlined" />
                ))}
              </Stack>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              {t('pages.post.authors.assignAuthor')}
            </Typography>

            <Autocomplete
              options={availableSearchResults}
              value={selectedAuthor}
              inputValue={searchInput}
              loading={isSearching}
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
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={assignAuthorMutation.isPending}>
          {t('pages.post.authors.close')}
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAddOutlinedIcon />}
          onClick={() => {
            void handleAssignAuthor();
          }}
          disabled={selectedAuthor === null || assignAuthorMutation.isPending}
        >
          {assignAuthorMutation.isPending
            ? t('pages.post.authors.assigning')
            : t('pages.post.authors.assign')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
