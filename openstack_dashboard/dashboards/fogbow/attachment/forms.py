import netaddr
import requests
import openstack_dashboard.models as fogbow_models
import base64

from django.core.validators import RegexValidator
from django.core.urlresolvers import reverse 
from django.core import validators
from django.core.urlresolvers import reverse_lazy
from django.utils.translation import ugettext_lazy as _  
from django import shortcuts
from horizon import exceptions
from horizon import forms
from horizon import messages
from horizon.utils import fields
from horizon import messages

from openstack_dashboard.dashboards.fogbow.members.views import IndexView as member_views
from openstack_dashboard.dashboards.fogbow.instance.views import IndexView as instance_views
from openstack_dashboard.dashboards.fogbow.storage.views import IndexView as storage_views

class CreateAttachment(forms.SelfHandlingForm):
    
    success_url = reverse_lazy("horizon:fogbow:attachment:index")
        
    compute = forms.ChoiceField(label=_('Compute'),
                               help_text=_('Compute'),
                               required=True)
    
    volume = forms.ChoiceField(label=_('Volume'),
                               help_text=_('Volume'),
                               required=True)
    

    def __init__(self, request, *args, **kwargs):
        super(CreateAttachment, self).__init__(request, *args, **kwargs)
        
#         responseCompute = fogbow_models.doRequest('get', COMPUTE_TERM, None, request)            
#         responseStorage = fogbow_models.doRequest('get', STORAGE_TERM, None, request)

        volumes_choices = []
#         try:
#             storages = storage_views().getInstances(responseStorage.text)
#             storagesChoices.append(('', ''))
#             for stor in storages:
#                 storagesChoices.append((stor.get('id'), stor.get('id')))
#                 
#             if storages == []:
#                 pass        
#         except Exception as error: 
#             pass        
 
        self.fields['volume'].choices = volumes_choices
        
        instances_choices = []
#         try:
#             instances = instance_views().getInstances(responseCompute.text)
#             instancesChoices.append(('', ''))
#             for inst in instances:
#                 instancesChoices.append((inst.get('id'), inst.get('id')))
#  
#             if instances == []:
#                 pass
#         except Exception as error: 
#             pass        
 
        self.fields['compute'].choices = instances_choices

    def handle(self, request, data):
        try:
            messages.success(request, _('Attachment created'))            
            return shortcuts.redirect(reverse("horizon:fogbow:attachment:index"))    
        except Exception:
            pass
            redirect = reverse("horizon:fogbow:attachment:index")
            exceptions.handle(request, _('Unable to create attachments.'),
                              redirect=redirect)             
