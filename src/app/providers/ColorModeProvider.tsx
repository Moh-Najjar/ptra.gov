import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  applyColorMode,
  COLOR_MODE_STORAGE_KEY,
  DEFAULT_COLOR_MODE,
  getStoredColorMode,
  type ColorMode,
} from '../../constants/colorMode';

interface ColorModeContextValue {
  mode: ColorMode;
  isDarkMode: boolean;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

interface ColorModeProviderProps {
  children: ReactNode;
}

const persistColorMode = (nextMode: ColorMode): ColorMode => {
  localStorage.setItem(COLOR_MODE_STORAGE_KEY, nextMode);
  return applyColorMode(nextMode);
};

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [mode, setMode] = useState<ColorMode>(() => {
    const storedMode = getStoredColorMode();
    return applyColorMode(storedMode);
  });

  const setColorMode = useCallback((nextMode: ColorMode) => {
    setMode(persistColorMode(nextMode));
  }, []);

  const toggleColorMode = useCallback(() => {
    setMode((currentMode) => {
      const nextMode: ColorMode = currentMode === 'light' ? 'dark' : 'light';
      return persistColorMode(nextMode);
    });
  }, []);

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      isDarkMode: mode === 'dark',
      setColorMode,
      toggleColorMode,
    }),
    [mode, setColorMode, toggleColorMode],
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

export const useColorModeContext = (): ColorModeContextValue => {
  const context = useContext(ColorModeContext);
  if (context === null) {
    throw new Error('useColorModeContext must be used within ColorModeProvider');
  }
  return context;
};

export { DEFAULT_COLOR_MODE };
