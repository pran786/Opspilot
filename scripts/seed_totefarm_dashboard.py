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
Seed script for OpsPilot '3-ToteFarm' big-screen industrial dashboard.
Creates:
  1. Demo PostgreSQL/SQLite tables & data for Dashboard #3 ('3-ToteFarm').
  2. Superset datasets (SqlaTable) and SqlMetrics.
  3. Slices for custom plugins (Utility Bar, Hot List with color indicators,
     Dual Center Speedometer Gauges 44 & 12MT, Upcoming Movements with badge 32,
     Sidebar Capacity Speedometer 23, Resources with hardhat, and Equipment card
     with Forklift and Centrifugal Blower Fan).
  4. '3-ToteFarm' Dashboard with 24-column layout (6+4+10+4 = 24) and custom CSS.
"""
import uuid
from sqlalchemy import text
from superset.app import create_app

app = create_app()

with app.app_context():
    from superset import db
    from superset.models.core import Database
    from superset.connectors.sqla.models import SqlaTable, SqlMetric
    from superset.models.slice import Slice
    from superset.models.dashboard import Dashboard
    from superset.utils import json

    print(">>> Starting 3-ToteFarm Dashboard Seeding...")

    # 1. Locate primary database
    database = db.session.query(Database).filter_by(database_name="examples").first()
    if not database:
        database = db.session.query(Database).filter_by(database_name="main").first()
    if not database:
        database = db.session.query(Database).first()

    if not database:
        raise RuntimeError("No Superset database connection found.")

    print(f">>> Using database: '{database.database_name}' (backend: {database.backend})")

    def execute_sql(statements):
        with database.get_sqla_engine() as engine:
            with engine.begin() as conn:
                for stmt in statements:
                    conn.execute(text(stmt))

    # 2. Define & seed demo tables for Dashboard #3
    print(">>> Creating and populating demo tables for 3-ToteFarm...")

    drop_tables = [
        "DROP TABLE IF EXISTS demo_tf_header CASCADE;",
        "DROP TABLE IF EXISTS demo_tf_hotlist CASCADE;",
        "DROP TABLE IF EXISTS demo_tf_gauge_replenished CASCADE;",
        "DROP TABLE IF EXISTS demo_tf_gauge_record CASCADE;",
        "DROP TABLE IF EXISTS demo_tf_upcoming CASCADE;",
        "DROP TABLE IF EXISTS demo_tf_capacity CASCADE;",
        "DROP TABLE IF EXISTS demo_tf_resources CASCADE;",
        "DROP TABLE IF EXISTS demo_tf_equipment CASCADE;",
    ]
    for d_stmt in drop_tables:
        try:
            execute_sql([d_stmt])
        except Exception:
            try:
                execute_sql([d_stmt.replace(" CASCADE;", ";")])
            except Exception as ex:
                print(f"Warning dropping table: {ex}")

    create_statements = [
        """
        CREATE TABLE demo_tf_header (
            id INTEGER PRIMARY KEY,
            title VARCHAR(255)
        );
        """,
        """
        CREATE TABLE demo_tf_hotlist (
            id INTEGER PRIMARY KEY,
            tank_id VARCHAR(100),
            material_id VARCHAR(100),
            material_desc VARCHAR(255),
            text_color VARCHAR(50),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_tf_gauge_replenished (
            id INTEGER PRIMARY KEY,
            metric_name VARCHAR(100),
            gauge_val INTEGER
        );
        """,
        """
        CREATE TABLE demo_tf_gauge_record (
            id INTEGER PRIMARY KEY,
            metric_name VARCHAR(100),
            gauge_val INTEGER
        );
        """,
        """
        CREATE TABLE demo_tf_upcoming (
            id INTEGER PRIMARY KEY,
            material_id VARCHAR(100),
            material_desc VARCHAR(255),
            quantity_str VARCHAR(100),
            text_color VARCHAR(50),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_tf_capacity (
            id INTEGER PRIMARY KEY,
            metric_name VARCHAR(100),
            capacity_val INTEGER
        );
        """,
        """
        CREATE TABLE demo_tf_resources (
            id INTEGER PRIMARY KEY,
            department VARCHAR(100),
            status VARCHAR(100),
            box_color VARCHAR(50),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_tf_equipment (
            id INTEGER PRIMARY KEY,
            section VARCHAR(100),
            status VARCHAR(100),
            count VARCHAR(50),
            text_color VARCHAR(50),
            row_order INTEGER
        );
        """,
    ]
    execute_sql(create_statements)

    insert_statements = [
        # 1. Header (3-ToteFarm)
        "INSERT INTO demo_tf_header (id, title) VALUES (1, '3-ToteFarm');",

        # 2. Hot List (6 rows matching screenshot)
        "INSERT INTO demo_tf_hotlist (id, tank_id, material_id, material_desc, text_color, row_order) VALUES (1, 'TK-254', '3214564', 'POLY OX FRAG OIL 235', '#DC2626', 1);",
        "INSERT INTO demo_tf_hotlist (id, tank_id, material_id, material_desc, text_color, row_order) VALUES (2, 'TK-231', '3214564', 'POLY OX FRAG OIL 235', '#DC2626', 2);",
        "INSERT INTO demo_tf_hotlist (id, tank_id, material_id, material_desc, text_color, row_order) VALUES (3, 'TK-112', '3214564', 'POLY OX FRAG OIL 235', '#DC2626', 3);",
        "INSERT INTO demo_tf_hotlist (id, tank_id, material_id, material_desc, text_color, row_order) VALUES (4, 'TK-002', '3214564', 'POLY OX FRAG OIL 235', '#EAB308', 4);",
        "INSERT INTO demo_tf_hotlist (id, tank_id, material_id, material_desc, text_color, row_order) VALUES (5, 'TK-056', '3214564', 'POLY OX FRAG OIL 235', '#EAB308', 5);",
        "INSERT INTO demo_tf_hotlist (id, tank_id, material_id, material_desc, text_color, row_order) VALUES (6, 'TK-321', '3214564', 'POLY OX FRAG OIL 235', '#0F2F57', 6);",

        # 3. Center Dual Gauges (44 POUNDS REPLENISHED & 12MT POUNDS REPLENISHED RECORD)
        "INSERT INTO demo_tf_gauge_replenished (id, metric_name, gauge_val) VALUES (1, 'POUNDS REPLENISHED', 44);",
        "INSERT INTO demo_tf_gauge_record (id, metric_name, gauge_val) VALUES (1, 'POUNDS REPLENISHED RECORD', 12);",

        # 4. Upcoming Movements (5 rows with yellow/blue material IDs and quantities)
        "INSERT INTO demo_tf_upcoming (id, material_id, material_desc, quantity_str, text_color, row_order) VALUES (1, '3214564', 'POLY OX FRAG OIL 235', '250 Kg', '#EAB308', 1);",
        "INSERT INTO demo_tf_upcoming (id, material_id, material_desc, quantity_str, text_color, row_order) VALUES (2, '3214564', 'POLY OX FRAG OIL 235', '750 Kg', '#2B6CB0', 2);",
        "INSERT INTO demo_tf_upcoming (id, material_id, material_desc, quantity_str, text_color, row_order) VALUES (3, '3214564', 'POLY OX FRAG OIL 235', '6 CT', '#2B6CB0', 3);",
        "INSERT INTO demo_tf_upcoming (id, material_id, material_desc, quantity_str, text_color, row_order) VALUES (4, '3214564', 'POLY OX FRAG OIL 235', '140 Kg', '#2B6CB0', 4);",
        "INSERT INTO demo_tf_upcoming (id, material_id, material_desc, quantity_str, text_color, row_order) VALUES (5, '3214564', 'POLY OX FRAG OIL 235', '660 Kg', '#2B6CB0', 5);",

        # 5. Right Sidebar Capacity (23 CAPACITY)
        "INSERT INTO demo_tf_capacity (id, metric_name, capacity_val) VALUES (1, 'CAPACITY', 23);",

        # 6. Right Sidebar Resources (Receiving OK, WH Replenish -1, Tote Farm 3)
        "INSERT INTO demo_tf_resources (id, department, status, box_color, row_order) VALUES (1, 'Receiving', 'OK', '#B73229', 1);",
        "INSERT INTO demo_tf_resources (id, department, status, box_color, row_order) VALUES (2, 'WH Replenish', '-1', '#E5A000', 2);",
        "INSERT INTO demo_tf_resources (id, department, status, box_color, row_order) VALUES (3, 'Tote Farm', '3', '#9C381E', 3);",

        # 7. Right Sidebar Equipment (Forklift CHARGING 1 / IN USE 2 + Blower CLEAN 3 / IN USE 2)
        "INSERT INTO demo_tf_equipment (id, section, status, count, text_color, row_order) VALUES (1, 'forklift', 'CHARGING', '1', '#DC2626', 1);",
        "INSERT INTO demo_tf_equipment (id, section, status, count, text_color, row_order) VALUES (2, 'forklift', 'IN USE', '2', '#1F2937', 2);",
        "INSERT INTO demo_tf_equipment (id, section, status, count, text_color, row_order) VALUES (3, 'blower', 'CLEAN', '3', '#16A34A', 3);",
        "INSERT INTO demo_tf_equipment (id, section, status, count, text_color, row_order) VALUES (4, 'blower', 'IN USE', '2', '#1F2937', 4);",
    ]
    execute_sql(insert_statements)
    print(">>> Tables created and populated successfully.")

    # 3. Register or sync SqlaTable datasets in Superset
    print(">>> Registering Superset datasets...")
    table_names = [
        "demo_tf_header",
        "demo_tf_hotlist",
        "demo_tf_gauge_replenished",
        "demo_tf_gauge_record",
        "demo_tf_upcoming",
        "demo_tf_capacity",
        "demo_tf_resources",
        "demo_tf_equipment",
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

    # Ensure SqlMetric on gauge datasets
    def ensure_metric(tbl_name, m_name, expr):
        tbl = datasets[tbl_name]
        existing = db.session.query(SqlMetric).filter_by(table_id=tbl.id, metric_name=m_name).first()
        if not existing:
            m_obj = SqlMetric(
                metric_name=m_name,
                verbose_name=m_name.upper(),
                metric_type="count",
                expression=expr,
                table_id=tbl.id,
            )
            db.session.add(m_obj)
            db.session.commit()
        tbl.fetch_metadata()
        db.session.commit()

    ensure_metric("demo_tf_gauge_replenished", "gauge_val", "MAX(gauge_val)")
    ensure_metric("demo_tf_gauge_record", "gauge_val", "MAX(gauge_val)")
    ensure_metric("demo_tf_capacity", "capacity_val", "MAX(capacity_val)")

    # 4. Helper to upsert Slices
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

    # Create Slices for Dashboard #3 ('3-ToteFarm')
    print(">>> Creating Chart Slices for 3-ToteFarm...")

    # Slice 1: Header Utility Bar
    slice_header = upsert_slice(
        name="3-ToteFarm Utility Bar",
        viz_type="dashboard_utility_bar",
        dataset_name="demo_tf_header",
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
        name="3-ToteFarm Hot List",
        viz_type="unified_list_bar",
        dataset_name="demo_tf_hotlist",
        params_dict={
            "keyColumn": "tank_id",
            "key_column": "tank_id",
            "colorColumn": "text_color",
            "color_column": "text_color",
            "secondaryColumns": ["material_id", "material_desc"],
            "secondary_columns": ["material_id", "material_desc"],
            "showBar": False,
            "show_bar": False,
            "showMetricValue": False,
            "show_metric_value": False,
            "keyFontSize": 28,
            "keyFontWeight": 800,
            "secondaryFontSize": 13,
            "secondaryColor": "#2B6CB0",
            "secondary_color": "#2B6CB0",
            "headerTitle": "Hot List",
            "header_title": "Hot List",
            "rowsPerItem": "2",
            "rows_per_item": "2",
            "row_limit": 10,
        }
    )

    # Slice 3: Center Gauge Top (44 POUNDS REPLENISHED)
    slice_gauge_top = upsert_slice(
        name="3-ToteFarm Gauge Top",
        viz_type="custom_gauge",
        dataset_name="demo_tf_gauge_replenished",
        params_dict={
            "metric": "gauge_val",
            "metrics": ["gauge_val"],
            "min": 0,
            "minVal": 0,
            "max": 100,
            "maxVal": 100,
            "startAngle": 180,
            "endAngle": 0,
            "colorMode": "intervals",
            "intervals": "33.3,66.7,100",
            "intervalColorIndices": "1,2,3",
            "intervalColors": "#DC2626,#EAB308,#16A34A",
            "interval_colors": "#DC2626,#EAB308,#16A34A",
            "showTickLabels": False,
            "show_tick_labels": False,
            "showAxisTick": False,
            "show_axis_tick": False,
            "showSplitLine": False,
            "show_split_line": False,
            "arcThickness": 28,
            "arc_thickness": 28,
            "needleWidth": 4,
            "needle_width": 4,
            "needleColor": "#0F2F57",
            "needle_color": "#0F2F57",
            "centerValSize": 36,
            "centerValWeight": "bold",
            "centerValColor": {"r": 234, "g": 179, "b": 8, "a": 1},
            "showCenterVal": True,
            "centerValOffsetY": "18%",
            "center_val_offset_y": "18%",
            "customSubtitle": "POUNDS\nREPLENISHED",
            "custom_subtitle": "POUNDS\nREPLENISHED",
            "subtitleOffsetY": "52%",
            "subtitle_offset_y": "52%",
            "subtitleFontSize": 13,
            "subtitle_font_size": 13,
            "subtitleFontWeight": "bold",
            "subtitle_font_weight": "bold",
            "subtitleColor": "#2B6CB0",
            "subtitle_color": "#2B6CB0",
            "valSuffix": "",
            "groupby": ["metric_name"],
            "row_limit": 10,
        }
    )

    # Slice 4: Center Gauge Bottom (12MT POUNDS REPLENISHED RECORD)
    slice_gauge_bottom = upsert_slice(
        name="3-ToteFarm Gauge Bottom",
        viz_type="custom_gauge",
        dataset_name="demo_tf_gauge_record",
        params_dict={
            "metric": "gauge_val",
            "metrics": ["gauge_val"],
            "min": 0,
            "minVal": 0,
            "max": 24,
            "maxVal": 24,
            "startAngle": 180,
            "endAngle": 0,
            "colorMode": "intervals",
            "intervals": "8,16,24",
            "intervalColorIndices": "1,2,3",
            "intervalColors": "#DC2626,#EAB308,#16A34A",
            "interval_colors": "#DC2626,#EAB308,#16A34A",
            "showTickLabels": False,
            "show_tick_labels": False,
            "showAxisTick": False,
            "show_axis_tick": False,
            "showSplitLine": False,
            "show_split_line": False,
            "arcThickness": 28,
            "arc_thickness": 28,
            "needleWidth": 4,
            "needle_width": 4,
            "needleColor": "#0F2F57",
            "needle_color": "#0F2F57",
            "centerValSize": 36,
            "centerValWeight": "bold",
            "centerValColor": {"r": 234, "g": 179, "b": 8, "a": 1},
            "showCenterVal": True,
            "centerValOffsetY": "18%",
            "center_val_offset_y": "18%",
            "customSubtitle": "POUNDS\nREPLENISHED\nRECORD",
            "custom_subtitle": "POUNDS\nREPLENISHED\nRECORD",
            "subtitleOffsetY": "52%",
            "subtitle_offset_y": "52%",
            "subtitleFontSize": 13,
            "subtitle_font_size": 13,
            "subtitleFontWeight": "bold",
            "subtitle_font_weight": "bold",
            "subtitleColor": "#2B6CB0",
            "subtitle_color": "#2B6CB0",
            "valSuffix": "MT",
            "val_suffix": "MT",
            "groupby": ["metric_name"],
            "row_limit": 10,
        }
    )

    # Slice 5: Upcoming Movements (Badge 32, Material IDs in Gold/Blue, Weights in Steel Blue)
    slice_upcoming = upsert_slice(
        name="3-ToteFarm Upcoming Movements",
        viz_type="unified_list_bar",
        dataset_name="demo_tf_upcoming",
        params_dict={
            "keyColumn": "material_id",
            "key_column": "material_id",
            "keySubColumn": "material_desc",
            "key_sub_column": "material_desc",
            "keySubFontSize": 13,
            "key_sub_font_size": 13,
            "keySubColor": "#2B6CB0",
            "key_sub_color": "#2B6CB0",
            "colorColumn": "text_color",
            "color_column": "text_color",
            "secondaryColumns": [],
            "secondary_columns": [],
            "displayValueColumn": "quantity_str",
            "display_value_column": "quantity_str",
            "displayValueColor": "#2B6CB0",
            "display_value_color": "#2B6CB0",
            "headerTitle": "Upcoming Movements",
            "header_title": "Upcoming Movements",
            "headerBadge": "32",
            "header_badge": "32",
            "headerBadgeColor": "#DC2626",
            "header_badge_color": "#DC2626",
            "showBar": False,
            "show_bar": False,
            "showMetricValue": False,
            "show_metric_value": False,
            "keyFontSize": 28,
            "keyFontWeight": 800,
            "secondaryFontSize": 13,
            "secondaryColor": "#2B6CB0",
            "secondary_color": "#2B6CB0",
            "displayValueFontSize": 26,
            "display_value_font_size": 26,
            "rowsPerItem": "2",
            "rows_per_item": "2",
            "row_limit": 10,
        }
    )

    # Slice 6: Sidebar Capacity Speedometer
    slice_capacity = upsert_slice(
        name="3-ToteFarm Capacity Speedometer",
        viz_type="custom_gauge",
        dataset_name="demo_tf_capacity",
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

    # Slice 7: Sidebar Resources Status
    slice_resources = upsert_slice(
        name="3-ToteFarm Resources Status",
        viz_type="kpi_dual_column_card",
        dataset_name="demo_tf_resources",
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

    # Slice 8: Sidebar Equipment (Combined Forklift & Blower Fan)
    slice_equipment = upsert_slice(
        name="3-ToteFarm Equipment Card",
        viz_type="kpi_dual_column_card",
        dataset_name="demo_tf_equipment",
        params_dict={
            "keyColumn": "status",
            "key_column": "status",
            "valueColumn": "count",
            "value_column": "count",
            "groupColumn": "section",
            "group_column": "section",
            "valTextColorColumn": "text_color",
            "val_text_color_column": "text_color",
            "keyFontSize": 13,
            "valueFontSize": 22,
            "keyFontWeight": 700,
            "valueFontWeight": 800,
            "globalKeyColor": "#374151",
            "headerMode": "none",
            "header_mode": "none",
            "iconSize": 54,
            "iconColor": "#111827",
            "iconSpacing": 6,
            "containerBgColor": "#FAF6EE",
            "container_bg_color": "#FAF6EE",
            "borderRadius": 10,
            "border_radius": 10,
            "containerPadding": 14,
            "enableShadow": False,
            "enable_shadow": False,
            "rowSpacing": 6,
            "row_spacing": 6,
            "row_limit": 10,
        }
    )

    all_slices = [
        slice_header,
        slice_hotlist,
        slice_gauge_top,
        slice_gauge_bottom,
        slice_upcoming,
        slice_capacity,
        slice_resources,
        slice_equipment,
    ]

    # 5. Build Position JSON Layout (24 columns total: HotList [6], DualGauges [4], Upcoming [10], RightSidebar [4])
    print(">>> Assembling 24-Column Full-Width Position JSON...")
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
        # Main Body Row containing 4 columns: Hot List (6), Dual Gauges (4), Upcoming Movements (10), Right Sidebar (4)
        "ROW_BODY": {
            "type": "ROW",
            "id": "ROW_BODY",
            "parents": ["ROOT_ID", "GRID_ID"],
            "children": ["COL_HOT_LIST", "COL_DUAL_GAUGES", "COL_UPCOMING", "COL_RIGHT"],
            "meta": {"background": "BACKGROUND_TRANSPARENT"}
        },
        # 1. Hot List Column (6 columns out of 24 = 25%)
        "COL_HOT_LIST": {
            "type": "COLUMN",
            "id": "COL_HOT_LIST",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_HOT_LIST"],
            "meta": {"width": 6}
        },
        "CHART_HOT_LIST": {
            "type": "CHART",
            "id": "CHART_HOT_LIST",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_HOT_LIST"],
            "children": [],
            "meta": {
                "chartId": slice_hotlist.id,
                "sliceName": slice_hotlist.slice_name,
                "uuid": str(slice_hotlist.uuid),
                "width": 6,
                "height": 95
            }
        },
        # 2. Center Dual Gauges Column (4 columns out of 24 = 16.67%)
        "COL_DUAL_GAUGES": {
            "type": "COLUMN",
            "id": "COL_DUAL_GAUGES",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_GAUGE_TOP", "CHART_GAUGE_BOTTOM"],
            "meta": {"width": 4}
        },
        "CHART_GAUGE_TOP": {
            "type": "CHART",
            "id": "CHART_GAUGE_TOP",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_DUAL_GAUGES"],
            "children": [],
            "meta": {
                "chartId": slice_gauge_top.id,
                "sliceName": slice_gauge_top.slice_name,
                "uuid": str(slice_gauge_top.uuid),
                "width": 4,
                "height": 46
            }
        },
        "CHART_GAUGE_BOTTOM": {
            "type": "CHART",
            "id": "CHART_GAUGE_BOTTOM",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_DUAL_GAUGES"],
            "children": [],
            "meta": {
                "chartId": slice_gauge_bottom.id,
                "sliceName": slice_gauge_bottom.slice_name,
                "uuid": str(slice_gauge_bottom.uuid),
                "width": 4,
                "height": 46
            }
        },
        # 3. Upcoming Movements Column (10 columns out of 24 = 41.67%)
        "COL_UPCOMING": {
            "type": "COLUMN",
            "id": "COL_UPCOMING",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_UPCOMING"],
            "meta": {"width": 10}
        },
        "CHART_UPCOMING": {
            "type": "CHART",
            "id": "CHART_UPCOMING",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_UPCOMING"],
            "children": [],
            "meta": {
                "chartId": slice_upcoming.id,
                "sliceName": slice_upcoming.slice_name,
                "uuid": str(slice_upcoming.uuid),
                "width": 10,
                "height": 95
            }
        },
        # 4. Right Sidebar (4 columns out of 24 = 16.67%)
        "COL_RIGHT": {
            "type": "COLUMN",
            "id": "COL_RIGHT",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_CAPACITY", "CHART_RESOURCES", "CHART_EQUIPMENT"],
            "meta": {"width": 4}
        },
        "CHART_CAPACITY": {
            "type": "CHART",
            "id": "CHART_CAPACITY",
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
        "CHART_EQUIPMENT": {
            "type": "CHART",
            "id": "CHART_EQUIPMENT",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_RIGHT"],
            "children": [],
            "meta": {
                "chartId": slice_equipment.id,
                "sliceName": slice_equipment.slice_name,
                "uuid": str(slice_equipment.uuid),
                "width": 4,
                "height": 52
            }
        },
    }

    # 6. Custom CSS for Big-Screen Aesthetics
    custom_css = """
/* OpsPilot 3-ToteFarm Industrial Big-Screen Theme */
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
    print(">>> Creating/Updating Dashboard '3-ToteFarm'...")
    dash = db.session.query(Dashboard).filter(
        (Dashboard.slug == "3-totefarm") | (Dashboard.dashboard_title == "3-ToteFarm")
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
            dashboard_title="3-ToteFarm",
            slug="3-totefarm",
            position_json=json.dumps(position_json, indent=2),
            css=custom_css,
            json_metadata=json.dumps(metadata),
            slices=all_slices,
            published=True,
            uuid=str(uuid.uuid4()),
        )
        db.session.add(dash)
    else:
        dash.dashboard_title = "3-ToteFarm"
        dash.slug = "3-totefarm"
        dash.position_json = json.dumps(position_json, indent=2)
        dash.css = custom_css
        dash.json_metadata = json.dumps(metadata)
        dash.slices = all_slices
        dash.published = True

    db.session.commit()
    print(f">>> Dashboard '3-ToteFarm' is ready!")
    print(f">>> Dashboard ID: {dash.id}, Slug: {dash.slug}")
    print(f">>> Access at: /opspilot/dashboard/{dash.slug}/")
