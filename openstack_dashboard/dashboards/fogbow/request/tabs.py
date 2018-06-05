from django.utils.translation import ugettext_lazy as _ 
from horizon import tabs
import openstack_dashboard.dashboards.fogbow.instance.tabs as tabsInstanceDashboard
import openstack_dashboard.dashboards.fogbow.storage.tabs as tabsStorageDashboard
import openstack_dashboard.dashboards.fogbow.network.tabs as tabsNetworkDashboard
import openstack_dashboard.models as fogbow_models
import base64

NETWORK_TERM = fogbow_models.FogbowConstants.NETWORK_TERM
STORAGE_TERM = fogbow_models.FogbowConstants.STORAGE_TERM
COMPUTE_TERM = fogbow_models.FogbowConstants.COMPUTE_TERM
REQUEST_TERM = fogbow_models.FogbowConstants.REQUEST_TERM

IMAGE_SCHEME = fogbow_models.FogbowConstants.IMAGE_SCHEME     
FOGBOW_SHH_PUBLIC_KEY_TERM = fogbow_models.FogbowConstants.FOGBOW_SHH_PUBLIC_KEY_REQUEST_TERM 
FOGBOW_REQUIREMENTS_TERM = fogbow_models.FogbowConstants.FOGBOW_REQUIREMENTS_TERM
FOGBOW_USERDATA_TERM = fogbow_models.FogbowConstants.FOGBOW_USERDATA_TERM
FOGBOW_USERDATA_CONTENT_TYPE_TERM = fogbow_models.FogbowConstants.FOGBOW_USERDATA_CONTENT_TYPE_TERM
FOGBOW_VALID_FROM_TERM = fogbow_models.FogbowConstants.FOGBOW_VALID_FROM_TERM
FOGBOW_VALID_UNTIL_TERM = fogbow_models.FogbowConstants.FOGBOW_VALID_UNTIL_TERM    
FOGBOW_STATE_TERM = fogbow_models.FogbowConstants.FOGBOW_STATE_TERM
FOGBOW_TYPE_TERM = fogbow_models.FogbowConstants.FOGBOW_TYPE_TERM
FOGBOW_INSTANCE_ID_TERM = fogbow_models.FogbowConstants.FOGBOW_INSTANCE_ID_TERM
FOGBOW_COUNT_TERM = fogbow_models.FogbowConstants.FOGBOW_COUNT_TERM
FOGBOW_SIZE_OCCI = fogbow_models.FogbowConstants.SIZE_OCCI
FOGBOW_RESOURCE_KIND_TERM = fogbow_models.FogbowConstants.FOGBOW_RESOURCE_KIND_TERM

FOGBOW_NETWORK_VLAN = fogbow_models.FogbowConstants.NETWORK_VLAN
FOGBOW_NETWORK_LABEL = fogbow_models.FogbowConstants.NETWORK_LABEL
FOGBOW_NETWORK_STATE = fogbow_models.FogbowConstants.NETWORK_STATE
FOGBOW_NETWORK_ADDRESS = fogbow_models.FogbowConstants.NETWORK_ADDRESS
FOGBOW_NETWORK_GATEWAY = fogbow_models.FogbowConstants.NETWORK_GATEWAY
FOGBOW_NETWORK_ALLOCATION = fogbow_models.FogbowConstants.NETWORK_ALLOCATION
FOGBOW_NETWORK_ID = fogbow_models.FogbowConstants.NETWORK_ID

class InstanceDetailTab(tabs.Tab):
    name = _("Instance details")
    slug = "instance_details"
    template_name = ("fogbow/instance/_detail_instance.html")

    def get_context_data(self, request):
        instanceId = self.tab_group.kwargs['instance_id'].split(':')[1]
        resourceKind = self.tab_group.kwargs['instance_id'].split(':')[2]
        print resourceKind
        if resourceKind == 'compute':
            self.name = _("Instance Details")
            self.template_name = ("fogbow/instance/_detail_instance.html")
            response = fogbow_models.doRequest('get', COMPUTE_TERM  + instanceId, None, request)
            
            return {'instance' : tabsInstanceDashboard.getInstancePerResponse(instanceId, response)}
        elif resourceKind == 'storage':
            self.name = _("Storage Details")
            self.template_name = ("fogbow/storage/_detail_instance.html")
            response = fogbow_models.doRequest('get', STORAGE_TERM  + instanceId, None, request)
            return {'instance' : tabsStorageDashboard.getInstancePerResponse(instanceId, response)}
        elif resourceKind == 'network':
            self.name = _("Network Details")
            self.template_name = ("fogbow/network/_detail_instance.html")
            response = fogbow_models.doRequest('get', NETWORK_TERM  + instanceId, None, request)
            return {'instance' : tabsNetworkDashboard.getInstancePerResponse(instanceId, response)}        
        else:
            return {'instance' : {}}
    
class RequestDetailTab(tabs.Tab):
    name = _("Order details")
    slug = "request_details"
    template_name = ("fogbow/request/_detail_request.html")

    def get_context_data(self, request):
        requestId = self.tab_group.kwargs['instance_id'].split(':')[0]
                
        response = fogbow_models.doRequest('get', REQUEST_TERM  + requestId, None, request)
        
        return {'request' : self.getRequestPerResponse(requestId, response)}
    
    def normalizeUserdate(self, extraUserdata):
        if 'Not defined' in extraUserdata:
            return extraUserdata
        try:
            extraUserdata = base64.b64decode(extraUserdata + '==')
            return  extraUserdata.replace('[[\\n]]', '\n').strip()
        except Exception, e:            
            print str(e)   
    
    def getRequestPerResponse(self, requestId, response):
        if requestId == 'null':
            requestId = '-'
        
        requestDetails = response.text.split('\n')
        print requestDetails
        
        requirements, type, state, validFrom, validUntil, image, ssh, extraUserdata, extraUserdataContentType, instanceId, count, size, resourceKind  = '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'
        networkid, address, gateway, allocation = '-','-', '-', '-'
        for detail in requestDetails:
            if FOGBOW_REQUIREMENTS_TERM in detail:
                try:
                    requirements = detail.split(FOGBOW_REQUIREMENTS_TERM)[1].replace('=', '', 1)[1:-2]              
                except Exception:
                    requirements = '-'
            elif FOGBOW_SHH_PUBLIC_KEY_TERM in detail:
                ssh = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_SHH_PUBLIC_KEY_TERM)
            elif FOGBOW_USERDATA_TERM + '=' in detail:
                extraUserdata = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_USERDATA_TERM)                                
                extraUserdata = self.normalizeUserdate(extraUserdata)
            elif FOGBOW_USERDATA_CONTENT_TYPE_TERM in detail:
                extraUserdataContentType = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_USERDATA_CONTENT_TYPE_TERM)                                
            elif FOGBOW_TYPE_TERM in detail:
                type = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_TYPE_TERM)
            elif FOGBOW_COUNT_TERM in detail:
                count = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_COUNT_TERM)                               
            elif FOGBOW_STATE_TERM in detail:
                state = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_STATE_TERM)
            elif FOGBOW_VALID_FROM_TERM in detail:
                validFrom = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_VALID_FROM_TERM)
            elif IMAGE_SCHEME in detail:
                image = tabsInstanceDashboard.getFeatureInCategoryPerScheme('title', detail)
            elif FOGBOW_VALID_UNTIL_TERM in detail:
                validUntil = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_VALID_UNTIL_TERM)
            elif FOGBOW_SIZE_OCCI in detail:
                size = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_SIZE_OCCI)
            elif FOGBOW_RESOURCE_KIND_TERM in detail:
                resourceKind = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_RESOURCE_KIND_TERM)
            
            elif FOGBOW_NETWORK_ID in detail:
                networkid = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_NETWORK_ID)
                
            elif FOGBOW_NETWORK_ADDRESS in detail:
                address = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_NETWORK_ADDRESS)
            elif FOGBOW_NETWORK_GATEWAY in detail:
                gateway = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_NETWORK_GATEWAY)
            elif FOGBOW_NETWORK_ALLOCATION in detail:
                allocation = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_NETWORK_ALLOCATION)                    
                                       
            elif FOGBOW_INSTANCE_ID_TERM in detail:
                instanceId = tabsInstanceDashboard.normalizeAttributes(detail, FOGBOW_INSTANCE_ID_TERM)
                if 'null' in instanceId:
                    instanceId = 'Not defined'
            elif 'org.fogbowcloud.request.user-data' in detail:
                extra = tabsInstanceDashboard.normalizeAttributes(detail, 'org.fogbowcloud.request.user-data')                    
                
        return {'requestId': requestId , 'requirements': requirements, 'type':type,
                 'state' : state, 'validFrom' : validFrom, 'validUntil' : validUntil,
                'image' : image, 'ssh': ssh, 'extraUserdata': extraUserdata, 
                'extraUserdataContentType': extraUserdataContentType, 'instanceId': instanceId,
                'count': count, 'size': size, 'resourceKind': resourceKind, 'address': address,
                'gateway': gateway, 'allocation': allocation, 'networkid': networkid}
                        
class InstanceDetailTabs(tabs.TabGroup):
    slug = "instances_details"
    tabs = (InstanceDetailTab,)
    
class RequestDetailTabs(tabs.TabGroup):
    slug = "requests_details"
    tabs = (RequestDetailTab,)
