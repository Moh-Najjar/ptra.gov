import { useCallback, useEffect, useState } from 'react';
import { useSurveyEligibility, useMarkSurveyPromptShown } from '../../hooks/useSurveyEligibility';
import { isSurveySubmitted } from '../../utils/surveyStorage';
import { SurveyDialog } from './SurveyDialog';
import { SurveyPrompt } from './SurveyPrompt';

export const SurveyManager = () => {
  const isEligible = useSurveyEligibility();
  const markPromptShown = useMarkSurveyPromptShown();
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    if (isEligible && !isSurveySubmitted()) {
      setIsPromptOpen(true);
      markPromptShown();
    }
  }, [isEligible, markPromptShown]);

  const handlePromptClose = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  const handlePromptDismiss = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  const handleSurveySubmitted = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  return (
    <>
      <SurveyPrompt
        open={isPromptOpen}
        onClose={handlePromptClose}
        onDismiss={handlePromptDismiss}
      />
      <SurveyDialog onSubmitted={handleSurveySubmitted} />
    </>
  );
};
