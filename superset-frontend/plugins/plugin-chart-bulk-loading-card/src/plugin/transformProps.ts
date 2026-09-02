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
  BulkLoadingCardProps,
  BulkLoadingCardCustomizeProps,
} from '../types';

export default function transformProps(chartProps: ChartProps): BulkLoadingCardProps {
  const { width, height, formData, queriesData } = chartProps;
  const data = (queriesData[0]?.data || []) as TimeseriesDataRecord[];

  const customize: BulkLoadingCardCustomizeProps = {
    workOrderColumn: formData.work_order_column || '',
    materialNameColumn: formData.material_name_column || '',
    secondaryIdColumn: formData.secondary_id_column || '',
    statusColumn: formData.status_column || '',
    destinationTankColumn: formData.destination_tank_column || '',
    elapsedTimeColumn: formData.elapsed_time_column || '',

    titleText: formData.title_text || 'Bulk Loading',
    showTruckGraphic: formData.show_truck_graphic !== false,
    showStatusPipeline: formData.show_status_pipeline !== false,
    activeStatusColor: formData.active_status_color || '#F59E0B',
    cardBgColor: formData.card_bg_color || '#FFFFFF',
    cardBorderColor: formData.card_border_color || '#E5E7EB',
    fontSize: Number(formData.font_size) || 14,
    workOrderFontSize: Number(formData.work_order_font_size) || 22,
    timerColor: formData.timer_color || '#111827',
    tankBadgeColor: formData.tank_badge_color || '#111827',
  };

  return {
    width,
    height,
    data,
    customize,
  };
}
