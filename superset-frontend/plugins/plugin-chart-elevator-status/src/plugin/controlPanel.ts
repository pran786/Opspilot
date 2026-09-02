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
            name: 'direction_column',
            config: {
              ...sharedControls.groupby,
              label: t('Direction Column'),
              description: t('Elevator direction (UP, DOWN, IDLE)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'floor_column',
            config: {
              ...sharedControls.groupby,
              label: t('Floor / Level Column'),
              description: t('Current Floor (e.g. Floor 1, Floor 2)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'status_column',
            config: {
              ...sharedControls.groupby,
              label: t('Status Column'),
              description: t('Elevator status (e.g. MOVING, OPEN, IDLE)'),
              multi: false,
            },
          },
        ],
        [
          {
            name: 'payload_column',
            config: {
              ...sharedControls.groupby,
              label: t('Current Payload Column'),
              description: t('Material or load currently inside elevator'),
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
            name: 'show_direction_arrows',
            config: {
              type: 'CheckboxControl',
              label: t('Show Direction Arrows'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'door_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Door Panel Color'),
              default: { r: 194, g: 120, b: 92, a: 1 },
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'arrow_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Direction Arrow Color'),
              default: { r: 245, g: 158, b: 11, a: 1 },
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default config;
