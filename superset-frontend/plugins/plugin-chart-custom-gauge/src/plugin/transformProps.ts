/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  QueryFormMetric,
  CategoricalColorNamespace,
  CategoricalColorScale,
  DataRecord,
  getMetricLabel,
  getColumnLabel,
  getValueFormatter,
  tooltipHtml,
} from '@superset-ui/core';
import type { EChartsCoreOption } from 'echarts/core';
import type { GaugeSeriesOption } from 'echarts/charts';
import type { GaugeDataItemOption } from 'echarts/types/src/chart/gauge/GaugeSeries';
import type { CallbackDataParams } from 'echarts/types/src/util/types';
import { range } from 'lodash';
import { parseNumbersList } from '../utils/controls';
import {
  DEFAULT_FORM_DATA as DEFAULT_GAUGE_FORM_DATA,
  EchartsGaugeFormData,
  AxisTickLineStyle,
  GaugeChartTransformedProps,
  EchartsGaugeChartProps,
} from './types';
import {
  defaultGaugeSeriesOption,
  INTERVAL_GAUGE_SERIES_OPTION,
  OFFSETS,
  FONT_SIZE_MULTIPLIERS,
} from './constants';
import { OpacityEnum } from '../constants';
import { getDefaultTooltip } from '../utils/tooltip';
import { Refs } from '../types';
import { getColtypesMapping } from '../utils/series';

const getRgba = (
  c: { r: number; g: number; b: number; a: number } | string,
) => {
  if (typeof c === 'string') return c;
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
};

export const getIntervalBoundsAndColors = (
  intervals: string,
  intervalColorIndices: string,
  colorFn: CategoricalColorScale,
  min: number,
  max: number,
  colorMode: string,
  singleColor: string | { r: number; g: number; b: number; a: number },
  customIntervalColors?: string | string[],
): Array<[number, string]> => {
  if (colorMode === 'single') {
    return [[1, getRgba(singleColor)]];
  }

  if (colorMode === 'default' && !intervals) return [];

  let intervalBoundsNonNormalized: number[] = [];
  try {
    intervalBoundsNonNormalized = parseNumbersList(intervals, ',');
  } catch (error) {
    intervalBoundsNonNormalized = [];
  }

  const intervalBounds = intervalBoundsNonNormalized.map(
    bound => (bound - min) / (max - min),
  );

  if (customIntervalColors) {
    const rawList =
      typeof customIntervalColors === 'string'
        ? customIntervalColors.split(',').map(s => s.trim())
        : customIntervalColors;
    return intervalBounds.map((val, idx) => [
      val,
      rawList[idx] ||
        rawList[rawList.length - 1] ||
        colorFn.colors[idx % colorFn.colors.length],
    ]);
  }

  // Support both comma-separated color indices (1,2,3) AND hex color codes (#DC2626,#EAB308,#16A34A)
  const rawIntervalColors = intervalColorIndices
    ? intervalColorIndices.split(',').map(s => s.trim())
    : [];

  return intervalBounds.map((val, idx) => {
    const rawItem = rawIntervalColors[idx];
    if (rawItem && (rawItem.startsWith('#') || rawItem.startsWith('rgb') || rawItem.startsWith('hsl'))) {
      return [val, rawItem];
    }
    const ind = Number(rawItem);
    if (!Number.isNaN(ind) && ind > 0) {
      return [val, colorFn.colors[(ind - 1) % colorFn.colors.length]];
    }
    return [val, colorFn.colors[idx % colorFn.colors.length]];
  });
};

const calculateAxisLineWidth = (
  data: DataRecord[],
  fontSize: number,
  overlap: boolean,
  arcThickness: number,
): number => /*overlap ? fontSize : data.length * fontSize*/ arcThickness;

const calculateMin = (data: GaugeDataItemOption[]) =>
  2 * Math.min(...data.map(d => d.value as number).concat([0]));

const calculateMax = (data: GaugeDataItemOption[]) =>
  2 * Math.max(...data.map(d => d.value as number).concat([0]));

export default function transformProps(
  chartProps: EchartsGaugeChartProps,
): GaugeChartTransformedProps {
  const {
    width,
    height,
    formData,
    queriesData,
    hooks,
    filterState,
    theme,
    emitCrossFilters,
    datasource,
  } = chartProps;

  const gaugeSeriesOptions = defaultGaugeSeriesOption(theme);
  const {
    verboseMap = {},
    currencyFormats = {},
    columnFormats = {},
    currencyCodeColumn,
  } = datasource;
  const {
    groupby,
    metric,
    minVal,
    maxVal,
    colorScheme,
    fontSize,
    numberFormat,
    currencyFormat,
    animation,
    showProgress,
    overlap,
    roundCap,
    showAxisTick,
    showSplitLine,
    splitNumber,
    startAngle,
    endAngle,
    intervals,
    intervalColorIndices,
    valueFormatter,
    sliceId,
    // V1 Features (Superset converts snake_case control names to camelCase in formData)
    showPointer,
    colorMode,
    singleColor,
    innerRadius,
    arcThickness,
    segmentStyle,
    needleColor,
    needleWidth,
    needleLength,
    needleStyle,
    showCenterVal,
    centerValSize,
    centerValWeight,
    centerValColor,
    valPrefix,
    valSuffix,
    showTickLabels,
    tickDensity,
    animationDuration,
  }: EchartsGaugeFormData = { ...DEFAULT_GAUGE_FORM_DATA, ...formData } as any;
  const refs: Refs = {};
  const data = (queriesData[0]?.data || []) as DataRecord[];
  const detectedCurrency = queriesData[0]?.detected_currency;
  const coltypeMapping = getColtypesMapping(queriesData[0]);
  const numberFormatter = getValueFormatter(
    metric,
    currencyFormats,
    columnFormats,
    numberFormat,
    currencyFormat,
    undefined,
    data,
    currencyCodeColumn,
    detectedCurrency,
  );
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const axisLineWidth =
    Number(arcThickness) || calculateAxisLineWidth(data, fontSize, overlap, 30);
  const groupbyLabels = groupby.map(getColumnLabel);
  const effectiveValPrefix =
    (formData as any).val_prefix !== undefined
      ? (formData as any).val_prefix
      : valPrefix || '';
  const effectiveValSuffix =
    (formData as any).val_suffix !== undefined
      ? (formData as any).val_suffix
      : valSuffix || '';
  const formatValue = (value: number) =>
    effectiveValPrefix +
    valueFormatter.replace('{value}', numberFormatter(value)) +
    effectiveValSuffix;
  const axisTickLength = FONT_SIZE_MULTIPLIERS.axisTickLength * fontSize;
  const splitLineLength = FONT_SIZE_MULTIPLIERS.splitLineLength * fontSize;
  const columnsLabelMap = new Map<string, string[]>();
  const metricLabel = getMetricLabel(metric as QueryFormMetric);

  const rawFormData = (chartProps as any).rawFormData || {};
  const mergedFormData: any = { ...rawFormData, ...formData };

  const rawStartAngle =
    mergedFormData.start_angle !== undefined
      ? mergedFormData.start_angle
      : mergedFormData.startAngle !== undefined
        ? mergedFormData.startAngle
        : startAngle;
  const rawEndAngle =
    mergedFormData.end_angle !== undefined
      ? mergedFormData.end_angle
      : mergedFormData.endAngle !== undefined
        ? mergedFormData.endAngle
        : endAngle;
  const finalStartAngle =
    rawStartAngle !== undefined && !isNaN(Number(rawStartAngle))
      ? Number(rawStartAngle)
      : 225;
  const finalEndAngle =
    rawEndAngle !== undefined && !isNaN(Number(rawEndAngle))
      ? Number(rawEndAngle)
      : -45;

  const isSemiCircle = finalStartAngle === 180 && finalEndAngle === 0;

  const customSubtitle =
    mergedFormData.custom_subtitle ||
    mergedFormData.customSubtitle ||
    mergedFormData.subtitle;

  const defaultSubtitleOffsetY = isSemiCircle ? '52%' : '60%';
  const defaultCenterValOffsetY = isSemiCircle ? '18%' : '40%';

  const subtitleOffsetY =
    mergedFormData.subtitle_offset_y !== undefined
      ? mergedFormData.subtitle_offset_y
      : mergedFormData.subtitleOffsetY !== undefined
        ? mergedFormData.subtitleOffsetY
        : defaultSubtitleOffsetY;

  const centerValOffsetY =
    mergedFormData.center_val_offset_y !== undefined
      ? mergedFormData.center_val_offset_y
      : mergedFormData.centerValOffsetY !== undefined
        ? mergedFormData.centerValOffsetY
        : defaultCenterValOffsetY;

  const subtitleFontSize =
    mergedFormData.subtitle_font_size ||
    mergedFormData.subtitleFontSize ||
    13;

  const subtitleFontWeight =
    mergedFormData.subtitle_font_weight ||
    mergedFormData.subtitleFontWeight ||
    'bold';

  const subtitleColor =
    mergedFormData.subtitle_color
      ? typeof mergedFormData.subtitle_color === 'object'
        ? getRgba(mergedFormData.subtitle_color)
        : mergedFormData.subtitle_color
      : mergedFormData.subtitleColor
        ? typeof mergedFormData.subtitleColor === 'object'
          ? getRgba(mergedFormData.subtitleColor)
          : mergedFormData.subtitleColor
        : '#0F2F57';

  const transformedData: GaugeDataItemOption[] = data.map(
    (data_point, index) => {
      let name = '';
      if (customSubtitle) {
        name = customSubtitle;
      } else {
        const showPrefix =
          mergedFormData.show_groupby_label === true ||
          mergedFormData.showGroupbyLabel === true;

        if (showPrefix) {
          name = groupbyLabels
            .map(
              (column: string) =>
                `${verboseMap[column] || column}: ${data_point[column]}`,
            )
            .join(', ');
        } else {
          const values = groupbyLabels
            .map((column: string) => {
              let val = String(data_point[column] ?? '');
              // Strip any leading prefix like "metric_name: " or "column: "
              val = val.replace(/^[a-zA-Z0-9_-]+:\s*/, '');
              return val;
            })
            .filter(Boolean);

          name = values.join('\n');
        }
      }

      // Strip any residual prefix like "metric_name: "
      if (name) {
        name = name.replace(/^[a-zA-Z0-9_-]+:\s*/, '');
      }

      // If the label is a multi-word industrial metric label without newlines,
      // stack words with \n so it displays cleanly under the gauge arc
      if (name && !name.includes('\n')) {
        const words = name.trim().split(/\s+/);
        if (words.length >= 2 && words.length <= 4) {
          name = words.join('\n');
        }
      }

      const colorLabel = groupbyLabels.map(
        (col: string) => data_point[col] as string,
      );
      columnsLabelMap.set(
        name,
        groupbyLabels.map((col: string) => data_point[col] as string),
      );
      let item: GaugeDataItemOption = {
        value: data_point[metricLabel] as number,
        name,
        itemStyle: {
          color: colorFn(colorLabel, sliceId),
        },
        title: {
          offsetCenter: ['0%', subtitleOffsetY],
          fontSize: Number(subtitleFontSize) || 13,
          fontWeight: subtitleFontWeight || 'bold',
          color: subtitleColor,
          lineHeight: 16,
        },
        detail: {
          offsetCenter: ['0%', centerValOffsetY],
          fontSize:
            Number(centerValSize) ||
            (isSemiCircle ? 36 : FONT_SIZE_MULTIPLIERS.detailFontSize * fontSize),
          fontWeight: centerValWeight || 'bold',
          color: centerValColor ? getRgba(centerValColor) : '#EAB308',
          show: showCenterVal !== false,
        },
      };

      if (
        filterState.selectedValues &&
        !filterState.selectedValues.includes(name)
      ) {
        item = {
          ...item,
          itemStyle: {
            color: colorFn(index, sliceId),
            opacity: OpacityEnum.SemiTransparent,
          },
          detail: {
            show: false,
          },
          title: {
            show: false,
          },
        };
      }
      return item;
    },
  );

  const { setDataMask = () => {}, onContextMenu } = hooks;

  const isValidNumber = (
    val: number | null | undefined | string,
  ): val is number => {
    if (val == null || val === '') return false;
    const num = typeof val === 'string' ? Number(val) : val;
    return !Number.isNaN(num) && Number.isFinite(num);
  };

  const min = isValidNumber(minVal)
    ? Number(minVal)
    : calculateMin(transformedData);
  const max = isValidNumber(maxVal)
    ? Number(maxVal)
    : calculateMax(transformedData);

  // Tick Density Logic
  let finalSplitNumber = splitNumber;
  if (tickDensity === 'low') finalSplitNumber = 5;
  if (tickDensity === 'high') finalSplitNumber = 20;

  const axisLabels = range(min, max, (max - min) / finalSplitNumber);
  const axisLabelLength = Math.max(
    ...axisLabels.map(label => numberFormatter(label).length).concat([1]),
  );

  const intervalColorsCustom =
    (formData as any).interval_colors || (formData as any).intervalColors;
  const intervalBoundsAndColors = getIntervalBoundsAndColors(
    intervals,
    intervalColorIndices,
    colorFn,
    min,
    max,
    colorMode,
    singleColor,
    intervalColorsCustom,
  );
  const splitLineDistance =
    axisLineWidth + splitLineLength + OFFSETS.ticksFromLine;
  const axisLabelDistance =
    FONT_SIZE_MULTIPLIERS.axisLabelDistance *
      fontSize *
      FONT_SIZE_MULTIPLIERS.axisLabelLength *
      axisLabelLength +
    (showSplitLine ? splitLineLength : 0) +
    (showAxisTick ? axisTickLength : 0) +
    OFFSETS.ticksFromLine -
    axisLineWidth;
  const axisTickDistance =
    axisLineWidth + axisTickLength + OFFSETS.ticksFromLine;

  const progress = {
    show: showProgress && colorMode === 'default', // Only show default progress if not handling colors manually
    overlap,
    roundCap: roundCap || segmentStyle === 'rounded',
    width: axisLineWidth, // Align width with arc thickness
  };
  const splitLine = {
    show: showSplitLine,
    distance: -splitLineDistance,
    length: splitLineLength,
    lineStyle: {
      width: FONT_SIZE_MULTIPLIERS.splitLineWidth * fontSize,
      color: gaugeSeriesOptions.splitLine?.lineStyle?.color,
    },
  };
  const axisLine = {
    roundCap: roundCap || segmentStyle === 'rounded',
    lineStyle: {
      width: axisLineWidth,
      color: intervalBoundsAndColors.length
        ? intervalBoundsAndColors
        : gaugeSeriesOptions.axisLine?.lineStyle?.color,
    },
  };
  const axisLabel = {
    show: showTickLabels,
    distance: -axisLabelDistance,
    fontSize,
    formatter: numberFormatter,
    color: gaugeSeriesOptions.axisLabel?.color,
  };
  const axisTick = {
    show: showAxisTick,
    distance: -axisTickDistance,
    length: axisTickLength,
    lineStyle: gaugeSeriesOptions.axisTick?.lineStyle as AxisTickLineStyle,
  };
  const detail = {
    valueAnimation: animation,
    formatter: (value: number) => formatValue(value),
    color: centerValColor
      ? getRgba(centerValColor)
      : gaugeSeriesOptions.detail?.color,
  };
  const tooltip = {
    ...getDefaultTooltip(refs),
    formatter: (params: CallbackDataParams) => {
      const { name, value } = params;
      return tooltipHtml([[metricLabel, formatValue(value as number)]], name);
    },
  };

  const gaugeCenterX =
    mergedFormData.gauge_center_x || mergedFormData.gaugeCenterX || '50%';
  const defaultCenterY = isSemiCircle ? '62%' : '55%';
  const gaugeCenterY =
    mergedFormData.gauge_center_y ||
    mergedFormData.gaugeCenterY ||
    defaultCenterY;

  let pointer;
  // Needle Customization
  const pointerIcon =
    needleStyle === 'triangle'
      ? 'triangle'
      : needleStyle === 'rounded'
        ? 'path://M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'
        : undefined;

  pointer = {
    show: showPointer !== false,
    showAbove: true,
    itemStyle: {
      color: needleColor
        ? getRgba(needleColor)
        : INTERVAL_GAUGE_SERIES_OPTION.pointer?.itemStyle?.color,
    },
    width: Number(needleWidth) || 4,
    length: `${Number(needleLength) || (isSemiCircle ? 65 : 60)}%`,
  } as any;
  if (pointerIcon) {
    pointer.icon = pointerIcon;
  }

  const anchor = {
    show: showPointer !== false,
    showAbove: true,
    size: 8,
    itemStyle: {
      color: needleColor ? getRgba(needleColor) : '#0F2F57',
    },
  };

  const series: GaugeSeriesOption[] = [
    {
      type: 'gauge',
      startAngle: finalStartAngle,
      endAngle: finalEndAngle,
      min,
      max,
      progress,
      animation,
      animationDuration: Number(animationDuration) || 1000,
      axisLine: axisLine as GaugeSeriesOption['axisLine'],
      splitLine,
      splitNumber: finalSplitNumber,
      axisLabel,
      axisTick,
      pointer,
      anchor,
      detail,
      tooltip,
      radius: `${Number(innerRadius) || 75}%`,
      center: [gaugeCenterX, gaugeCenterY],
      data: transformedData,
    },
  ];

  const echartOptions: EChartsCoreOption = {
    tooltip: {
      ...getDefaultTooltip(refs),
      trigger: 'item',
    },
    series,
  };

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    emitCrossFilters,
    labelMap: Object.fromEntries(columnsLabelMap),
    groupby,
    selectedValues: filterState.selectedValues || [],
    onContextMenu,
    refs,
    coltypeMapping,
  };
}
