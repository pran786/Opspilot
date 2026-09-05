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
import { ParkingSpotMatrixProps } from './types';
import ParkingSpotCard from './components/ParkingSpotCard';

const MatrixWrapper = styled.div<{ width: number; height: number }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: auto;
  padding: 4px;
  box-sizing: border-box;
`;

const Grid = styled.div<{ columns: number; gap: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, minmax(0, 1fr));
  gap: ${props => props.gap}px;
  width: 100%;
  box-sizing: border-box;
`;

const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  font-size: 14px;
`;

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
    console.error('ParkingSpotMatrixChart render error:', error, errorInfo);
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
            {this.state.error?.message || 'Unable to render parking spot matrix.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ParkingSpotMatrixChartContent: React.FC<ParkingSpotMatrixProps> = ({
  width = 400,
  height = 400,
  data = [],
  customize = {} as any,
}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <EmptyContainer>No Parking Spot Data Available</EmptyContainer>;
  }

  const columnsCount = Number(customize?.columnsCount) || 3;
  const cardGap = Number(customize?.cardGap) || 8;
  const spotIdCol = customize?.spotIdColumn || '';

  return (
    <MatrixWrapper width={width} height={height}>
      <Grid columns={columnsCount} gap={cardGap}>
        {data.map((record, index) => (
          <ParkingSpotCard
            key={String((spotIdCol && record?.[spotIdCol]) || index)}
            record={record}
            customize={customize || {}}
          />
        ))}
      </Grid>
    </MatrixWrapper>
  );
};

export const ParkingSpotMatrixChart: React.FC<ParkingSpotMatrixProps> = (props) => {
  return (
    <ChartErrorBoundary>
      <ParkingSpotMatrixChartContent {...props} />
    </ChartErrorBoundary>
  );
};

export default ParkingSpotMatrixChart;

