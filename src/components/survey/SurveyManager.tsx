import { useCallback, useEffect, useState } from 'react';
import { useSurvey } from '../../contexts/SurveyContext';
import {
  clearSurveySoftCloseOnShow,
  useSurveyEligibility,
} from '../../hooks/useSurveyEligibility';
import { isSurveySubmitted, markSurveySoftClosed } from '../../utils/surveyStorage';
import { SurveyDialog } from './SurveyDialog';
import { SurveyPrompt } from './SurveyPrompt';

export const SurveyManager = () => {
  const isEligible = useSurveyEligibility();
  const { isDialogOpen } = useSurvey();
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    if (isEligible && !isSurveySubmitted() && !isDialogOpen) {
      clearSurveySoftCloseOnShow();
      setIsPromptOpen(true);
    }
  }, [isDialogOpen, isEligible]);

  const handleDismiss = useCallback(() => {
    markSurveySoftClosed();
    setIsPromptOpen(false);
  }, []);

  const handleHidePrompt = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  const handleDialogClosedWithoutSubmit = useCallback(() => {
    markSurveySoftClosed();
    setIsPromptOpen(false);
  }, []);

  const handleSurveySubmitted = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  return (
    <>
      <SurveyPrompt
        open={isPromptOpen}
        onDismiss={handleDismiss}
        onHide={handleHidePrompt}
      />
      <SurveyDialog
        onSubmitted={handleSurveySubmitted}
        onClosedWithoutSubmit={handleDialogClosedWithoutSubmit}
      />
    </>
  );
};
