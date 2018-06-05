from django.utils.translation import ugettext_lazy as _

import horizon

from openstack_dashboard.dashboards.fogbow import dashboard

class Overview(horizon.Panel):
    name = _("Overview")
    slug = "overview"

dashboard.Fogbow.register(Overview)
