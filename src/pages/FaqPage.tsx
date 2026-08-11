import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import { FAQ_ITEMS } from '../constants/faqItems';

export const FaqPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.faq.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        {t('pages.faq.title')}
      </Typography>

      <Stack spacing={2}>
        {FAQ_ITEMS.map((item) => (
          <Accordion
            key={item.id}
            defaultExpanded={item.id === 'releaseTime'}
            disableGutters
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px !important',
              overflow: 'hidden',
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${item.id}-content`}
              id={`${item.id}-header`}
              sx={{
                px: { xs: 2, md: 3 },
                py: 1,
                bgcolor: 'background.paper',
                '& .MuiAccordionSummary-content': { my: 1.5 },
              }}
            >
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {t(item.questionKey)}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pb: 3, pt: 0 }}>
              <Stack spacing={2}>
                {item.answerKeys.map((answerKey) => (
                  <Typography
                    key={answerKey}
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.9 }}
                  >
                    {t(answerKey)}
                  </Typography>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Container>
  );
};
