import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  applyFontSizeLevel,
  DEFAULT_FONT_SIZE_LEVEL,
  FONT_SIZE_STORAGE_KEY,
  getStoredFontSizeLevel,
  MAX_FONT_SIZE_LEVEL,
  MIN_FONT_SIZE_LEVEL,
} from '../../constants/fontSize';

interface FontSizeContextValue {
  level: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

interface FontSizeProviderProps {
  children: ReactNode;
}

const persistFontSizeLevel = (nextLevel: number): number => {
  const clampedLevel = applyFontSizeLevel(nextLevel);
  localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(clampedLevel));
  return clampedLevel;
};

export const FontSizeProvider = ({ children }: FontSizeProviderProps) => {
  const [level, setLevel] = useState<number>(() => getStoredFontSizeLevel());

  const increaseFontSize = useCallback(() => {
    setLevel((currentLevel) => persistFontSizeLevel(currentLevel + 1));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setLevel((currentLevel) => persistFontSizeLevel(currentLevel - 1));
  }, []);

  const value = useMemo<FontSizeContextValue>(
    () => ({
      level,
      increaseFontSize,
      decreaseFontSize,
      canIncrease: level < MAX_FONT_SIZE_LEVEL,
      canDecrease: level > MIN_FONT_SIZE_LEVEL,
    }),
    [level, increaseFontSize, decreaseFontSize],
  );

  return <FontSizeContext.Provider value={value}>{children}</FontSizeContext.Provider>;
};

export const useFontSizeContext = (): FontSizeContextValue => {
  const context = useContext(FontSizeContext);
  if (context === null) {
    throw new Error('useFontSizeContext must be used within FontSizeProvider');
  }
  return context;
};

export { DEFAULT_FONT_SIZE_LEVEL };
