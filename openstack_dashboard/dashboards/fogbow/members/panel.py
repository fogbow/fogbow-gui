from django.utils.translation import ugettext_lazy as _

import horizon

from openstack_dashboard.dashboards.fogbow import dashboard

class Members(horizon.Panel):
    name = _("Quota")
    slug = "members"

dashboard.Fogbow.register(Members)
