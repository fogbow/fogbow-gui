import logging

from django.utils.translation import ugettext_lazy as _
from horizon import tabs
import openstack_dashboard.models as fogbow_models
                
from openstack_dashboard.dashboards.fogbow.models import FederatedNetworkUtil

LOG = logging.getLogger(__name__)

class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Federated Network details")
    slug = "federatednetwork_details"
    template_name = ("fogbow/federatednetwork/_detail_instance.html")

    def get_context_data(self, request):
        federatednetwork_id = self.tab_group.kwargs['federatednetwork_id']
        LOG.info("Trying to get the federated network: {federatednetwork_id}".format(federatednetwork_id=federatednetwork_id))

        federation_token_value = request.user.token.id
        try:
            federated_network = FederatedNetworkUtil.get_federated_network(federatednetwork_id, federation_token_value)
        except Exception as e:
            LOG.info("Is not possible get the federated network. Message exception is {error_msg}:".format(error_msg=str(e)))
            federated_network = None

        return {'federatednetwork' : federated_network}
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "federatednetwork_details"
    tabs = (InstanceDetailTabInstancePanel, )
