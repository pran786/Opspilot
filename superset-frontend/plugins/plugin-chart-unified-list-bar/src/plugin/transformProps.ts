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
  ChartProps,
  TimeseriesDataRecord,
  ensureIsArray,
} from '@superset-ui/core';
import {
  UnifiedListBarChartProps,
  UnifiedListBarChartCustomizeProps,
} from '../types';

// Helper to extract clean column name from formData value (which can be string, array, or object)
const getColumnName = (col: any): string => {
  if (!col) return '';
  if (typeof col === 'string') return col;
  if (Array.isArray(col) && col.length > 0) return getColumnName(col[0]);
  if (typeof col === 'object') {
    if (col.label) return col.label;
    if (col.column_name) return col.column_name;
    if (col.column && col.column.column_name) return col.column.column_name;
    if (col.sqlExpression) return col.sqlExpression;
  }
  return String(col);
};

// Helper to convert ColorPickerControl value (RGBA object) to CSS color string
const rgbaToString = (color: any): string => {
  if (typeof color === 'string') return color;
  if (
    color &&
    typeof color === 'object' &&
    'r' in color &&
    'g' in color &&
    'b' in color
  ) {
    const a = color.a !== undefined ? color.a : 1;
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${a})`;
  }
  return '#000000'; // Default black
};

export default function transformProps(
  chartProps: ChartProps,
): UnifiedListBarChartProps {
  const { width, height, formData, queriesData } = chartProps;

  // Extract values using camelCase (Superset converts snake_case control names to camelCase)
  const {
    keyColumn,
    keySubColumn,
    secondaryColumns,
    metricColumn,
    maxMetricColumn,
    severityColumn,
    colorColumn,
    displayValueColumn,
    rowsPerItem = '2',
    alignMetric = 'right',
    showBar = true,
    showMetricValue = true,
    keyFontSize = 16,
    keyColor,
    keySubFontSize = 11,
    secondaryFontSize = 12,
    displayValueFontSize = 24,
    barColorPositive,
    barColorNegative,
    conditionalColorRules,
    iconRules,
  } = formData;

  const data = (queriesData?.[0]?.data || []) as TimeseriesDataRecord[];

  // DEBUG: Log to verify values
  console.log('=== TRANSFORM PROPS DEBUG ===');
  console.log('keyColumn:', keyColumn);
  console.log('keySubColumn:', keySubColumn);
  console.log('colorColumn:', colorColumn);
  console.log('metricColumn:', metricColumn);
  console.log('displayValueColumn:', displayValueColumn);

  // Extract clean column names
  const keyColumnName = getColumnName(
    keyColumn || (formData as any).key_column,
  );
  const keySubColumnName = getColumnName(
    keySubColumn || (formData as any).key_sub_column,
  );
  const secondaryColumnNames = ensureIsArray(
    secondaryColumns || (formData as any).secondary_columns,
  )
    .map(getColumnName)
    .filter(Boolean);
  const metricColumnName = getColumnName(
    metricColumn || (formData as any).metric_column,
  );
  const maxMetricColumnName = getColumnName(
    maxMetricColumn || (formData as any).max_metric_column,
  );
  const severityColumnName = getColumnName(
    severityColumn || (formData as any).severity_column,
  );
  const colorColumnName = getColumnName(
    colorColumn || (formData as any).color_column,
  );
  const displayValueColumnName = getColumnName(
    displayValueColumn || (formData as any).display_value_column,
  );

  const customize: UnifiedListBarChartCustomizeProps = {
    keyColumn: keyColumnName,
    keySubColumn: keySubColumnName || undefined,
    secondaryColumns: secondaryColumnNames,
    metricColumn: metricColumnName || undefined,
    maxMetricColumn: maxMetricColumnName || undefined,
    severityColumn: severityColumnName || undefined,
    colorColumn: colorColumnName || undefined,
    displayValueColumn: displayValueColumnName || undefined,
    rowsPerItem: rowsPerItem,
    alignMetric: alignMetric,
    showBar: showBar,
    showMetricValue: showMetricValue,
    keyFontSize: Number(keyFontSize) || 16,
    keyColor: rgbaToString(keyColor || (formData as any).key_color),
    keySubFontSize: Number(keySubFontSize) || 11,
    keySubColor:
      rgbaToString(
        (formData as any).keySubColor || (formData as any).key_sub_color,
      ) || '#2B6CB0',
    secondaryFontSize: Number(secondaryFontSize) || 12,
    secondaryColor:
      rgbaToString(
        (formData as any).secondaryColor || (formData as any).secondary_color,
      ) || '#2B6CB0',
    displayValueFontSize: Number(displayValueFontSize) || 24,
    displayValueColor:
      rgbaToString(
        (formData as any).displayValueColor ||
          (formData as any).display_value_color,
      ) || undefined,
    headerTitle:
      (formData as any).headerTitle ||
      (formData as any).header_title ||
      undefined,
    headerSubtitle:
      (formData as any).headerSubtitle ||
      (formData as any).header_subtitle ||
      undefined,
    headerSubtitleColor:
      rgbaToString(
        (formData as any).headerSubtitleColor ||
          (formData as any).header_subtitle_color,
      ) || '#2B6CB0',
    headerBadge:
      (formData as any).headerBadge ||
      (formData as any).header_badge ||
      undefined,
    headerBadgeColor:
      rgbaToString(
        (formData as any).headerBadgeColor ||
          (formData as any).header_badge_color,
      ) || '#DC2626',
    barColorPositive: rgbaToString(barColorPositive),
    barColorNegative: rgbaToString(barColorNegative),
    conditionalColorRules:
      typeof conditionalColorRules === 'string'
        ? JSON.parse(conditionalColorRules)
        : conditionalColorRules,
    iconRules:
      typeof iconRules === 'string' ? JSON.parse(iconRules) : iconRules,
  };

  return {
    width,
    height,
    data,
    customize,
  };
}
