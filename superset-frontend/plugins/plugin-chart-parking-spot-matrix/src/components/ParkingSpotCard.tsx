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
import { ParkingSpotMatrixCustomizeProps } from '../types';

interface ParkingSpotCardProps {
  record: Record<string, any>;
  customize: ParkingSpotMatrixCustomizeProps;
}

const CardContainer = styled.div<{
  bgColor: string;
  borderColor: string;
  fontSize: number;
}>`
  background-color: ${props => props.bgColor};
  border: 1.5px solid ${props => props.borderColor};
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: ${props => props.fontSize}px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  min-height: 120px;
`;

const HeaderBar = styled.div<{ bg: string; color: string }>`
  background-color: ${props => props.bg};
  color: ${props => props.color};
  padding: 4px 8px;
  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const PriorityBadge = styled.span<{ bg: string; color: string }>`
  background-color: ${props => props.bg};
  color: ${props => props.color};
  font-size: 0.75em;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 2px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const BodySection = styled.div`
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OrderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const WorkOrderId = styled.span`
  font-size: 1.45em;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
`;

const DueDate = styled.span`
  font-size: 0.85em;
  font-weight: 600;
  color: #4b5563;
`;

const StageBadge = styled.div<{ bg: string; color: string }>`
  background-color: ${props => props.bg};
  color: ${props => props.color};
  font-weight: 700;
  font-size: 0.95em;
  padding: 3px 6px;
  border-radius: 3px;
  text-align: center;
  margin-top: 2px;
`;

const BinTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: auto;
  border-top: 1px solid #e5e7eb;
  background-color: #fafafa;

  th {
    font-size: 0.68em;
    font-weight: 700;
    color: #6b7280;
    text-align: center;
    padding: 2px;
    border-right: 1px solid #e5e7eb;
    &:last-child {
      border-right: none;
    }
  }

  td {
    font-size: 0.95em;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
    padding: 2px;
    border-right: 1px solid #e5e7eb;
    &:last-child {
      border-right: none;
    }
  }
`;

const EmptySpot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #9ca3af;
  font-style: italic;
  font-size: 0.9em;
  padding: 16px 0;
`;

export const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ record, customize }) => {
  const c = customize || ({} as any);
  const spotId = (c.spotIdColumn && record?.[c.spotIdColumn]) || 'Bay';
  const workOrder = c.workOrderColumn ? record?.[c.workOrderColumn] : null;
  const isPriority = c.priorityColumn
    ? Boolean(record?.[c.priorityColumn]) &&
      String(record[c.priorityColumn]).toLowerCase() !== 'false' &&
      String(record[c.priorityColumn]).toLowerCase() !== '0'
    : false;
  const dueDate = c.dueDateColumn ? record?.[c.dueDateColumn] : null;
  const stageTag = c.stageTagColumn ? record?.[c.stageTagColumn] : null;
  const stageColor = c.stageColorColumn && record?.[c.stageColorColumn]
    ? record[c.stageColorColumn]
    : c.stageBadgeBgColor || '#4B5563';

  const binC1 = c.binC1Column ? record?.[c.binC1Column] : null;
  const binC2 = c.binC2Column ? record?.[c.binC2Column] : null;
  const binC3 = c.binC3Column ? record?.[c.binC3Column] : null;
  const binBC = c.binBCColumn ? record?.[c.binBCColumn] : null;
  const hasBins = binC1 !== null || binC2 !== null || binC3 !== null || binBC !== null;

  return (
    <CardContainer
      bgColor={c.cardBgColor || '#FFFFFF'}
      borderColor={c.cardBorderColor || '#E5E7EB'}
      fontSize={c.fontSize || 14}
    >
      <HeaderBar bg={c.headerBgColor || '#1F2937'} color={c.headerTextColor || '#FFFFFF'}>
        <span>{spotId}</span>
        {isPriority && (
          <PriorityBadge bg={c.priorityBadgeBgColor || '#EF4444'} color={c.priorityBadgeTextColor || '#FFFFFF'}>
            Priority
          </PriorityBadge>
        )}
      </HeaderBar>

      <BodySection>
        {workOrder ? (
          <>
            <OrderRow>
              <WorkOrderId>{workOrder}</WorkOrderId>
              {dueDate && <DueDate>{dueDate}</DueDate>}
            </OrderRow>

            {stageTag && (
              <StageBadge bg={stageColor} color={c.stageBadgeTextColor || '#FFFFFF'}>
                {stageTag}
              </StageBadge>
            )}
          </>
        ) : (
          <EmptySpot>{c.emptySpotText || 'Available'}</EmptySpot>
        )}
      </BodySection>

      {c.showBinGrid && hasBins && (
        <BinTable>
          <thead>
            <tr>
              <th>C1</th>
              <th>C2</th>
              <th>C3</th>
              <th>BC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{binC1 ?? '-'}</td>
              <td>{binC2 ?? '-'}</td>
              <td>{binC3 ?? '-'}</td>
              <td>{binBC ?? '-'}</td>
            </tr>
          </tbody>
        </BinTable>
      )}
    </CardContainer>
  );
};

export default ParkingSpotCard;
