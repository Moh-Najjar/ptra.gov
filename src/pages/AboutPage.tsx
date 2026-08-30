import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import { ABOUT_OBJECTIVE_KEYS, ABOUT_PARAGRAPH_KEYS } from '../constants/aboutContent';

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.about.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        {t('pages.about.title')}
      </Typography>

      <Box
        sx={{
          border: '0.0625rem solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
          p: { xs: 3, md: 4 },
        }}
      >
        <Stack spacing={2.5}>
          {ABOUT_PARAGRAPH_KEYS.map((paragraphKey) => (
            <Typography
              key={paragraphKey}
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.9 }}
            >
              {t(paragraphKey)}
            </Typography>
          ))}

          <List
            sx={{
              listStyleType: 'disc',
              pl: { xs: 3, md: 4 },
              py: 0,
              '& .MuiListItem-root': {
                display: 'list-item',
                py: 0.75,
                px: 0,
              },
            }}
          >
            {ABOUT_OBJECTIVE_KEYS.map((objectiveKey) => (
              <ListItem key={objectiveKey} disablePadding>
                <ListItemText
                  primary={t(objectiveKey)}
                  slotProps={{
                    primary: {
                      variant: 'body1',
                      color: 'text.secondary',
                      sx: { lineHeight: 1.9 },
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>
    </Container>
  );
};
