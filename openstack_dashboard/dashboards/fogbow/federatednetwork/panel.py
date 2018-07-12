import horizon
from django.utils.translation import ugettext_lazy as _

from openstack_dashboard.dashboards.fogbow import dashboard

class FederatedNetwork(horizon.Panel):
    name = _("Federated Network")
    slug = "federatednetwork"

dashboard.Fogbow.register(FederatedNetwork)
