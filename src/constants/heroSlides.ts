import { heroSlideBackgrounds } from '../assets/images';

export interface HeroSlideItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  background: string;
}

export const HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 'slide-1',
    titleKey: 'hero.slides.slide1.title',
    descriptionKey: 'hero.slides.slide1.description',
    background: heroSlideBackgrounds.slide1,
  },
  {
    id: 'slide-2',
    titleKey: 'hero.slides.slide2.title',
    descriptionKey: 'hero.slides.slide2.description',
    background: heroSlideBackgrounds.slide2,
  },
  {
    id: 'slide-3',
    titleKey: 'hero.slides.slide3.title',
    descriptionKey: 'hero.slides.slide3.description',
    background: heroSlideBackgrounds.slide3,
  },
  {
    id: 'slide-4',
    titleKey: 'hero.slides.slide4.title',
    descriptionKey: 'hero.slides.slide4.description',
    background: heroSlideBackgrounds.slide4,
  },
];

export const HERO_CAROUSEL_RESPONSIVE = {
  all: {
    breakpoint: { max: 4000, min: 0 },
    items: 1,
  },
} as const;
