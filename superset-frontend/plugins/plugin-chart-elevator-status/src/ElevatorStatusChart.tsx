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
import { ElevatorStatusProps } from './types';
import ElevatorGraphic from './components/ElevatorGraphic';

const Container = styled.div<{ width: number; height: number }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

const InfoRow = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const FloorBadge = styled.div`
  font-size: 1.25em;
  font-weight: 800;
  color: #111827;
`;

const PayloadText = styled.div`
  font-size: 0.9em;
  font-weight: 600;
  color: #4b5563;
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
    console.error('ElevatorStatusChart render error:', error, errorInfo);
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
            {this.state.error?.message || 'Unable to render elevator status.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ElevatorStatusChartContent: React.FC<ElevatorStatusProps> = ({
  width = 400,
  height = 400,
  data = [],
  customize = {} as any,
}) => {
  const c = customize || ({} as any);
  const currentRecord: Record<string, any> = data && Array.isArray(data) && data.length > 0 ? data[0] : {};
  const direction = c.directionColumn && currentRecord[c.directionColumn] ? String(currentRecord[c.directionColumn] || 'down') : 'down';
  const floor = c.floorColumn && currentRecord[c.floorColumn] ? String(currentRecord[c.floorColumn] || '') : '';
  const payload = c.payloadColumn && currentRecord[c.payloadColumn] ? String(currentRecord[c.payloadColumn] || '') : '';
  const status = c.statusColumn && currentRecord[c.statusColumn] ? String(currentRecord[c.statusColumn] || '') : '';

  return (
    <Container width={width} height={height}>
      <ElevatorGraphic
        doorColor={c.doorColor}
        frameColor={c.frameColor}
        arrowColor={c.arrowColor}
        direction={direction}
        floor={floor}
        status={status}
      />
      {(floor || payload || status) && (
        <InfoRow>
          {floor && <FloorBadge>{floor}</FloorBadge>}
          {payload && <PayloadText>{payload}</PayloadText>}
        </InfoRow>
      )}
    </Container>
  );
};

export const ElevatorStatusChart: React.FC<ElevatorStatusProps> = (props) => {
  return (
    <ChartErrorBoundary>
      <ElevatorStatusChartContent {...props} />
    </ChartErrorBoundary>
  );
};

export default ElevatorStatusChart;

