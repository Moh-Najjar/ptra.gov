import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SURVEY_EXCLUDED_ROUTES,
  SURVEY_MIN_PAGE_VIEWS,
  SURVEY_MIN_TIME_MS,
} from '../constants/survey';
import {
  getSessionPageViews,
  getSessionStartedAt,
  incrementSessionPageViews,
  isSurveyDismissed,
  isSurveySubmitted,
  markPromptShownThisSession,
  wasPromptShownThisSession,
} from '../utils/surveyStorage';

const isExcludedRoute = (pathname: string): boolean =>
  SURVEY_EXCLUDED_ROUTES.some((route) => pathname.startsWith(route));

export const useSurveyEligibility = (): boolean => {
  const { pathname } = useLocation();
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    if (isExcludedRoute(pathname)) {
      setIsEligible(false);
      return;
    }

    if (isSurveySubmitted() || isSurveyDismissed() || wasPromptShownThisSession()) {
      setIsEligible(false);
      return;
    }

    incrementSessionPageViews();
    getSessionStartedAt();
  }, [pathname]);

  useEffect(() => {
    if (isExcludedRoute(pathname)) {
      setIsEligible(false);
      return;
    }

    if (isSurveySubmitted() || isSurveyDismissed() || wasPromptShownThisSession()) {
      setIsEligible(false);
      return;
    }

    const checkEligibility = (): void => {
      const pageViews = getSessionPageViews();
      const sessionStartedAt = getSessionStartedAt();
      const timeOnSite = Date.now() - sessionStartedAt;
      const meetsEngagementRules =
        pageViews >= SURVEY_MIN_PAGE_VIEWS && timeOnSite >= SURVEY_MIN_TIME_MS;

      setIsEligible(meetsEngagementRules);
    };

    checkEligibility();
    const intervalId = window.setInterval(checkEligibility, 5_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [pathname]);

  return isEligible;
};

export const useMarkSurveyPromptShown = (): (() => void) =>
  useCallback(() => {
    markPromptShownThisSession();
  }, []);
