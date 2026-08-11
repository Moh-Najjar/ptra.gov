import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { getPowerBiReport } from '../../constants/powerBiReports';
import type { PowerBiReportId } from '../../types/powerBi';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../app/routes/paths';
import { useTranslation } from 'react-i18next';
import { PowerBiEmbed } from './PowerBiEmbed';

interface PowerBiPageProps {
  /** Report id from the centralized Power BI config. */
  reportId: PowerBiReportId;
}

export const PowerBiPage = ({ reportId }: PowerBiPageProps) => {
  const { t } = useTranslation();
  const report = getPowerBiReport(reportId);
  const pageTitle = t(report.titleKey);
  const pageDescription = report.descriptionKey ? t(report.descriptionKey) : undefined;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{pageTitle}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        {pageTitle}
      </Typography>

      {pageDescription && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.8 }}
        >
          {pageDescription}
        </Typography>
      )}

      <Box sx={{ mt: pageDescription ? 0 : 2 }}>
        <PowerBiEmbed title={pageTitle} embedUrl={report.embedUrl} />
      </Box>
    </Container>
  );
};
