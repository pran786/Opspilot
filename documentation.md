# 1. Clone & checkout branch
git clone https://github.com/pran786/eenera-llc-superset.git
cd eenera-llc-superset
git checkout feature/custom-theme

# 2. Start all backend services
docker compose -f docker-compose-runtime.yml up -d

# 3. Initialize database & create admin user (first-time only)
docker compose -f docker-compose-runtime.yml exec superset superset db upgrade
docker compose -f docker-compose-runtime.yml exec superset superset fab create-admin --username admin --firstname Admin --lastname User --email admin@opspilot.local --password admin
docker compose -f docker-compose-runtime.yml exec superset superset init

# 4. Open in browser:
# http://localhost/opspilot/welcome/   (Username: admin / Password: admin)
