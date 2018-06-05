from django.utils.translation import ugettext_lazy as _
from horizon import tabs
import openstack_dashboard.models as fogbow_models
                
STORAGE_TERM = fogbow_models.FogbowConstants.STORAGE_TERM
COMPUTE_TERM = fogbow_models.FogbowConstants.COMPUTE_TERM
STATE_TERM = fogbow_models.FogbowConstants.STATE_TERM
SHH_PUBLIC_KEY_TERM = fogbow_models.FogbowConstants.SHH_PUBLIC_KEY_TERM
CONSOLE_VNC_TERM = fogbow_models.FogbowConstants.CONSOLE_VNC_TERM
MEMORY_TERM = fogbow_models.FogbowConstants.MEMORY_TERM
CORES_TERM = fogbow_models.FogbowConstants.CORES_TERM
IMAGE_SCHEME = fogbow_models.FogbowConstants.IMAGE_SCHEME     
EXTRA_PORT_SCHEME = fogbow_models.FogbowConstants.EXTRA_PORT_SCHEME

SIZE = 'occi.storage.size'
STATUS = 'occi.storage.status'

class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Volume details")
    slug = "instance_details"
    template_name = ("fogbow/storage/_detail_instance.html")

    def get_context_data(self, request):
        instanceId = self.tab_group.kwargs['instance_id']
        response = fogbow_models.doRequest('get', STORAGE_TERM  + instanceId, None, request)        

        instance = None
        try:
            instance = getInstancePerResponse(instanceId, response)
        except Exception:
            instance = {'instanceId': '-' , 'size': '-', 'status': '-'}

        return {'instance' : instance}
    
def getInstancePerResponse(instanceId, response):
    if instanceId == 'null':
        instanceId = '-'
    
    instanceDetails = response.text.split('\n')
    print instanceDetails
    
    size, status  = '-', '-'
    for detail in instanceDetails:
        if SIZE in detail:
            size = normalizeAttributes(detail, SIZE)
        elif STATUS in detail:
            status = normalizeAttributes(detail, STATUS)
            
    return {'instanceId': instanceId , 'size': size, 'status': status}
    
def normalizeAttributes(propertie, term):
    try:
        return propertie.split(term)[1].replace('=', '').replace('"', '')
    except:
        return ''                
                
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (InstanceDetailTabInstancePanel,)
