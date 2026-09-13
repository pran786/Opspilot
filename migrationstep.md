# Step-by-Step Guide for Setting Up on Another Device

To pull and run all 4 big-screen dashboards (`1-receiving`, `2-wh-replenishment`, `3-totefarm`, and `5-small-pours`) on another device:

## Step 1: Pull the Latest Changes
```bash
git checkout feature/custom-theme
git pull origin feature/custom-theme
```

## Step 2: Ensure Docker Services are Running
```bash
docker compose up -d
# or if using the non-dev compose:
# docker compose -f docker-compose-non-dev.yml up -d
```

## Step 3: Run the Master Seed Script in the Superset Container
Because `./docker` is volume-mounted to `/app/docker`, the seed scripts are already inside the container. Run this single command:

```bash
docker compose exec superset python /app/docker/scripts/seed_all_opspilot_dashboards.py
```

*(If running with docker exec using container name instead)*:
```bash
docker exec eenera-llc-superset-superset-1 python /app/docker/scripts/seed_all_opspilot_dashboards.py
```

> ### 💡 Quick Fix if you see `password authentication failed for user "examples"`:
> If the PostgreSQL container was initialized previously without the `examples` user/password, run this one command to instantly configure it:
> ```bash
> docker compose exec db psql -U superset -c "CREATE USER examples WITH PASSWORD 'examples'; ALTER USER examples WITH PASSWORD 'examples'; CREATE DATABASE examples OWNER examples; GRANT ALL PRIVILEGES ON DATABASE examples TO examples;"
> docker compose exec db psql -U superset -d examples -c "GRANT ALL ON SCHEMA public TO examples;"
> ```
> *(Or if using container name directly:)*
> ```bash
> docker exec eenera-llc-superset-db-1 psql -U superset -c "CREATE USER examples WITH PASSWORD 'examples'; ALTER USER examples WITH PASSWORD 'examples'; CREATE DATABASE examples OWNER examples; GRANT ALL PRIVILEGES ON DATABASE examples TO examples;"
> docker exec eenera-llc-superset-db-1 psql -U superset -d examples -c "GRANT ALL ON SCHEMA public TO examples;"
> ```

---

## Step 4: Run the Frontend Dev Server (Port 9000)
If you are developing or viewing the dashboards with the webpack dev server on port 9000:

```bash
cd superset-frontend
npm install
npm run dev-server
```

---

## Accessing the Big-Screen Dashboards
All 4 dashboards are ready to view in full-screen TV / kiosk mode (`?standalone=3`):

| Dashboard | URL (Port 9000 Dev-Server) |
| :--- | :--- |
| **1-Receiving** | `http://localhost:9000/opspilot/dashboard/1-receiving/?standalone=3` |
| **2-WH Replenishment** | `http://localhost:9000/opspilot/dashboard/2-wh-replenishment/?standalone=3` |
| **3-ToteFarm** | `http://localhost:9000/opspilot/dashboard/3-totefarm/?standalone=3` |
| **5-Small Pours** | `http://localhost:9000/opspilot/dashboard/5-small-pours/?standalone=3` |