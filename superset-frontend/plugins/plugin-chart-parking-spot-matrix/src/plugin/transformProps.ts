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
  ParkingSpotMatrixProps,
  ParkingSpotMatrixCustomizeProps,
} from '../types';

function parseColor(color: any, fallback: string): string {
  if (!color) return fallback;
  if (typeof color === 'string') return color;
  if (typeof color === 'object' && 'r' in color) {
    const { r, g, b, a = 1 } = color;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return fallback;
}

export default function transformProps(chartProps: ChartProps): ParkingSpotMatrixProps {
  const { width, height, formData, queriesData } = chartProps;
  const data = (queriesData[0]?.data || []) as TimeseriesDataRecord[];

  const customize: ParkingSpotMatrixCustomizeProps = {
    spotIdColumn: formData.spot_id_column || '',
    workOrderColumn: formData.work_order_column || '',
    priorityColumn: formData.priority_column || '',
    dueDateColumn: formData.due_date_column || '',
    stageTagColumn: formData.stage_tag_column || '',
    stageColorColumn: formData.stage_color_column || '',
    binC1Column: formData.bin_c1_column || '',
    binC2Column: formData.bin_c2_column || '',
    binC3Column: formData.bin_c3_column || '',
    binBCColumn: formData.bin_bc_column || '',

    columnsCount: Number(formData.columns_count) || 5,
    cardGap: formData.card_gap !== undefined ? Number(formData.card_gap) : 8,
    cardBgColor: parseColor(formData.card_bg_color, '#FFFFFF'),
    cardBorderColor: parseColor(formData.card_border_color, '#D0D7DE'),
    headerBgColor: parseColor(formData.header_bg_color, '#F3F4F6'),
    headerTextColor: parseColor(formData.header_text_color, '#4B5563'),
    stageBadgeBgColor: parseColor(formData.stage_badge_bg_color, '#E65100'),
    stageBadgeTextColor: parseColor(formData.stage_badge_text_color, '#FFFFFF'),
    priorityBadgeBgColor: parseColor(formData.priority_badge_bg_color, '#E02020'),
    priorityBadgeTextColor: parseColor(formData.priority_badge_text_color, '#FFFFFF'),
    fontSize: Number(formData.font_size) || 13,
    showBinGrid: formData.show_bin_grid !== false,
    emptySpotText: formData.empty_spot_text || 'Available',
  };

  return {
    width,
    height,
    data,
    customize,
  };
}
