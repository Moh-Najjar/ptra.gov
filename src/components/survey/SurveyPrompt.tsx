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
import type { SurveyDismissReason } from '../../types/survey';
import { dismissSurvey } from '../../utils/surveyStorage';

interface SurveyPromptProps {
  open: boolean;
  onClose: () => void;
  onDismiss: (reason: SurveyDismissReason) => void;
}

export const SurveyPrompt = ({ open, onClose, onDismiss }: SurveyPromptProps) => {
  const { t } = useTranslation();
  const { openSurvey } = useSurvey();

  const handleTakeSurvey = (): void => {
    onClose();
    openSurvey();
  };

  /** X only hides the slide-in for this session; it does not long-term dismiss. */
  const handleClosePrompt = (): void => {
    onClose();
  };

  const handleNotNow = (): void => {
    dismissSurvey('notNow');
    onDismiss('notNow');
    onClose();
  };

  const handleNever = (): void => {
    dismissSurvey('never');
    onDismiss('never');
    onClose();
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
          bottom: { xs: 16, sm: 24 },
          // Logical inline-end mirrors by language: EN = bottom-right, AR = bottom-left.
          insetInlineEnd: { xs: 16, sm: 24 },
          insetInlineStart: { xs: 16, sm: 'auto' },
          zIndex: (muiTheme) => muiTheme.zIndex.snackbar,
          width: { xs: 'auto', sm: 380 },
          maxWidth: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
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
            onClick={handleClosePrompt}
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
            <Button size="small" onClick={handleNotNow} sx={{ color: 'text.secondary' }}>
              {t('survey.notNow')}
            </Button>
            <Button size="small" onClick={handleNever} sx={{ color: 'text.secondary' }}>
              {t('survey.dontAskAgain')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
};
