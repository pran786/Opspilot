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
import { t } from '@apache-superset/core';
import { validateNonEmpty } from '@superset-ui/core';
import {
  ControlPanelConfig,
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Data Mapping'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'spot_id_column',
            config: {
              ...sharedControls.groupby,
              label: t('Spot / Bay ID Column'),
              description: t('Column containing spot identifiers (e.g., P1, P2, PARKING SPOT P1)'),
              multi: false,
              validators: [validateNonEmpty],
            },
          },
        ],
        [
          {
            name: 'work_order_column',
            config: {
              ...sharedControls.groupby,
              label: t('Work Order Column'),
              description: t('Work Order or Batch ID in this bay (e.g. 14302)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'priority_column',
            config: {
              ...sharedControls.groupby,
              label: t('Priority Flag Column'),
              description: t('Column indicating priority (e.g., true, PRIORITY, 1)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'due_date_column',
            config: {
              ...sharedControls.groupby,
              label: t('Due Date Column'),
              description: t('Due Date or Scheduled Date (e.g., Jun 30, Jul 01)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'stage_tag_column',
            config: {
              ...sharedControls.groupby,
              label: t('Stage Tag Column'),
              description: t('Machine or process stage (e.g., Mixer, Mix Tank, Cleaning)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'stage_color_column',
            config: {
              ...sharedControls.groupby,
              label: t('Stage Badge Color Column'),
              description: t('Optional custom color for the stage badge'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'bin_c1_column',
            config: {
              ...sharedControls.groupby,
              label: t('Bin C1 Column'),
              description: t('Quantity in Bin C1'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'bin_c2_column',
            config: {
              ...sharedControls.groupby,
              label: t('Bin C2 Column'),
              description: t('Quantity in Bin C2'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'bin_c3_column',
            config: {
              ...sharedControls.groupby,
              label: t('Bin C3 Column'),
              description: t('Quantity in Bin C3'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'bin_bc_column',
            config: {
              ...sharedControls.groupby,
              label: t('Bin BC Column'),
              description: t('Quantity in Bin BC'),
              multi: false,
            },
          },
        ],
      ],
    },
    {
      label: t('Grid & Card Customization'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'columns_count',
            config: {
              type: 'SelectControl',
              label: t('Grid Columns Count'),
              default: 5,
              choices: [
                [2, '2 Columns'],
                [3, '3 Columns'],
                [4, '4 Columns'],
                [5, '5 Columns (Standard 10-Bay)'],
                [6, '6 Columns'],
                [10, '10 Columns Single Row'],
              ],
              renderTrigger: true,
              description: t('Number of bay cards per row'),
            },
          },
        ],
        [
          {
            name: 'card_gap',
            config: {
              type: 'SliderControl',
              label: t('Card Gap (px)'),
              default: 8,
              min: 0,
              max: 24,
              step: 2,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'font_size',
            config: {
              type: 'SliderControl',
              label: t('Base Font Size (px)'),
              default: 13,
              min: 9,
              max: 24,
              step: 1,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'show_bin_grid',
            config: {
              type: 'CheckboxControl',
              label: t('Show C1/C2/C3/BC Bin Grid'),
              default: true,
              renderTrigger: true,
              description: t('Whether to render the 4-column bin container quantity matrix'),
            },
          },
        ],
        [
          {
            name: 'stage_badge_bg_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Stage Badge Color'),
              default: { r: 230, g: 81, b: 0, a: 1 },
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'priority_badge_bg_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Priority Tag Color'),
              default: { r: 224, g: 32, b: 32, a: 1 },
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'card_bg_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Card Background Color'),
              default: { r: 255, g: 255, b: 255, a: 1 },
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default config;
