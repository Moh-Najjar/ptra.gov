import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useMemo, type ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { useSurveyStatistics } from '../../hooks/queries/surveyAdmin';
import type { SurveyQuestionStat, SurveyStatistics } from '../../types/surveyAdmin';
import { formatSystemNumber } from '../../utils/formatNumber';

interface SurveyStatisticsChartsProps {
  formId: number;
}

/** Soft brand-aligned palette from dissatisfied → very satisfied. */
const RATING_COLORS = ['#E74C3C', '#F39C12', '#F1C40F', '#5DADE2', '#1B75BC'] as const;

/** Always Western digits (1, 2, 3) regardless of UI language. */
const formatInteger = (value: number): string => formatSystemNumber(value);

const formatScore = (value: number): string =>
  formatSystemNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatPercent = (value: number): string =>
  formatSystemNumber(value, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const truncateLabel = (label: string, maxLength: number): string => {
  if (label.length <= maxLength) {
    return label;
  }

  return `${label.slice(0, maxLength).trim()}…`;
};

const buildAverageScoreOption = (
  questions: SurveyQuestionStat[],
  title: string,
  averageLabel: string,
  answersLabel: string,
  isRtl: boolean,
  textColor: string,
  axisColor: string,
  primaryColor: string,
  primaryLight: string,
): EChartsOption => {
  const labels = questions.map((question, index) => {
    const shortLabel = truncateLabel(question.label, 36);
    return `Q${index + 1}. ${shortLabel}`;
  });
  const scores = questions.map((question) => Number(question.averageScore.toFixed(2)));

  return {
    animationDuration: 700,
    textStyle: {
      fontFamily: 'Cairo, sans-serif',
    },
    title: {
      text: title,
      left: isRtl ? 'right' : 'left',
      textStyle: {
        color: textColor,
        fontSize: 15,
        fontWeight: 700,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: alpha('#0F1923', 0.92),
      borderWidth: 0,
      padding: [10, 14],
      textStyle: { color: '#FFFFFF', fontSize: 12 },
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) {
          return '';
        }

        const firstItem = params[0] as { value?: number; dataIndex?: number };
        const question = questions[firstItem.dataIndex ?? 0];
        if (!question) {
          return '';
        }

        const score =
          typeof firstItem.value === 'number' ? formatScore(firstItem.value) : formatScore(0);

        return [
          `<div style="font-weight:700;margin-bottom:6px;max-width:280px;white-space:normal">${question.label}</div>`,
          `${averageLabel}: <b>${score}</b> / 5`,
          `${answersLabel}: <b>${formatInteger(question.totalAnswers)}</b>`,
        ].join('<br/>');
      },
    },
    grid: {
      left: 12,
      right: 36,
      top: 52,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 5,
      interval: 1,
      inverse: isRtl,
      axisLabel: {
        color: axisColor,
        formatter: (value: number) => formatInteger(value),
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: alpha(axisColor, 0.12),
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: labels,
      inverse: true,
      axisLabel: {
        color: axisColor,
        width: 200,
        overflow: 'truncate',
        lineHeight: 16,
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: scores,
        barMaxWidth: 22,
        showBackground: true,
        backgroundStyle: {
          color: alpha(primaryColor, 0.08),
          borderRadius: 8,
        },
        itemStyle: {
          borderRadius: 8,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: primaryColor },
              { offset: 1, color: primaryLight },
            ],
          },
          shadowColor: alpha(primaryColor, 0.28),
          shadowBlur: 8,
          shadowOffsetY: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 14,
            shadowColor: alpha(primaryColor, 0.4),
          },
        },
        label: {
          show: true,
          position: isRtl ? 'left' : 'right',
          color: textColor,
          fontWeight: 700,
          formatter: (params: { value?: unknown }) => {
            if (typeof params.value === 'number') {
              return formatScore(params.value);
            }

            return '';
          },
        },
      },
    ],
  };
};

const buildDistributionOption = (
  questions: SurveyQuestionStat[],
  title: string,
  countLabel: string,
  percentLabel: string,
  isRtl: boolean,
  textColor: string,
  axisColor: string,
): EChartsOption => {
  const labels = questions.map((question, index) => {
    const shortLabel = truncateLabel(question.label, 36);
    return `Q${index + 1}. ${shortLabel}`;
  });

  const ratingValues =
    questions[0]?.ratings
      .slice()
      .sort((first, second) => first.score - second.score)
      .map((rating) => rating.value) ?? [];

  const series = ratingValues.map((ratingValue, ratingIndex) => {
    const data = questions.map((question) => {
      const rating = question.ratings.find((item) => item.value === ratingValue);
      return rating?.count ?? 0;
    });

    const isFirst = ratingIndex === 0;
    const isLast = ratingIndex === ratingValues.length - 1;

    return {
      name: ratingValue,
      type: 'bar' as const,
      stack: 'ratings',
      barMaxWidth: 22,
      emphasis: { focus: 'series' as const },
      itemStyle: {
        color: RATING_COLORS[ratingIndex % RATING_COLORS.length],
        borderRadius:
          isFirst && isLast
            ? 8
            : isFirst
              ? isRtl
                ? [0, 8, 8, 0]
                : [8, 0, 0, 8]
              : isLast
                ? isRtl
                  ? [8, 0, 0, 8]
                  : [0, 8, 8, 0]
                : 0,
      },
      data,
    };
  });

  return {
    animationDuration: 700,
    textStyle: {
      fontFamily: 'Cairo, sans-serif',
    },
    title: {
      text: title,
      left: isRtl ? 'right' : 'left',
      textStyle: {
        color: textColor,
        fontSize: 15,
        fontWeight: 700,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: alpha('#0F1923', 0.92),
      borderWidth: 0,
      padding: [10, 14],
      textStyle: { color: '#FFFFFF', fontSize: 12 },
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) {
          return '';
        }

        const firstItem = params[0] as { dataIndex?: number };
        const question = questions[firstItem.dataIndex ?? 0];
        if (!question) {
          return '';
        }

        const lines = [
          `<div style="font-weight:700;margin-bottom:8px;max-width:300px;white-space:normal">${question.label}</div>`,
        ];

        for (const param of params) {
          const item = param as { marker?: string; seriesName?: string; value?: number };
          const rating = question.ratings.find((entry) => entry.value === item.seriesName);
          const count = item.value ?? 0;
          const percentage = rating?.percentage ?? 0;

          lines.push(
            `${item.marker ?? ''}${item.seriesName ?? ''}: <b>${formatInteger(count)}</b> ${countLabel} (${formatPercent(percentage)}% ${percentLabel})`,
          );
        }

        return lines.join('<br/>');
      },
    },
    legend: {
      type: 'scroll',
      top: 34,
      left: isRtl ? 'right' : 'left',
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: textColor, fontSize: 12 },
    },
    grid: {
      left: 12,
      right: 24,
      top: 78,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      inverse: isRtl,
      axisLabel: {
        color: axisColor,
        formatter: (value: number) => formatInteger(value),
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: alpha(axisColor, 0.12),
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: labels,
      inverse: true,
      axisLabel: {
        color: axisColor,
        width: 200,
        overflow: 'truncate',
        lineHeight: 16,
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series,
  };
};

interface StatSummaryCardProps {
  label: string;
  value: string;
  icon: ElementType;
}

const StatSummaryCard = ({ label, value, icon: Icon }: StatSummaryCardProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      height: '100%',
      borderRadius: 2.5,
      border: '1px solid',
      borderColor: 'divider',
      background: (theme) =>
        `linear-gradient(145deg, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.06)} 0%, ${theme.palette.background.paper} 55%)`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: (theme) => `0 10px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
      },
    }}
  >
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
          color: 'primary.main',
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75, fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            letterSpacing: 0.3,
            fontVariantNumeric: 'lining-nums',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const getChartHeight = (data: SurveyStatistics): number =>
  Math.max(340, data.questions.length * 58 + 130);

export const SurveyStatisticsCharts = ({ formId }: SurveyStatisticsChartsProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { data, isLoading, isError } = useSurveyStatistics(formId);

  const textColor = theme.palette.text.primary;
  const axisColor = theme.palette.text.secondary;
  const primaryColor = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;

  const averageOption = useMemo(() => {
    if (!data || data.questions.length === 0) {
      return null;
    }

    return buildAverageScoreOption(
      data.questions,
      t('pages.surveys.statistics.averageByQuestion'),
      t('pages.surveys.statistics.averageScore'),
      t('pages.surveys.statistics.answers'),
      isRtl,
      textColor,
      axisColor,
      primaryColor,
      primaryLight,
    );
  }, [axisColor, data, isRtl, primaryColor, primaryLight, t, textColor]);

  const distributionOption = useMemo(() => {
    if (!data || data.questions.length === 0) {
      return null;
    }

    return buildDistributionOption(
      data.questions,
      t('pages.surveys.statistics.ratingDistribution'),
      t('pages.surveys.statistics.count'),
      t('pages.surveys.statistics.percent'),
      isRtl,
      textColor,
      axisColor,
    );
  }, [axisColor, data, isRtl, t, textColor]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress aria-label={t('pages.surveys.statistics.loading')} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {t('pages.surveys.statistics.loadError')}
      </Alert>
    );
  }

  if (!data || data.questions.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        {t('pages.surveys.statistics.noData')}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2.5 }}>
        <AssessmentOutlinedIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t('pages.surveys.statistics.title')}
        </Typography>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatSummaryCard
            label={t('pages.surveys.statistics.totalSubmissions')}
            value={formatInteger(data.totalSubmissions)}
            icon={SummarizeOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatSummaryCard
            label={t('pages.surveys.statistics.overallAverage')}
            value={formatScore(data.overallAverageScore)}
            icon={InsightsOutlinedIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatSummaryCard
            label={t('pages.surveys.statistics.questionsCount')}
            value={formatInteger(data.questions.length)}
            icon={QuizOutlinedIcon}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, md: 2 },
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            {averageOption && (
              <ReactECharts
                option={averageOption}
                style={{ height: getChartHeight(data), width: '100%' }}
                opts={{ renderer: 'canvas', locale: 'EN' }}
                notMerge
              />
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, md: 2 },
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            {distributionOption && (
              <ReactECharts
                option={distributionOption}
                style={{ height: getChartHeight(data), width: '100%' }}
                opts={{ renderer: 'canvas', locale: 'EN' }}
                notMerge
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
