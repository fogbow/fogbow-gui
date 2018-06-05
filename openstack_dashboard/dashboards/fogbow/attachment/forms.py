import netaddr
import requests
import openstack_dashboard.models as fogbow_models
import base64

from django.core.validators import RegexValidator
from django.core.urlresolvers import reverse 
from django.core import validators
from django.utils.translation import ugettext_lazy as _  
from horizon import exceptions
from horizon import forms
from horizon import messages
from horizon.utils import fields
from django.core.urlresolvers import reverse_lazy
from horizon import messages
from django import shortcuts
from openstack_dashboard.dashboards.fogbow.members.views import IndexView as member_views
from openstack_dashboard.dashboards.fogbow.instance.views import IndexView as instance_views
from openstack_dashboard.dashboards.fogbow.storage.views import IndexView as storage_views

RESOURCE_TERM = fogbow_models.FogbowConstants.RESOURCE_TERM
MEMBER_TERM = fogbow_models.FogbowConstants.MEMBER_TERM
REQUEST_TERM = fogbow_models.FogbowConstants.REQUEST_TERM

LINK_TERM = fogbow_models.FogbowConstants.LINK_TERM
STORAGE_TERM = fogbow_models.FogbowConstants.STORAGE_TERM
COMPUTE_TERM = fogbow_models.FogbowConstants.COMPUTE_TERM

SIZE_OCCI = fogbow_models.FogbowConstants.SIZE_OCCI
STORAGE_SCHEME = fogbow_models.FogbowConstants.STORAGE_SCHEME

STORAGELINK_TERM_OCCI = 'storagelink'

TARGET = fogbow_models.FogbowConstants.TARGET
SOURCE = fogbow_models.FogbowConstants.SOURCE
DEVICE_ID = fogbow_models.FogbowConstants.DEVICE_ID
PROVADING_MEMBER_ID = fogbow_models.FogbowConstants.PROVADING_MEMBER_ID

class CreateAttachment(forms.SelfHandlingForm):
    
    success_url = reverse_lazy("horizon:fogbow:attachment:index")
        
    compute = forms.ChoiceField(label=_('Instance'),
                               help_text=_('Instance'),
                               required=True)
    
    storage = forms.ChoiceField(label=_('Volume'),
                               help_text=_('Volume'),
                               required=True)
    

    def __init__(self, request, *args, **kwargs):
        super(CreateAttachment, self).__init__(request, *args, **kwargs)
        
        responseCompute = fogbow_models.doRequest('get', COMPUTE_TERM, None, request)            
        responseStorage = fogbow_models.doRequest('get', STORAGE_TERM, None, request)

        storagesChoices = []
        try:
            storages = storage_views().getInstances(responseStorage.text)
            storagesChoices.append(('', ''))
            for stor in storages:
                storagesChoices.append((stor.get('id'), stor.get('id')))
                
            if storages == []:
                pass        
        except Exception as error: 
            pass        
 
        self.fields['storage'].choices = storagesChoices
        
        instancesChoices = []
        try:
            instances = instance_views().getInstances(responseCompute.text)
            instancesChoices.append(('', ''))
            for inst in instances:
                instancesChoices.append((inst.get('id'), inst.get('id')))

            if instances == []:
                pass
        except Exception as error: 
            pass        
 
        self.fields['compute'].choices = instancesChoices

    def handle(self, request, data):
        try:
            headers = {}
            
            headers = {'Category' : '%s; %s; class="kind"' % (STORAGELINK_TERM_OCCI , STORAGE_SCHEME)}
                                
            compute = '%s=%s' % (SOURCE, data['compute'])            
            storage = '%s=%s' % (TARGET, data['storage'])
            
            deviceId = 'null'
                
            deviceId = '%s=%s' % (DEVICE_ID, deviceId)                
            
            headers.update({'X-OCCI-Attribute': '%s,%s,%s' % (compute, storage, deviceId)})            
            
            response = fogbow_models.doRequest('post', STORAGE_TERM + LINK_TERM , headers, request)
             
            if response != None and fogbow_models.isResponseOk(response.text) == True: 
                messages.success(request, _('Attachment created'))
            
            return shortcuts.redirect(reverse("horizon:fogbow:attachment:index"))    
        except Exception:
            pass
            redirect = reverse("horizon:fogbow:attachment:index")
            exceptions.handle(request, _('Unable to create attachments.'),
                              redirect=redirect)             
