import requests
import json
from django.conf import settings

import openstack_dashboard.models as fogbow_models

class MemberUtil:
     
    @staticmethod
    def get_members(federation_token_value):
        # TODO ask to server
        # fogbow_models.doRequestMembership().. # Complete 
        
        response_json = None
        return MemberUtil.get_members_from_json(response_json)
        
    @staticmethod
    def get_members_from_json(response_json):
        # TODO fake information
        response_json = '["Member Fake 1", "Member Fake 2", "Member Fake 3"]'
        
        members = []
        json_data = json.loads(response_json)
        for member in json_data:
            members.append((member, member))
            
        return members
        
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
