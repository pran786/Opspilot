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

interface ElevatorGraphicProps {
  doorColor: string;
  frameColor: string;
  arrowColor: string;
  direction?: string;
  floor?: string;
  status?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ArrowIndicator = styled.div<{ color: string; direction: string }>`
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  ${props =>
    props.direction === 'up'
      ? `border-bottom: 24px solid ${props.color};`
      : `border-top: 24px solid ${props.color};`}
  animation: bounce 1.5s infinite;

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(${props => (props.direction === 'up' ? '-6px' : '6px')}); }
  }
`;

const ShaftFrame = styled.div<{ frameColor: string }>`
  width: 170px;
  height: 220px;
  border: 8px solid ${props => props.frameColor};
  border-radius: 6px;
  background-color: #f3f4f6;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Transom = styled.div`
  height: 36px;
  background-color: #e5e7eb;
  border-bottom: 4px solid #111827;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DirectionIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid #111827;
  }
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid #111827;
  }
`;

const DoorsContainer = styled.div`
  flex: 1;
  display: flex;
  background-color: #374151;
  padding: 4px;
  gap: 4px;
`;

const DoorPanel = styled.div<{ color: string }>`
  flex: 1;
  background-color: ${props => props.color};
  border: 2px solid #7c2d12;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DoorSeam = styled.div`
  width: 3px;
  height: 100%;
  background-color: #111827;
`;

export const ElevatorGraphic: React.FC<ElevatorGraphicProps> = ({
  doorColor,
  frameColor,
  arrowColor,
  direction = 'down',
}) => {
  const dir = direction.toLowerCase().includes('up') ? 'up' : 'down';

  return (
    <Wrapper>
      <ArrowIndicator color={arrowColor} direction={dir} />
      <ShaftFrame frameColor={frameColor}>
        <Transom>
          <DirectionIcon />
        </Transom>
        <DoorsContainer>
          <DoorPanel color={doorColor} />
          <DoorSeam />
          <DoorPanel color={doorColor} />
        </DoorsContainer>
      </ShaftFrame>
    </Wrapper>
  );
};

export default ElevatorGraphic;
