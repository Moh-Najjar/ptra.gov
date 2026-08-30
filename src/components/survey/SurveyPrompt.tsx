import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useSurvey } from '../../contexts/SurveyContext';
import { rem } from '../../theme/rem';

interface SurveyPromptProps {
  open: boolean;
  /** Soft-dismiss: re-show after 1 minute or 2 page views. */
  onDismiss: () => void;
  /** Hide prompt only (e.g. opening the survey dialog). */
  onHide: () => void;
}

export const SurveyPrompt = ({ open, onDismiss, onHide }: SurveyPromptProps) => {
  const { t } = useTranslation();
  const { openSurvey } = useSurvey();

  const handleTakeSurvey = (): void => {
    onHide();
    openSurvey();
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        role="dialog"
        aria-labelledby="survey-prompt-title"
        aria-describedby="survey-prompt-description"
        sx={{
          position: 'fixed',
          bottom: { xs: rem(16), sm: rem(24) },
          // Logical inline-end mirrors by language: EN = bottom-right, AR = bottom-left.
          insetInlineEnd: { xs: rem(16), sm: rem(24) },
          insetInlineStart: { xs: rem(16), sm: 'auto' },
          zIndex: (muiTheme) => muiTheme.zIndex.snackbar,
          width: { xs: 'auto', sm: rem(380) },
          maxWidth: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: '0.0625rem solid',
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <RateReviewOutlinedIcon fontSize="small" />
          <Typography id="survey-prompt-title" variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
            {t('survey.promptTitle')}
          </Typography>
          <IconButton
            size="small"
            aria-label={t('survey.close')}
            onClick={onDismiss}
            sx={{
              color: 'inherit',
              bgcolor: alpha('#FFFFFF', 0.12),
              '&:hover': { bgcolor: alpha('#FFFFFF', 0.22) },
            }}
          >
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        <Stack spacing={2} sx={{ p: 2 }}>
          <Typography id="survey-prompt-description" variant="body2" color="text.secondary">
            {t('survey.promptDescription')}
          </Typography>

          <Button variant="contained" onClick={handleTakeSurvey} fullWidth>
            {t('survey.takeSurvey')}
          </Button>

          <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
            <Button size="small" onClick={onDismiss} sx={{ color: 'text.secondary' }}>
              {t('survey.notNow')}
            </Button>
            <Button size="small" onClick={onDismiss} sx={{ color: 'text.secondary' }}>
              {t('survey.dontAskAgain')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
};
