#!/usr/bin/env python3
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
"""
Seed script for OpsPilot '1-Receiving' big-screen industrial dashboard.
Creates:
  1. Demo PostgreSQL/SQLite tables & data.
  2. Superset datasets (SqlaTable).
  3. Slices for all custom plugins (Utility Bar, Hot List, Upcoming, Bulk Loading, Demurrage, Gauge, Resources, Forklift).
  4. '1-Receiving' Dashboard with 3-column + sidebar layout and custom CSS.
"""
import uuid
from sqlalchemy import text
from superset.app import create_app

app = create_app()

with app.app_context():
    from superset import db
    from superset.models.core import Database
    from superset.connectors.sqla.models import SqlaTable
    from superset.models.slice import Slice
    from superset.models.dashboard import Dashboard
    from superset.utils import json

    print(">>> Starting 1-Receiving Dashboard Seeding...")

    # 1. Locate primary database
    database = db.session.query(Database).filter_by(database_name="examples").first()
    if not database:
        database = db.session.query(Database).filter_by(database_name="main").first()
    if not database:
        database = db.session.query(Database).first()

    if not database:
        raise RuntimeError("No Superset database connection found.")

    print(f">>> Using database: '{database.database_name}' (backend: {database.backend})")

    # Helper to execute DDL / DML safely
    def execute_sql(statements):
        with database.get_sqla_engine() as engine:
            with engine.begin() as conn:
                for stmt in statements:
                    conn.execute(text(stmt))

    # 2. Define & seed demo tables
    print(">>> Creating and populating demo tables...")

    # Drop existing demo tables
    drop_tables = [
        "DROP TABLE IF EXISTS demo_receiving_header CASCADE;",
        "DROP TABLE IF EXISTS demo_receiving_hotlist CASCADE;",
        "DROP TABLE IF EXISTS demo_receiving_upcoming CASCADE;",
        "DROP TABLE IF EXISTS demo_receiving_bulk_loading CASCADE;",
        "DROP TABLE IF EXISTS demo_receiving_demurrage CASCADE;",
        "DROP TABLE IF EXISTS demo_receiving_capacity CASCADE;",
        "DROP TABLE IF EXISTS demo_receiving_resources CASCADE;",
        "DROP TABLE IF EXISTS demo_receiving_forklift CASCADE;",
    ]
    for d_stmt in drop_tables:
        try:
            execute_sql([d_stmt])
        except Exception:
            # Fallback if CASCADE is not supported (e.g. SQLite)
            try:
                execute_sql([d_stmt.replace(" CASCADE;", ";")])
            except Exception as ex:
                print(f"Warning dropping table: {ex}")

    # Create tables
    create_statements = [
        """
        CREATE TABLE demo_receiving_header (
            id INTEGER PRIMARY KEY,
            title VARCHAR(255)
        );
        """,
        """
        CREATE TABLE demo_receiving_hotlist (
            id INTEGER PRIMARY KEY,
            po_number VARCHAR(100),
            material_id VARCHAR(100),
            material_desc VARCHAR(255),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_receiving_upcoming (
            id INTEGER PRIMARY KEY,
            po_number VARCHAR(100),
            material_id VARCHAR(100),
            material_desc VARCHAR(255),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_receiving_bulk_loading (
            id INTEGER PRIMARY KEY,
            order_label VARCHAR(100),
            work_order VARCHAR(100),
            material_name VARCHAR(255),
            status VARCHAR(100),
            tank_label VARCHAR(100),
            destination_tank VARCHAR(100),
            timer_label VARCHAR(100),
            elapsed_time VARCHAR(100),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_receiving_demurrage (
            id INTEGER PRIMARY KEY,
            door VARCHAR(100),
            countdown VARCHAR(100),
            text_color VARCHAR(50),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_receiving_capacity (
            id INTEGER PRIMARY KEY,
            metric_name VARCHAR(100),
            capacity_val INTEGER
        );
        """,
        """
        CREATE TABLE demo_receiving_resources (
            id INTEGER PRIMARY KEY,
            department VARCHAR(100),
            status VARCHAR(100),
            box_color VARCHAR(50),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_receiving_forklift (
            id INTEGER PRIMARY KEY,
            status VARCHAR(100),
            count VARCHAR(100),
            text_color VARCHAR(50),
            row_order INTEGER
        );
        """
    ]
    execute_sql(create_statements)

    # Insert data
    insert_statements = [
        # 1. Header
        "INSERT INTO demo_receiving_header (id, title) VALUES (1, '1-Receiving');",

        # 2. Hot List (4 rows matching screenshot)
        "INSERT INTO demo_receiving_hotlist (id, po_number, material_id, material_desc, row_order) VALUES (1, 'PO220202', '3214564', 'POLY OX FRAG OIL 235', 1);",
        "INSERT INTO demo_receiving_hotlist (id, po_number, material_id, material_desc, row_order) VALUES (2, 'PO220202', '3214564', 'POLY OX FRAG OIL 235', 2);",
        "INSERT INTO demo_receiving_hotlist (id, po_number, material_id, material_desc, row_order) VALUES (3, 'PO220202', '3214564', 'POLY OX FRAG OIL 235', 3);",
        "INSERT INTO demo_receiving_hotlist (id, po_number, material_id, material_desc, row_order) VALUES (4, 'PO220202', '3214564', 'POLY OX FRAG OIL 235', 4);",

        # 3. Upcoming Deliveries (4 rows matching screenshot)
        "INSERT INTO demo_receiving_upcoming (id, po_number, material_id, material_desc, row_order) VALUES (1, 'PO220202', '3214564', 'POLY OX FRAG OIL 235', 1);",
        "INSERT INTO demo_receiving_upcoming (id, po_number, material_id, material_desc, row_order) VALUES (2, 'PO220202', '3214564', 'POLY OX FRAG OIL 235', 2);",
        "INSERT INTO demo_receiving_upcoming (id, po_number, material_id, material_desc, row_order) VALUES (3, 'PO220202', '3214564', 'POLY OX FRAG OIL 235', 3);",
        "INSERT INTO demo_receiving_upcoming (id, po_number, material_id, material_desc, row_order) VALUES (4, 'PO220202', '3214564', 'POLY OX FRAG OIL 235', 4);",

        # 4. Bulk Loading
        "INSERT INTO demo_receiving_bulk_loading (id, order_label, work_order, material_name, status, tank_label, destination_tank, timer_label, elapsed_time, row_order) VALUES (1, 'Dfwlyh', '2544434', 'POLY OX FRAG OIL 235', 'LOADING', 'Wdqn', 'BK-2', 'Wlp h#lq#Ed|', '2:43', 1);",
        "INSERT INTO demo_receiving_bulk_loading (id, order_label, work_order, material_name, status, tank_label, destination_tank, timer_label, elapsed_time, row_order) VALUES (2, 'Xsfrp lqj', '3256652', 'RED FOX FRAG OIL 112', 'UPCOMING', '', 'BK-4', '', '', 2);",

        # 5. Demurrage Risk
        "INSERT INTO demo_receiving_demurrage (id, door, countdown, text_color, row_order) VALUES (1, 'DOOR  5', '3:22', '#FF0000', 1);",
        "INSERT INTO demo_receiving_demurrage (id, door, countdown, text_color, row_order) VALUES (2, 'DOOR 11', '2:15', '#FF7A00', 2);",
        "INSERT INTO demo_receiving_demurrage (id, door, countdown, text_color, row_order) VALUES (3, 'DOOR  2', '2:06', '#FF7A00', 3);",

        # 6. Capacity
        "INSERT INTO demo_receiving_capacity (id, metric_name, capacity_val) VALUES (1, 'CAPACITY', 23);",

        # 7. Resources
        "INSERT INTO demo_receiving_resources (id, department, status, box_color, row_order) VALUES (1, 'Receiving', 'OK', '#B73229', 1);",
        "INSERT INTO demo_receiving_resources (id, department, status, box_color, row_order) VALUES (2, 'WH Replenish', '-1', '#E5A000', 2);",
        "INSERT INTO demo_receiving_resources (id, department, status, box_color, row_order) VALUES (3, 'Tote Farm', '3', '#9C381E', 3);",

        # 8. Forklift
        "INSERT INTO demo_receiving_forklift (id, status, count, text_color, row_order) VALUES (1, 'CHARGING', '1', '#DC2626', 1);",
        "INSERT INTO demo_receiving_forklift (id, status, count, text_color, row_order) VALUES (2, 'IN USE', '2', '#1F2937', 2);",
    ]
    execute_sql(insert_statements)
    print(">>> Tables created and populated successfully.")

    # 3. Register or sync SqlaTable datasets in Superset
    print(">>> Registering Superset datasets...")
    table_names = [
        "demo_receiving_header",
        "demo_receiving_hotlist",
        "demo_receiving_upcoming",
        "demo_receiving_bulk_loading",
        "demo_receiving_demurrage",
        "demo_receiving_capacity",
        "demo_receiving_resources",
        "demo_receiving_forklift",
    ]

    datasets = {}
    for t_name in table_names:
        tbl = db.session.query(SqlaTable).filter_by(table_name=t_name, database_id=database.id).first()
        if not tbl:
            tbl = SqlaTable(table_name=t_name, database_id=database.id)
            db.session.add(tbl)
            db.session.commit()
        tbl.fetch_metadata()
        db.session.commit()
        datasets[t_name] = tbl
        print(f"    - Dataset '{t_name}' synced (ID: {tbl.id})")

    # 4. Ensure metrics on SqlaTable
    from superset.connectors.sqla.models import SqlMetric

    cap_tbl = datasets["demo_receiving_capacity"]
    existing_metric = db.session.query(SqlMetric).filter_by(table_id=cap_tbl.id, metric_name="capacity_val").first()
    if not existing_metric:
        metric_obj = SqlMetric(
            metric_name="capacity_val",
            verbose_name="CAPACITY",
            metric_type="count",
            expression="MAX(capacity_val)",
            table_id=cap_tbl.id,
        )
        db.session.add(metric_obj)
        db.session.commit()
    cap_tbl.fetch_metadata()
    db.session.commit()

    # Helper to upsert Slices
    def upsert_slice(name, viz_type, dataset_name, params_dict):
        tbl = datasets[dataset_name]
        slc = db.session.query(Slice).filter_by(slice_name=name).first()
        params_dict["datasource"] = f"{tbl.id}__table"
        params_dict["viz_type"] = viz_type
        params_json = json.dumps(params_dict, indent=2)

        if not slc:
            slc = Slice(
                slice_name=name,
                viz_type=viz_type,
                datasource_type="table",
                datasource_id=tbl.id,
                params=params_json,
                uuid=str(uuid.uuid4()),
            )
            db.session.add(slc)
        else:
            slc.viz_type = viz_type
            slc.datasource_type = "table"
            slc.datasource_id = tbl.id
            slc.params = params_json
        db.session.commit()
        print(f"    - Slice '{name}' created/updated (ID: {slc.id}, UUID: {slc.uuid})")
        return slc

    # Create Slices
    print(">>> Creating Chart Slices...")

    # Slice 1: Header Utility Bar
    slice_header = upsert_slice(
        name="1-Receiving Utility Bar",
        viz_type="dashboard_utility_bar",
        dataset_name="demo_receiving_header",
        params_dict={
            "layoutMode": "header",
            "layout_mode": "header",
            "showTitle": True,
            "show_title": True,
            "titleColumn": "title",
            "title_column": "title",
            "showDate": True,
            "show_date": True,
            "showClock": True,
            "show_clock": True,
            "showWeather": True,
            "show_weather": True,
            "showTemperature": False,
            "show_temperature": False,
            "showKpi": False,
            "show_kpi": False,
            "showTicker": False,
            "show_ticker": False,
            "showCustomRightSlot": False,
            "backgroundColor": "#004B93",
            "background_color": "#004B93",
            "textColor": "#FFFFFF",
            "text_color": "#FFFFFF",
            "titleFontSize": 28,
            "dateFontSize": 16,
            "clockFontSize": 24,
            "weatherIconSize": 36,
            "row_limit": 10,
        }
    )

    # Slice 2: Hot List
    slice_hotlist = upsert_slice(
        name="1-Receiving Hot List",
        viz_type="unified_list_bar",
        dataset_name="demo_receiving_hotlist",
        params_dict={
            "keyColumn": "po_number",
            "key_column": "po_number",
            "secondaryColumns": ["material_id", "material_desc"],
            "secondary_columns": ["material_id", "material_desc"],
            "headerTitle": "Hot List",
            "header_title": "Hot List",
            "showBar": False,
            "show_bar": False,
            "showMetricValue": False,
            "show_metric_value": False,
            "keyFontSize": 28,
            "keyColor": "#0F2F57",
            "key_color": "#0F2F57",
            "secondaryFontSize": 13,
            "secondaryColor": "#2B6CB0",
            "secondary_color": "#2B6CB0",
            "rowsPerItem": "2",
            "rows_per_item": "2",
            "row_limit": 10,
        }
    )

    # Slice 3: Upcoming Deliveries
    slice_upcoming = upsert_slice(
        name="1-Receiving Upcoming Deliveries",
        viz_type="unified_list_bar",
        dataset_name="demo_receiving_upcoming",
        params_dict={
            "keyColumn": "po_number",
            "key_column": "po_number",
            "secondaryColumns": ["material_id", "material_desc"],
            "secondary_columns": ["material_id", "material_desc"],
            "headerTitle": "Upcoming Deliveries",
            "header_title": "Upcoming Deliveries",
            "showBar": False,
            "show_bar": False,
            "showMetricValue": False,
            "show_metric_value": False,
            "keyFontSize": 28,
            "keyColor": "#0F2F57",
            "key_color": "#0F2F57",
            "secondaryFontSize": 13,
            "secondaryColor": "#2B6CB0",
            "secondary_color": "#2B6CB0",
            "rowsPerItem": "2",
            "rows_per_item": "2",
            "row_limit": 10,
        }
    )

    # Slice 4: Bulk Loading Card
    slice_bulk = upsert_slice(
        name="1-Receiving Bulk Loading",
        viz_type="bulk_loading_card",
        dataset_name="demo_receiving_bulk_loading",
        params_dict={
            "titleText": "Bulk Loading",
            "title_text": "Bulk Loading",
            "workOrderColumn": "work_order",
            "work_order_column": "work_order",
            "materialNameColumn": "material_name",
            "material_name_column": "material_name",
            "statusColumn": "status",
            "status_column": "status",
            "destinationTankColumn": "destination_tank",
            "destination_tank_column": "destination_tank",
            "elapsedTimeColumn": "elapsed_time",
            "elapsed_time_column": "elapsed_time",
            "showTruckGraphic": True,
            "show_truck_graphic": True,
            "showStatusPipeline": True,
            "show_status_pipeline": True,
            "workOrderFontSize": 26,
            "work_order_font_size": 26,
            "tankBadgeColor": "#0F2F57",
            "tank_badge_color": "#0F2F57",
            "timerColor": "#0F2F57",
            "timer_color": "#0F2F57",
            "cardBgColor": "transparent",
            "card_bg_color": "transparent",
            "cardBorderColor": "none",
            "card_border_color": "none",
            "row_limit": 10,
        }
    )

    # Slice 5: Demurrage Risk
    slice_demurrage = upsert_slice(
        name="1-Receiving Demurrage Risk",
        viz_type="kpi_dual_column_card",
        dataset_name="demo_receiving_demurrage",
        params_dict={
            "titleText": "Demurrage Risk",
            "title_text": "Demurrage Risk",
            "titleFontSize": 22,
            "title_font_size": 22,
            "titleColor": "#9CA3AF",
            "title_color": "#9CA3AF",
            "keyColumn": "door",
            "key_column": "door",
            "valueColumn": "countdown",
            "value_column": "countdown",
            "valTextColorColumn": "text_color",
            "val_text_color_column": "text_color",
            "keyFontSize": 26,
            "valueFontSize": 28,
            "keyFontWeight": 800,
            "valueFontWeight": 800,
            "globalKeyColor": "#0F2F57",
            "headerMode": "none",
            "header_mode": "none",
            "containerBgColor": "transparent",
            "container_bg_color": "transparent",
            "enableShadow": False,
            "enable_shadow": False,
            "rowSpacing": 14,
            "row_spacing": 14,
            "row_limit": 10,
        }
    )

    # Slice 6: Capacity Speedometer
    slice_capacity = upsert_slice(
        name="1-Receiving Capacity Speedometer",
        viz_type="custom_gauge",
        dataset_name="demo_receiving_capacity",
        params_dict={
            "metric": "capacity_val",
            "metrics": ["capacity_val"],
            "min": 0,
            "minVal": 0,
            "max": 50,
            "maxVal": 50,
            "startAngle": 180,
            "endAngle": 0,
            "colorMode": "intervals",
            "intervals": "16.7,33.3,50",
            "intervalColorIndices": "1,2,3",
            "intervalColors": "#DC2626,#EAB308,#16A34A",
            "interval_colors": "#DC2626,#EAB308,#16A34A",
            "showTickLabels": False,
            "show_tick_labels": False,
            "showAxisTick": False,
            "show_axis_tick": False,
            "showSplitLine": False,
            "show_split_line": False,
            "arcThickness": 24,
            "needleWidth": 4,
            "needle_width": 4,
            "needleColor": "#0F2F57",
            "needle_color": "#0F2F57",
            "centerValSize": 34,
            "centerValWeight": "bold",
            "centerValColor": {"r": 234, "g": 179, "b": 8, "a": 1},
            "showCenterVal": True,
            "centerValOffsetY": "18%",
            "center_val_offset_y": "18%",
            "customSubtitle": "CAPACITY",
            "custom_subtitle": "CAPACITY",
            "subtitleOffsetY": "52%",
            "subtitle_offset_y": "52%",
            "subtitleFontSize": 13,
            "subtitle_font_size": 13,
            "subtitleFontWeight": "bold",
            "subtitle_font_weight": "bold",
            "subtitleColor": "#0F2F57",
            "subtitle_color": "#0F2F57",
            "valSuffix": "",
            "groupby": ["metric_name"],
            "row_limit": 10,
        }
    )

    # Slice 7: Resources
    slice_resources = upsert_slice(
        name="1-Receiving Resources Status",
        viz_type="kpi_dual_column_card",
        dataset_name="demo_receiving_resources",
        params_dict={
            "titleText": "RESOURCES",
            "title_text": "RESOURCES",
            "titleFontSize": 12,
            "title_font_size": 12,
            "titleColor": "#718096",
            "title_color": "#718096",
            "keyColumn": "department",
            "key_column": "department",
            "valueColumn": "status",
            "value_column": "status",
            "valBoxColorColumn": "box_color",
            "val_box_color_column": "box_color",
            "globalValueColor": "#FFFFFF",
            "keyFontSize": 14,
            "valueFontSize": 13,
            "keyFontWeight": 800,
            "valueFontWeight": 800,
            "globalKeyColor": "#0F2F57",
            "headerMode": "icon_above_value",
            "header_mode": "icon_above_value",
            "iconType": "hardhat",
            "icon_type": "hardhat",
            "iconSize": 34,
            "iconColor": "#2D3748",
            "valuePadding": 4,
            "borderRadius": 4,
            "border_radius": 4,
            "containerBgColor": "transparent",
            "container_bg_color": "transparent",
            "enableShadow": False,
            "enable_shadow": False,
            "rowSpacing": 8,
            "row_spacing": 8,
            "row_limit": 10,
        }
    )

    # Slice 8: Forklift Status
    slice_forklift = upsert_slice(
        name="1-Receiving Forklift Status",
        viz_type="kpi_dual_column_card",
        dataset_name="demo_receiving_forklift",
        params_dict={
            "keyColumn": "status",
            "key_column": "status",
            "valueColumn": "count",
            "value_column": "count",
            "valTextColorColumn": "text_color",
            "val_text_color_column": "text_color",
            "keyFontSize": 14,
            "valueFontSize": 18,
            "keyFontWeight": 700,
            "valueFontWeight": 800,
            "globalKeyColor": "#374151",
            "headerMode": "icon_centered",
            "header_mode": "icon_centered",
            "iconType": "forklift",
            "icon_type": "forklift",
            "iconSize": 54,
            "iconColor": "#111827",
            "containerBgColor": "#FAF6EE",
            "container_bg_color": "#FAF6EE",
            "borderRadius": 8,
            "border_radius": 8,
            "containerPadding": 14,
            "enableShadow": False,
            "enable_shadow": False,
            "rowSpacing": 8,
            "row_spacing": 8,
            "row_limit": 10,
        }
    )

    all_slices = [
        slice_header,
        slice_hotlist,
        slice_upcoming,
        slice_bulk,
        slice_demurrage,
        slice_capacity,
        slice_resources,
        slice_forklift,
    ]

    # 5. Build Position JSON Layout (24 Columns: Left [10], Mid [10], Right [4])
    print(">>> Assembling 24-Column Position JSON...")
    position_json = {
        "DASHBOARD_VERSION_KEY": "v2",
        "ROOT_ID": {
            "type": "ROOT",
            "id": "ROOT_ID",
            "children": ["GRID_ID"]
        },
        "GRID_ID": {
            "type": "GRID",
            "id": "GRID_ID",
            "parents": ["ROOT_ID"],
            "children": ["ROW_HEADER", "ROW_BODY"]
        },
        # Top Full-width Header Row (24 columns)
        "ROW_HEADER": {
            "type": "ROW",
            "id": "ROW_HEADER",
            "parents": ["ROOT_ID", "GRID_ID"],
            "children": ["COL_HEADER"],
            "meta": {"background": "BACKGROUND_TRANSPARENT"}
        },
        "COL_HEADER": {
            "type": "COLUMN",
            "id": "COL_HEADER",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_HEADER"],
            "children": ["CHART_HEADER"],
            "meta": {"width": 24}
        },
        "CHART_HEADER": {
            "type": "CHART",
            "id": "CHART_HEADER",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_HEADER", "COL_HEADER"],
            "children": [],
            "meta": {
                "chartId": slice_header.id,
                "sliceName": slice_header.slice_name,
                "uuid": str(slice_header.uuid),
                "width": 24,
                "height": 14
            }
        },
        # Main Body Row containing 3 columns: Left (10), Middle (10), Right Sidebar (4)
        "ROW_BODY": {
            "type": "ROW",
            "id": "ROW_BODY",
            "parents": ["ROOT_ID", "GRID_ID"],
            "children": ["COL_LEFT", "COL_MID", "COL_RIGHT"],
            "meta": {"background": "BACKGROUND_TRANSPARENT"}
        },
        # 1. Left Column (10 columns: Hot List + Bulk Loading)
        "COL_LEFT": {
            "type": "COLUMN",
            "id": "COL_LEFT",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_HOT_LIST", "CHART_BULK_LOADING"],
            "meta": {"width": 10}
        },
        "CHART_HOT_LIST": {
            "type": "CHART",
            "id": "CHART_HOT_LIST",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_LEFT"],
            "children": [],
            "meta": {
                "chartId": slice_hotlist.id,
                "sliceName": slice_hotlist.slice_name,
                "uuid": str(slice_hotlist.uuid),
                "width": 10,
                "height": 48
            }
        },
        "CHART_BULK_LOADING": {
            "type": "CHART",
            "id": "CHART_BULK_LOADING",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_LEFT"],
            "children": [],
            "meta": {
                "chartId": slice_bulk.id,
                "sliceName": slice_bulk.slice_name,
                "uuid": str(slice_bulk.uuid),
                "width": 10,
                "height": 48
            }
        },
        # 2. Middle Column (10 columns: Upcoming Deliveries + Demurrage Risk)
        "COL_MID": {
            "type": "COLUMN",
            "id": "COL_MID",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_UPCOMING", "CHART_DEMURRAGE"],
            "meta": {"width": 10}
        },
        "CHART_UPCOMING": {
            "type": "CHART",
            "id": "CHART_UPCOMING",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_MID"],
            "children": [],
            "meta": {
                "chartId": slice_upcoming.id,
                "sliceName": slice_upcoming.slice_name,
                "uuid": str(slice_upcoming.uuid),
                "width": 10,
                "height": 48
            }
        },
        "CHART_DEMURRAGE": {
            "type": "CHART",
            "id": "CHART_DEMURRAGE",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_MID"],
            "children": [],
            "meta": {
                "chartId": slice_demurrage.id,
                "sliceName": slice_demurrage.slice_name,
                "uuid": str(slice_demurrage.uuid),
                "width": 10,
                "height": 48
            }
        },
        # 3. Right Sidebar (4 columns: Capacity + Resources + Forklift)
        "COL_RIGHT": {
            "type": "COLUMN",
            "id": "COL_RIGHT",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_GAUGE", "CHART_RESOURCES", "CHART_FORKLIFT"],
            "meta": {"width": 4}
        },
        "CHART_GAUGE": {
            "type": "CHART",
            "id": "CHART_GAUGE",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_RIGHT"],
            "children": [],
            "meta": {
                "chartId": slice_capacity.id,
                "sliceName": slice_capacity.slice_name,
                "uuid": str(slice_capacity.uuid),
                "width": 4,
                "height": 32
            }
        },
        "CHART_RESOURCES": {
            "type": "CHART",
            "id": "CHART_RESOURCES",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_RIGHT"],
            "children": [],
            "meta": {
                "chartId": slice_resources.id,
                "sliceName": slice_resources.slice_name,
                "uuid": str(slice_resources.uuid),
                "width": 4,
                "height": 28
            }
        },
        "CHART_FORKLIFT": {
            "type": "CHART",
            "id": "CHART_FORKLIFT",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_RIGHT"],
            "children": [],
            "meta": {
                "chartId": slice_forklift.id,
                "sliceName": slice_forklift.slice_name,
                "uuid": str(slice_forklift.uuid),
                "width": 4,
                "height": 38
            }
        }
    }

    # 6. Custom CSS for Big-Screen Aesthetics
    custom_css = """
/* OpsPilot 1-Receiving Industrial Big-Screen Theme */
.dashboard {
  background-color: #ffffff !important;
}

.dashboard-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

/* Eliminate default chart cards padding, borders and shadows */
.dashboard-component-chart-holder {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0px 4px !important;
}

.dashboard-component-chart-holder .slice_container {
  background: transparent !important;
}

/* Header utility bar: full bleed flush at top */
.grid-row:first-child {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
}

/* Slices title styling: completely hide default Superset chart header controls */
.dashboard-component-chart-holder .header-title,
.dashboard-component-chart-holder .chart-header,
.dashboard-component-chart-holder .header-controls {
  display: none !important;
}

/* Right sidebar column styling */
.grid-row > .dragdroppable-column:last-child:not(:only-child) {
  background-color: #ece8de !important;
  border-left: 1px solid #ded8cb !important;
  padding: 8px 10px !important;
  min-height: calc(100vh - 75px) !important;
}

.grid-row > .dragdroppable-column:last-child:not(:only-child) .dashboard-component-chart-holder {
  padding: 2px 0px !important;
}

/* Suppress all scrollbars in dashboard */
.dashboard-component-chart-holder,
.dashboard-component-chart-holder * {
  scrollbar-width: none !important;
}
.dashboard-component-chart-holder *::-webkit-scrollbar {
  display: none !important;
}
"""

    # 7. Upsert Dashboard
    print(">>> Creating/Updating Dashboard '1-Receiving'...")
    dash = db.session.query(Dashboard).filter(
        (Dashboard.slug == "1-receiving") | (Dashboard.dashboard_title == "1-Receiving")
    ).first()

    metadata = {
        "timed_refresh_immune_slices": [],
        "expanded_slices": {},
        "refresh_frequency": 0,
        "default_filters": "{}",
        "color_scheme": "",
        "label_colors": {},
        "shared_label_colors": [],
        "color_scheme_domain": [],
        "cross_filters_enabled": True
    }

    if not dash:
        dash = Dashboard(
            dashboard_title="1-Receiving",
            slug="1-receiving",
            position_json=json.dumps(position_json, indent=2),
            css=custom_css,
            json_metadata=json.dumps(metadata),
            slices=all_slices,
            published=True,
            uuid=str(uuid.uuid4()),
        )
        db.session.add(dash)
    else:
        dash.dashboard_title = "1-Receiving"
        dash.slug = "1-receiving"
        dash.position_json = json.dumps(position_json, indent=2)
        dash.css = custom_css
        dash.json_metadata = json.dumps(metadata)
        dash.slices = all_slices
        dash.published = True

    db.session.commit()
    print(f">>> Dashboard '1-Receiving' is ready!")
    print(f">>> Dashboard ID: {dash.id}, Slug: {dash.slug}")
    print(f">>> Access at: /opspilot/dashboard/{dash.slug}/")
