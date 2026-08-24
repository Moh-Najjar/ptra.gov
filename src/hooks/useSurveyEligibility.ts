import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SURVEY_EXCLUDED_ROUTES,
  SURVEY_MIN_PAGE_VIEWS,
  SURVEY_MIN_TIME_MS,
  SURVEY_RESHOW_AFTER_CLOSE_MS,
  SURVEY_RESHOW_PAGE_VIEWS,
} from '../constants/survey';
import {
  clearSoftCloseState,
  getPagesSinceClose,
  getSessionPageViews,
  getSessionStartedAt,
  getSoftClosedAt,
  hasSoftClosePending,
  isSurveySubmitted,
  trackSurveyPageView,
} from '../utils/surveyStorage';

const isExcludedRoute = (pathname: string): boolean =>
  SURVEY_EXCLUDED_ROUTES.some((route) => pathname.startsWith(route));

const meetsFirstShowRules = (): boolean => {
  const pageViews = getSessionPageViews();
  const sessionStartedAt = getSessionStartedAt();
  const timeOnSite = Date.now() - sessionStartedAt;

  return pageViews >= SURVEY_MIN_PAGE_VIEWS && timeOnSite >= SURVEY_MIN_TIME_MS;
};

const meetsReshowAfterCloseRules = (): boolean => {
  const softClosedAt = getSoftClosedAt();
  if (softClosedAt === null) {
    return false;
  }

  const timeSinceClose = Date.now() - softClosedAt;
  const pagesSinceClose = getPagesSinceClose();

  return (
    timeSinceClose >= SURVEY_RESHOW_AFTER_CLOSE_MS || pagesSinceClose >= SURVEY_RESHOW_PAGE_VIEWS
  );
};

export const useSurveyEligibility = (): boolean => {
  const { pathname } = useLocation();
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    if (isExcludedRoute(pathname) || isSurveySubmitted()) {
      setIsEligible(false);
      return;
    }

    trackSurveyPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    if (isExcludedRoute(pathname) || isSurveySubmitted()) {
      setIsEligible(false);
      return;
    }

    const checkEligibility = (): void => {
      if (isSurveySubmitted()) {
        setIsEligible(false);
        return;
      }

      if (hasSoftClosePending()) {
        setIsEligible(meetsReshowAfterCloseRules());
        return;
      }

      setIsEligible(meetsFirstShowRules());
    };

    checkEligibility();
    const intervalId = window.setInterval(checkEligibility, 5_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [pathname]);

  return isEligible;
};

/** Clears soft-close state when the prompt is shown again. */
export const clearSurveySoftCloseOnShow = (): void => {
  clearSoftCloseState();
};
