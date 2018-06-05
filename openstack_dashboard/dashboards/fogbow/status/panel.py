from django.utils.translation import ugettext_lazy as _

import horizon

from openstack_dashboard.dashboards.fogbow import dashboard


class Status(horizon.Panel):
    name = _("Status")
    slug = "status"


dashboard.Fogbow.register(Status)
