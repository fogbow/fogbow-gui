from django.utils.translation import ugettext_lazy as _
from horizon import tabs

import openstack_dashboard.models as fogbow_models
                
class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Volume details")
    slug = "instance_details"
    template_name = ("fogbow/storage/_detail_instance.html")

    def get_context_data(self, request):
        instanceId = self.tab_group.kwargs['instance_id']
#         response = fogbow_models.doRequest('get', STORAGE_TERM  + instanceId, None, request)        

        volume = None
#         try:
#             instance = get_instance_from_json(response_json)
#         except Exception:
#             instance = {'instanceId': '-' , 'size': '-', 'status': '-'}

        # TODO change to volume
        return {'instance' : volume}
    
def get_instance_from_json(response_json):
#     return {'instanceId': instanceId , 'size': size, 'status': status}
    return None
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (InstanceDetailTabInstancePanel,)
