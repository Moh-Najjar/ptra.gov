import { HERO_CAROUSEL_RESPONSIVE, HERO_SLIDES } from '../../constants/heroSlides';
import type { HeroSlideItem } from '../../constants/heroSlides';
import { Box, Container, Typography } from '@mui/material';
import { Carousel } from '../../lib/reactMultiCarousel';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import 'react-multi-carousel/lib/styles.css';

interface HeroSlideProps {
  slide: HeroSlideItem;
}

const HeroDecorations = () => (
  <>
    <Box
      sx={{
        position: 'absolute',
        insetInlineStart: { xs: '-10%', md: '5%' },
        top: '50%',
        transform: 'translateY(-50%)',
        width: { xs: 200, md: 320 },
        height: { xs: 200, md: 320 },
        borderRadius: '50%',
        border: '2px dashed rgba(255,255,255,0.3)',
        opacity: 0.6,
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '20%',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
        },
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        insetInlineEnd: { xs: '-5%', md: '10%' },
        top: '50%',
        transform: 'translateY(-50%)',
        width: { xs: 180, md: 280 },
        height: { xs: 220, md: 340 },
        opacity: 0.5,
        pointerEvents: 'none',
        background:
          'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 2px, transparent 2px)',
        backgroundSize: '20px 20px',
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
      }}
    />
  </>
);

const HeroSlide = ({ slide }: HeroSlideProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: 'relative',
        background: slide.background,
        overflow: 'hidden',
        minHeight: { xs: 320, md: 480 },
        backgroundSize: 'cover',
      }}
    >
      <HeroDecorations />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          minHeight: { xs: 320, md: 480 },
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'start',
          // Keep text above the carousel dots.
          pb: { xs: 7, md: 9 },
          pt: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: 640, width: '100%', textAlign: 'start' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: '#FFFFFF',
              fontWeight: 700,
              mb: 2,
            }}
          >
            {t(slide.titleKey)}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.8,
            }}
          >
            {t(slide.descriptionKey)}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

interface HeroDotProps {
  active?: boolean;
  onClick?: () => void;
  index?: number;
}

const HeroDot = ({ active = false, onClick, index = 0 }: HeroDotProps) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    aria-label={`hero slide ${index + 1}`}
    aria-current={active ? 'true' : undefined}
    sx={{
      width: active ? 28 : 10,
      height: 10,
      minWidth: 10,
      borderRadius: 999,
      border: '2px solid',
      borderColor: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)',
      p: 0,
      mx: 0.75,
      cursor: 'pointer',
      bgcolor: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.22)',
      boxShadow: active
        ? '0 0 0 3px rgba(255, 255, 255, 0.18), 0 2px 8px rgba(0, 0, 0, 0.15)'
        : 'none',
      transition:
        'width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease',
      '&:hover': {
        bgcolor: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.38)',
        borderColor: '#FFFFFF',
        transform: 'translateY(-1px)',
      },
      '&:focus-visible': {
        outline: '2px solid #FFFFFF',
        outlineOffset: 3,
      },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    }}
  />
);

export const HeroSection = () => {
  const { direction } = useLanguage();

  return (
    <Box
      sx={{
        position: 'relative',
        '& .react-multi-carousel-list': {
          overflow: 'hidden',
        },
        '& .react-multi-carousel-item': {
          textAlign: 'start',
        },
        '& .react-multi-carousel-dot-list': {
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.25,
          m: 0,
          p: 0,
          listStyle: 'none',
          zIndex: 2,
          width: 'auto',
        },
        '& .react-multi-carousel-dot-list li': {
          display: 'flex',
        },
      }}
    >
      <Carousel
        responsive={HERO_CAROUSEL_RESPONSIVE}
        infinite
        autoPlay
        autoPlaySpeed={5000}
        showDots
        arrows={false}
        rtl={direction === 'rtl'}
        renderDotsOutside={false}
        customDot={<HeroDot />}
        key={direction}
      >
        {HERO_SLIDES.map((slide) => (
          <HeroSlide key={slide.id} slide={slide} />
        ))}
      </Carousel>
    </Box>
  );
};
