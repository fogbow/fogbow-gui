import requests
import logging
import json
from django.conf import settings

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.models import FogbowConstants
from openstack_dashboard.models import RequestConstants
from openstack_dashboard.models import DashboardConstants

from openstack_dashboard.dashboards.fogbow.network.models import Network

LOG = logging.getLogger(__name__)

class MemberUtil:
     
    #FIXME: remove federation_token_value in parameters
    @staticmethod
    def get_members(federation_token_value):
        LOG.debug("Gettings members.")
        response = RequestUtil.do_request_membership(RequestConstants.GET_METHOD, FogbowConstants.MEMBERS_ACTION_REQUEST_MERBERSHIP)
        # TODO use check_success_request in the RequestUtil class
        if response == None or response.status_code != RequestConstants.OK_STATUS_CODE:
            LOG.error("Status code is {code}".format(code=response.status_code))
            raise Exception("Is not possible get members")
        
        response_json = response.text
        return MemberUtil.get_members_from_json(response_json)
        
    @staticmethod
    def get_members_from_json(response_json):
        members = []
        json_data = json.loads(response_json)
        for member in json_data:
            members.append((member, member))
            
        return members

class NetworkUtil:

    @staticmethod
    def get_networks(federation_token_value):
        LOG.debug("Gettings networks.")
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, FogbowConstants.NETWORKS_ACTION_REQUEST_MANAGER, federation_token_value)

        RequestUtil.check_success_request(response)
        
        response_json = response.json()

        return NetworkUtil.get_networks_from_json(response_json)
     
    @staticmethod 
    def delete_network(federation_token_value):
        response = RequestUtil.do_request_manager(RequestConstants.DELETE_METHOD, FogbowConstants.NETWORKS_ACTION_REQUEST_MANAGER, federation_token_value)
        RequestUtil.check_success_request(response)

    @staticmethod
    def get_networks_from_json(response_json):
        networks = []

        data = json.loads(response_json)

        for network in data:
            networks.append(Network({'id': network.get('id'), 
            'network_id': network.get('id'), 'state': network.get('state')}))

        return networks
        
class RequestUtil:
    
    @staticmethod
    def check_success_request(response):
        if response == None:
            raise Exception("Response is null")

        status_code = response.status_code
        if status_code != RequestConstants.OK_STATUS_CODE and status_code != RequestConstants.CREATED_STATUS_CODE:
            raise Exception("Response is not ok. Status code is {code}".format(code=response.status_code))

    @staticmethod
    def do_request_membership(method_request, action_enpoint):
        timeout_get = settings.TIMEOUT_POST
    
        endpoint = settings.FOGBOW_MEMBERSHIP_ENDPOINT + action_enpoint
        LOG.debug("Requisting to membership in the endpoint: {endpoint}".format(endpoint=endpoint))
        try:
            if method_request == RequestConstants.GET_METHOD:
                response = requests.get(endpoint, timeout=timeout_get)
        except Exception as e:
            msg = "Error while requesting membership: {error}".format(error=str(e))
            LOG.error(msg)
            raise Exception(msg)
            
        return response
    
    @staticmethod
    def do_request_manager(method_request, action_enpoint, federation_token_value):
        timeout_post = settings.TIMEOUT_POST
        if timeout_post is None or not timeout_post:
            timeout_post = DashboardConstants.DEFAULT_POST_TIMEOUT
        timeout_delete = settings.TIMEOUT_DELETE
        if timeout_delete is None or not timeout_delete:
            timeout_delete = DashboardConstants.DEFAULT_DELETE_TIMEOUT    
        timeout_get = settings.TIMEOUT_GET
        if timeout_get is None or not timeout_get:
            timeout_get = DashboardConstants.DEFAULT_GET_TIMEOUT
    
        headers = {RequestConstants.CONTENT_TYPE_HEADER: RequestConstants.JSON_APPLIVATION_VALUE_HEADER,
                    FogbowConstants.FEDERATION_TOKEN_VALUE : federation_token_value}    
        try:
            if method_request == RequestConstants.GET_METHOD:
                response = requests.get(settings.FOGBOW_MANAGER_CORE_ENDPOINT + action_enpoint, headers=headers, timeout=timeout_get)
            elif method_request == RequestConstants.DELETE_METHOD:
                response = requests.delete(settings.FOGBOW_MANAGER_CORE_ENDPOINT + action_enpoint, headers=headers, timeout=timeout_delete)
            elif method_request == RequestConstants.POST_METHOD:
                response = requests.post(settings.FOGBOW_MANAGER_CORE_ENDPOINT + action_enpoint, headers=headers, timeout=timeout_post)
        except Exception as e:
            msg = "Error while requesting membership: {error}".format(error=str(e))
            LOG.error(msg)
            raise Exception(msg)
            
        return response    
           
# TODO check if is necessary. Old code
def doRequest(method, endpoint, additionalHeaders):
    token = settings.MY_TOKEN    
    headers = {'content-type': 'text/occi', 'X-Auth-Token' : token}
    if additionalHeaders is not None:
        headers.update(additionalHeaders)    
        
    if method == 'get': 
        response = requests.get(settings.FOGBOW_MANAGER_ENDPOINT + endpoint, headers=headers)
    elif method == 'delete':
        response = requests.delete(settings.FOGBOW_MANAGER_ENDPOINT + endpoint, headers=headers)
    elif method == 'post':        
        response = requests.post(settings.FOGBOW_MANAGER_ENDPOINT + endpoint, headers=headers)
    
    return response
