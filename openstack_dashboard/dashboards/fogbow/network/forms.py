import netaddr
import requests
import openstack_dashboard.models as fogbow_models
import base64
import logging

from django.core.validators import RegexValidator
from django.core.urlresolvers import reverse_lazy
from django.core.urlresolvers import reverse 
from django.core import validators
from django.utils.translation import ugettext_lazy as _  
from django import shortcuts
from horizon import exceptions
from horizon import forms
from horizon import messages
from horizon.utils import fields
from horizon import messages

from openstack_dashboard.dashboards.fogbow.models import MemberUtil
from openstack_dashboard.dashboards.fogbow.members.views import IndexView as member_views
from openstack_dashboard.dashboards.fogbow.models import NetworkUtil

LOG = logging.getLogger(__name__)

class CreateNetwork(forms.SelfHandlingForm):
    success_url = reverse_lazy("horizon:fogbow:network:index")
    
    cird = forms.CharField(label=_('CIDR'), initial='10.10.0.0/24',
                          widget=forms.TextInput(),
                          required=False)

    gateway = forms.CharField(label=_('Gateway'), initial='10.10.0.1',
                          widget=forms.TextInput())

    allocation = forms.ChoiceField(label=_('Allocation'), help_text=_('Allocation'), required=False)  

    members = forms.ChoiceField(label=_('Member'), help_text=_('Member'), required=False)

    def __init__(self, request, *args, **kwargs):
        super(CreateNetwork, self).__init__(request, *args, **kwargs)
        LOG.debug("Initializing network form")
        
        members_choices = []
        federation_token_value = request.user.token.id
        members_choices = MemberUtil.get_members(federation_token_value)
        self.fields['members'].choices = members_choices 

        dataAllocation = []
        dataAllocation.append(('dynamic', 'Dynamic'))
        dataAllocation.append(('static', 'Static'))
        self.fields['allocation'].choices = dataAllocation

    def handle(self, request, data):
        LOG.debug("Try create network")
        federation_token_value = request.user.token.id
        
        try:
            address = data['cird']
            gateway = data['gateway']
            allocation = data['allocation']
            member = data['members']

            NetworkUtil.create_network(address, gateway, allocation, member, federation_token_value)
            
            messages.success(request, _('Network created'))
            return shortcuts.redirect(reverse("horizon:fogbow:network:index"))    
        except Exception:
            redirect = reverse("horizon:fogbow:network:index")
            exceptions.handle(request, _('Unable to create network.'), redirect=redirect)            