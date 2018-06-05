from django.utils.translation import ugettext_lazy as _

import horizon

from openstack_dashboard.dashboards.fogbow import dashboard

class Request(horizon.Panel):
    name = _("Orders")
    slug = "request"

dashboard.Fogbow.register(Request)
