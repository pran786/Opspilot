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
import ImageUploadControl from './ImageUploadControl';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Data Mapping'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'work_order_column',
            config: {
              ...sharedControls.groupby,
              label: t('Work Order / Batch ID Column'),
              description: t('Work order number (e.g. 2544434)'),
              multi: false,
              validators: [validateNonEmpty],
            },
          },
        ],
        [
          {
            name: 'material_name_column',
            config: {
              ...sharedControls.groupby,
              label: t('Material Name Column'),
              description: t('Product description (e.g. POLY OX FRAG OIL 235)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'status_column',
            config: {
              ...sharedControls.groupby,
              label: t('Loading Status Column'),
              description: t('Current status (LOADING, AWAITING QC, QC APPROVED, QC REJECTED)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'destination_tank_column',
            config: {
              ...sharedControls.groupby,
              label: t('Destination Tank Column'),
              description: t('Target Tank ID (e.g. BK-2, BK-4)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'elapsed_time_column',
            config: {
              ...sharedControls.groupby,
              label: t('Elapsed Time / Countdown Column'),
              description: t('Timer string (e.g. 2:43)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'order_label_column',
            config: {
              ...sharedControls.groupby,
              label: t('Order Sub-Label Column (Active / Upcoming)'),
              description: t(
                'Column containing order stage or label (e.g. Active, Upcoming, Queued)',
              ),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'tank_label_column',
            config: {
              ...sharedControls.groupby,
              label: t('Destination Tank Label Column'),
              description: t(
                'Column containing header label for tank (e.g. Tank, Silo, Bay)',
              ),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'timer_label_column',
            config: {
              ...sharedControls.groupby,
              label: t('Timer Header Label Column'),
              description: t(
                'Column containing header label for timer (e.g. Time in Bay, Remaining)',
              ),
              multi: false,
            },
          },
        ],
      ],
    },
    {
      label: t('Visual Customization'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'title_text',
            config: {
              type: 'TextControl',
              label: t('Section Title'),
              default: 'Bulk Loading',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'show_truck_graphic',
            config: {
              type: 'CheckboxControl',
              label: t('Show Vehicle Graphic'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'custom_truck_image',
            config: {
              type: ImageUploadControl,
              label: t('Upload Custom Vehicle / Logo Image'),
              description: t(
                'Upload a PNG, SVG, JPG, or WebP image to replace the tanker truck illustration (Max 3 MB)',
              ),
              default: '',
              renderTrigger: true,
              visibility: ({ controls }: any) =>
                controls?.show_truck_graphic?.value !== false,
            },
          },
        ],
        [
          {
            name: 'custom_truck_image_url',
            config: {
              type: 'TextControl',
              label: t('Or Custom Vehicle Image URL / Path'),
              description: t(
                'Web URL or relative path to vehicle image (e.g. /static/assets/images/custom_truck.png)',
              ),
              default: '',
              renderTrigger: true,
              visibility: ({ controls }: any) =>
                controls?.show_truck_graphic?.value !== false,
            },
          },
        ],
        [
          {
            name: 'truck_image_width',
            config: {
              type: 'SliderControl',
              label: t('Vehicle Image Width (px)'),
              default: 200,
              min: 60,
              max: 400,
              step: 5,
              renderTrigger: true,
              visibility: ({ controls }: any) =>
                controls?.show_truck_graphic?.value !== false,
            },
          },
        ],
        [
          {
            name: 'truck_image_height',
            config: {
              type: 'SliderControl',
              label: t('Vehicle Image Height (px)'),
              default: 65,
              min: 30,
              max: 150,
              step: 5,
              renderTrigger: true,
              visibility: ({ controls }: any) =>
                controls?.show_truck_graphic?.value !== false,
            },
          },
        ],
        [
          {
            name: 'show_status_pipeline',
            config: {
              type: 'CheckboxControl',
              label: t('Show Status Pipeline Badges'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'work_order_font_size',
            config: {
              type: 'SliderControl',
              label: t('Work Order Font Size (px)'),
              default: 34,
              min: 14,
              max: 48,
              step: 1,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'tank_badge_color',
            config: {
              type: 'TextControl',
              label: t('Destination Tank Badge Color'),
              description: t('CSS color for tank badge (e.g. #0F2F57)'),
              default: '#0F2F57',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'timer_color',
            config: {
              type: 'TextControl',
              label: t('Timer Color'),
              description: t('CSS color for timer text (e.g. #0F2F57)'),
              default: '#0F2F57',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'card_bg_color',
            config: {
              type: 'TextControl',
              label: t('Card Background Color'),
              description: t('CSS color for card background (e.g. transparent or #FFFFFF)'),
              default: 'transparent',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'card_border_color',
            config: {
              type: 'TextControl',
              label: t('Card Border Color'),
              description: t('CSS border property (e.g. none or 1px solid #E2E8F0)'),
              default: 'none',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'active_status_color',
            config: {
              type: 'TextControl',
              label: t('Active Status Color'),
              description: t('CSS color for active status badge (e.g. #F59E0B)'),
              default: '#F59E0B',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'font_family',
            config: {
              type: 'SelectControl',
              label: t('Font Family'),
              description: t('Font family for all card typography'),
              default: 'Inter',
              choices: [
                ['Inter', 'Inter (Matches OpsPilot)'],
                ['Roboto', 'Roboto'],
                ['Segoe UI', 'Segoe UI'],
                ['Arial', 'Arial'],
                ['system', 'System Default'],
              ],
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default config;
