import horizon
import requests
import decimal
import openstack_dashboard.models as fogbow_models

from django.utils.translation import ugettext_lazy as _
from horizon import tables
from horizon import messages
from openstack_dashboard.dashboards.fogbow.usage.models import Member
from openstack_dashboard.dashboards.fogbow.usage \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.usage \
    import models as project_models
import math    
from django.http import HttpResponse
import base64
import json

MEMBER_TERM = fogbow_models.FogbowConstants.MEMBER_TERM
USAGE_TERM = fogbow_models.FogbowConstants.USAGE_TERM

class IndexView(tables.DataTableView):
    table_class = project_tables.UsageTable
    template_name = 'fogbow/usage/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        return context

    def has_more_data(self, table):
        return self._more
    
    def get_data(self):           
        response = fogbow_models.doRequest('get', MEMBER_TERM, None, self.request)   
        
        members = []
        self._more = False
        if response == None:
            return members 
                        
        try:
            responseStr = response.text
            members = self.getMembersList(responseStr);            
        except Exception:
            return members

        return members

    def getMembersList(self, strResponse):
        members = []
        membersList = strResponse.strip().split('\n')    
        for mName in membersList:
            member = {'id': mName , 'idMember' : mName, 
            'usage': '-',
            'usageStorage': '-',
            'timestamp' : '-'}
            members.append(Member(member));  
        
        return members

def getSpecificMemberUsage(request, member_id):
    response = fogbow_models.doRequest('get', MEMBER_TERM + '/' + member_id + '/usage', None, request, False)
    responseStr = response.text
    if fogbow_models.isResponseOk(responseStr) == True:
        data = {}
        cont = 0
        valuesList = responseStr.split('\n')
        for value in valuesList:
            if 'memberId' in value:
                continue                                
            if len(value.split('=')) > 1 and 'compute' in value:
                cont = cont + 1;
                data[cont] = value.split('=')[1]
            if len(value.split('=')) > 1 and 'storage' in value:
                cont = cont + 1;
                data[cont] = value.split('=')[1]                                        
                
        return HttpResponse(json.dumps(data))
    return HttpResponse('error')
    