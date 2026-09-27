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
import {
  CategoricalScheme,
  ColorScheme,
  ColorSchemeConfig,
  getCategoricalSchemeRegistry,
  getSequentialSchemeRegistry,
  SequentialScheme,
  SequentialSchemeConfig,
  CategoricalAirbnb,
  CategoricalD3,
  CategoricalEcharts,
  CategoricalGoogle,
  CategoricalLyft,
  CategoricalPreset,
  CategoricalSuperset,
  SequentialCommon,
  SequentialD3,
  ColorSchemeRegistry,
  ColorSchemeGroup,
  CategoricalPresetSuperset,
  CategoricalModernSunset,
  CategoricalColorsOfRainbow,
  CategoricalBlueToGreen,
  CategoricalRedToYellow,
  CategoricalWavesOfBlue,
} from '@superset-ui/core';

function registerColorSchemes<T extends ColorScheme>(
  registry: ColorSchemeRegistry<T>,
  colorSchemes: T[],
  standardDefaultKey: string,
) {
  colorSchemes.forEach(scheme => {
    registry.registerValue(scheme.id, scheme);
  });

  const defaultKey =
    colorSchemes.find(scheme => scheme.isDefault)?.id || standardDefaultKey;
  registry.setDefaultKey(defaultKey);
}

export default function setupColors(
  extraCategoricalColorSchemeConfigs: ColorSchemeConfig[] = [],
  extraSequentialColorSchemeConfigs: SequentialSchemeConfig[] = [],
) {
  const extraCategoricalColorSchemes = extraCategoricalColorSchemeConfigs.map(
    config =>
      new CategoricalScheme({ ...config, group: ColorSchemeGroup.Custom }),
  );
  const extraSequentialColorSchemes = extraSequentialColorSchemeConfigs.map(
    config => new SequentialScheme(config),
  );
  const builtInOpsPilotSchemes = [
    new CategoricalScheme({
      id: 'risk_meter_yellow_to_green',
      label: 'Risk Meter Theme (Yellow to Green)',
      group: ColorSchemeGroup.Custom,
      colors: ['#EAB308', '#16A34A'],
    }),
    new CategoricalScheme({
      id: 'risk_meter_red_yellow_green',
      label: 'Risk Meter Theme (Red - Yellow - Green)',
      group: ColorSchemeGroup.Custom,
      colors: ['#DC2626', '#EAB308', '#16A34A'],
    }),
    new CategoricalScheme({
      id: 'risk_meter',
      label: 'Risk Meter Theme (Green to Red)',
      group: ColorSchemeGroup.Custom,
      colors: ['#008450', '#D19900', '#B81D13'],
    }),
  ];

  registerColorSchemes(
    getCategoricalSchemeRegistry(),
    [
      ...CategoricalAirbnb,
      ...CategoricalD3,
      ...CategoricalEcharts,
      ...CategoricalGoogle,
      ...CategoricalLyft,
      ...CategoricalPreset,
      ...CategoricalSuperset,
      ...CategoricalPresetSuperset,
      ...CategoricalModernSunset,
      ...CategoricalColorsOfRainbow,
      ...CategoricalBlueToGreen,
      ...CategoricalRedToYellow,
      ...CategoricalWavesOfBlue,
      ...builtInOpsPilotSchemes,
      ...extraCategoricalColorSchemes,
    ],
    'supersetColors',
  );
  registerColorSchemes(
    getSequentialSchemeRegistry(),
    [...SequentialCommon, ...SequentialD3, ...extraSequentialColorSchemes],
    'superset_seq_1',
  );
}
