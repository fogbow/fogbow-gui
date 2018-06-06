from django.utils.translation import ugettext_lazy as _
from horizon import tabs

import openstack_dashboard.models as fogbow_models
                
class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Network details")
    slug = "instance_details"
    template_name = ("fogbow/network/_detail_instance.html")

    def get_context_data(self, request):
        network_id = self.tab_group.kwargs['instance_id']
        # TODO get network detail in the new fogbow-manager-core
#         response = fogbow_models.doRequest('get', NETWORK_TERM  + network_id, None, request)        

        network = None
#         try:
#             network = get_instance_from_json(response_json)
#         except Exception:
#             instance = {'instanceId': '-' , 'vlan': '-', 'label': '-', 
#                         'state': '-', 'address': '-', 'gateway': '-', 'allocation': '-'}

        # TODO change instance to network
        return {'instance' : network}
    
def get_instance_from_json(response_json):                                           
#     return {'instanceId': instanceId , 'vlan': vlan, 'label': label, 
#             'state': state, 'address': address, 'gateway': gateway, 'allocation': allocation}
    return None
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (InstanceDetailTabInstancePanel,)
