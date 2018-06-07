import netaddr
import requests
import openstack_dashboard.models as fogbow_models
import base64
import logging

from django.core.validators import RegexValidator
from django.core.urlresolvers import reverse 
from django.core.urlresolvers import reverse_lazy
from django.core import validators
from django.utils.translation import ugettext_lazy as _  
from horizon import exceptions
from horizon import forms
from horizon import messages
from horizon.utils import fields
from horizon import messages
from django import shortcuts

from openstack_dashboard.dashboards.fogbow.models import MemberUtil
from openstack_dashboard.dashboards.fogbow.members.views import IndexView as member_views
from openstack_dashboard.dashboards.fogbow.network.views import IndexView as network_views

LOG = logging.getLogger(__name__)

# TODO change to volume
class CreateStorage(forms.SelfHandlingForm):
    success_url = reverse_lazy("horizon:fogbow:storage:index")
    
    size_storage = forms.CharField(label=_('Volume size (in GB)'), initial=1,
                          widget=forms.TextInput(),
                          required=False)
    
    members = forms.ChoiceField(label=_('Members'), help_text=_('Members'), required=False)
        
    def __init__(self, request, *args, **kwargs):
        super(CreateStorage, self).__init__(request, *args, **kwargs)
        LOG.debug("Initializing volume form")
        
        members_choices = []
        federation_token_value = request.user.token.id
        members_choices = MemberUtil.get_members(federation_token_value)
        self.fields['members'].choices = members_choices 
        
    def handle(self, request, data):
        try:
            messages.success(request, _('Volume created'))            
            return shortcuts.redirect(reverse("horizon:fogbow:storage:index"))    
        except Exception:
            redirect = reverse("horizon:fogbow:storage:index")
            exceptions.handle(request,
                              _('Unable to create volume.'),
                              redirect=redirect)         