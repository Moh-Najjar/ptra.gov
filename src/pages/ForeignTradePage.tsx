import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../app/routes/paths';
import heroSlide11 from '../assets/images/hero/slide-11.png';
import heroSlide12 from '../assets/images/hero/slide-12.jpg';
import heroSlide13 from '../assets/images/hero/slide-13.png';
import foreignTradeCardImage from '../assets/images/cards/foreignTrade.png';

interface ForeignTradeNavItem {
  id: string;
  labelKey: string;
  path: string;
  backgroundImage: string;
}

const FOREIGN_TRADE_NAV_ITEMS: ForeignTradeNavItem[] = [
  {
    id: 'exports',
    labelKey: 'nav.exports',
    path: ROUTES.FOREIGN_TRADE_EXPORTS,
    backgroundImage: heroSlide11,
  },
  {
    id: 'imports',
    labelKey: 'nav.imports',
    path: ROUTES.FOREIGN_TRADE_IMPORTS,
    backgroundImage: heroSlide12,
  },
  {
    id: 'transit',
    labelKey: 'nav.transit',
    path: ROUTES.FOREIGN_TRADE_TRANSIT,
    backgroundImage: heroSlide13,
  },
  {
    id: 'trade-balance',
    labelKey: 'nav.tradeBalance',
    path: ROUTES.FOREIGN_TRADE_BALANCE,
    backgroundImage: foreignTradeCardImage,
  },
];

export const ForeignTradePage = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const handleCardClick = (path: string): void => {
    navigate(path);
  };

  return (
    <Box
      className="no-print"
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        minHeight: '60vh',
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
            {t('common.home')}
          </Link>
          <Typography color="text.primary">{t('dashboardCards.foreignTrade')}</Typography>
        </Breadcrumbs>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 3,
              color: 'text.primary',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
          >
            {t('dashboardCards.foreignTrade')}
          </Typography>
        </motion.div>

        {/* Page Description */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'text.secondary',
              maxWidth: '900px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            {t('dashboardCards.foreignTradeDescription')}
          </Typography>
        </motion.div>

        {/* Areas Introduction */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'text.primary',
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.15rem' },
            }}
          >
            {t('dashboardCards.foreignTradeAreasIntro')}
          </Typography>
        </motion.div>

        {/* Navigation Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mt: 4,
          }}
        >
          {FOREIGN_TRADE_NAV_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Box
                onClick={() => {
                  handleCardClick(item.path);
                }}
                sx={{
                  position: 'relative',
                  height: { xs: '180px', sm: '220px', md: '280px' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  },
                  // Background image
                  backgroundImage: `url(${item.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Label overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      textAlign: 'center',
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)',
                      writingMode: isRtl ? 'horizontal-tb' : 'horizontal-tb',
                      transform: isRtl ? 'rotate(0deg)' : 'rotate(0deg)',
                    }}
                  >
                    {t(item.labelKey)}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Areas Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              mt: 5,
              color: 'text.secondary',
              maxWidth: '900px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            {t('dashboardCards.foreignTradeAreasConclusion')}
          </Typography>
        </motion.div>
      </Container>

      {/* Print View */}
      <Box
        sx={{
          display: 'none',
          '@media print': {
            display: 'block',
            p: 4,
          },
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {t('dashboardCards.foreignTrade')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('dashboardCards.foreignTradeDescription')}
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          {FOREIGN_TRADE_NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <Typography variant="body1">
                {t(item.labelKey)}: {window.location.origin}
                {item.path}
              </Typography>
            </li>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
