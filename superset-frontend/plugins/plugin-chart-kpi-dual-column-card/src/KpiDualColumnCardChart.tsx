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

// ─── Built-in SVGs ────────────────────────────────────────────────
const HardHatSvg: React.FC<{
  width?: number;
  height?: number;
  color?: string;
}> = ({ width = 36, height = 36, color = '#111827' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hard hat dome */}
    <path
      d="M10 15 C10 8.5 13.5 5.5 18 5.5 C22.5 5.5 26 8.5 26 15 Z"
      fill={color}
    />
    {/* Ridge / rib lines on hardhat */}
    <line x1="18" y1="5.5" x2="18" y2="15" stroke="#FAF5E8" strokeWidth="1.5" />
    <line x1="14" y1="8" x2="14" y2="15" stroke="#FAF5E8" strokeWidth="1" />
    <line x1="22" y1="8" x2="22" y2="15" stroke="#FAF5E8" strokeWidth="1" />
    {/* Hard hat brim */}
    <path
      d="M7 15 C7 14.5 9 14 18 14 C27 14 29 14.5 29 15 C29 16 26 17 18 17 C10 17 7 16 7 15 Z"
      fill={color}
    />
    {/* Head / face */}
    <path
      d="M13 17 H23 V22 C23 24.5 20.8 26.5 18 26.5 C15.2 26.5 13 24.5 13 22 V17 Z"
      fill={color}
    />
    {/* Eyes / Visor cutout */}
    <path
      d="M15 20 H21"
      stroke="#FAF5E8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Shoulders / Torso with safety stripes */}
    <path d="M8 33 C8 28 11.5 26 18 26 C24.5 26 28 28 28 33 Z" fill={color} />
    <path d="M12.5 27.5 L11 33" stroke="#FAF5E8" strokeWidth="1.5" />
    <path d="M23.5 27.5 L25 33" stroke="#FAF5E8" strokeWidth="1.5" />
    <path d="M10 30.5 H26" stroke="#FAF5E8" strokeWidth="1" />
  </svg>
);

const ForkliftSvg: React.FC<{
  width?: number;
  height?: number;
  color?: string;
}> = ({ width = 64, height = 48, color = '#111827' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 28 H34 V12 C34 9 32 8 28 8 H20 C16 8 14 10 14 14 V28 Z"
      fill={color}
    />
    <path d="M18 12 H28 V20 H18 V12 Z" fill="#FAF5E8" />
    <path d="M6 24 C6 20 8 18 12 18 V34 H8 C6 34 6 30 6 24 Z" fill={color} />
    <rect x="38" y="4" width="4" height="34" rx="1" fill={color} />
    <rect x="44" y="8" width="3" height="30" rx="1" fill={color} />
    <rect x="36" y="26" width="12" height="4" fill={color} />
    <path d="M46 28 H58 C59 28 60 29 60 30 V31 H46 V28 Z" fill={color} />
    <circle cx="16" cy="36" r="6" fill={color} />
    <circle cx="16" cy="36" r="2.5" fill="#FAF5E8" />
    <circle cx="34" cy="36" r="6" fill={color} />
    <circle cx="34" cy="36" r="2.5" fill="#FAF5E8" />
  </svg>
);

const BlowerFanSvg: React.FC<{
  width?: number;
  height?: number;
  color?: string;
}> = ({ width = 56, height = 48, color = '#111827' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 56 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Foot mounting bracket */}
    <rect x="12" y="42" width="22" height="3" rx="1.5" fill={color} />
    <rect x="18" y="38" width="10" height="4" fill={color} />
    {/* Volute / Scroll outer casing */}
    <path
      d="M23 10 C14 10 7 17 7 26 C7 35 14 42 24 42 C33 42 40 35 40 26 V12 H34 V8 H46 V14 H43 V26 C43 37 34 44 23 44 C11 44 4 35 4 25 C4 14 13 7 24 7 H34 V10 Z"
      fill={color}
    />
    {/* Outlet duct top flange */}
    <rect x="34" y="6" width="13" height="3.5" rx="1" fill={color} />
    {/* Center impeller hub */}
    <circle
      cx="22"
      cy="26"
      r="11"
      stroke={color}
      strokeWidth="2.2"
      fill="none"
    />
    <circle cx="22" cy="26" r="3.5" fill={color} />
    {/* Curved fan blades */}
    <path
      d="M22 22.5 C22 17.5 25 15.5 28 16.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M25.5 26 C29 27 31 29 30 32"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M22 29.5 C21 34 18.5 35.5 15.5 34.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M18.5 26 C15 25 13 22.5 14.5 19.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// ─── Styled components ────────────────────────────────────────────
const CardContainer = styled.div<{
  height: number;
  width: number;
  bgColor: string;
  padding: number;
  shadow: boolean;
  borderRadius?: number;
}>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
  border-radius: ${({ borderRadius }) => borderRadius || 0}px;
  padding: ${({ padding }) => padding}px;
  box-sizing: border-box;
  font-family: ${({ theme }) => getFontFamily(theme)};
  ${({ shadow }) =>
    shadow ? 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);' : ''}
`;

const CardHeader = styled.div<{
  centered: boolean;
  spacing: number;
}>`
  display: flex;
  justify-content: ${({ centered }) => (centered ? 'center' : 'space-between')};
  align-items: center;
  margin-bottom: ${({ spacing }) => spacing}px;
  width: 100%;
`;

const CardTitle = styled.div<{
  fontSize?: number;
  color?: string;
}>`
  font-size: ${({ fontSize }) => fontSize || 13}px;
  font-weight: 800;
  color: ${({ color }) => color || '#6B7280'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  const {
    data = [],
    height = 400,
    width = 600,
    customize = {} as any,
  } = props || {};
  const {
    keyColumn,
    valueColumn,
    valBoxColorColumn,
    valTextColorColumn,
    groupColumn,
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
      data.some(r => valBoxColorColumn && !!r?.[valBoxColorColumn]),
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
  }, [
    data,
    valueColumn,
    valueFontSize,
    valueFontWeight,
    textTransform,
    valuePadding,
    hasAnyBox,
  ]);

  // ── Render icon ────────────────────────────────────────────────
  const renderIcon = () => {
    if (headerMode === 'none') return null;

    let iconElement: React.ReactNode = null;

    if (iconType === 'hardhat' || iconName === 'hardhat') {
      iconElement = (
        <HardHatSvg
          width={iconSize || 32}
          height={iconSize || 32}
          color={iconColor || '#111827'}
        />
      );
    } else if (iconType === 'forklift' || iconName === 'forklift') {
      iconElement = (
        <ForkliftSvg
          width={iconSize || 64}
          height={iconSize || 48}
          color={iconColor || '#111827'}
        />
      );
    } else if (iconType === 'blower' || iconName === 'blower') {
      iconElement = (
        <BlowerFanSvg
          width={iconSize || 56}
          height={iconSize || 48}
          color={iconColor || '#111827'}
        />
      );
    } else if (iconType === 'antd' && iconName) {
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

    return iconElement;
  };

  const renderHeader = () => {
    const iconEl = renderIcon();
    const title = customize.titleText;
    if (!iconEl && !title) return null;

    const isCentered = headerMode === 'icon_centered' && !title;

    return (
      <CardHeader centered={isCentered} spacing={iconSpacing || 10}>
        {title && (
          <CardTitle
            fontSize={customize.titleFontSize}
            color={customize.titleColor}
          >
            {title}
          </CardTitle>
        )}
        {iconEl}
      </CardHeader>
    );
  };

  // ── Group data if groupColumn is present ────────────────────────
  const groups = useMemo(() => {
    if (!groupColumn) {
      return [{ groupKey: '', records: data }];
    }
    const map = new Map<string, typeof data>();
    data.forEach(r => {
      const k = String(r[groupColumn] || '');
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    });
    return Array.from(map.entries()).map(([groupKey, records]) => ({
      groupKey,
      records,
    }));
  }, [data, groupColumn]);

  const renderGroupIcon = (groupKey: string) => {
    const k = groupKey.toLowerCase();
    if (k.includes('forklift')) {
      return (
        <ForkliftSvg
          width={iconSize || 54}
          height={iconSize ? Math.round(iconSize * 0.75) : 40}
          color={iconColor || '#111827'}
        />
      );
    }
    if (k.includes('blower')) {
      return (
        <BlowerFanSvg
          width={iconSize || 48}
          height={iconSize ? Math.round(iconSize * 0.75) : 40}
          color={iconColor || '#111827'}
        />
      );
    }
    if (k.includes('hardhat')) {
      return (
        <HardHatSvg
          width={iconSize || 32}
          height={iconSize || 32}
          color={iconColor || '#111827'}
        />
      );
    }
    return renderIcon();
  };

  // ── Render rows ────────────────────────────────────────────────
  return (
    <CardContainer
      height={height}
      width={width}
      bgColor={containerBgColor}
      padding={containerPadding}
      shadow={enableShadow}
      borderRadius={borderRadius}
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

      {!groupColumn && renderHeader()}

      {groups.map((group, groupIdx) => (
        <div
          key={groupIdx}
          style={
            groupIdx > 0
              ? { marginTop: Math.round((rowSpacing || 12) * 1.5) }
              : undefined
          }
        >
          {groupColumn && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: iconSpacing || 8,
              }}
            >
              {renderGroupIcon(group.groupKey)}
            </div>
          )}
          {group.records.map((record, index) => {
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
        </div>
      ))}
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
