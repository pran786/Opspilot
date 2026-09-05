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
import React, { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import styled from '@emotion/styled';
import { KpiDualColumnCardProps } from './types';

// ─── Fallback theme ────────────────────────────────────────────────
const fallbackTheme = {
    typography: {
        families: { sansSerif: '"Inter", Helvetica, Arial, sans-serif' },
    },
};
const getFontFamily = (theme: any): string =>
    theme?.typography?.families?.sansSerif ||
    fallbackTheme.typography.families.sansSerif;

// ─── Styled components ────────────────────────────────────────────
const CardContainer = styled.div<{
    height: number;
    width: number;
    bgColor: string;
    padding: number;
    shadow: boolean;
}>`
    height: ${({ height }) => height}px;
    width: ${({ width }) => width}px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: ${({ bgColor }) => bgColor};
    padding: ${({ padding }) => padding}px;
    box-sizing: border-box;
    font-family: ${({ theme }) => getFontFamily(theme)};
    ${({ shadow }) =>
        shadow
            ? 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);'
            : ''}
`;

const IconWrapper = styled.div<{
    centered: boolean;
    spacing: number;
}>`
    display: flex;
    justify-content: ${({ centered }) => (centered ? 'center' : 'flex-end')};
    margin-bottom: ${({ spacing }) => spacing}px;
`;

const RowWrapper = styled.div<{
    spacing: number;
    alignment: string;
}>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ spacing }) => spacing}px;
    text-align: ${({ alignment }) => alignment};
    &:last-child {
        margin-bottom: 0;
    }
`;

const KeyCell = styled.span<{
    fontSize: number;
    fontWeight: number;
    color: string;
    transform: string;
}>`
    flex: 1;
    font-size: ${({ fontSize }) => fontSize}px;
    font-weight: ${({ fontWeight }) => fontWeight};
    color: ${({ color }) => color};
    text-transform: ${({ transform }) => transform};
    line-height: 1.4;
`;

const ValueColumnWrapper = styled.div`
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
`;

const ValueCell = styled.span<{
    fontSize: number;
    fontWeight: number;
    color: string;
    transform: string;
    hasBox: boolean;
    boxColor: string;
    padding: number;
    borderRadius: number;
    uniformWidth: number;
}>`
    font-size: ${({ fontSize }) => fontSize}px;
    font-weight: ${({ fontWeight }) => fontWeight};
    color: ${({ color }) => color};
    text-transform: ${({ transform }) => transform};
    line-height: 1.4;
    text-align: center;
    ${({ uniformWidth }) =>
        uniformWidth > 0 ? `min-width: ${uniformWidth}px;` : ''}
    ${({ hasBox, boxColor, padding, borderRadius }) =>
        hasBox
            ? `
        background-color: ${boxColor};
        padding: ${padding}px ${padding * 1.5}px;
        border-radius: ${borderRadius}px;
        display: inline-block;
      `
            : ''}
`;

/** Hidden off-screen container used to measure the widest value text */
const MeasureContainer = styled.div`
    position: absolute;
    visibility: hidden;
    height: 0;
    overflow: hidden;
    white-space: nowrap;
`;

// ─── Dynamic Ant Design icon renderer ──────────────────────────────
const AntIconRenderer: React.FC<{
    iconName: string;
    size: number;
    color: string;
}> = ({ iconName, size, color }) => {
    const IconComponent = useMemo(() => {
        if (!iconName) return null;
        return React.lazy(() =>
            import('@ant-design/icons')
                .then((mod: any) => {
                    const Comp = mod[iconName];
                    if (!Comp) {
                        console.warn(
                            `[KpiDualColumnCard] Ant Design icon "${iconName}" not found.`,
                        );
                        return { default: () => null };
                    }
                    return { default: Comp };
                })
                .catch(() => ({ default: () => null })),
        );
    }, [iconName]);

    if (!IconComponent) return null;

    return (
        <Suspense fallback={null}>
            <IconComponent style={{ fontSize: size, color }} />
        </Suspense>
    );
};

// ─── Chart Error Boundary ──────────────────────────────────────────
class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('KpiDualColumnCardChart render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 16,
            color: '#e74c3c',
            fontSize: 13,
            border: '1px dashed #e74c3c',
            borderRadius: 4,
            background: '#fff5f5',
          }}
        >
          <strong>Chart Display Warning</strong>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#666' }}>
            {this.state.error?.message || 'Unable to render chart data.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main chart component ──────────────────────────────────────────
function KpiDualColumnCardChartContent(props: KpiDualColumnCardProps) {
    const { data = [], height = 400, width = 600, customize = {} as any } = props || {};
    const {
        keyColumn,
        valueColumn,
        valBoxColorColumn,
        valTextColorColumn,
        headerMode,
        iconType,
        iconName,
        svgUrl,
        uploadedIcon,
        iconSize,
        iconColor,
        iconSpacing,
        keyFontSize,
        valueFontSize,
        keyFontWeight,
        valueFontWeight,
        globalKeyColor,
        globalValueColor,
        textTransform,
        alignment,
        rowSpacing,
        valuePadding,
        borderRadius,
        containerPadding,
        containerBgColor,
        enableShadow,
    } = customize || {};

    // ── Measure uniform value‑box width ────────────────────────────
    const measureRef = useRef<HTMLDivElement>(null);
    const [uniformWidth, setUniformWidth] = useState(0);

    // Check if any row has a box color
    const hasAnyBox = useMemo(
        () =>
            Array.isArray(data) &&
            data.some(
                (r) => valBoxColorColumn && !!r?.[valBoxColorColumn],
            ),
        [data, valBoxColorColumn],
    );

    useEffect(() => {
        if (!measureRef.current || !hasAnyBox) {
            setUniformWidth(0);
            return;
        }
        const children = measureRef.current.children;
        let maxW = 0;
        for (let i = 0; i < children.length; i++) {
            const w = (children[i] as HTMLElement).offsetWidth;
            if (w > maxW) maxW = w;
        }
        // Add box padding (horizontal = padding * 1.5 * 2)
        setUniformWidth(maxW + valuePadding * 1.5 * 2);
    }, [data, valueColumn, valueFontSize, valueFontWeight, textTransform, valuePadding, hasAnyBox]);

    // ── Render icon ────────────────────────────────────────────────
    const renderIcon = () => {
        if (headerMode === 'none') return null;

        let iconElement: React.ReactNode = null;

        if (iconType === 'antd' && iconName) {
            iconElement = (
                <AntIconRenderer
                    iconName={iconName}
                    size={iconSize}
                    color={iconColor}
                />
            );
        } else if (iconType === 'svg_url' && svgUrl) {
            iconElement = (
                <img
                    src={svgUrl}
                    alt="icon"
                    width={iconSize}
                    height={iconSize}
                    style={{ objectFit: 'contain' }}
                />
            );
        } else if (iconType === 'upload' && uploadedIcon) {
            iconElement = (
                <img
                    src={uploadedIcon}
                    alt="icon"
                    width={iconSize}
                    height={iconSize}
                    style={{ objectFit: 'contain' }}
                />
            );
        }

        if (!iconElement) return null;

        return (
            <IconWrapper
                centered={headerMode === 'icon_centered'}
                spacing={iconSpacing}
            >
                {iconElement}
            </IconWrapper>
        );
    };

    // ── Render rows ────────────────────────────────────────────────
    return (
        <CardContainer
            height={height}
            width={width}
            bgColor={containerBgColor}
            padding={containerPadding}
            shadow={enableShadow}
        >
            {/* Hidden measurement container for uniform box sizing */}
            {hasAnyBox && (
                <MeasureContainer ref={measureRef}>
                    {data.map((record, idx) => (
                        <span
                            key={idx}
                            style={{
                                fontSize: valueFontSize,
                                fontWeight: valueFontWeight,
                                textTransform: textTransform as any,
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {String(record[valueColumn] ?? '')}
                        </span>
                    ))}
                </MeasureContainer>
            )}

            {renderIcon()}

            {data.map((record, index) => {
                const key = record[keyColumn] ?? '';
                const val = record[valueColumn] ?? '';

                // Box color: from column if present
                const boxColor =
                    valBoxColorColumn && record[valBoxColorColumn]
                        ? String(record[valBoxColorColumn])
                        : '';

                // Value text color priority: column > global
                const valColor =
                    valTextColorColumn && record[valTextColorColumn]
                        ? String(record[valTextColorColumn])
                        : globalValueColor;

                return (
                    <RowWrapper
                        key={index}
                        spacing={rowSpacing}
                        alignment={alignment}
                    >
                        <KeyCell
                            fontSize={keyFontSize}
                            fontWeight={keyFontWeight}
                            color={globalKeyColor}
                            transform={textTransform}
                        >
                            {String(key)}
                        </KeyCell>

                        <ValueColumnWrapper>
                            <ValueCell
                                fontSize={valueFontSize}
                                fontWeight={valueFontWeight}
                                color={valColor}
                                transform={textTransform}
                                hasBox={!!boxColor}
                                boxColor={boxColor}
                                padding={valuePadding}
                                borderRadius={borderRadius}
                                uniformWidth={boxColor ? uniformWidth : 0}
                            >
                                {String(val)}
                            </ValueCell>
                        </ValueColumnWrapper>
                    </RowWrapper>
                );
            })}
        </CardContainer>
    );
}

export default function KpiDualColumnCardChart(props: KpiDualColumnCardProps) {
  return (
    <ChartErrorBoundary>
      <KpiDualColumnCardChartContent {...props} />
    </ChartErrorBoundary>
  );
}
