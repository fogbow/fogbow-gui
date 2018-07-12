import base64
import json
import horizon
import requests
import decimal
import logging

from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.http import HttpResponse
from horizon import tables
from horizon import messages

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.members.models import Member
from openstack_dashboard.dashboards.fogbow.members import tables as project_tables
from openstack_dashboard.dashboards.fogbow.members import models as project_models

from openstack_dashboard.dashboards.fogbow.models import MemberUtil
from openstack_dashboard.dashboards.fogbow.models import QuotaUtil

LOG = logging.getLogger(__name__)

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
        members = []
        self._more = False                    
        return members

def get_compute_quota(request, member_id):
    federation_token_value = request.user.token.id
    response = QuotaUtil.get_compute_quota_response(member_id, federation_token_value)
    json_response = json.dumps(response)
    return HttpResponse(json_response)

def get_compute_allocation(request, member_id):
    federation_token_value = request.user.token.id
    response = QuotaUtil.get_compute_allocation_response(member_id, federation_token_value)
    json_response = json.dumps(response)
    return HttpResponse(json_response)

def get_members(request):
    federation_token_value = request.user.token.id
    members = MemberUtil.get_members(federation_token_value)
    json_response = json.dumps(members)
    return HttpResponse(json_response)



fowbow_endpoint = settings.FOGBOW_MANAGER_CORE_ENDPOINT

# TODO move to intance/compute path
# TODO use openstack_dashboard.dashboards.fogbow.models.RequestUtil for make requests
# TODO use constants
def get_shared_quota(request, member_id):
    response = requests.get(fowbow_endpoint + '/compute/quota/shared')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_available_quota(request, member_id):
    response = requests.get(fowbow_endpoint + '/compute/quota/available')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_used_by_me_quota(request, member_id):
    response = requests.get(fowbow_endpoint + '/compute/quota/me')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def getSpecificMemberQuota(request):
    response = requests.get(fowbow_endpoint + '/compute/quota/member')
    r = response.text.encode('ascii')
    return HttpResponse(r)

def get_aggregated(request):
    response = requests.get(fowbow_endpoint + '/compute/quota/aggregated')
    r = response.text.encode('ascii')
    return HttpResponse(r)
