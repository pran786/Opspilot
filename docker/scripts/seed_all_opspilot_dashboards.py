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

    print("\n==========================================================")
    print(" All OpsPilot Dashboards Seeded Successfully!")
    print(" Dashboards available:")
    print("   - 1-Receiving:        /opspilot/dashboard/1-receiving/?standalone=3")
    print("   - 2-WH Replenishment: /opspilot/dashboard/2-wh-replenishment/?standalone=3")
    print("   - 3-ToteFarm:         /opspilot/dashboard/3-totefarm/?standalone=3")
    print("   - 5-Small Pours:      /opspilot/dashboard/5-small-pours/?standalone=3")
    print("==========================================================")

if __name__ == "__main__":
    main()
