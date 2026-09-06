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
Seed script for OpsPilot '5-Small Pours' big-screen industrial dashboard.
Creates:
  1. Demo PostgreSQL/SQLite tables & data for Dashboard #5.
  2. Superset datasets (SqlaTable) and SqlMetrics.
  3. Slices for custom plugins (Utility Bar, Active Work Orders with progress bars
     and warning alert, 3 Center Gauges for WIP/TODAY/WEEK, Upcoming Work Orders
     with BY PRIORITY subtitle, Sidebar Capacity, and Resources Status).
  4. '5-Small Pours' Dashboard with 24-column layout and OpsPilot big-screen CSS.
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

    print(">>> Starting 5-Small Pours Dashboard Seeding...")

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

    # 2. Define & seed demo tables for Dashboard #5
    print(">>> Creating and populating demo tables for 5-Small Pours...")

    # Drop existing demo tables
    drop_tables = [
        "DROP TABLE IF EXISTS demo_sp_header CASCADE;",
        "DROP TABLE IF EXISTS demo_sp_active CASCADE;",
        "DROP TABLE IF EXISTS demo_sp_gauge_wip CASCADE;",
        "DROP TABLE IF EXISTS demo_sp_gauge_today CASCADE;",
        "DROP TABLE IF EXISTS demo_sp_gauge_week CASCADE;",
        "DROP TABLE IF EXISTS demo_sp_upcoming CASCADE;",
        "DROP TABLE IF EXISTS demo_sp_capacity CASCADE;",
        "DROP TABLE IF EXISTS demo_sp_resources CASCADE;",
    ]
    for d_stmt in drop_tables:
        try:
            execute_sql([d_stmt])
        except Exception:
            try:
                execute_sql([d_stmt.replace(" CASCADE;", ";")])
            except Exception as ex:
                print(f"Warning dropping table: {ex}")

    # Create tables
    create_statements = [
        """
        CREATE TABLE demo_sp_header (
            id INTEGER PRIMARY KEY,
            title VARCHAR(255)
        );
        """,
        """
        CREATE TABLE demo_sp_active (
            id INTEGER PRIMARY KEY,
            order_id VARCHAR(100),
            operator VARCHAR(100),
            material_id VARCHAR(100),
            material_desc VARCHAR(255),
            remaining_count VARCHAR(50),
            progress_pct INTEGER,
            severity INTEGER,
            text_color VARCHAR(50),
            bar_color VARCHAR(50),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_sp_gauge_wip (
            id INTEGER PRIMARY KEY,
            metric_name VARCHAR(100),
            gauge_val INTEGER
        );
        """,
        """
        CREATE TABLE demo_sp_gauge_today (
            id INTEGER PRIMARY KEY,
            metric_name VARCHAR(100),
            gauge_val INTEGER
        );
        """,
        """
        CREATE TABLE demo_sp_gauge_week (
            id INTEGER PRIMARY KEY,
            metric_name VARCHAR(100),
            gauge_val INTEGER
        );
        """,
        """
        CREATE TABLE demo_sp_upcoming (
            id INTEGER PRIMARY KEY,
            order_id VARCHAR(100),
            material_id VARCHAR(100),
            material_desc VARCHAR(255),
            priority_count VARCHAR(50),
            row_order INTEGER
        );
        """,
        """
        CREATE TABLE demo_sp_capacity (
            id INTEGER PRIMARY KEY,
            metric_name VARCHAR(100),
            capacity_val INTEGER
        );
        """,
        """
        CREATE TABLE demo_sp_resources (
            id INTEGER PRIMARY KEY,
            department VARCHAR(100),
            status VARCHAR(100),
            box_color VARCHAR(50),
            row_order INTEGER
        );
        """,
    ]
    execute_sql(create_statements)

    # Populate demo data matching screenshot
    insert_statements = [
        # 1. Header
        "INSERT INTO demo_sp_header (id, title) VALUES (1, '5-Small Pours');",

        # 2. Active Work Orders (6 rows)
        "INSERT INTO demo_sp_active (id, order_id, operator, material_id, material_desc, remaining_count, progress_pct, severity, text_color, bar_color, row_order) VALUES (1, '9085884', 'JOHN K.', '3214564', 'POLY OX FRAG OIL 235', '16', 5, 0, '#EAB308', '#EAB308', 1);",
        "INSERT INTO demo_sp_active (id, order_id, operator, material_id, material_desc, remaining_count, progress_pct, severity, text_color, bar_color, row_order) VALUES (2, '9085884', 'PETER V.', '3214564', 'POLY OX FRAG OIL 235', '8', 30, 0, '#EAB308', '#EAB308', 2);",
        "INSERT INTO demo_sp_active (id, order_id, operator, material_id, material_desc, remaining_count, progress_pct, severity, text_color, bar_color, row_order) VALUES (3, '9085884', 'JEFF B.', '3214564', 'POLY OX FRAG OIL 235', '12', 75, 0, '#EAB308', '#EAB308', 3);",
        "INSERT INTO demo_sp_active (id, order_id, operator, material_id, material_desc, remaining_count, progress_pct, severity, text_color, bar_color, row_order) VALUES (4, '9085884', 'DEB C', '3214564', 'POLY OX FRAG OIL 235', '18', 15, 1, '#EAB308', '#EAB308', 4);",
        "INSERT INTO demo_sp_active (id, order_id, operator, material_id, material_desc, remaining_count, progress_pct, severity, text_color, bar_color, row_order) VALUES (5, '9085884', 'JOHN K.', '3214564', 'POLY OX FRAG OIL 235', '5', 40, 0, '#EAB308', '#EAB308', 5);",
        "INSERT INTO demo_sp_active (id, order_id, operator, material_id, material_desc, remaining_count, progress_pct, severity, text_color, bar_color, row_order) VALUES (6, '9085884', 'JOHN K.', '3214564', 'POLY OX FRAG OIL 235', '9', 100, 0, '#16A34A', '#16A34A', 6);",

        # 3. Center Triple Gauges (23 WIP, 12 TODAY, 12 WEEK)
        "INSERT INTO demo_sp_gauge_wip (id, metric_name, gauge_val) VALUES (1, 'WIP', 23);",
        "INSERT INTO demo_sp_gauge_today (id, metric_name, gauge_val) VALUES (1, 'TODAY', 12);",
        "INSERT INTO demo_sp_gauge_week (id, metric_name, gauge_val) VALUES (1, 'WEEK', 12);",

        # 4. Upcoming Work Orders (6 rows)
        "INSERT INTO demo_sp_upcoming (id, order_id, material_id, material_desc, priority_count, row_order) VALUES (1, '9085884', '3214564', 'POLY OX FRAG OIL 235', '16', 1);",
        "INSERT INTO demo_sp_upcoming (id, order_id, material_id, material_desc, priority_count, row_order) VALUES (2, '9085884', '3214564', 'POLY OX FRAG OIL 235', '20', 2);",
        "INSERT INTO demo_sp_upcoming (id, order_id, material_id, material_desc, priority_count, row_order) VALUES (3, '9085884', '3214564', 'POLY OX FRAG OIL 235', '4', 3);",
        "INSERT INTO demo_sp_upcoming (id, order_id, material_id, material_desc, priority_count, row_order) VALUES (4, '9085884', '3214564', 'POLY OX FRAG OIL 235', '5', 4);",
        "INSERT INTO demo_sp_upcoming (id, order_id, material_id, material_desc, priority_count, row_order) VALUES (5, '9085884', '3214564', 'POLY OX FRAG OIL 235', '18', 5);",
        "INSERT INTO demo_sp_upcoming (id, order_id, material_id, material_desc, priority_count, row_order) VALUES (6, '9085884', '3214564', 'POLY OX FRAG OIL 235', '16', 6);",

        # 5. Right Sidebar Capacity (23 CAPACITY)
        "INSERT INTO demo_sp_capacity (id, metric_name, capacity_val) VALUES (1, 'CAPACITY', 23);",

        # 6. Right Sidebar Resources (Receiving OK, WH Replenish -1, Tote Farm 3)
        "INSERT INTO demo_sp_resources (id, department, status, box_color, row_order) VALUES (1, 'Receiving', 'OK', '#B73229', 1);",
        "INSERT INTO demo_sp_resources (id, department, status, box_color, row_order) VALUES (2, 'WH Replenish', '-1', '#E5A000', 2);",
        "INSERT INTO demo_sp_resources (id, department, status, box_color, row_order) VALUES (3, 'Tote Farm', '3', '#9C381E', 3);",
    ]
    execute_sql(insert_statements)
    print(">>> Tables created and populated successfully.")

    # 3. Register or sync SqlaTable datasets in Superset
    print(">>> Registering Superset datasets...")
    table_names = [
        "demo_sp_header",
        "demo_sp_active",
        "demo_sp_gauge_wip",
        "demo_sp_gauge_today",
        "demo_sp_gauge_week",
        "demo_sp_upcoming",
        "demo_sp_capacity",
        "demo_sp_resources",
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

    ensure_metric("demo_sp_gauge_wip", "gauge_val", "MAX(gauge_val)")
    ensure_metric("demo_sp_gauge_today", "gauge_val", "MAX(gauge_val)")
    ensure_metric("demo_sp_gauge_week", "gauge_val", "MAX(gauge_val)")
    ensure_metric("demo_sp_capacity", "capacity_val", "MAX(capacity_val)")

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

    # Create Slices for Dashboard #5 ('5-Small Pours')
    print(">>> Creating Chart Slices for 5-Small Pours...")

    # Slice 1: Header Utility Bar
    slice_header = upsert_slice(
        name="5-Small Pours Utility Bar",
        viz_type="dashboard_utility_bar",
        dataset_name="demo_sp_header",
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

    # Slice 2: Active Work Orders (with operator, 2-line material, warning triangle, progress bar)
    slice_active = upsert_slice(
        name="5-Small Pours Active Work Orders",
        viz_type="unified_list_bar",
        dataset_name="demo_sp_active",
        params_dict={
            "keyColumn": "order_id",
            "key_column": "order_id",
            "colorColumn": "text_color",
            "color_column": "text_color",
            "keySubColumn": "operator",
            "key_sub_column": "operator",
            "keySubFontSize": 13,
            "key_sub_font_size": 13,
            "keySubColor": "#4B5563",
            "key_sub_color": "#4B5563",
            "secondaryColumns": ["material_id", "material_desc"],
            "secondary_columns": ["material_id", "material_desc"],
            "secondaryFontSize": 13,
            "secondary_font_size": 13,
            "secondaryColor": "#2B6CB0",
            "secondary_color": "#2B6CB0",
            "displayValueColumn": "remaining_count",
            "display_value_column": "remaining_count",
            "displayValueColor": "#2B6CB0",
            "display_value_color": "#2B6CB0",
            "displayValueFontSize": 26,
            "display_value_font_size": 26,
            "severityColumn": "severity",
            "severity_column": "severity",
            "metricColumn": "progress_pct",
            "metric_column": "progress_pct",
            "maxMetricValue": 100,
            "showBar": True,
            "show_bar": True,
            "showMetricValue": False,
            "show_metric_value": False,
            "keyFontSize": 28,
            "keyFontWeight": 800,
            "headerTitle": "Active Work Orders",
            "header_title": "Active Work Orders",
            "row_limit": 10,
        }
    )

    # Slice 3: Center Gauge 1 - WIP
    slice_gauge_wip = upsert_slice(
        name="5-Small Pours Gauge WIP",
        viz_type="custom_gauge",
        dataset_name="demo_sp_gauge_wip",
        params_dict={
            "metric": "gauge_val",
            "metrics": ["gauge_val"],
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
            "arc_thickness": 24,
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
            "customSubtitle": "WIP",
            "custom_subtitle": "WIP",
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

    # Slice 4: Center Gauge 2 - TODAY
    slice_gauge_today = upsert_slice(
        name="5-Small Pours Gauge Today",
        viz_type="custom_gauge",
        dataset_name="demo_sp_gauge_today",
        params_dict={
            "metric": "gauge_val",
            "metrics": ["gauge_val"],
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
            "arc_thickness": 24,
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
            "customSubtitle": "TODAY",
            "custom_subtitle": "TODAY",
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

    # Slice 5: Center Gauge 3 - WEEK
    slice_gauge_week = upsert_slice(
        name="5-Small Pours Gauge Week",
        viz_type="custom_gauge",
        dataset_name="demo_sp_gauge_week",
        params_dict={
            "metric": "gauge_val",
            "metrics": ["gauge_val"],
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
            "arc_thickness": 24,
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
            "customSubtitle": "WEEK",
            "custom_subtitle": "WEEK",
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

    # Slice 6: Upcoming Work Orders BY PRIORITY
    slice_upcoming = upsert_slice(
        name="5-Small Pours Upcoming Work Orders",
        viz_type="unified_list_bar",
        dataset_name="demo_sp_upcoming",
        params_dict={
            "keyColumn": "order_id",
            "key_column": "order_id",
            "keyColor": "#2B6CB0",
            "key_color": "#2B6CB0",
            "secondaryColumns": ["material_id", "material_desc"],
            "secondary_columns": ["material_id", "material_desc"],
            "secondaryFontSize": 13,
            "secondary_font_size": 13,
            "secondaryColor": "#2B6CB0",
            "secondary_color": "#2B6CB0",
            "displayValueColumn": "priority_count",
            "display_value_column": "priority_count",
            "displayValueColor": "#2B6CB0",
            "display_value_color": "#2B6CB0",
            "displayValueFontSize": 26,
            "display_value_font_size": 26,
            "showBar": False,
            "show_bar": False,
            "showMetricValue": False,
            "show_metric_value": False,
            "keyFontSize": 28,
            "keyFontWeight": 800,
            "headerTitle": "Upcoming Work Orders",
            "header_title": "Upcoming Work Orders",
            "headerSubtitle": "BY PRIORITY",
            "header_subtitle": "BY PRIORITY",
            "headerSubtitleColor": "#2B6CB0",
            "header_subtitle_color": "#2B6CB0",
            "row_limit": 10,
        }
    )

    # Slice 7: Sidebar Capacity Speedometer
    slice_capacity = upsert_slice(
        name="5-Small Pours Capacity Speedometer",
        viz_type="custom_gauge",
        dataset_name="demo_sp_capacity",
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

    # Slice 8: Sidebar Resources Status
    slice_resources = upsert_slice(
        name="5-Small Pours Resources Status",
        viz_type="kpi_dual_column_card",
        dataset_name="demo_sp_resources",
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

    all_slices = [
        slice_header,
        slice_active,
        slice_gauge_wip,
        slice_gauge_today,
        slice_gauge_week,
        slice_upcoming,
        slice_capacity,
        slice_resources,
    ]

    # 5. Build Position JSON Layout (24 columns total: Active [8], 3 Center Gauges [4], Upcoming [8], RightSidebar [4])
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
        # Main Body Row containing 4 columns: Active (8), Gauges (4), Upcoming (8), Right Sidebar (4)
        "ROW_BODY": {
            "type": "ROW",
            "id": "ROW_BODY",
            "parents": ["ROOT_ID", "GRID_ID"],
            "children": ["COL_ACTIVE", "COL_GAUGES", "COL_UPCOMING", "COL_RIGHT"],
            "meta": {"background": "BACKGROUND_TRANSPARENT"}
        },
        # 1. Active Work Orders Column (8 columns out of 24 = 33.33%)
        "COL_ACTIVE": {
            "type": "COLUMN",
            "id": "COL_ACTIVE",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_ACTIVE"],
            "meta": {"width": 8}
        },
        "CHART_ACTIVE": {
            "type": "CHART",
            "id": "CHART_ACTIVE",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_ACTIVE"],
            "children": [],
            "meta": {
                "chartId": slice_active.id,
                "sliceName": slice_active.slice_name,
                "uuid": str(slice_active.uuid),
                "width": 8,
                "height": 95
            }
        },
        # 2. Center Triple Gauges Column (4 columns out of 24 = 16.67%)
        "COL_GAUGES": {
            "type": "COLUMN",
            "id": "COL_GAUGES",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_GAUGE_WIP", "CHART_GAUGE_TODAY", "CHART_GAUGE_WEEK"],
            "meta": {"width": 4}
        },
        "CHART_GAUGE_WIP": {
            "type": "CHART",
            "id": "CHART_GAUGE_WIP",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_GAUGES"],
            "children": [],
            "meta": {
                "chartId": slice_gauge_wip.id,
                "sliceName": slice_gauge_wip.slice_name,
                "uuid": str(slice_gauge_wip.uuid),
                "width": 4,
                "height": 31
            }
        },
        "CHART_GAUGE_TODAY": {
            "type": "CHART",
            "id": "CHART_GAUGE_TODAY",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_GAUGES"],
            "children": [],
            "meta": {
                "chartId": slice_gauge_today.id,
                "sliceName": slice_gauge_today.slice_name,
                "uuid": str(slice_gauge_today.uuid),
                "width": 4,
                "height": 31
            }
        },
        "CHART_GAUGE_WEEK": {
            "type": "CHART",
            "id": "CHART_GAUGE_WEEK",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY", "COL_GAUGES"],
            "children": [],
            "meta": {
                "chartId": slice_gauge_week.id,
                "sliceName": slice_gauge_week.slice_name,
                "uuid": str(slice_gauge_week.uuid),
                "width": 4,
                "height": 31
            }
        },
        # 3. Upcoming Work Orders Column (8 columns out of 24 = 33.33%)
        "COL_UPCOMING": {
            "type": "COLUMN",
            "id": "COL_UPCOMING",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_UPCOMING"],
            "meta": {"width": 8}
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
                "width": 8,
                "height": 95
            }
        },
        # 4. Right Sidebar (4 columns out of 24 = 16.67%)
        "COL_RIGHT": {
            "type": "COLUMN",
            "id": "COL_RIGHT",
            "parents": ["ROOT_ID", "GRID_ID", "ROW_BODY"],
            "children": ["CHART_CAPACITY", "CHART_RESOURCES"],
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
                "height": 36
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
                "height": 34
            }
        },
    }

    # 6. Custom CSS for Big-Screen Aesthetics
    custom_css = """
/* OpsPilot 5-Small Pours Industrial Big-Screen Theme */
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
    print(">>> Creating/Updating Dashboard '5-Small Pours'...")
    dash = db.session.query(Dashboard).filter(
        (Dashboard.slug == "5-small-pours") | (Dashboard.dashboard_title == "5-Small Pours")
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
            dashboard_title="5-Small Pours",
            slug="5-small-pours",
            position_json=json.dumps(position_json, indent=2),
            css=custom_css,
            json_metadata=json.dumps(metadata),
            slices=all_slices,
            published=True,
            uuid=str(uuid.uuid4()),
        )
        db.session.add(dash)
    else:
        dash.dashboard_title = "5-Small Pours"
        dash.slug = "5-small-pours"
        dash.position_json = json.dumps(position_json, indent=2)
        dash.css = custom_css
        dash.json_metadata = json.dumps(metadata)
        dash.slices = all_slices
        dash.published = True

    db.session.commit()
    print(f">>> Dashboard '5-Small Pours' is ready!")
    print(f">>> Dashboard ID: {dash.id}, Slug: {dash.slug}")
    print(f">>> Access at: /opspilot/dashboard/{dash.slug}/")
