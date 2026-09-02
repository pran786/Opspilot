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
              label: t('Show Tanker Truck Graphic'),
              default: true,
              renderTrigger: true,
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
              default: 20,
              min: 14,
              max: 36,
              step: 1,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default config;
