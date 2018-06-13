import logging

from django.utils.translation import ugettext_lazy as _
from horizon import tabs
from horizon import messages

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.models import NetworkUtil

LOG = logging.getLogger(__name__)                

class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Network details")
    slug = "instance_details"
    template_name = ("fogbow/network/_detail_instance.html")

    def get_context_data(self, request):
        network_id = self.tab_group.kwargs['instance_id']
        LOG.info("Trying to get the network: {network_id}".format(network_id=network_id))

        federation_token_value = request.user.token.id
        try:
            network = NetworkUtil.get_network(network_id, federation_token_value)
        except Exception as e:
            LOG.info("Is not possible get the network. Message exception is {error_msg}:".format(error_msg=str(e)))
            messages.error(request, "Is not possible get the network")
            network = None

        return {'network': network}    
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (InstanceDetailTabInstancePanel,)
