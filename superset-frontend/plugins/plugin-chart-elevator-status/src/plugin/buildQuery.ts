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
  buildQueryContext,
  QueryFormData,
  QueryFormColumn,
} from '@superset-ui/core';

export default function buildQuery(formData: QueryFormData) {
  const columns: QueryFormColumn[] = [];

  const addCol = (col?: QueryFormColumn) => {
    if (col && !columns.includes(col)) {
      columns.push(col);
    }
  };

  addCol(formData.status_column);
  addCol(formData.floor_column);
  addCol(formData.direction_column);
  addCol(formData.payload_column);
  addCol(formData.destination_column);

  if (Array.isArray(formData.groupby)) {
    formData.groupby.forEach((col: QueryFormColumn) => addCol(col));
  }

  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      columns,
    },
  ]);
}
