import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface SurveyContextValue {
  isDialogOpen: boolean;
  openSurvey: () => void;
  closeSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextValue | null>(null);

interface SurveyProviderProps {
  children: ReactNode;
}

export const SurveyProvider = ({ children }: SurveyProviderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openSurvey = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const closeSurvey = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isDialogOpen,
      openSurvey,
      closeSurvey,
    }),
    [closeSurvey, isDialogOpen, openSurvey],
  );

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
};

export const useSurvey = (): SurveyContextValue => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
