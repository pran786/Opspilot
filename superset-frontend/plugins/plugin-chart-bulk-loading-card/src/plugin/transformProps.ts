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
import { BulkLoadingCardProps, BulkLoadingCardCustomizeProps } from '../types';

export default function transformProps(
  chartProps: ChartProps,
): BulkLoadingCardProps {
  const { width, height, formData, queriesData } = chartProps;
  const data = (queriesData[0]?.data || []) as TimeseriesDataRecord[];

  const getProp = (snake: string, camel: string, fallback?: any) =>
    formData[snake] !== undefined
      ? formData[snake]
      : (formData as any)[camel] !== undefined
        ? (formData as any)[camel]
        : fallback;

  const customize: BulkLoadingCardCustomizeProps = {
    workOrderColumn: getProp('work_order_column', 'workOrderColumn', ''),
    materialNameColumn: getProp(
      'material_name_column',
      'materialNameColumn',
      '',
    ),
    secondaryIdColumn: getProp('secondary_id_column', 'secondaryIdColumn', ''),
    statusColumn: getProp('status_column', 'statusColumn', ''),
    destinationTankColumn: getProp(
      'destination_tank_column',
      'destinationTankColumn',
      '',
    ),
    elapsedTimeColumn: getProp('elapsed_time_column', 'elapsedTimeColumn', ''),

    titleText: getProp('title_text', 'titleText', 'Bulk Loading'),
    showTruckGraphic:
      getProp('show_truck_graphic', 'showTruckGraphic', true) !== false,
    showStatusPipeline:
      getProp('show_status_pipeline', 'showStatusPipeline', true) !== false,
    activeStatusColor: getProp(
      'active_status_color',
      'activeStatusColor',
      '#F59E0B',
    ),
    cardBgColor: getProp('card_bg_color', 'cardBgColor', 'transparent'),
    cardBorderColor: getProp('card_border_color', 'cardBorderColor', 'none'),
    fontSize: Number(getProp('font_size', 'fontSize', 14)) || 14,
    workOrderFontSize:
      Number(getProp('work_order_font_size', 'workOrderFontSize', 26)) || 26,
    timerColor: getProp('timer_color', 'timerColor', '#0F2F57'),
    tankBadgeColor: getProp('tank_badge_color', 'tankBadgeColor', '#0F2F57'),
  };

  return {
    width,
    height,
    data,
    customize,
  };
}
