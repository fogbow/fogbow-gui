import requests
import openstack_dashboard.models as fogbow_models

from horizon import forms
from horizon import tables
from horizon import tabs
from django.core.urlresolvers import reverse_lazy 
from django.utils.translation import ugettext_lazy as _ 
from openstack_dashboard.dashboards.fogbow.request \
    import tabs as project_tabs
from openstack_dashboard.dashboards.fogbow.request \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.request \
    import models as project_models    
from openstack_dashboard.dashboards.fogbow.request.forms import CreateRequest
from openstack_dashboard.dashboards.fogbow.request.models import Request

REQUEST_TERM = fogbow_models.FogbowConstants.REQUEST_TERM_WITH_VERBOSE
STATE_TERM = fogbow_models.FogbowConstants.FOGBOW_STATE_TERM
TYPE_TERM = fogbow_models.FogbowConstants.FOGBOW_TYPE_TERM
FOGBOW_RESOURCE_KIND_TERM = fogbow_models.FogbowConstants.FOGBOW_RESOURCE_KIND_TERM
INSTANCE_ID_TERM = fogbow_models.FogbowConstants.FOGBOW_INSTANCE_ID_TERM

class IndexView(tables.DataTableView):
    table_class = project_tables.RequestsTable
    template_name = 'fogbow/request/index.html'
    
    def has_more_data(self, table):
        return self._more

    def get_data(self):
        response = fogbow_models.doRequest('get', REQUEST_TERM, None, self.request)
        
        listRequests = []
        self._more = False
        if response == None:
            return listRequests 
              
        listRequests = self.getRequestsList(response.text)                
        
        return listRequests

    def getRequestsList(self, responseStr):
        print responseStr
        listRequests = []
        propertiesRequests = responseStr.split('\n')
        for propertiesOneRequest in propertiesRequests:
            propertiesOneRequest = propertiesOneRequest.split(REQUEST_TERM + '/')
            if len(propertiesOneRequest) > 1:
                propertiesOneRequest = propertiesOneRequest[1]                
                properties = propertiesOneRequest.split(';')
                
                state, type, instanceId, resourceKind = '-', '-', '-', '-'
                for propertie in properties:
                    if STATE_TERM in propertie:                        
                        state = self.normalizeAttributes(propertie, STATE_TERM)
                    elif TYPE_TERM in propertie:
                        type = self.normalizeAttributes(propertie, TYPE_TERM)
                    elif INSTANCE_ID_TERM in propertie:
                        instanceId = self.normalizeAttributes(propertie, INSTANCE_ID_TERM)
                    elif FOGBOW_RESOURCE_KIND_TERM in propertie:
                        resourceKind = self.normalizeAttributes(propertie, FOGBOW_RESOURCE_KIND_TERM)
                
                id = properties[0]
                if instanceId == 'null':
                    instanceId = ''
                idRequestTable = '%s:%s:%s' % (id, instanceId, resourceKind)
                request = {'id' : idRequestTable, 'requestId' : id, 'state' : _(state), 'type' : type,
                            'resourceKind': resourceKind, 'instanceId': instanceId}
                listRequests.append(Request(request))                
        
        return listRequests
    
    def normalizeAttributes(self, propertie, term):        
        return propertie.split(term)[1].replace('"', '').replace('=','')
    
class CreateView(forms.ModalFormView):
    form_class = CreateRequest
    template_name = 'fogbow/request/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')
    
class DetailInstanceView(tabs.TabView):
    tab_group_class = project_tabs.InstanceDetailTabs
    template_name = 'fogbow/request/detail.html'
    
class DetailRequestView(tabs.TabView):
    tab_group_class = project_tabs.RequestDetailTabs
    template_name = 'fogbow/request/detail.html'    
