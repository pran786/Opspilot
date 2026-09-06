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
import React from 'react';
import { UnifiedListBarChartProps } from './types';
import { Styles } from './styles';
import { Row } from './components/Row';

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
    console.error('UnifiedListBarChart render error:', error, errorInfo);
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

function UnifiedListBarChartContent(props: UnifiedListBarChartProps) {
  const {
    data = [],
    height = 400,
    width = 600,
    customize = {} as any,
  } = props || {};
  const {
    metricColumn,
    maxMetricColumn,
    headerTitle,
    headerSubtitle,
    headerSubtitleColor = '#2B6CB0',
    headerBadge,
    headerBadgeColor = '#DC2626',
  } = customize || {};

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Styles height={height} width={width}>
        {headerTitle && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#9CA3AF',
                  letterSpacing: '-0.3px',
                }}
              >
                {headerTitle}
              </span>
              {headerBadge && (
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: headerBadgeColor,
                  }}
                >
                  {headerBadge}
                </span>
              )}
            </div>
            {headerSubtitle && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: headerSubtitleColor,
                  paddingLeft: 135,
                  marginTop: -2,
                }}
              >
                {headerSubtitle}
              </span>
            )}
          </div>
        )}
        <div style={{ padding: 16, color: '#888', textAlign: 'center' }}>
          No data available
        </div>
      </Styles>
    );
  }

  // Calculate Max Metric for Bars if not provided via column
  let maxMetricValue = 0;
  if (metricColumn && Array.isArray(data) && data.length > 0) {
    const vals = data.map(d => Number(d[metricColumn]) || 0);
    maxMetricValue = vals.length > 0 ? Math.max(...vals) : 0;
  }

  return (
    <Styles height={height} width={width}>
      {headerTitle && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 8,
            paddingLeft: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#9CA3AF',
                letterSpacing: '-0.3px',
              }}
            >
              {headerTitle}
            </span>
            {headerBadge && (
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: headerBadgeColor,
                }}
              >
                {headerBadge}
              </span>
            )}
          </div>
          {headerSubtitle && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: headerSubtitleColor,
                paddingLeft: 135,
                marginTop: -2,
              }}
            >
              {headerSubtitle}
            </span>
          )}
        </div>
      )}
      {data.map((record, index) => {
        // Determine row-specific max
        let rowMax = maxMetricValue;
        if (maxMetricColumn && record) {
          rowMax = (record[maxMetricColumn] as number) || 0;
        }

        return (
          <Row
            key={index}
            record={record}
            customize={customize}
            maxMetricValue={rowMax}
          />
        );
      })}
    </Styles>
  );
}

export default function UnifiedListBarChart(props: UnifiedListBarChartProps) {
  return (
    <ChartErrorBoundary>
      <UnifiedListBarChartContent {...props} />
    </ChartErrorBoundary>
  );
}
