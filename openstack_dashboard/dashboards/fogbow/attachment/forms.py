import netaddr
import requests
import openstack_dashboard.models as fogbow_models
import base64
import logging

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
from openstack_dashboard.dashboards.fogbow.models import AttachmentUtil
from openstack_dashboard.dashboards.fogbow.models import VolumeUtil
from openstack_dashboard.dashboards.fogbow.models import ComputeUtil

LOG = logging.getLogger(__name__)

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
        federation_token_value = request.user.token.id

        volumes_choices = []
        volumes = VolumeUtil.get_volumes(federation_token_value)
        for volume in volumes:
            if volume.state == 'READY':
                volumes_choices.append((volume.id, volume.id))
 
        self.fields['volume'].choices = volumes_choices
        
        computes_choices = []
        computes = ComputeUtil.get_computes(federation_token_value)
        for compute in computes:
            if compute.state == 'READY':
                computes_choices.append((compute.id, compute.id))
        self.fields['compute'].choices = computes_choices

    def handle(self, request, data):
        federation_token_value = request.user.token.id

        try:
            target = data['volume']
            source = data['compute']

            AttachmentUtil.create_attachment(target, source, federation_token_value)
            
            messages.success(request, _('Attachment created'))            
            return shortcuts.redirect(reverse("horizon:fogbow:attachment:index"))    
        except Exception as e:
            redirect = reverse("horizon:fogbow:attachment:index")
            exceptions.handle(request, _('Unable to create attachments.'),
                              redirect=redirect)             
