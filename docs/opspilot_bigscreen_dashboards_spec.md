# OpsPilot Big-Screen Industrial Dashboard Specification & Research

## 1. Executive Summary & Goals
This document provides a comprehensive analysis of the **14 industrial plant floor dashboards** shown in the client's specification PDF. The goal is to deploy these dashboards onto **large TV/plant screens** with high visual density, high contrast, zero scrolling, and real-time operational metrics.

### Key Objectives:
1. **Big-Screen TV Optimization**: Pixel-perfect layout with high-contrast visual cues (red/amber/green status, large typography, instant readability from distance).
2. **Dashboard Grid Enhancement**: Increase Superset's default 12-column grid (`GRID_COLUMN_COUNT = 12`) to **24 columns** to enable precise multi-column layout alignment without wasted whitespace.
3. **Custom Plugin Reuse & Gap Analysis**: Map out existing custom plugins (Gauge, Utility Bar, Dual Column KPI, Unified List Bar/Arrow) and define any new custom plugins required (Parking Bay Matrix, Bulk Loading Flow Card, Elevator Graphic).
4. **Independent Dashboard Mapping**: Detail the exact widgets, data structures, and layout requirements for all 14 screens.

---

## 2. Dashboard Grid Enhancement Research

### Current Architecture (`GRID_COLUMN_COUNT = 12`)
In Apache Superset, dashboard layouts use a fixed grid system defined in `superset-frontend/src/dashboard/util/constants.ts`:
- `GRID_COLUMN_COUNT = 12`
- `GRID_DEFAULT_CHART_WIDTH = 4`
- `GRID_BASE_UNIT = 8` (8px base padding/gutter)
- `GRID_GUTTER_SIZE = 16px`

### The Big-Screen Problem:
With only 12 columns, widgets can only be sized at 8.33% increments (1/12, 2/12, 3/12...). On a 1080p (1920x1080) or 4K (3840x2160) big screen:
- A 3-column widget takes **480px** (too wide for single KPI cards or vertical sidebars).
- A 2-column widget takes **320px** (often too wide or too narrow for sidebars like the persistent 240px right panel).
- Complex cards (like the 10-bay parking matrix on Page 7 or dual-vessel columns on Page 8) require precise 5-column or 10-column distributions that cannot be represented cleanly in a 12-column grid.

### Solution: 24-Column Sub-Grid System
1. **Update `constants.ts`**:
   - `export const GRID_COLUMN_COUNT = 24;`
   - `export const GRID_DEFAULT_CHART_WIDTH = 6;`
   - `export const GRID_MIN_COLUMN_COUNT = 1;`
2. **Component Resizing Calculation**:
   - Grid width calculation in `getComponentWidth.ts` and `gridWidths.ts` scales proportionally (`(colSpan / GRID_COLUMN_COUNT) * 100%`).
3. **Big-Screen Canvas Preset**:
   - Add a fixed 16:9 widescreen canvas wrapper (`1920x1080` / `3840x2160`) for plant display mode with auto-scaling (`transform: scale(...)` or CSS grid).

---

## 3. Persistent Global Elements (The OpsPilot TV Shell)

Every dashboard across all 14 pages shares a consistent, unified layout shell:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [TOP HEADER UTILITY BAR]                                                               │
│ Title: e.g. "1-Receiving"                   Date/Time: "Feb 22, 2026 7:01:25 PM" [☀️]  │
├───────────────────────────────────────────────────────────────────┬────────────────────┤
│                                                                   │ [RIGHT SIDEBAR]    │
│                                                                   │ ┌────────────────┐ │
│                                                                   │ │ Capacity Gauge │ │
│                      MAIN OPERATIONAL CANVAS                      │ └────────────────┘ │
│                     (20 / 24 Columns Width)                       │ ┌────────────────┐ │
│                                                                   │ │ Resources List │ │
│   - Hot Lists / Work Orders                                       │ └────────────────┘ │
│   - Central Throughput / WIP Gauges                               │ ┌────────────────┐ │
│   - Material Movement / Bay Status Grid                           │ │ Equipment/Cart │ │
│                                                                   │ └────────────────┘ │
│                                                                   │ [OpsPilot Logo]    │
└───────────────────────────────────────────────────────────────────┴────────────────────┘
```

1. **Top Header**: `plugin-chart-dashboard-utility-bar`
   - Background: Dark Blue (`#0B4F8A` / `#0A3D62`)
   - Left: Dashboard Name in Bold White (e.g., `1-Receiving`, `8-Clusters & Mixing`, `10-LOW Flash Compounding & Replenishment 72°F`)
   - Right: Live Clock, Current Date, Weather icon & Ambient Temperature
2. **Right Sidebar**:
   - **Capacity Semicircle Gauge**: `plugin-chart-custom-gauge` (Red-Yellow-Green arc with center value `23`).
   - **Resources Status Table**: `plugin-chart-kpi-dual-column-card` (`Receiving: OK`, `WH Replenish: -1`, `Tote Farm: 3`).
   - **Equipment Counter Card**: `plugin-chart-kpi-dual-column-card` (Forklift charging / Clean pots / In use).
   - **OpsPilot Footer Logo**: `superset-logo-horiz.png`.

---

## 4. Deep Page-by-Page Breakdown & Chart Mapping

---

### Dashboard 1: `1-Receiving`
* **Purpose**: Monitor incoming raw materials, dock door demurrage risks, and bulk tanker loading.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (8 cols)**:
    - `Hot List`: Top 4 urgent POs (`PO220202`, `POLY OX FRAG OIL 235`, `3214564`).
    - `Bulk Loading`: Visual tanker truck graphic + Work Order (`2544434`) + Status (`LOADING` / `AWAITING QC` / `QC APPROVED`) + Destination Tank (`BK-2`, `BK-4`) + Elapsed Timer (`2:43`).
  - **Center Section (12 cols)**:
    - `Upcoming Deliveries`: Next scheduled PO deliveries list.
    - `Demurrage Risk Table`: High-urgency dock doors (`DOOR 5`, `DOOR 11`, `DOOR 2`) with color-coded countdown timers (`3:22` in Red, `2:15` in Orange).
  - **Right Sidebar (4 cols)**:
    - Capacity Gauge (23) + Resources Status (`OK`, `-1`, `3`) + Forklift Charging/In-Use (`Charging 1`, `In Use 2`).
* **Chart Plugins Needed**:
  - `plugin-chart-dashboard-utility-bar` (Header)
  - `plugin-chart-kpi-dual-column-card` (Hot List, Upcoming Deliveries, Demurrage Risk)
  - `plugin-chart-unified-list-arrow` / *Bulk Loading Flow Card* (Tanker loading flow)
  - `plugin-chart-custom-gauge` (Capacity gauge)

---

### Dashboard 2: `2-WH Replenishment`
* **Purpose**: Warehouse raw material replenishment from staging to tanks.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (6 cols)**:
    - `Hot List`: Tank replenishment priority list with color-coded tank IDs (`TK-254` Red, `TK-231` Red, `TK-112` Red, `TK-002` Yellow, `TK-056` Yellow, `TK-321` Dark).
  - **Center Section (14 cols)**:
    - Top Center: Dual Speedometer Gauges (`23 POUNDS REPLENISHED`, `23 POUNDS REPLENISHED RECORD`).
    - Bottom Center: `Upcoming Movements` list with batch header badge `32` (Red) + Material ID, Name, and Weight in Kg/CT (`250 Kg`, `750 Kg`, `6 CT`, `140 Kg`, `660 Kg`).
  - **Right Sidebar (4 cols)**:
    - Capacity Gauge + Resources + Forklift Status + Cleaning Equipment Status (`Clean 3`, `In Use 2`).
* **Chart Plugins Needed**:
  - `plugin-chart-dashboard-utility-bar`
  - `plugin-chart-unified-list-bar` (Hot List with colored indicators)
  - `plugin-chart-custom-gauge` (Dual Center Gauges + Top Right Capacity Gauge)
  - `plugin-chart-kpi-dual-column-card` (Upcoming Movements & Sidebar Equipment)

---

### Dashboard 3: `3-ToteFarm`
* **Purpose**: Tote farm replenishment throughput, tank levels, and upcoming tote transfers.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (6 cols)**: `Hot List` of Tote Tanks (`TK-254` through `TK-321`).
  - **Center Section (14 cols)**:
    - Dual Gauges: `44 POUNDS REPLENISHED`, `12MT POUNDS REPLENISHED RECORD`.
    - `Upcoming Movements` Table (Total `32` transfers pending, quantities in Kg/CT).
  - **Right Sidebar (4 cols)**: Capacity (23), Resources, Equipment Status.
* **Chart Plugins Needed**:
  - `plugin-chart-custom-gauge`, `plugin-chart-unified-list-bar`, `plugin-chart-kpi-dual-column-card`, `plugin-chart-dashboard-utility-bar`.

---

### Dashboard 4: `4-Elevator`
* **Purpose**: Material lift & elevator status between floors, queue management.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (6 cols)**: `Hot List` with active item indicator (`TK-231` checked).
  - **Center Section (6 cols)**: `Elevator Visualizer` (Elevator doors graphic, directional arrows showing up/down motion).
  - **Right-Center Section (8 cols)**: `Upcoming Movements` queue (`32` items pending).
  - **Right Sidebar (4 cols)**: Capacity gauge, Resources, Equipment.
* **Chart Plugins Needed**:
  - *New/Custom Component*: `plugin-chart-elevator-status` (or custom SVG graphic within unified-list/card)
  - `plugin-chart-custom-gauge`, `plugin-chart-kpi-dual-column-card`.

---

### Dashboard 5: `5-Small Pours`
* **Purpose**: Tracking manual/small ingredient pour execution, operator assignment, and throughput.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (8 cols)**: `Active Work Orders` with operator name (`JOHN K.`, `PETER V.`, `JEFF B.`, `DEB C`), progress bar, and remaining count with alert icon (`18 ⚠️`).
  - **Center Section (4 cols)**: 3 Semicircle Gauges (`23 WIP`, `12 TODAY`, `12 WEEK`).
  - **Right-Center Section (8 cols)**: `Upcoming Work Orders BY PRIORITY` (Batch priority ranks `16`, `20`, `4`, `5`, `18`, `16`).
  - **Right Sidebar (4 cols)**: Capacity Gauge, Resources.
* **Chart Plugins Needed**:
  - `plugin-chart-unified-list-bar` (Active Work Orders with operator & progress bar)
  - `plugin-chart-custom-gauge` (Triple vertical gauge stack)
  - `plugin-chart-kpi-dual-column-card` (Upcoming Work Orders)

---

### Dashboard 6: `6/7-Mobile Compounding`
* **Purpose**: Mobile compounding vessel tracking, operator allocations, and pot inventory.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (8 cols)**: `Active Work Orders` (Operator names, colored progress bars, remaining counts).
  - **Center Section (4 cols)**: Triple Gauges (`23 WIP`, `12 COMPLETED`, `12 COMPLETED`).
  - **Right-Center Section (8 cols)**: `Upcoming Work Orders BY PRIORITY`.
  - **Right Sidebar (4 cols)**: Capacity Gauge, Resources (`Mobile Comp: OK`, `Small Pours: -1`, `Tote Farm: 3`), Multi-equipment counter (`CLEAN POTS: 2`, `CLEAN DETACHABLE POTS: 5`, `CARTS IN USE: 9`).
* **Chart Plugins Needed**:
  - `plugin-chart-unified-list-bar`, `plugin-chart-custom-gauge`, `plugin-chart-kpi-dual-column-card`.

---

### Dashboard 7: `8-Clusters & Mixing`
* **Purpose**: Automated mixing clusters, mixing tanks, and 10 staging parking bays.
* **Layout Structure (24 Grid Columns)**:
  - **Top Left Section (7 cols)**: `CLUSTER` - Active Work Orders (`WO220202`) & Upcoming count `12`.
  - **Top Center Section (4 cols)**: Dual Throughput Gauges (`23`, `23`).
  - **Top Right-Center Section (9 cols)**: `MIXER` - Active Work Orders (`WO220202`) & Upcoming count `12`.
  - **Bottom Full Canvas (20 cols)**: `Parking Spot Bay Matrix (P1 through P10)`:
    - 10 Cards representing staging spots.
    - Each card displays: Spot ID (`P1`-`P10`), Work Order (`14302`), Due Date (`Jun 30`), Priority Flag, Machine Stage Tag (`Mixer` / `Mix Tank`), and Component Grid (`C1`, `C2`, `C3`, `BC` with quantities).
  - **Right Sidebar (4 cols)**: Capacity Gauge, Resources, Clean Pots, Clean Detachable Pots, Carts in Use.
* **Chart Plugins Needed**:
  - *New Custom Plugin*: `plugin-chart-parking-spot-matrix` (Renders 10-bay staging grid with bin matrices).
  - `plugin-chart-custom-gauge`, `plugin-chart-kpi-dual-column-card`.

---

### Dashboard 8: `9-Bulk Mixing`
* **Purpose**: Large-scale mixing vessels status, CIP (clean-in-place), drying, packout, and OEE.
* **Layout Structure (24 Grid Columns)**:
  - **Left Column (10 cols)**: Vessels `4`, `5`, `6`, `7`, `8`, `9` with vessel number badges, stage tags (`DRYING`, `CIP`, `CLEAN & WAITING` green, `CHARGING`, `PACKOUT`), progress bar, and remaining units.
  - **Center Column (10 cols)**: Vessels `:`, `;`, `<`, `43`, `44`, `45` with stage tags (`DRYING`, `MIXING`, `AWAITING QC`, `PACKOUT`).
  - **Right Sidebar (4 cols)**: Capacity Gauge, Resources Status, `OEE Donut Chart` (Overall Equipment Effectiveness slice).
* **Chart Plugins Needed**:
  - `plugin-chart-unified-list-bar` (Vessel cards with left badges and progress bars)
  - `plugin-chart-custom-gauge`, `plugin-chart-echarts` (Donut OEE), `plugin-chart-kpi-dual-column-card`.

---

### Dashboard 9: `10-LOW Flash Compounding & Replenishment`
* **Purpose**: Low flashpoint compounding safety zone monitoring (ambient temp `72°F`), cluster and mixer tracking.
* **Layout Structure (24 Grid Columns)**:
  - Header: Temperature callout `72 F`.
  - Left: `CLUSTER` (Active & Upcoming).
  - Center: Dual Semicircular Gauges (`23`, `23`).
  - Right-Center: `MIXER` (Active & Upcoming).
  - Right Sidebar: Capacity (23), Resources, Clean Pots (`2`), Detachable Pots (`5`), Carts in Use (`9`).
* **Chart Plugins Needed**:
  - `plugin-chart-dashboard-utility-bar` (with temp `72 F`), `plugin-chart-custom-gauge`, `plugin-chart-kpi-dual-column-card`.

---

### Dashboard 10: `11- Packout`
* **Purpose**: Finished goods packaging lines, operator countdowns, valve status, and multi-line OEE.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (8 cols)**: Packout Lines `4` through `;` with operator names and countdown timers (`16:24`, `18:08`, `12:12`, `5:18 ⚠️`).
  - **Center-Top Section (6 cols)**: Packout Lines `EN`, `OI`, `VS`, `US` with countdowns (`25:05`, `18:59`, `16:24`, `18:08`).
  - **Center-Bottom Section (6 cols)**: `Triple OEE Donut Charts` (Line efficiency breakdown).
  - **Right Sidebar (4 cols)**: Capacity Gauge, Resources, Clean Valves (`2`), Valves in Cleaning (`5`), Carts in Use (`9`), Awaiting QC Approval (`5`).
* **Chart Plugins Needed**:
  - `plugin-chart-unified-list-bar`, `plugin-chart-echarts` (Triple Donut Charts), `plugin-chart-kpi-dual-column-card`, `plugin-chart-custom-gauge`.

---

### Dashboard 11: `12- Cleaning`
* **Purpose**: Sanitation department queue, cleaning bottlenecks, and QC release approvals.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (10 cols)**: `Awaiting Cleaning` category count list (`Detachable Pots: 3`, `Valves: 2`, `Small Pots: 7`, `Medium Pots: 4`, `Scoops: 1`, `Mixer Blades: 3`) in large prominent font.
  - **Center Section (10 cols)**: `Awaiting QC Approval` high-priority banner with large count `3` (Gold/Amber).
  - **Right Sidebar (4 cols)**: Capacity Gauge (23), Resources, Large OpsPilot Brand Logo.
* **Chart Plugins Needed**:
  - `plugin-chart-kpi-dual-column-card`, `plugin-chart-custom-gauge`, `plugin-chart-dashboard-utility-bar`.

---

### Dashboard 12: `13- Shopfloor Replenishment`
* **Purpose**: Active and upcoming inventory transfer, including dedicated HotBox temperature-controlled staging.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (8 cols)**:
    - `Active Movements` (Count `4` in Red, list of weights).
    - `HotBox Active` (Red bordered box with count `2` and active lots).
  - **Center Section (4 cols)**: Dual Gauges (`23 POUNDS REPLENISHED`, `23 POUNDS REPLENISHED RECORD`).
  - **Right-Center Section (8 cols)**:
    - `Upcoming Movements` (Count `32` in Red).
    - `HotBox Upcoming` (Red bordered box with count `5` and items).
  - **Right Sidebar (4 cols)**: Capacity Gauge, Resources, Clean Valves (`2`), Valves in Cleaning (`5`), Carts in Use (`9`).
* **Chart Plugins Needed**:
  - `plugin-chart-unified-list-bar`, `plugin-chart-kpi-dual-column-card`, `plugin-chart-custom-gauge`.

---

### Dashboard 13: `14- QC`
* **Purpose**: Quality Control lab inspection queues, lot expirations, and sample tracking.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (6 cols)**:
    - `Hot List`: Priority tanks (`TK-254` to `TK-002`).
    - `Upcoming Expirations`: Materials nearing shelf-life limit.
  - **Center Section (4 cols)**: Dual Gauges (`23 INSPECTIONS TODAY`, `123 INSPECTIONS WEEK`).
  - **Right-Center Section (10 cols)**:
    - Top: `Awaiting Approval` (Count `32` Red, elapsed wait timers `14:13`, `4:55`, `3:34`, `30:44`).
    - Bottom: `Samples Tracking Table` (`Samples from Receiving: 4`, `Samples from Production: 7`, `Samples in Route: 2`, `Awaiting Approvals: 32`, `In QC: 15`).
  - **Right Sidebar (4 cols)**: Capacity Gauge (23), 3 Red Status Badges, Clean Valves (`2`), Valves in Cleaning (`5`), Carts in Use (`9`).
* **Chart Plugins Needed**:
  - `plugin-chart-kpi-dual-column-card`, `plugin-chart-custom-gauge`, `plugin-chart-unified-list-bar`.

---

### Dashboard 14: `15- Shipping`
* **Purpose**: Finished goods dispatch, demurrage timer alerts, and outbound freight staging.
* **Layout Structure (24 Grid Columns)**:
  - **Left Section (6 cols)**:
    - `Hot List`: Priority shipments with countdown timers.
    - `QC Rejected`: Lots blocked from shipping (`POLY OX FRAG OIL 235`).
  - **Center Section (6 cols)**:
    - Top: Gauge `23 SHIPPED TODAY`.
    - Bottom: `Demurrage Risk` table (`DOOR 5: 3:22 Red`, `DOOR 11: 2:15 Orange`, `DOOR 2: 2:06 Orange`).
  - **Right-Center Section (8 cols)**:
    - Top: `Awaiting Approval` with timers.
    - Bottom: `Shipping KPI Summary` (`Packed Awaiting QC: 32`, `QC Approved: 32`, `ToBe Shipped Today: 32`, `Awaiting Approvals: 32`, `In QC: 32`).
  - **Right Sidebar (4 cols)**: Capacity Gauge (23), 3 Red Status Indicator Badges.
* **Chart Plugins Needed**:
  - `plugin-chart-kpi-dual-column-card`, `plugin-chart-custom-gauge`, `plugin-chart-dashboard-utility-bar`.

---

## 5. Custom Chart Plugins Matrix & Development Plan

### Currently Available Plugins (Built in Workspace):
1. **`plugin-chart-dashboard-utility-bar`**:
   - Capabilities: Top header banner with title, subtitle, live clock, date, weather widget, and temperature callout (`72 F`).
   - Status: **Ready**. Matches the top blue header bar on all 14 screens.
2. **`plugin-chart-custom-gauge`**:
   - Capabilities: Semicircular speedometer gauge with red-yellow-green colored ranges, needle, center numeric value, and bottom label.
   - Status: **Ready**. Matches the `CAPACITY`, `WIP`, `POUNDS REPLENISHED`, `INSPECTIONS`, and `SHIPPED TODAY` gauges on all screens.
3. **`plugin-chart-kpi-dual-column-card`**:
   - Capabilities: Multi-row key-value table, optional header icon (forklift, agitator, clean pot), custom badge colors, and text alignment.
   - Status: **Ready**. Matches the Demurrage table, Resources list, Equipment status, and Summary metric cards.
4. **`plugin-chart-unified-list-bar`**:
   - Capabilities: Multi-row list with colored progress bars, operator name, sub-labels, and alert badges (`⚠️`).
   - Status: **Ready**. Matches Active Work Orders, Small Pours, Mobile Compounding, and Packout lines.
5. **`plugin-chart-unified-list-arrow`**:
   - Capabilities: Multi-row list with chevron/arrow process indicators.
   - Status: **Ready**.

---

### New Custom Plugins Required:

#### 1. **`plugin-chart-parking-spot-matrix`** (Required for Screen 8: *Clusters & Mixing*)
* **Description**: A specialized staging bay matrix component that renders 10 parking spots (`P1` to `P10`).
* **Visual Specification**:
  - Grid of cards (e.g. 5x2 or 2 rows of 5).
  - Each card contains:
    - Spot Title Header: `PARKING SPOT P1` ... `PARKING SPOT P10`.
    - Work Order Number (`14302`, `14307`) with `PRIORITY` red badge.
    - Due Date (`Jun 30`, `Jul 01`).
    - Machine Assignment Tag: Orange filled badge (`Mixer`, `Mix Tank`).
    - Component Grid: Sub-table with columns `C1`, `C2`, `C3`, `BC` showing bin quantities (`4`, `23`, `43`).

#### 2. **`plugin-chart-bulk-loading-card`** (Required for Screen 1: *Receiving*)
* **Description**: Flow visualization card showing tanker truck asset graphic, Work Order ID, Status sequence (`LOADING` / `AWAITING QC` / `QC APPROVED` / `QC REJECTED`), Destination Tank ID (`BK-2`), and Live Elapsed/Remaining Timer (`2:43`).

#### 3. **`plugin-chart-elevator-status`** (Required for Screen 4: *Elevator*)
* **Description**: Elevator shaft & lift visualization with animated directional arrows (up/down/idle) and current queue metrics.

---

## 6. Big-Screen Grid & CSS Optimization Plan

1. **24-Column Dashboard Layout Grid**:
   - Modify `GRID_COLUMN_COUNT = 24` in `superset-frontend/src/dashboard/util/constants.ts`.
   - Update `GRID_DEFAULT_CHART_WIDTH = 6` to keep drag-and-drop proportions intuitive.
2. **TV Display Mode (Full-Screen / Kiosk)**:
   - Provide a zero-scroll 100vh layout wrapper.
   - Disable chart title toolbars/headers when in TV mode so cards look like native hardware status screens.
3. **Data Refresh Strategy**:
   - Configure auto-refresh interval (e.g., 5s, 10s, 30s) per dashboard for real-time plant floor updates.
