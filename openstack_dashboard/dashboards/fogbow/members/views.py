import base64
import json
import horizon
import requests
import decimal

from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.http import HttpResponse
from horizon import tables
from horizon import messages

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.members.models import Member
from openstack_dashboard.dashboards.fogbow.members \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.members \
    import models as project_models

MEMBER_TERM = fogbow_models.FogbowConstants.MEMBER_TERM
QUOTA_TERM = fogbow_models.FogbowConstants.QUOTA_TERM
MAX_VALUE = 2000000000

class IndexView(tables.DataTableView):
    table_class = project_tables.MembersTable
    template_name = 'fogbow/members/index.html'
    memTotal, memInUse, memUsedPercentage, cpuTotal, cpuInUse, cpuUsedPercentage = 0,0,0,0,0,0

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
                
        responseStr = response.text
        print responseStr
        if fogbow_models.isResponseOk(responseStr) == True:                    
            members = self.getMembersList(responseStr)                              

        return members
    
    def addUserLocalQuota(self, responseStr, responseQuota):
        if responseQuota != None:
            resposenQuotaStr = responseQuota.text
            username = self.request.session['username']
            newUserQuotaRow = '\n%s;%s' % ('id=%s: %s' % ("Local user", username) , resposenQuotaStr)
	    username = '%s' % (username) # ToString
            if fogbow_models.isResponseOk(resposenQuotaStr) == True and username != 'None':
                responseStr = responseStr + newUserQuotaRow
        
        return responseStr        
    
    def getMembersList(self, strResponse):
        members = []
        membersList = strResponse.strip().split('\n')    
        for mName in membersList:
            member = {'id': mName , 'idMember' : mName, 
            'cpuIdle': '-',
            'cpuInUse': '-', 
            'cpuInUseByUser': '-', 
            'memIdle': '-',
            'memInUse': '-',
            'memInUseByUser': '-', 
            'instanceInUse' : '-',
            'instanceInUseByUser' : '-',
            'instanceIdle' : '-',
            'timestamp' : '-'}
            members.append(Member(member));  
        
        return members

fowbow_endpoint = settings.FOGBOW_MANAGER_CORE_ENDPOINT

# TODO move to intance/compute path
# TODO use openstack_dashboard.dashboards.fogbow.models.RequestUtil for make requests
# TODO use constants
def get_shared_quota(request, member_id):
    response = requests.get(fowbow_endpoint + '/quota/shared')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_available_quota(request, member_id):
    response = requests.get(fowbow_endpoint + '/quota/available')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_used_by_me_quota(request, member_id):
    response = requests.get(fowbow_endpoint + '/quota/me')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def getSpecificMemberQuota(request, member_id):
    response = requests.get(fowbow_endpoint + '/quota/member')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_members(request):
    response = requests.get(fowbow_endpoint + '/membership/members')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_aggregated(request):
    response = requests.get(fowbow_endpoint + '/quota/aggregated')
    r = response.text.encode('ascii')
    return HttpResponse(r)
