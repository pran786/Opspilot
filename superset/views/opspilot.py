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
from flask import g
from flask_appbuilder import expose
from superset import db
from superset.models.user_attributes import UserAttribute
from superset.superset_typing import FlaskResponse
from superset.utils.core import get_user_id
from superset.views.base import (
    BaseSupersetView,
    bootstrap_user_data,
    common_bootstrap_payload,
)
from superset.views.utils import redirect_to_login


class OpspilotView(BaseSupersetView):
    route_base = "/opspilot"
    class_permission_name = "Superset"

    @expose("/welcome/")
    @expose("/welcome")
    def welcome(self) -> FlaskResponse:
        if not g.user or not get_user_id():
            return redirect_to_login()

        if welcome_dashboard_id := (
            db.session.query(UserAttribute.welcome_dashboard_id)
            .filter_by(user_id=get_user_id())
            .scalar()
        ):
            return self.dashboard(dashboard_id_or_slug=str(welcome_dashboard_id))

        payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
        }

        return self.render_app_template(extra_bootstrap_data=payload)

    @expose("/dashboard/<path:dashboard_id_or_slug>/")
    @expose("/dashboard/<path:dashboard_id_or_slug>")
    def dashboard(self, dashboard_id_or_slug: str) -> FlaskResponse:
        if not g.user or not get_user_id():
            return redirect_to_login()

        payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
        }

        return self.render_app_template(extra_bootstrap_data=payload)

    @expose("/file-handler")
    @expose("/file-handler/")
    def file_handler(self) -> FlaskResponse:
        if not g.user or not get_user_id():
            return redirect_to_login()

        payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
        }

        return self.render_app_template(extra_bootstrap_data=payload)
