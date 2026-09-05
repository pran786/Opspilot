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
import styled from '@emotion/styled';
import { UnifiedListBarChartProps } from './types';
import { Row } from './components/Row';

// Fallback theme values
const fallbackTheme = {
  typography: {
    families: {
      sansSerif: '"Inter", Helvetica, Arial, sans-serif',
    },
    weights: {
      bold: 700,
      normal: 400,
    },
  },
  gridUnit: 4,
  colors: {
    grayscale: {
      light2: '#E0E0E0',
      light5: '#F5F5F5',
      base: '#484848',
      dark1: '#262626',
    },
  },
};

const getTheme = (theme: any) => theme || fallbackTheme;

export const Styles = styled.div<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: ${({ theme }) =>
    getTheme(theme)?.typography?.families?.sansSerif ||
    fallbackTheme.typography.families.sansSerif};
`;

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
    console.error('UnifiedListArrowChart render error:', error, errorInfo);
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

function UnifiedListArrowChartContent(props: UnifiedListBarChartProps) {
  const { data = [], height = 400, width = 600, customize = {} as any } = props || {};

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Styles height={height} width={width}>
        <div style={{ padding: 16, color: '#888', textAlign: 'center' }}>
          No data available
        </div>
      </Styles>
    );
  }

  return (
    <Styles height={height} width={width}>
      {data.map((record, index) => (
        <Row
          key={index}
          record={record}
          customize={customize}
        />
      ))}
    </Styles>
  );
}

export default function UnifiedListArrowChart(props: UnifiedListBarChartProps) {
  return (
    <ChartErrorBoundary>
      <UnifiedListArrowChartContent {...props} />
    </ChartErrorBoundary>
  );
}
