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

export const ElevatorStatusChart: React.FC<ElevatorStatusProps> = ({
  width,
  height,
  data,
  customize,
}) => {
  const currentRecord: Record<string, any> = data && data.length > 0 ? data[0] : {};
  const direction = customize.directionColumn ? String(currentRecord[customize.directionColumn] || 'down') : 'down';
  const floor = customize.floorColumn ? String(currentRecord[customize.floorColumn] || '') : '';
  const payload = customize.payloadColumn ? String(currentRecord[customize.payloadColumn] || '') : '';
  const status = customize.statusColumn ? String(currentRecord[customize.statusColumn] || '') : '';

  return (
    <Container width={width} height={height}>
      <ElevatorGraphic
        doorColor={customize.doorColor}
        frameColor={customize.frameColor}
        arrowColor={customize.arrowColor}
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

export default ElevatorStatusChart;
