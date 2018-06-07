import netaddr
import requests
import logging
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
from openstack_dashboard.dashboards.fogbow.network.views import IndexView as network_views
from openstack_dashboard.dashboards.fogbow.models import MemberUtil
from openstack_dashboard.dashboards.fogbow.models import NetworkUtil
import openstack_dashboard.models as fogbow_models

LOG = logging.getLogger(__name__)

class CreateInstance(forms.SelfHandlingForm):
    success_url = reverse_lazy("horizon:fogbow:instance:index")
    
    cpu = forms.CharField(label=_('Minimal number of vCPUs'), initial=1,
                          widget=forms.TextInput(),
                          required=False)
    
    mem = forms.CharField(label=_('Minimal amount of RAM in MB'), initial=1024,
                          widget=forms.TextInput(),
                          required=False)
    
    members = forms.ChoiceField(label=_('Members'), help_text=_('Members'), required=False)
        
    image = forms.ChoiceField(label=_('Image'), required=False, help_text=_('Image'))
    
    network_id = forms.ChoiceField(label=_('Network id'), help_text=_('Network id'), required=False)    
    
    data_user = forms.FileField(label=_('Extra user data file'), required=False)
    
    data_user_type = forms.ChoiceField(label=_('Extra user data file type'),
                           help_text=_('Data user type'),
                           required=False)
    
    publicKey = forms.CharField(label=_('Public key'),
                           error_messages={'invalid': _('The string may only contain'
                                            ' ASCII characters and numbers.')},
                           required=False, widget=forms.Textarea)
    
    data_user_file = forms.CharField(label=_('hidden'), required=False, widget=forms.Textarea)            

    def __init__(self, request, *args, **kwargs):
        super(CreateInstance, self).__init__(request, *args, **kwargs)
        LOG.debug("Initializing compute form")
        
        members_choices = []
        federation_token_value = request.user.token.id
        members_choices.append(('', ''))
        members_choices.extend(MemberUtil.get_members(federation_token_value))
        self.fields['members'].choices = members_choices
        
        dataUserTypeChoices = []
        dataUserTypeChoices.append(('text/x-shellscript', 'text/x-shellscript'))
        dataUserTypeChoices.append(('text/x-include-once-url', 'text/x-include-once-url'))
        dataUserTypeChoices.append(('text/x-include-url', 'text/x-include-url'))
        dataUserTypeChoices.append(('text/cloud-config-archive', 'text/cloud-config-archive'))
        dataUserTypeChoices.append(('text/upstart-job', 'text/upstart-job'))
        dataUserTypeChoices.append(('text/cloud-config', 'text/cloud-config'))        
        dataUserTypeChoices.append(('text/cloud-boothook', 'text/cloud-boothook'))
        self.fields['data_user_type'].choices = dataUserTypeChoices
        
        networks_choices = []
        networks_choices.append(('', ''))
        networks_choices.extend(NetworkUtil.get_networks())
        self.fields['network_id'].choices = networks_choices
        
    def normalize_user_data(self, value):
        try:
            return base64.b64encode(value.replace('\n', '[[\\n]]').replace('\r', ''))
        except Exception:
            return ''

    def handle(self, request, data):
        LOG.debug("Try create compute.")
        try:
            messages.success(request, _('Orders created'))            
            return shortcuts.redirect(reverse("horizon:fogbow:request:index"))         
        except Exception:
            redirect = reverse("horizon:fogbow:instance:index")
            exceptions.handle(request,
                              _('Unable to create orders.'),
                              redirect=redirect)         