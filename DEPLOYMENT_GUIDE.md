<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# OpsPilot Deployment Guide

This guide provides end-to-end instructions for deploying OpsPilot on a new machine (Windows, Linux, or macOS).

---

## 📋 System Prerequisites

1. **Docker & Docker Compose**:
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) OR Docker Engine + Docker Compose Plugin (Linux).
   - Ensure Docker Desktop is running before executing commands.
2. **Git**:
   - [Git SCM](https://git-scm.com/) installed.
3. **Node.js & npm** *(Only needed for local frontend development/HMR)*:
   - Node.js 18.x, 20.x, or 22.x.
4. **Hardware Recommendations**:
   - Minimum: 8 GB RAM (Docker allocated 6 GB+).
   - Recommended: 16 GB RAM.

---

## 🚀 Option A: Fast Runtime Deployment (Recommended)

This is the fastest method to deploy OpsPilot on any target server or machine. It uses the pre-configured runtime stack with PostgreSQL, Redis, Gunicorn, and Nginx.

### Step 1: Clone the Repository
```bash
git clone https://github.com/pran786/eenera-llc-superset.git
cd eenera-llc-superset
git checkout feature/custom-theme
```

### Step 2: Environment Setup
Ensure default configuration files are present in `docker/`:
```bash
# If docker/.env-local does not exist, copy from example
cp docker/.env-local.example docker/.env-local  # On Linux/macOS
# On Windows PowerShell:
# Copy-Item docker/.env-local.example docker/.env-local
```

### Step 3: Start Services
```bash
docker compose -f docker-compose-runtime.yml up -d
```

### Step 4: First-Time Initialization (Run Once on New Database)
If starting on a fresh database without existing data:
```bash
# 1. Run database migrations
docker compose -f docker-compose-runtime.yml exec superset superset db upgrade

# 2. Create the Admin User (Username: admin, Password: admin)
docker compose -f docker-compose-runtime.yml exec superset superset fab create-admin \
  --username admin \
  --firstname Admin \
  --lastname User \
  --email admin@opspilot.local \
  --password admin

# 3. Initialize default roles and permissions
docker compose -f docker-compose-runtime.yml exec superset superset init
```

### Step 5: Access the Application
Open your web browser and navigate to:
- **`http://localhost/opspilot/welcome/`** (or `http://<server-ip>/opspilot/welcome/` via Nginx on Port 80)
- **`http://localhost:8088/opspilot/welcome/`** (Direct Superset Backend)

---

## 💻 Option B: Local Frontend Development Mode (Hot-Reload)

Use this setup when modifying React components, custom chart plugins, or themes with instant live reload.

### Step 1: Start Backend Services
```bash
docker compose -f docker-compose-runtime.yml up -d
```

### Step 2: Start Webpack Dev Server
```bash
cd superset-frontend

# Install dependencies (if first time on machine)
npm install --legacy-peer-deps

# Start dev server on port 9000
npm run dev-server
```

### Step 3: Access Dev Server
Open your browser at:
- **`http://localhost:9000/opspilot/welcome/`**

---

## 🛠️ Option C: Full Build from Source (Docker Image Rebuild)

To rebuild the entire Docker image from source on a new machine:

```bash
# 1. Build images
docker compose build

# 2. Start full development stack
docker compose up -d
```

---

## 🔍 Useful Commands & Troubleshooting

### Check Service Status
```bash
docker compose -f docker-compose-runtime.yml ps
```

### View Real-Time Logs
```bash
# View all logs
docker compose -f docker-compose-runtime.yml logs -f

# View backend only
docker compose -f docker-compose-runtime.yml logs -f superset
```

### Restart Backend
```bash
docker compose -f docker-compose-runtime.yml restart superset
```

### Stop All Services
```bash
docker compose -f docker-compose-runtime.yml down
```

### Common Issues & Fixes:

1. **`Port 9000 already in use (EADDRINUSE)`**:
   - The dev server is already running in another process/terminal. Stop the previous terminal or terminate node with `taskkill /F /IM node.exe` (Windows) or `killall node` (Linux).
2. **`Port 80 already in use`**:
   - Another service (like IIS or Apache) is using port 80. Edit `docker/.env-local` and set `NGINX_PORT=8080`, then access at `http://localhost:8080/`.
3. **Database Connection Error**:
   - Ensure `db` and `redis` containers are healthy (`docker compose -f docker-compose-runtime.yml ps`).
