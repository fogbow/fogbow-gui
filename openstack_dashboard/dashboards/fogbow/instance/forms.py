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
from openstack_dashboard.dashboards.fogbow.models import ComputeUtil
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
    
    publi_key = forms.CharField(label=_('Public key'),
                           error_messages={'invalid': _('The string may only contain'
                                            ' ASCII characters and numbers.')},
                           required=False, widget=forms.Textarea)
    
    data_user_file = forms.CharField(label=_('hidden'), required=False, widget=forms.Textarea)            

    def __init__(self, request, *args, **kwargs):
        super(CreateInstance, self).__init__(request, *args, **kwargs)
        LOG.debug("Initializing compute form")

        federation_token_value = request.user.token.id
        
        members_choices = []
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
        networks = NetworkUtil.get_networks(federation_token_value)
        for network in networks:
            networks_choices.append((network.id, network.id))
        
        self.fields['network_id'].choices = networks_choices
        
    def normalize_user_data(self, value):
        try:
            return base64.b64encode(value.replace('\n', '[[\\n]]').replace('\r', ''))
        except Exception:
            return ''

    def handle(self, request, data):
        LOG.debug("Try create compute")
        federation_token_value = request.user.token.id
        
        try:
            vcpu = data['cpu']
            memory = data['mem']
            member = data['members']
            image_id = data['image']
            network_id = data['network_id']
            data_user_file = data['data_user_file']
            extra_user_data = None
            extra_user_data_type = None
            if data_user_file != None and not data_user_file:
                extra_user_data = self.normalize_user_data(data['data_user'])
                extra_user_data_type = data['data_user_type']
            public_key = data['publi_key']

            ComputeUtil.create_compute(vcpu, memory, member, image_id, network_id, extra_user_data, extra_user_data_type, public_key, federation_token_value)

            messages.success(request, _('Orders created'))            
            return shortcuts.redirect(reverse("horizon:fogbow:instance:index"))         
        except Exception as e:
            LOG.error(str(e))
            redirect = reverse("horizon:fogbow:instance:index")
            exceptions.handle(request, _('Unable to create orders.'), redirect=redirect)         