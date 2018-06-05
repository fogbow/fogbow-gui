from django.utils.translation import ugettext_lazy as _
from horizon import tabs
import openstack_dashboard.models as fogbow_models
                
NETWORK_TERM = fogbow_models.FogbowConstants.NETWORK_TERM
COMPUTE_TERM = fogbow_models.FogbowConstants.COMPUTE_TERM
STATE_TERM = fogbow_models.FogbowConstants.STATE_TERM
SHH_PUBLIC_KEY_TERM = fogbow_models.FogbowConstants.SHH_PUBLIC_KEY_TERM
CONSOLE_VNC_TERM = fogbow_models.FogbowConstants.CONSOLE_VNC_TERM
MEMORY_TERM = fogbow_models.FogbowConstants.MEMORY_TERM
CORES_TERM = fogbow_models.FogbowConstants.CORES_TERM
IMAGE_SCHEME = fogbow_models.FogbowConstants.IMAGE_SCHEME     
EXTRA_PORT_SCHEME = fogbow_models.FogbowConstants.EXTRA_PORT_SCHEME

NETWORK_VLAN = "occi.network.vlan=";
NETWORK_LABEL = "occi.network.label=";
NETWORK_STATE = "occi.network.state=";
NETWORK_ADDRESS = "occi.network.address=";
NETWORK_GATEWAY = "occi.network.gateway=";
NETWORK_ALLOCATION = "occi.network.allocation=";

class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Network details")
    slug = "instance_details"
    template_name = ("fogbow/network/_detail_instance.html")

    def get_context_data(self, request):
        instanceId = self.tab_group.kwargs['instance_id']
        response = fogbow_models.doRequest('get', NETWORK_TERM  + instanceId, None, request)        

        instance = None
        try:
            instance = getInstancePerResponse(instanceId, response)
        except Exception:
            instance = {'instanceId': '-' , 'vlan': '-', 'label': '-', 
                        'state': '-', 'address': '-', 'gateway': '-', 'allocation': '-'}

        return {'instance' : instance}
    
def getInstancePerResponse(instanceId, response):
    if instanceId == 'null':
        instanceId = '-'
    
    instanceDetails = response.text.split('\n')
    print instanceDetails
    
    vlan, label, state, address, gateway, allocation  = '-', '-' , '-', '-', '-' , '-'
    for detail in instanceDetails:
        if NETWORK_VLAN in detail:
            vlan = normalizeAttributes(detail, NETWORK_VLAN)
        elif NETWORK_LABEL in detail:
            label = normalizeAttributes(detail, NETWORK_LABEL)
        elif NETWORK_STATE in detail:
            state = normalizeAttributes(detail, NETWORK_STATE)
        elif NETWORK_ADDRESS in detail:
            address = normalizeAttributes(detail, NETWORK_ADDRESS)
        elif NETWORK_GATEWAY in detail:
            gateway = normalizeAttributes(detail, NETWORK_GATEWAY) 
        elif NETWORK_ALLOCATION in detail:
            allocation = normalizeAttributes(detail, NETWORK_ALLOCATION)                                                
            
    return {'instanceId': instanceId , 'vlan': vlan, 'label': label, 
            'state': state, 'address': address, 'gateway': gateway, 'allocation': allocation}
    
def normalizeAttributes(propertie, term):
    try:
        return propertie.split(term)[1].replace('=', '').replace('"', '')
    except:
        return ''                
                
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (InstanceDetailTabInstancePanel,)
