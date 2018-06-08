import requests
import logging
import json
from django.conf import settings

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.models import FogbowConstants
from openstack_dashboard.models import RequestConstants
from openstack_dashboard.models import DashboardConstants

LOG = logging.getLogger(__name__)

class MemberUtil:
     
    @staticmethod
    def get_members(federation_token_value):
        LOG.debug("Gettings members.")
        response = RequestUtil.do_request_membership(RequestConstants.GET_METHOD, FogbowConstants.MEMBERS_ACTION_REQUEST_MERBERSHIP)
        if response == None or response.status_code != RequestConstants.OK_STATUS_CODE:
            # TODO check response null
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
    def get_networks():
        # TODO ask to server
        # response_json = fogbow_models.doRequest('get', NETWORK_TERM, None, instance).json
        response_json = [{"id": "id1", "state": "state"}, {"id": "id2", "state": "state"}]
        return NetworkUtil.get_network_ids_from_json(response_json)
        
    @staticmethod
    def get_network_ids_from_json(response_json):
        network_ids = []

        for network in response_json:
            network_ids.append((network.get('id'), network.get('id')))

        return network_ids
        
class RequestUtil:
    
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
            # TODO implement
            raise Exception('')
            
        return response    
        
# TODO check if is necessary
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
