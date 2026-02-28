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
import { QueryFormData, TimeseriesDataRecord } from '@superset-ui/core';

// ── Header / Icon enums ────────────────────────────────────────────
export type HeaderMode = 'none' | 'icon_above_value' | 'icon_centered';
export type IconType = 'none' | 'antd' | 'svg_url';
export type TextTransform = 'none' | 'uppercase' | 'capitalize';
export type Alignment = 'left' | 'center' | 'right';

// ── Customize props (control‑panel‑driven) ─────────────────────────
export interface KpiDualColumnCardCustomizeProps {
    // Data columns
    keyColumn: string;
    valueColumn: string;
    valBoxColorColumn?: string;
    valTextColorColumn?: string;

    // Header / Icon
    headerMode: HeaderMode;
    iconType: IconType;
    iconName: string;
    svgUrl: string;
    iconSize: number;
    iconColor: string;
    iconSpacing: number;

    // Typography
    keyFontSize: number;
    valueFontSize: number;
    keyFontWeight: number;
    valueFontWeight: number;
    globalKeyColor: string;
    globalValueColor: string;
    textTransform: TextTransform;

    // Layout
    alignment: Alignment;
    rowSpacing: number;
    valuePadding: number;
    borderRadius: number;
    containerPadding: number;
    containerBgColor: string;
    enableShadow: boolean;
}

// ── Styles props (width / height from Superset) ────────────────────
export interface KpiDualColumnCardStylesProps {
    height: number;
    width: number;
}

// ── Combined chart component props ─────────────────────────────────
export interface KpiDualColumnCardProps extends KpiDualColumnCardStylesProps {
    data: TimeseriesDataRecord[];
    customize: KpiDualColumnCardCustomizeProps;
}

// ── Query form data ────────────────────────────────────────────────
export type KpiDualColumnCardQueryFormData = QueryFormData &
    KpiDualColumnCardStylesProps &
    KpiDualColumnCardCustomizeProps;
