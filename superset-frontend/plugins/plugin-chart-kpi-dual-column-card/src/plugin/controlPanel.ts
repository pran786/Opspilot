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
import { ControlPanelConfig, sections, sharedControls } from '@superset-ui/chart-controls';
import ImageUploadControl from './ImageUploadControl';

const config: ControlPanelConfig = {
    controlPanelSections: [
        sections.legacyTimeseriesTime,

        // ── DATA SECTION ───────────────────────────────────────────
        {
            label: t('Data'),
            expanded: true,
            controlSetRows: [
                [
                    {
                        name: 'key_column',
                        config: {
                            ...sharedControls.groupby,
                            label: t('Key Column'),
                            description: t('Column containing the label / key for each row'),
                            multi: false,
                            validators: [validateNonEmpty],
                        },
                    },
                ],
                [
                    {
                        name: 'value_column',
                        config: {
                            ...sharedControls.groupby,
                            label: t('Value Column'),
                            description: t('Column containing the value for each row'),
                            multi: false,
                            validators: [validateNonEmpty],
                        },
                    },
                ],
                [
                    {
                        name: 'val_box_color_column',
                        config: {
                            ...sharedControls.groupby,
                            label: t('Value Box Color Column'),
                            description: t('Optional column with hex color codes for value box background'),
                            multi: false,
                        },
                    },
                ],
                [
                    {
                        name: 'val_text_color_column',
                        config: {
                            ...sharedControls.groupby,
                            label: t('Value Text Color Column'),
                            description: t('Optional column with hex color codes for value text color'),
                            multi: false,
                        },
                    },
                ],
                ['adhoc_filters'],
                ['row_limit'],
            ],
        },

        // ── HEADER / ICON SECTION ──────────────────────────────────
        {
            label: t('Header / Icon'),
            expanded: false,
            controlSetRows: [
                [
                    {
                        name: 'header_mode',
                        config: {
                            type: 'SelectControl',
                            label: t('Header Mode'),
                            description: t('Where to display the icon header'),
                            default: 'none',
                            choices: [
                                ['none', t('None')],
                                ['icon_above_value', t('Icon above Value Column')],
                                ['icon_centered', t('Icon centered above Card')],
                            ],
                            renderTrigger: true,
                        },
                    },
                ],
                [
                    {
                        name: 'icon_type',
                        config: {
                            type: 'SelectControl',
                            label: t('Icon Type'),
                            description: t('Type of icon to display'),
                            default: 'none',
                            choices: [
                                ['none', t('None')],
                                ['antd', t('Built-in Icon (Ant Design)')],
                                ['svg_url', t('Custom Image URL')],
                                ['upload', t('Upload Image')],
                            ],
                            renderTrigger: true,
                        },
                    },
                ],
                [
                    {
                        name: 'icon_name',
                        config: {
                            type: 'TextControl',
                            label: t('Icon Name'),
                            description: t('Ant Design icon name in PascalCase (e.g. CheckCircleOutlined, DashboardFilled)'),
                            default: '',
                            renderTrigger: true,
                            visibility: ({ controls }: any) =>
                                controls?.icon_type?.value === 'antd',
                        },
                    },
                ],
                [
                    {
                        name: 'svg_url',
                        config: {
                            type: 'TextControl',
                            label: t('Image URL'),
                            description: t('URL to an image file (SVG, PNG, JPG, etc.)'),
                            default: '',
                            renderTrigger: true,
                            visibility: ({ controls }: any) =>
                                controls?.icon_type?.value === 'svg_url',
                        },
                    },
                ],
                [
                    {
                        name: 'uploaded_icon',
                        config: {
                            type: ImageUploadControl,
                            label: t('Upload Icon'),
                            description: t('Upload a PNG, SVG, or JPG image (max 100 KB)'),
                            default: '',
                            renderTrigger: true,
                            visibility: ({ controls }: any) =>
                                controls?.icon_type?.value === 'upload',
                        },
                    },
                ],
                [
                    {
                        name: 'icon_size',
                        config: {
                            type: 'TextControl',
                            label: t('Icon Size (px)'),
                            default: 32,
                            renderTrigger: true,
                            isInt: true,
                            visibility: ({ controls }: any) =>
                                controls?.header_mode?.value !== 'none' &&
                                controls?.icon_type?.value !== 'none',
                        },
                    },
                ],
                [
                    {
                        name: 'icon_color',
                        config: {
                            type: 'TextControl',
                            label: t('Icon Color'),
                            description: t('CSS color for the built-in icon (e.g. #4285F4)'),
                            default: '#333333',
                            renderTrigger: true,
                            visibility: ({ controls }: any) =>
                                controls?.icon_type?.value === 'antd',
                        },
                    },
                ],
                [
                    {
                        name: 'icon_spacing',
                        config: {
                            type: 'TextControl',
                            label: t('Icon Spacing (px)'),
                            description: t('Margin below the icon'),
                            default: 12,
                            renderTrigger: true,
                            isInt: true,
                            visibility: ({ controls }: any) =>
                                controls?.header_mode?.value !== 'none',
                        },
                    },
                ],
            ],
        },

        // ── TYPOGRAPHY SECTION ─────────────────────────────────────
        {
            label: t('Typography'),
            expanded: false,
            controlSetRows: [
                [
                    {
                        name: 'key_font_size',
                        config: {
                            type: 'TextControl',
                            label: t('Key Font Size (px)'),
                            default: 14,
                            renderTrigger: true,
                            isInt: true,
                        },
                    },
                ],
                [
                    {
                        name: 'value_font_size',
                        config: {
                            type: 'TextControl',
                            label: t('Value Font Size (px)'),
                            default: 14,
                            renderTrigger: true,
                            isInt: true,
                        },
                    },
                ],
                [
                    {
                        name: 'key_font_weight',
                        config: {
                            type: 'SelectControl',
                            label: t('Key Font Weight'),
                            default: 400,
                            choices: [
                                [300, '300 (Light)'],
                                [400, '400 (Normal)'],
                                [500, '500 (Medium)'],
                                [600, '600 (Semi-Bold)'],
                                [700, '700 (Bold)'],
                            ],
                            renderTrigger: true,
                        },
                    },
                ],
                [
                    {
                        name: 'value_font_weight',
                        config: {
                            type: 'SelectControl',
                            label: t('Value Font Weight'),
                            default: 600,
                            choices: [
                                [300, '300 (Light)'],
                                [400, '400 (Normal)'],
                                [500, '500 (Medium)'],
                                [600, '600 (Semi-Bold)'],
                                [700, '700 (Bold)'],
                            ],
                            renderTrigger: true,
                        },
                    },
                ],
                [
                    {
                        name: 'global_key_color',
                        config: {
                            type: 'TextControl',
                            label: t('Global Key Color'),
                            description: t('CSS color for all key labels (e.g. #333333)'),
                            default: '#333333',
                            renderTrigger: true,
                        },
                    },
                ],
                [
                    {
                        name: 'global_value_color',
                        config: {
                            type: 'TextControl',
                            label: t('Global Value Color'),
                            description: t('CSS color for value text when no column override exists'),
                            default: '#000000',
                            renderTrigger: true,
                        },
                    },
                ],
                [
                    {
                        name: 'text_transform',
                        config: {
                            type: 'SelectControl',
                            label: t('Text Transform'),
                            default: 'none',
                            choices: [
                                ['none', t('None')],
                                ['uppercase', t('UPPERCASE')],
                                ['capitalize', t('Capitalize')],
                            ],
                            renderTrigger: true,
                        },
                    },
                ],
            ],
        },

        // ── LAYOUT SECTION ─────────────────────────────────────────
        {
            label: t('Layout'),
            expanded: false,
            controlSetRows: [
                [
                    {
                        name: 'alignment',
                        config: {
                            type: 'SelectControl',
                            label: t('Alignment'),
                            default: 'left',
                            choices: [
                                ['left', t('Left')],
                                ['center', t('Center')],
                                ['right', t('Right')],
                            ],
                            renderTrigger: true,
                        },
                    },
                ],
                [
                    {
                        name: 'row_spacing',
                        config: {
                            type: 'TextControl',
                            label: t('Row Spacing (px)'),
                            default: 12,
                            renderTrigger: true,
                            isInt: true,
                        },
                    },
                ],
                [
                    {
                        name: 'value_padding',
                        config: {
                            type: 'TextControl',
                            label: t('Value Padding (px)'),
                            description: t('Padding inside the value box when val_box_color is used'),
                            default: 6,
                            renderTrigger: true,
                            isInt: true,
                        },
                    },
                ],
                [
                    {
                        name: 'border_radius',
                        config: {
                            type: 'TextControl',
                            label: t('Border Radius (px)'),
                            description: t('Border radius for value box'),
                            default: 4,
                            renderTrigger: true,
                            isInt: true,
                        },
                    },
                ],
                [
                    {
                        name: 'container_padding',
                        config: {
                            type: 'TextControl',
                            label: t('Container Padding (px)'),
                            default: 16,
                            renderTrigger: true,
                            isInt: true,
                        },
                    },
                ],
                [
                    {
                        name: 'container_bg_color',
                        config: {
                            type: 'TextControl',
                            label: t('Container Background Color'),
                            description: t('CSS color for the card container background (e.g. #FFFFFF or transparent)'),
                            default: 'transparent',
                            renderTrigger: true,
                        },
                    },
                ],
                [
                    {
                        name: 'enable_shadow',
                        config: {
                            type: 'CheckboxControl',
                            label: t('Enable Shadow'),
                            default: false,
                            renderTrigger: true,
                        },
                    },
                ],
            ],
        },
    ],
};

export default config;
