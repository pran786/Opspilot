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

const Container = styled.div<{
  width: number;
  height: number;
  bg: string;
  border: string;
}>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => props.bg};
  border: ${props => props.border || 'none'};
  border-radius: 4px;
  padding: 8px 12px;
  box-sizing: border-box;
  overflow: auto;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

const SectionTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: -0.3px;
`;

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child {
    border-bottom: none;
  }
`;

const MaterialInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 170px;
`;

const SubLabel = styled.div<{ color?: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.color || '#9ca3af'};
  letter-spacing: 0.5px;
  min-height: 14px;
`;

const WorkOrderId = styled.div<{ fontSize: number }>`
  font-size: ${props => props.fontSize}px;
  font-weight: 800;
  color: #0f2f57;
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

const MaterialName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #2b6cb0;
  text-transform: uppercase;
  margin-top: 2px;
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
  gap: 2.5px;
`;

const ChevronBadge = styled.div<{ bg: string; active?: boolean }>`
  background-color: ${props => props.bg};
  color: #ffffff;
  font-size: 0.62em;
  font-weight: 800;
  padding: 2px 12px;
  clip-path: polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%);
  text-align: left;
  letter-spacing: 0.5px;
  opacity: ${props => (props.active ? 1 : 0.85)};
  box-shadow: ${props =>
    props.active ? '0 1px 3px rgba(0,0,0,0.15)' : 'none'};
`;

const HorizontalArrow = styled.div`
  width: 100px;
  height: 22px;
  background-color: #eee9dc;
  clip-path: polygon(
    0% 30%,
    75% 30%,
    75% 0%,
    100% 50%,
    75% 100%,
    75% 70%,
    0% 70%
  );
`;

const DestinationBlock = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 28px;
  min-width: 140px;
  justify-content: flex-end;
`;

const SubCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
`;

const TankBadge = styled.div<{ color: string }>`
  font-size: 26px;
  font-weight: 800;
  color: ${props => props.color};
  line-height: 1.1;
`;

const TimerText = styled.div<{ color: string }>`
  font-size: 26px;
  font-weight: 800;
  color: ${props => props.color};
  line-height: 1.1;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  const cardBgColor = c.cardBgColor || 'transparent';
  const cardBorderColor = c.cardBorderColor || 'none';
  const titleText = c.titleText || 'Bulk Loading';

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Container
        width={width}
        height={height}
        bg={cardBgColor}
        border={cardBorderColor}
      >
        <HeaderRow>
          <SectionTitle>{titleText}</SectionTitle>
          {c.showTruckGraphic !== false && (
            <TankerTruckSvg width={180} height={56} />
          )}
        </HeaderRow>
        <EmptyState>No Active Bulk Loading Operations</EmptyState>
      </Container>
    );
  }

  return (
    <Container
      width={width}
      height={height}
      bg={cardBgColor}
      border={cardBorderColor}
    >
      <HeaderRow>
        <SectionTitle>{titleText}</SectionTitle>
        {c.showTruckGraphic !== false && (
          <TankerTruckSvg width={180} height={56} />
        )}
      </HeaderRow>
      {data.map((record, index) => {
        const workOrder =
          (c.workOrderColumn && record?.[c.workOrderColumn]) ||
          record?.work_order ||
          `WO-${index + 1}`;
        const materialName =
          (c.materialNameColumn && record?.[c.materialNameColumn]) ||
          record?.material_name ||
          '';
        const currentStatus = (
          c.statusColumn && record?.[c.statusColumn]
            ? String(record[c.statusColumn])
            : record?.status
              ? String(record.status)
              : 'LOADING'
        ).toUpperCase();
        const destinationTank =
          (c.destinationTankColumn && record?.[c.destinationTankColumn]) ||
          record?.destination_tank ||
          (index === 0 ? 'BK-2' : 'BK-4');
        const elapsedTime =
          (c.elapsedTimeColumn && record?.[c.elapsedTimeColumn]) ||
          record?.elapsed_time ||
          null;
        const isPipeline = index === 0 || currentStatus.includes('LOAD');

        return (
          <LoadingRow key={String(workOrder) + index}>
            <MaterialInfo>
              <SubLabel color={index === 0 ? '#EAB308' : '#94A3B8'}>
                {record?.order_label || (index === 0 ? 'Dfwlyh' : 'Xsfrp lqj')}
              </SubLabel>
              <WorkOrderId fontSize={c.workOrderFontSize || 26}>
                {workOrder}
              </WorkOrderId>
              {materialName && <MaterialName>{materialName}</MaterialName>}
            </MaterialInfo>

            <FlowCenter>
              {isPipeline ? (
                <StatusPipeline>
                  <ChevronBadge
                    bg="#F59E0B"
                    active={currentStatus.includes('LOAD')}
                  >
                    LOADING
                  </ChevronBadge>
                  <ChevronBadge
                    bg="#DC2626"
                    active={currentStatus.includes('AWAIT')}
                  >
                    AWAITING QC
                  </ChevronBadge>
                  <ChevronBadge
                    bg="#10B981"
                    active={currentStatus.includes('APPROV')}
                  >
                    QC APPROVED
                  </ChevronBadge>
                  <ChevronBadge
                    bg="#DC2626"
                    active={currentStatus.includes('REJECT')}
                  >
                    QC REJECTED
                  </ChevronBadge>
                </StatusPipeline>
              ) : (
                <HorizontalArrow />
              )}
            </FlowCenter>

            <DestinationBlock>
              <SubCol>
                <SubLabel>
                  {record?.tank_label || (index === 0 ? 'Wdqn' : '')}
                </SubLabel>
                <TankBadge color={c.tankBadgeColor || '#0F2F57'}>
                  {destinationTank}
                </TankBadge>
              </SubCol>
              <SubCol>
                <SubLabel>
                  {record?.timer_label || (index === 0 ? 'Wlp h#lq#Ed|' : '')}
                </SubLabel>
                {elapsedTime ? (
                  <TimerText color={c.timerColor || '#0F2F57'}>
                    {elapsedTime}
                  </TimerText>
                ) : (
                  <div style={{ minHeight: 26 }} />
                )}
              </SubCol>
            </DestinationBlock>
          </LoadingRow>
        );
      })}
    </Container>
  );
};

export const BulkLoadingCardChart: React.FC<BulkLoadingCardProps> = props => {
  return (
    <ChartErrorBoundary>
      <BulkLoadingCardChartContent {...props} />
    </ChartErrorBoundary>
  );
};

export default BulkLoadingCardChart;
