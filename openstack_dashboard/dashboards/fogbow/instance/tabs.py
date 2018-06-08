import logging

from django.utils.translation import ugettext_lazy as _
from horizon import tabs
import openstack_dashboard.models as fogbow_models
                
LOG = logging.getLogger(__name__)

class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Compute details")
    slug = "compute_details"
    template_name = ("fogbow/instance/_detail_instance.html")

    def get_context_data(self, request):
        # instanceId = self.tab_group.kwargs['instance_id']
        # response = fogbow_models.doRequest('get', COMPUTE_TERM  + instanceId, None, request)

        # TODO: here we must use the request response
        response =  {"id": "id", "hostName": "hostName", "vCPU": 10, "memory": 10, 
        "state": "state", "localIpAddress": "localIpAddress"}

        return {'instance' : response}
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "compute_details"
    tabs = (InstanceDetailTabInstancePanel, )
