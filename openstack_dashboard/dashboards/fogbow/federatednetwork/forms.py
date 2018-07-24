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
from openstack_dashboard.dashboards.fogbow.models import FederatedNetworkUtil
import openstack_dashboard.models as fogbow_models

LOG = logging.getLogger(__name__)

class CreateInstance(forms.SelfHandlingForm):
    success_url = reverse_lazy("horizon:fogbow:federatednetwork:index")
    
    label = forms.CharField(label=_('Label'),
                          widget=forms.TextInput(),
                          required=False)

    cird = forms.CharField(label=_('CIDR'), initial='188.140.0.0/24',
                          widget=forms.TextInput(),
                          required=True)

    members = forms.MultipleChoiceField(label=_('Members'), widget=forms.CheckboxSelectMultiple(), required=True)
            

    def __init__(self, request, *args, **kwargs):
        super(CreateInstance, self).__init__(request, *args, **kwargs)
        LOG.debug("Initializing federated network form")

        federation_token_value = request.user.token.id
        
        members_choices = []
        members_choices.extend(MemberUtil.get_members(federation_token_value))
        self.fields['members'].choices = members_choices

    def handle(self, request, data):
        LOG.debug("Try create federated network")
        federation_token_value = request.user.token.id
        
        try:
            label = data['label']
            cird = data['cird']
            members = data['members']

            FederatedNetworkUtil.create_federated_network(label, cird, members, federation_token_value)

            messages.success(request, _('Federated network created'))            
            return shortcuts.redirect(reverse("horizon:fogbow:federatednetwork:index"))         
        except Exception as e:
            LOG.error(str(e))
            redirect = reverse("horizon:fogbow:federatednetwork:index")
            exceptions.handle(request, _('Unable to create federated network.'), redirect=redirect)        