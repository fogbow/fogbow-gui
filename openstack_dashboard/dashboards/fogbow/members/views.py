import horizon
import requests
import decimal
import openstack_dashboard.models as fogbow_models

from django.utils.translation import ugettext_lazy as _
from horizon import tables
from horizon import messages
from openstack_dashboard.dashboards.fogbow.members.models import Member
from openstack_dashboard.dashboards.fogbow.members \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.members \
    import models as project_models
from django.http import HttpResponse
import base64
import json

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

def get_shared_quota(request, member_id):
    response = requests.get('http://localhost:8080/quota/shared')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_available_quota(request, member_id):
    response = requests.get('http://localhost:8080/quota/available')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_used_by_me_quota(request, member_id):
    response = requests.get('http://localhost:8080/quota/me')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def getSpecificMemberQuota(request, member_id):
    response = requests.get('http://localhost:8080/quota/member/2')
    r = response.text.encode('ascii')
    return HttpResponse(r)
