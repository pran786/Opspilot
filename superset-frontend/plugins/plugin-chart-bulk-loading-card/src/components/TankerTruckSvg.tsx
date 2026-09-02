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

export const TankerTruckSvg: React.FC<{ width?: number; height?: number }> = ({
  width = 180,
  height = 70,
}) => (
  <svg
    viewBox="0 0 240 90"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cabin */}
    <path
      d="M10 65 L10 32 Q10 22 22 22 L45 22 L58 40 L65 40 L65 65 Z"
      fill="#E5E7EB"
      stroke="#4B5563"
      strokeWidth="2.5"
    />
    <path
      d="M24 28 L42 28 L53 42 L24 42 Z"
      fill="#93C5FD"
      stroke="#4B5563"
      strokeWidth="1.5"
    />
    {/* Front Bumper & Grill */}
    <rect x="6" y="52" width="6" height="15" rx="1.5" fill="#374151" />
    <rect x="8" y="44" width="4" height="6" fill="#FBBF24" />

    {/* Tanker Body */}
    <rect
      x="70"
      y="16"
      width="160"
      height="48"
      rx="24"
      fill="url(#tanker-grad)"
      stroke="#4B5563"
      strokeWidth="2.5"
    />
    <line x1="120" y1="16" x2="120" y2="64" stroke="#9CA3AF" strokeWidth="1.5" />
    <line x1="170" y1="16" x2="170" y2="64" stroke="#9CA3AF" strokeWidth="1.5" />

    {/* Chassis & Hose */}
    <rect x="60" y="60" width="170" height="8" rx="2" fill="#374151" />

    {/* Wheels */}
    {/* Front Wheel */}
    <circle cx="32" cy="72" r="14" fill="#1F2937" stroke="#111827" strokeWidth="2" />
    <circle cx="32" cy="72" r="7" fill="#9CA3AF" />

    {/* Rear Wheels */}
    <circle cx="150" cy="72" r="14" fill="#1F2937" stroke="#111827" strokeWidth="2" />
    <circle cx="150" cy="72" r="7" fill="#9CA3AF" />
    <circle cx="180" cy="72" r="14" fill="#1F2937" stroke="#111827" strokeWidth="2" />
    <circle cx="180" cy="72" r="7" fill="#9CA3AF" />
    <circle cx="210" cy="72" r="14" fill="#1F2937" stroke="#111827" strokeWidth="2" />
    <circle cx="210" cy="72" r="7" fill="#9CA3AF" />

    <defs>
      <linearGradient id="tanker-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#E5E7EB" />
        <stop offset="100%" stopColor="#D1D5DB" />
      </linearGradient>
    </defs>
  </svg>
);

export default TankerTruckSvg;
