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
from django.conf import settings

from openstack_dashboard.dashboards.fogbow.members.views import IndexView as member_views
from openstack_dashboard.dashboards.fogbow.network.views import IndexView as network_views
from openstack_dashboard.dashboards.fogbow.models import MemberUtil
from openstack_dashboard.dashboards.fogbow.models import NetworkUtil
from openstack_dashboard.dashboards.fogbow.models import FederatedNetworkUtil
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
        
    # FIXME.
    image = forms.ChoiceField(label=_('Image'), required=False, help_text=_('Image'))

    image_id = forms.CharField(label=_('hidden'),  widget=forms.TextInput(), required=False) 
    
    network_id = forms.ChoiceField(label=_('Network id'), help_text=_('Network id'), required=False)

    federated_network_id = forms.ChoiceField(label=_('Federated network id'), help_text=_('Federated network id'), required=False)
    
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
        members_choices.extend(MemberUtil.get_members(federation_token_value))
        self.fields['members'].choices = members_choices
        
        images_choices = []
        images_choices.append(('default', ''))
        self.fields['image'].choices = images_choices        

        dataUserTypeChoices = []
        dataUserTypeChoices.append(('SHELL_SCRIPT', 'text/x-shellscript'))
        dataUserTypeChoices.append(('INCLUDE_URL', 'text/x-include-url'))
        dataUserTypeChoices.append(('UPSTART_JOB', 'text/upstart-job'))
        dataUserTypeChoices.append(('CLOUD_CONFIG', 'text/cloud-config'))        
        dataUserTypeChoices.append(('CLOUD_BOOTHOOK', 'text/cloud-boothook'))
        self.fields['data_user_type'].choices = dataUserTypeChoices
        
        networks_choices = []
        networks_choices.append(('', 'Default'))        
        networks = NetworkUtil.get_networks(federation_token_value)
        for network in networks:
            networks_choices.append((network.id, network.id))
        
        self.fields['network_id'].choices = networks_choices

        if settings.FEDERATED_NETWORK_EXTENSION:
            LOG.debug("Filling federated network field")
            federated_networks_choices = []            
            try:
                federated_networks = FederatedNetworkUtil.get_federated_networks(federation_token_value)
                for federated_network in federated_networks:
                    federated_networks_choices.append((federated_network.id, federated_network.id))
            except Exception as e:
                LOG.error("Is not possible get federated networks. {error_msg}".format(error_msg=str(e)))

            self.fields['federated_network_id'].choices = federated_networks_choices
        
    def normalize_user_data(self, value):
        try:
            return base64.b64encode(value.replace('\n', '[[\\n]]').replace('\r', ''))
        except Exception as e:
            LOG.error("Is not possible normalize user data: {error_msg}".format(error_msg=str(e)))
            return ''

    def handle(self, request, data):
        LOG.debug("Try create compute")
        federation_token_value = request.user.token.id
        
        try:
            vcpu = data['cpu']
            memory = data['mem']
            member = data['members']
            image_id = data['image_id']
            network_id = data['network_id']
            data_user_file = data['data_user_file']
            extra_user_data, extra_user_data_type = None, None
            if data_user_file != None:
                extra_user_data = self.normalize_user_data(data_user_file)
                extra_user_data_type = data['data_user_type']
            public_key = data['publi_key']
            federated_network_id = data['federated_network_id']

            ComputeUtil.create_compute(vcpu, memory, member, image_id, network_id, extra_user_data, extra_user_data_type, public_key, federated_network_id, federation_token_value)

            messages.success(request, _('Orders created'))            
            return shortcuts.redirect(reverse("horizon:fogbow:instance:index"))         
        except Exception as e:
            LOG.error(str(e))
            redirect = reverse("horizon:fogbow:instance:index")
            exceptions.handle(request, _('Unable to create orders.'), redirect=redirect)         