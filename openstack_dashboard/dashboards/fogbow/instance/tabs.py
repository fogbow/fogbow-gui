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
        instanceId = self.tab_group.kwargs['instance_id']
        response = None
#        response = fogbow_models.doRequest('get', COMPUTE_TERM  + instanceId,
#                                             None, request)

        instance = None
#         try:
#             instance = get_compute_from_json(response)
#         except Exception:
#             instance = {'instanceId': '-' , 'state': '-', 'sshPublic': '-',
#              'extra' : '-', 'memory' : '-', 'cores' : '-',
#             'image' : '-', 'extraPorts': '-'}

        return {'instance' : instance}
    
def get_compute_from_json(response_json):
    pass
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "compute_details"
    tabs = (InstanceDetailTabInstancePanel, )
