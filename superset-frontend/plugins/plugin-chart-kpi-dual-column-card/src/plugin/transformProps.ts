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
import { ChartProps, TimeseriesDataRecord } from '@superset-ui/core';
import {
  KpiDualColumnCardProps,
  KpiDualColumnCardCustomizeProps,
  HeaderMode,
  IconType,
  TextTransform,
  Alignment,
} from '../types';

/** Extract clean column name from formData value (string | array | object) */
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

export default function transformProps(
  chartProps: ChartProps,
): KpiDualColumnCardProps {
  const { width, height, formData, queriesData } = chartProps;

  const getProp = (snake: string, camel: string, fallback?: any) =>
    formData[snake] !== undefined
      ? formData[snake]
      : formData[camel] !== undefined
        ? formData[camel]
        : fallback;

  // Data columns
  const keyColumn = getColumnName(getProp('key_column', 'keyColumn'));
  const valueColumn = getColumnName(getProp('value_column', 'valueColumn'));
  const valBoxColorColumn =
    getColumnName(getProp('val_box_color_column', 'valBoxColorColumn')) ||
    undefined;
  const valTextColorColumn =
    getColumnName(getProp('val_text_color_column', 'valTextColorColumn')) ||
    undefined;
  const groupColumn =
    getColumnName(getProp('group_column', 'groupColumn')) || undefined;

  // Header / Icon
  const headerMode = getProp('header_mode', 'headerMode', 'none') as HeaderMode;
  const iconType = getProp('icon_type', 'iconType', 'none') as IconType;
  const iconName = String(getProp('icon_name', 'iconName', '') || '');
  const titleText = String(getProp('title_text', 'titleText', '') || '');
  const titleFontSize =
    Number(getProp('title_font_size', 'titleFontSize', 13)) || 13;
  const titleColor = String(
    getProp('title_color', 'titleColor', '#6B7280') || '#6B7280',
  );
  const svgUrl = String(getProp('svg_url', 'svgUrl', '') || '');
  const uploadedIcon = String(
    getProp('uploaded_icon', 'uploadedIcon', '') || '',
  );
  const iconSize = Number(getProp('icon_size', 'iconSize', 32)) || 32;
  const iconColor = String(
    getProp('icon_color', 'iconColor', '#333333') || '#333333',
  );
  const iconSpacing = Number(getProp('icon_spacing', 'iconSpacing', 12)) || 12;

  // Typography
  const keyFontSize = Number(getProp('key_font_size', 'keyFontSize', 14)) || 14;
  const valueFontSize =
    Number(getProp('value_font_size', 'valueFontSize', 14)) || 14;
  const keyFontWeight =
    Number(getProp('key_font_weight', 'keyFontWeight', 400)) || 400;
  const valueFontWeight =
    Number(getProp('value_font_weight', 'valueFontWeight', 600)) || 600;
  const globalKeyColor = String(
    getProp('global_key_color', 'globalKeyColor', '#333333') || '#333333',
  );
  const globalValueColor = String(
    getProp('global_value_color', 'globalValueColor', '#000000') || '#000000',
  );
  const textTransform = getProp(
    'text_transform',
    'textTransform',
    'none',
  ) as TextTransform;

  // Layout
  const alignment = getProp('alignment', 'alignment', 'left') as Alignment;
  const rowSpacing = Number(getProp('row_spacing', 'rowSpacing', 12)) || 12;
  const valuePadding = Number(getProp('value_padding', 'valuePadding', 6)) || 6;
  const borderRadius = Number(getProp('border_radius', 'borderRadius', 4)) || 4;
  const containerPadding =
    Number(getProp('container_padding', 'containerPadding', 16)) || 16;
  const containerBgColor = String(
    getProp('container_bg_color', 'containerBgColor', 'transparent') ||
      'transparent',
  );
  const enableShadow = !!getProp('enable_shadow', 'enableShadow', false);

  const data = (queriesData?.[0]?.data || []) as TimeseriesDataRecord[];

  const customize: KpiDualColumnCardCustomizeProps = {
    keyColumn,
    valueColumn,
    valBoxColorColumn,
    valTextColorColumn,
    groupColumn,
    headerMode,
    iconType,
    iconName,
    titleText,
    titleFontSize,
    titleColor,
    svgUrl,
    uploadedIcon,
    iconSize,
    iconColor,
    iconSpacing,
    keyFontSize,
    valueFontSize,
    keyFontWeight,
    valueFontWeight,
    globalKeyColor,
    globalValueColor,
    textTransform,
    alignment,
    rowSpacing,
    valuePadding,
    borderRadius,
    containerPadding,
    containerBgColor,
    enableShadow,
  };

  return {
    width,
    height,
    data,
    customize,
  };
}
