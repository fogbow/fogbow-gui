import horizon
from django.utils.translation import ugettext_lazy as _

from openstack_dashboard.dashboards.fogbow import dashboard

class Instance(horizon.Panel):
    name = _("Computes")
    slug = "instance"

dashboard.Fogbow.register(Instance)
