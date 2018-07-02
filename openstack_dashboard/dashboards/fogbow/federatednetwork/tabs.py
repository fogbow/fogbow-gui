import logging

from django.utils.translation import ugettext_lazy as _
from horizon import tabs
import openstack_dashboard.models as fogbow_models
                
from openstack_dashboard.dashboards.fogbow.models import ComputeUtil

LOG = logging.getLogger(__name__)

class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Federated Network details")
    slug = "federatednetwork_details"
    template_name = ("fogbow/federatednetwork/_detail_instance.html")

    def get_context_data(self, request):
        federatednetwork_id = self.tab_group.kwargs['federatednetwork_id']

        return {'federatednetwork' : None}
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "federatednetwork_details"
    tabs = (InstanceDetailTabInstancePanel, )
