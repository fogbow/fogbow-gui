from django.utils.translation import ugettext_lazy as _
from horizon import tabs
import openstack_dashboard.models as fogbow_models
                
COMPUTE_TERM = fogbow_models.FogbowConstants.COMPUTE_TERM
STATE_TERM = fogbow_models.FogbowConstants.STATE_TERM
SHH_PUBLIC_KEY_TERM = fogbow_models.FogbowConstants.SHH_PUBLIC_KEY_TERM
CONSOLE_VNC_TERM = fogbow_models.FogbowConstants.CONSOLE_VNC_TERM
MEMORY_TERM = fogbow_models.FogbowConstants.MEMORY_TERM
CORES_TERM = fogbow_models.FogbowConstants.CORES_TERM
IMAGE_SCHEME = fogbow_models.FogbowConstants.IMAGE_SCHEME     
EXTRA_PORT_SCHEME = fogbow_models.FogbowConstants.EXTRA_PORT_SCHEME

class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Instance details")
    slug = "instance_details"
    template_name = ("fogbow/instance/_detail_instance.html")

    def get_context_data(self, request):
        instanceId = self.tab_group.kwargs['instance_id']
        response = fogbow_models.doRequest('get', COMPUTE_TERM  + instanceId,
                                             None, request)

        instance = None
        try:
            instance = getInstancePerResponse(instanceId, response)
        except Exception:
            instance = {'instanceId': '-' , 'state': '-', 'sshPublic': '-',
             'extra' : '-', 'memory' : '-', 'cores' : '-',
            'image' : '-', 'extraPorts': '-'}

        return {'instance' : instance}
    
def getInstancePerResponse(instanceId, response):
    if instanceId == 'null':
        instanceId = '-'
    
    instanceDetails = response.text.split('\n')
    
    state,sshPublic,console_vnc,memory,cores,image,extraPort  = '-', '-', '-', '-', '-', '-', '-'
    for detail in instanceDetails:
        if STATE_TERM in detail:
            state = normalizeAttributes(detail, STATE_TERM)
        elif SHH_PUBLIC_KEY_TERM in detail:
            sshPublic = normalizeAttributes(detail, SHH_PUBLIC_KEY_TERM)
        elif MEMORY_TERM in detail:
            memory = normalizeAttributes(detail, MEMORY_TERM)
        elif CORES_TERM in detail:
            cores = normalizeAttributes(detail, CORES_TERM)
        elif IMAGE_SCHEME in detail:
            image = getFeatureInCategoryPerScheme('title', detail)
        elif EXTRA_PORT_SCHEME in detail:
            extraPort = normalizeAttributes(detail, EXTRA_PORT_SCHEME)
            
    return {'instanceId': instanceId , 'state': state, 'sshPublic':sshPublic,
             'extra' : instanceDetails, 'memory' : memory, 'cores' : cores,
            'image' : image, 'extraPorts': extraPort}
    
def normalizeAttributes(propertie, term):
    try:
        return propertie.split(term)[1].replace('=', '').replace('"', '')
    except:
        return ''
    
def getFeatureInCategoryPerScheme(featureName, features):
    try:
        features = features.split(';')
        for feature in features:
            if featureName in feature:
                return feature.replace(featureName + '=', '') \
                              .replace('"','').replace('Image:','') \
                              .replace(' image', '')
        return ''
    except Exception:
        return '-'                
                
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (InstanceDetailTabInstancePanel,)
