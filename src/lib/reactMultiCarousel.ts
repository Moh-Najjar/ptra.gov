import type { CarouselProps } from 'react-multi-carousel';
import type { ComponentType } from 'react';
import RawCarouselModule from 'react-multi-carousel';

interface NestedCarouselModule {
  default: ComponentType<CarouselProps>;
}

const resolveCarouselComponent = (): ComponentType<CarouselProps> => {
  if (typeof RawCarouselModule === 'function') {
    return RawCarouselModule;
  }

  const firstLevel = (RawCarouselModule as NestedCarouselModule).default;
  if (typeof firstLevel === 'function') {
    return firstLevel;
  }

  throw new Error('Unable to resolve react-multi-carousel Carousel component.');
};

export const Carousel = resolveCarouselComponent();
