import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
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
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSurveyStatistics } from '../../hooks/queries/surveyAdmin';
import type { SurveyQuestionStat, SurveyStatistics } from '../../types/surveyAdmin';

interface SurveyStatisticsChartsProps {
  formId: number;
}

const RATING_COLORS = ['#C0392B', '#E67E22', '#F1C40F', '#3498DB', '#1B75BC'] as const;

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
  isRtl: boolean,
  textColor: string,
  axisColor: string,
  primaryColor: string,
): EChartsOption => {
  const labels = questions.map((question) => truncateLabel(question.label, 42));
  const scores = questions.map((question) => question.averageScore);

  return {
    title: {
      text: title,
      left: isRtl ? 'right' : 'left',
      textStyle: {
        color: textColor,
        fontSize: 14,
        fontWeight: 700,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) {
          return '';
        }

        const firstItem = params[0] as { name?: string; value?: number; dataIndex?: number };
        const question = questions[firstItem.dataIndex ?? 0];
        const score =
          typeof firstItem.value === 'number' ? firstItem.value.toFixed(2) : String(firstItem.value);

        return [`${question?.label ?? firstItem.name ?? ''}`, `${averageLabel}: ${score}`].join(
          '<br/>',
        );
      },
    },
    grid: {
      left: 16,
      right: 24,
      top: 48,
      bottom: 24,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 5,
      inverse: isRtl,
      axisLabel: { color: axisColor },
      splitLine: { lineStyle: { color: alpha(axisColor, 0.15) } },
    },
    yAxis: {
      type: 'category',
      data: labels,
      inverse: true,
      axisLabel: {
        color: axisColor,
        width: 180,
        overflow: 'truncate',
      },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: scores,
        barMaxWidth: 28,
        itemStyle: {
          color: primaryColor,
          borderRadius: 4,
        },
        label: {
          show: true,
          position: isRtl ? 'left' : 'right',
          color: textColor,
          formatter: '{c}',
        },
      },
    ],
  };
};

const buildDistributionOption = (
  questions: SurveyQuestionStat[],
  title: string,
  countLabel: string,
  isRtl: boolean,
  textColor: string,
  axisColor: string,
): EChartsOption => {
  const labels = questions.map((question) => truncateLabel(question.label, 42));
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

    return {
      name: ratingValue,
      type: 'bar' as const,
      stack: 'ratings',
      barMaxWidth: 28,
      emphasis: { focus: 'series' as const },
      itemStyle: {
        color: RATING_COLORS[ratingIndex % RATING_COLORS.length],
      },
      data,
    };
  });

  return {
    title: {
      text: title,
      left: isRtl ? 'right' : 'left',
      textStyle: {
        color: textColor,
        fontSize: 14,
        fontWeight: 700,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) {
          return '';
        }

        const firstItem = params[0] as { dataIndex?: number };
        const question = questions[firstItem.dataIndex ?? 0];
        const lines = [question?.label ?? ''];

        for (const param of params) {
          const item = param as { marker?: string; seriesName?: string; value?: number };
          lines.push(
            `${item.marker ?? ''}${item.seriesName ?? ''}: ${item.value ?? 0} ${countLabel}`,
          );
        }

        return lines.join('<br/>');
      },
    },
    legend: {
      type: 'scroll',
      top: 28,
      left: isRtl ? 'right' : 'left',
      textStyle: { color: textColor },
    },
    grid: {
      left: 16,
      right: 24,
      top: 72,
      bottom: 24,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      inverse: isRtl,
      axisLabel: { color: axisColor },
      splitLine: { lineStyle: { color: alpha(axisColor, 0.15) } },
    },
    yAxis: {
      type: 'category',
      data: labels,
      inverse: true,
      axisLabel: {
        color: axisColor,
        width: 180,
        overflow: 'truncate',
      },
      axisTick: { show: false },
    },
    series,
  };
};

interface StatSummaryCardProps {
  label: string;
  value: string;
}

const StatSummaryCard = ({ label, value }: StatSummaryCardProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      height: '100%',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: (theme) =>
        alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.04),
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
      {value}
    </Typography>
  </Paper>
);

const formatNumber = (value: number, language: string): string =>
  new Intl.NumberFormat(language === 'ar' ? 'ar-JO' : 'en-US').format(value);

const formatScore = (value: number, language: string): string =>
  new Intl.NumberFormat(language === 'ar' ? 'ar-JO' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const getChartHeight = (data: SurveyStatistics): number =>
  Math.max(320, data.questions.length * 56 + 120);

export const SurveyStatisticsCharts = ({ formId }: SurveyStatisticsChartsProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { data, isLoading, isError } = useSurveyStatistics(formId);

  const textColor = theme.palette.text.primary;
  const axisColor = theme.palette.text.secondary;
  const primaryColor = theme.palette.primary.main;

  const averageOption = useMemo(() => {
    if (!data || data.questions.length === 0) {
      return null;
    }

    return buildAverageScoreOption(
      data.questions,
      t('pages.surveys.statistics.averageByQuestion'),
      t('pages.surveys.statistics.averageScore'),
      isRtl,
      textColor,
      axisColor,
      primaryColor,
    );
  }, [axisColor, data, isRtl, primaryColor, t, textColor]);

  const distributionOption = useMemo(() => {
    if (!data || data.questions.length === 0) {
      return null;
    }

    return buildDistributionOption(
      data.questions,
      t('pages.surveys.statistics.ratingDistribution'),
      t('pages.surveys.statistics.count'),
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
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
        <AssessmentOutlinedIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t('pages.surveys.statistics.title')}
        </Typography>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatSummaryCard
            label={t('pages.surveys.statistics.totalSubmissions')}
            value={formatNumber(data.totalSubmissions, i18n.language)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatSummaryCard
            label={t('pages.surveys.statistics.overallAverage')}
            value={formatScore(data.overallAverageScore, i18n.language)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatSummaryCard
            label={t('pages.surveys.statistics.questionsCount')}
            value={formatNumber(data.questions.length, i18n.language)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {averageOption && (
              <ReactECharts
                option={averageOption}
                style={{ height: getChartHeight(data), width: '100%' }}
                opts={{ renderer: 'canvas' }}
                notMerge
              />
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {distributionOption && (
              <ReactECharts
                option={distributionOption}
                style={{ height: getChartHeight(data), width: '100%' }}
                opts={{ renderer: 'canvas' }}
                notMerge
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
