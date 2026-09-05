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
from typing import Callable
from urllib import parse
from flask import abort, g, redirect, request, url_for
from flask_appbuilder import expose
from flask_appbuilder.security.decorators import has_access
from flask_babel import _
from superset import db, event_logger, security_manager
from superset.commands.dashboard.permalink.get import GetDashboardPermalinkCommand
from superset.dashboards.permalink.exceptions import (
    DashboardAccessDeniedError,
    DashboardPermalinkGetFailedError,
)
from superset.exceptions import SupersetSecurityException
from superset.models.dashboard import Dashboard
from superset.models.user_attributes import UserAttribute
from superset.superset_typing import FlaskResponse
from superset.utils.core import (
    get_user_id,
    ReservedUrlParameters,
)
from superset.views.base import (
    BaseSupersetView,
    bootstrap_user_data,
    common_bootstrap_payload,
    get_current_user,
    json_error_response,
)
from superset.views.utils import redirect_to_login


class OpspilotView(BaseSupersetView):
    route_base = "/opspilot"
    class_permission_name = "Superset"

    @event_logger.log_this
    @expose("/welcome/")
    @expose("/welcome")
    def welcome(self) -> FlaskResponse:
        """Personalized welcome page"""
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

    @has_access
    @expose("/dashboard/<path:dashboard_id_or_slug>/")
    @expose("/dashboard/<path:dashboard_id_or_slug>")
    @event_logger.log_this_with_extra_payload
    def dashboard(
        self,
        dashboard_id_or_slug: str,
        add_extra_log_payload: Callable[..., None] = lambda **kwargs: None,
    ) -> FlaskResponse:
        """Server side rendering for a dashboard."""
        dashboard = Dashboard.get(dashboard_id_or_slug)

        if not dashboard:
            if not get_current_user():
                return redirect_to_login()
            abort(404)

        # Redirect anonymous users to login for unpublished dashboards
        if not get_current_user() and not dashboard.published:
            return redirect_to_login()

        try:
            dashboard.raise_for_access()
        except SupersetSecurityException:
            if not get_current_user():
                return redirect_to_login()
            abort(404)

        add_extra_log_payload(
            dashboard_id=dashboard.id,
            dashboard_version="v2",
            dash_edit_perm=(
                security_manager.is_owner(dashboard)
                and security_manager.can_access("can_write", "Dashboard")
            ),
            edit_mode=(
                request.args.get(ReservedUrlParameters.EDIT_MODE.value) == "true"
            ),
        )

        bootstrap_payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
        }
        return self.render_app_template(
            extra_bootstrap_data=bootstrap_payload,
            title=dashboard.dashboard_title,
            standalone_mode=ReservedUrlParameters.is_standalone_mode(),
        )

    @has_access
    @expose("/dashboard/p/<key>/", methods=("GET",))
    def dashboard_permalink(
        self,
        key: str,
    ) -> FlaskResponse:
        try:
            value = GetDashboardPermalinkCommand(key).run()
        except (DashboardPermalinkGetFailedError, DashboardAccessDeniedError) as ex:
            return json_error_response(_("Error: %(msg)s", msg=ex.message), status=404)
        if not value:
            return json_error_response(_("permalink state not found"), status=404)

        dashboard_id, state = value["dashboardId"], value.get("state", {})
        url = url_for(
            "OpspilotView.dashboard", dashboard_id_or_slug=dashboard_id, permalink_key=key
        )
        if url_params := state.get("urlParams"):
            for param_key, param_val in url_params:
                if param_key == "native_filters":
                    url = f"{url}&native_filters={param_val}"
                else:
                    params = parse.urlencode([(param_key, param_val)])
                    url = f"{url}&{params}"
        return redirect(url)

    @has_access
    @event_logger.log_this
    @expose("/file-handler")
    @expose("/file-handler/")
    def file_handler(self) -> FlaskResponse:
        """File handler page for PWA file handling"""
        if not g.user or not get_user_id():
            return redirect_to_login()

        payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
        }

        return self.render_app_template(extra_bootstrap_data=payload)

    @has_access
    @expose("/explore/p/<key>/")
    @expose("/explore/p/<key>")
    @event_logger.log_this
    def explore_permalink(self, key: str) -> FlaskResponse:
        return self.render_app_template()

    @has_access
    @expose("/all_entities/")
    @expose("/all_entities")
    @event_logger.log_this
    def all_entities(self) -> FlaskResponse:
        return self.render_app_template()

    @has_access
    @expose("/tags/")
    @expose("/tags")
    @event_logger.log_this
    def tags(self) -> FlaskResponse:
        return self.render_app_template()
