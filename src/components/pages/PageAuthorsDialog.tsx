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
  useAssignPageAuthor,
  usePageAuthors,
  useRemovePageAuthor,
  useSearchPageAuthors,
} from '../../hooks/usePages';
import type { CmsPage, PageAuthor, SearchablePageAuthor } from '../../types/cmsPage';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { rem } from '../../theme/rem';

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

interface AuthorNotice {
  severity: 'success' | 'error';
  message: string;
}

interface PageAuthorsDialogProps {
  page: CmsPage | null;
  onClose: () => void;
}

export const PageAuthorsDialog = ({ page, onClose }: PageAuthorsDialogProps) => {
  const { t } = useTranslation();
  const isOpen = page !== null;
  const pageId = page?.id ?? null;

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<SearchablePageAuthor | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<AuthorNotice | null>(null);
  const [removingAuthorId, setRemovingAuthorId] = useState<number | null>(null);

  const {
    data: authors = [],
    isLoading: isAuthorsLoading,
    isError: isAuthorsError,
  } = usePageAuthors(pageId, isOpen);

  const {
    data: searchResults = [],
    isFetching: isSearching,
    isError: isSearchError,
  } = useSearchPageAuthors(debouncedSearch, isOpen);

  const assignAuthorMutation = useAssignPageAuthor();
  const removeAuthorMutation = useRemovePageAuthor();

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
    if (!page || selectedAuthor === null) {
      return;
    }

    const assignedAuthorName = selectedAuthor.name;
    setActionError(null);

    try {
      await assignAuthorMutation.mutateAsync({
        pageId: page.id,
        payload: { userId: selectedAuthor.id },
      });
      setSelectedAuthor(null);
      setSearchInput('');
      setDebouncedSearch('');
      setNotice({
        severity: 'success',
        message: t('pages.pages.authors.assignSuccess', { name: assignedAuthorName }),
      });
    } catch (error) {
      setActionError(getApiErrorMessage(error, t('pages.pages.authors.assignError')));
    }
  };

  const handleRemoveAuthor = async (author: PageAuthor) => {
    if (!page) {
      return;
    }

    setActionError(null);
    setRemovingAuthorId(author.id);

    try {
      await removeAuthorMutation.mutateAsync({
        pageId: page.id,
        userId: author.id,
      });
      setNotice({
        severity: 'success',
        message: t('pages.pages.authors.removeSuccess', { name: author.name }),
      });
    } catch (error) {
      setActionError(getApiErrorMessage(error, t('pages.pages.authors.removeError')));
    } finally {
      setRemovingAuthorId(null);
    }
  };

  const pageTitle =
    page && page.title.trim().length > 0 ? page.title : t('pages.pages.table.untitled');

  return (
    <>
      <AdminDialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <AdminDialogHeader
          title={t('pages.pages.authors.title')}
          subtitle={pageTitle}
          icon={GroupOutlinedIcon}
          onClose={onClose}
          closeLabel={t('pages.pages.authors.close')}
          closeDisabled={isActionPending}
        />

        <AdminDialogContent>
          <Stack spacing={2.5}>
            <AdminDialogSection
              title={t('pages.pages.authors.currentAuthors')}
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
                  <CircularProgress size={rem(24)} aria-label={t('pages.pages.authors.loading')} />
                </Box>
              )}

              {isAuthorsError && (
                <Alert severity="error">{t('pages.pages.authors.loadError')}</Alert>
              )}

              {!isAuthorsLoading && !isAuthorsError && authors.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  {t('pages.pages.authors.noAuthors')}
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
              title={t('pages.pages.authors.assignAuthor')}
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
                    ? t('pages.pages.authors.searchHint')
                    : t('pages.pages.authors.noSearchResults')
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
                    label={t('pages.pages.authors.searchLabel')}
                    placeholder={t('pages.pages.authors.searchPlaceholder')}
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
                  {t('pages.pages.authors.searchError')}
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
            {t('pages.pages.authors.close')}
          </AdminDialogCancelButton>
          <AdminDialogPrimaryButton
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => {
              void handleAssignAuthor();
            }}
            disabled={selectedAuthor === null || isActionPending}
          >
            {assignAuthorMutation.isPending
              ? t('pages.pages.authors.assigning')
              : t('pages.pages.authors.assign')}
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
