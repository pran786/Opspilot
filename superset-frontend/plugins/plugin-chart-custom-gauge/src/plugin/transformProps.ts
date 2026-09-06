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

  let intervalBoundsNonNormalized;
  let intervalColorIndicesArray;
  try {
    intervalBoundsNonNormalized = parseNumbersList(intervals, ',');
    intervalColorIndicesArray = parseNumbersList(intervalColorIndices, ',');
  } catch (error) {
    intervalBoundsNonNormalized = [] as number[];
    intervalColorIndicesArray = [] as number[];
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

  const intervalColors = intervalColorIndicesArray.map(
    ind => colorFn.colors[(ind - 1) % colorFn.colors.length],
  );

  return intervalBounds.map((val, idx) => {
    const color = intervalColors[idx];
    return [val, color || colorFn.colors[idx]];
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
  const titleOffsetFromTitle =
    FONT_SIZE_MULTIPLIERS.titleOffsetFromTitle * fontSize;
  const detailOffsetFromTitle =
    FONT_SIZE_MULTIPLIERS.detailOffsetFromTitle * fontSize;
  const columnsLabelMap = new Map<string, string[]>();
  const metricLabel = getMetricLabel(metric as QueryFormMetric);

  const customSubtitle =
    (formData as any).custom_subtitle || (formData as any).customSubtitle;
  const subtitleOffsetY =
    (formData as any).subtitle_offset_y || (formData as any).subtitleOffsetY;
  const subtitleFontSize =
    (formData as any).subtitle_font_size || (formData as any).subtitleFontSize;
  const subtitleFontWeight =
    (formData as any).subtitle_font_weight ||
    (formData as any).subtitleFontWeight;
  const subtitleColor =
    (formData as any).subtitle_color || (formData as any).subtitleColor;
  const centerValOffsetY =
    (formData as any).center_val_offset_y || (formData as any).centerValOffsetY;

  const transformedData: GaugeDataItemOption[] = data.map(
    (data_point, index) => {
      const name =
        customSubtitle ||
        ((formData as any).show_groupby_label === false ||
        (formData as any).showGroupbyLabel === false
          ? groupbyLabels
              .map((column: string) => `${data_point[column]}`)
              .join('\n')
          : groupbyLabels
              .map(
                (column: string) =>
                  `${verboseMap[column] || column}: ${data_point[column]}`,
              )
              .join(', '));
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
          offsetCenter: [
            '0%',
            subtitleOffsetY !== undefined
              ? subtitleOffsetY
              : `${index * titleOffsetFromTitle + OFFSETS.titleFromCenter}%`,
          ],
          fontSize: Number(subtitleFontSize) || fontSize,
          fontWeight:
            subtitleFontWeight || (customSubtitle ? 'bold' : 'normal'),
          color: subtitleColor || theme.colorTextSecondary,
          lineHeight: 18,
        },
        detail: {
          offsetCenter: [
            '0%',
            centerValOffsetY !== undefined
              ? centerValOffsetY
              : `${
                  index * titleOffsetFromTitle +
                  OFFSETS.titleFromCenter +
                  detailOffsetFromTitle
                }%`,
          ],
          fontSize:
            centerValSize || FONT_SIZE_MULTIPLIERS.detailFontSize * fontSize,
          fontWeight: centerValWeight || 'normal',
          color: centerValColor ? getRgba(centerValColor) : theme.colorText,
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

  const rawStartAngle =
    (formData as any).start_angle !== undefined
      ? (formData as any).start_angle
      : startAngle;
  const rawEndAngle =
    (formData as any).end_angle !== undefined
      ? (formData as any).end_angle
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
  const gaugeCenterX =
    (formData as any).gauge_center_x || (formData as any).gaugeCenterX || '50%';
  const defaultCenterY = isSemiCircle ? '62%' : '55%';
  const gaugeCenterY =
    (formData as any).gauge_center_y ||
    (formData as any).gaugeCenterY ||
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
