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
import { BulkLoadingCardProps } from './types';
import TankerTruckSvg from './components/TankerTruckSvg';

const Container = styled.div<{ width: number; height: number; bg: string; border: string }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => props.bg};
  border: 1px solid ${props => props.border};
  border-radius: 4px;
  padding: 12px 16px;
  box-sizing: border-box;
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.div`
  font-size: 1.15em;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 4px;
`;

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 12px;
  &:last-child {
    border-bottom: none;
  }
`;

const MaterialInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 140px;
`;

const WorkOrderId = styled.div<{ fontSize: number }>`
  font-size: ${props => props.fontSize}px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
`;

const MaterialName = styled.div`
  font-size: 0.82em;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
`;

const FlowCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: center;
`;

const StatusPipeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const ChevronBadge = styled.div<{ bg: string; active?: boolean }>`
  background-color: ${props => props.bg};
  color: #ffffff;
  font-size: 0.65em;
  font-weight: 800;
  padding: 2px 10px;
  clip-path: polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%);
  text-align: left;
  letter-spacing: 0.5px;
  opacity: ${props => (props.active ? 1 : 0.45)};
  box-shadow: ${props => (props.active ? '0 1px 3px rgba(0,0,0,0.2)' : 'none')};
`;

const DestinationBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TankBadge = styled.div<{ color: string }>`
  font-size: 1.5em;
  font-weight: 800;
  color: ${props => props.color};
`;

const TimerText = styled.div<{ color: string }>`
  font-size: 1.5em;
  font-weight: 800;
  color: ${props => props.color};
  font-family: 'Fira Code', 'Roboto Mono', monospace;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-style: italic;
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
    console.error('BulkLoadingCardChart render error:', error, errorInfo);
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
            {this.state.error?.message || 'Unable to render bulk loading card.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const BulkLoadingCardChartContent: React.FC<BulkLoadingCardProps> = ({
  width = 400,
  height = 400,
  data = [],
  customize = {} as any,
}) => {
  const c = customize || ({} as any);
  const cardBgColor = c.cardBgColor || '#FFFFFF';
  const cardBorderColor = c.cardBorderColor || '#E5E7EB';
  const titleText = c.titleText || 'Bulk Loading';

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Container width={width} height={height} bg={cardBgColor} border={cardBorderColor}>
        <SectionTitle>{titleText}</SectionTitle>
        <EmptyState>No Active Bulk Loading Operations</EmptyState>
      </Container>
    );
  }

  return (
    <Container width={width} height={height} bg={cardBgColor} border={cardBorderColor}>
      <SectionTitle>{titleText}</SectionTitle>
      {data.map((record, index) => {
        const workOrder = (c.workOrderColumn && record?.[c.workOrderColumn]) || `WO-${index + 1}`;
        const materialName = c.materialNameColumn ? record?.[c.materialNameColumn] : '';
        const currentStatus = c.statusColumn && record?.[c.statusColumn] ? String(record[c.statusColumn]).toUpperCase() : 'LOADING';
        const destinationTank = c.destinationTankColumn && record?.[c.destinationTankColumn] ? record[c.destinationTankColumn] : 'BK-1';
        const elapsedTime = c.elapsedTimeColumn && record?.[c.elapsedTimeColumn] ? record[c.elapsedTimeColumn] : null;

        return (
          <LoadingRow key={String(workOrder) + index}>
            <MaterialInfo>
              <WorkOrderId fontSize={c.workOrderFontSize || 22}>{workOrder}</WorkOrderId>
              {materialName && <MaterialName>{materialName}</MaterialName>}
            </MaterialInfo>

            <FlowCenter>
              {c.showTruckGraphic && index === 0 && <TankerTruckSvg width={120} height={50} />}

              {c.showStatusPipeline && (
                <StatusPipeline>
                  <ChevronBadge bg="#F59E0B" active={currentStatus.includes('LOAD')}>
                    LOADING
                  </ChevronBadge>
                  <ChevronBadge bg="#DC2626" active={currentStatus.includes('AWAIT')}>
                    AWAITING QC
                  </ChevronBadge>
                  <ChevronBadge bg="#10B981" active={currentStatus.includes('APPROV')}>
                    QC APPROVED
                  </ChevronBadge>
                  <ChevronBadge bg="#B91C1C" active={currentStatus.includes('REJECT')}>
                    QC REJECTED
                  </ChevronBadge>
                </StatusPipeline>
              )}
            </FlowCenter>

            <DestinationBlock>
              <TankBadge color={c.tankBadgeColor || '#111827'}>{destinationTank}</TankBadge>
              {elapsedTime && <TimerText color={c.timerColor || '#111827'}>{elapsedTime}</TimerText>}
            </DestinationBlock>
          </LoadingRow>
        );
      })}
    </Container>
  );
};

export const BulkLoadingCardChart: React.FC<BulkLoadingCardProps> = (props) => {
  return (
    <ChartErrorBoundary>
      <BulkLoadingCardChartContent {...props} />
    </ChartErrorBoundary>
  );
};

export default BulkLoadingCardChart;

