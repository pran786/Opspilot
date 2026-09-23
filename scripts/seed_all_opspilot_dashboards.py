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
Master seed script for all OpsPilot industrial big-screen dashboards.
Sequentially runs:
  1. 1-Receiving (Dashboard #1)
  2. 2-WH Replenishment (Dashboard #2)
  3. 3-ToteFarm (Dashboard #3)
  4. 5-Small Pours (Dashboard #5)
"""
import os
import subprocess
import sys

def ensure_postgres_examples_db():
    """Verify and auto-repair PostgreSQL 'examples' user & database if needed."""
    try:
        from superset.app import create_app
        app = create_app()
        with app.app_context():
            from superset import db
            from sqlalchemy import text
            try:
                with db.engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
                    if db.engine.dialect.name == "postgresql":
                        print(">>> Preflight check: Ensuring PostgreSQL 'examples' user and database exist...")
                        conn.execute(text("""
                            DO $$
                            BEGIN
                                IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'examples') THEN
                                    CREATE USER examples WITH PASSWORD 'examples';
                                ELSE
                                    ALTER USER examples WITH PASSWORD 'examples';
                                END IF;
                            END
                            $$;
                        """))
                        db_exists = conn.execute(
                            text("SELECT 1 FROM pg_database WHERE datname = 'examples'")
                        ).scalar()
                        if not db_exists:
                            conn.execute(text("CREATE DATABASE examples OWNER examples;"))
                        conn.execute(text("GRANT ALL PRIVILEGES ON DATABASE examples TO examples;"))
                        conn.execute(text("GRANT ALL ON SCHEMA public TO examples;"))
                        print(">>> PostgreSQL 'examples' user & database ready.")
            except Exception as e:
                print(f">>> Note: Preflight database check: {e}")
    except Exception as e:
        print(f">>> Note: Could not initialize Superset app for preflight check: {e}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    scripts = [
        "seed_receiving_dashboard.py",
        "seed_wh_replenishment_dashboard.py",
        "seed_totefarm_dashboard.py",
        "seed_small_pours_dashboard.py",
    ]

    print("==========================================================")
    print(" OpsPilot Master Big-Screen Dashboard Seeder")
    print("==========================================================")

    ensure_postgres_examples_db()

    for script_name in scripts:
        script_path = os.path.join(script_dir, script_name)
        if not os.path.exists(script_path):
            # Also check /app or current directory fallback
            alt_path = os.path.join("/app", script_name)
            if os.path.exists(alt_path):
                script_path = alt_path
            else:
                alt_docker_path = os.path.join("/app/docker/scripts", script_name)
                if os.path.exists(alt_docker_path):
                    script_path = alt_docker_path

        print(f"\n>>> Running: {script_name} ({script_path}) ...")
        result = subprocess.run([sys.executable, script_path])
        if result.returncode != 0:
            print(f"❌ Error running {script_name}! (Exit code {result.returncode})")
            sys.exit(result.returncode)

    ensure_dashboard_permissions_and_owners()

    print("\n==========================================================")
    print(" All OpsPilot Dashboards Seeded Successfully!")
    print(" Dashboards available:")
    print("   - 1-Receiving:        /opspilot/dashboard/1-receiving/?standalone=3")
    print("   - 2-WH Replenishment: /opspilot/dashboard/2-wh-replenishment/?standalone=3")
    print("   - 3-ToteFarm:         /opspilot/dashboard/3-totefarm/?standalone=3")
    print("   - 5-Small Pours:      /opspilot/dashboard/5-small-pours/?standalone=3")
    print("==========================================================")

def ensure_dashboard_permissions_and_owners():
    """Ensure admin ownership and grant dataset/database access to Gamma & Public roles."""
    print("\n>>> Post-seeding: Ensuring dashboard ownership and database permissions...")
    try:
        from superset.app import create_app
        app = create_app()
        with app.app_context():
            from superset import db, security_manager
            from superset.models.core import Database
            from superset.models.dashboard import Dashboard

            # 1. Assign admin as owner to all 4 OpsPilot dashboards
            admin = security_manager.find_user("admin")
            target_slugs = ["1-receiving", "2-wh-replenishment", "3-totefarm", "5-small-pours"]
            dashboards = db.session.query(Dashboard).filter(Dashboard.slug.in_(target_slugs)).all()
            for d in dashboards:
                if admin and admin not in d.owners:
                    d.owners.append(admin)
                d.published = True
            db.session.commit()
            print(f">>> Ensured admin ownership for {len(dashboards)} OpsPilot dashboards.")

            # 2. Grant 'database access on [examples]' to Gamma and Public roles
            examples_db = db.session.query(Database).filter_by(database_name="examples").first()
            if examples_db and examples_db.perm:
                perm_view = security_manager.find_permission_view_menu("database_access", examples_db.perm)
                if perm_view:
                    for role_name in ["Gamma", "Public"]:
                        role = security_manager.find_role(role_name)
                        if role:
                            security_manager.add_permission_role(role, perm_view)
                            print(f">>> Granted database access on [examples] to '{role_name}' role.")
            db.session.commit()
    except Exception as e:
        print(f">>> Note: Post-seeding permission check warning: {e}")

if __name__ == "__main__":
    main()

