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
  ElevatorStatusProps,
  ElevatorStatusCustomizeProps,
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

export default function transformProps(chartProps: ChartProps): ElevatorStatusProps {
  const { width, height, formData, queriesData } = chartProps;
  const data = (queriesData[0]?.data || []) as TimeseriesDataRecord[];

  const customize: ElevatorStatusCustomizeProps = {
    directionColumn: formData.direction_column || '',
    floorColumn: formData.floor_column || '',
    statusColumn: formData.status_column || '',
    payloadColumn: formData.payload_column || '',
    destinationColumn: formData.destination_column || '',

    doorColor: parseColor(formData.door_color, '#C2785C'),
    frameColor: parseColor(formData.frame_color, '#111827'),
    arrowColor: parseColor(formData.arrow_color, '#F59E0B'),
    showDirectionArrows: formData.show_direction_arrows !== false,
    showFloorDisplay: formData.show_floor_display !== false,
    statusText: formData.status_text || '',
    fontSize: Number(formData.font_size) || 14,
  };

  return {
    width,
    height,
    data,
    customize,
  };
}
