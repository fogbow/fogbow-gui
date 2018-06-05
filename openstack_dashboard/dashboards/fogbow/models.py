"""
Stub file to work around django bug: https://code.djangoproject.com/ticket/7198
"""

from django.conf import settings
import requests

def doRequest(method, endpoint, additionalHeaders):
    token = settings.MY_TOKEN
    print additionalHeaders
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
