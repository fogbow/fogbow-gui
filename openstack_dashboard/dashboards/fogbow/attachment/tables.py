import requests
import logging

from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse_lazy
from django.core.urlresolvers import reverse 
from django.conf import settings
from horizon import tables
from horizon import messages

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.models import AttachmentUtil

LOG = logging.getLogger(__name__)

class TerminateAttachment(tables.BatchAction):
    name = "terminate"
    action_present = _("Terminate")
    action_past = _("Terminated")
    data_type_singular = _("attachment")
    data_type_plural = _("attachments")
    classes = ('btn-danger', 'btn-terminate')
    success_url = reverse_lazy("horizon:fogbow:attachment:index")

    def allowed(self, request, instance=None):
        return True

    def action(self, request, obj_id):
        self.current_past_action = 0  
        attachment_id = obj_id
        LOG.info("Trying to delete the attachment: {attachment_id}".format(attachment_id=attachment_id))
        federation_token_value = request.user.token.id  
        try:
            AttachmentUtil.delete_attachment(attachment_id, federation_token_value)
        except Exception as e:
            LOG.error("Is not possible delete the attachment. Message exception is {error_msg}:".format(error_msg=str(e)))
            messages.error(request, _('Is was not possible to delete : %s') % attachment_id)      

def get_attachment_id(request):
    null_value = 'null'
    if null_value not in request.attachment_id:
        return request.attachment_id 
    else:
        return '-'

class CreateAttachment(tables.LinkAction):
    name = 'create'
    verbose_name = _('Create attachment')
    url = 'horizon:fogbow:attachment:create'
    classes = ('ajax-modal', 'btn-create')

class AttachmentFilterAction(tables.FilterAction):

    def filter(self, table, attachments, filter_string):
        q = filter_string.lower()
        return [attachment for attachment in attachments
                if q in attachment.name.lower()]

class InstancesTable(tables.DataTable):
    
    attachmentId = tables.Column(get_attachment_id, link=("horizon:fogbow:attachment:detail"), verbose_name=_("Attachment id"))
    
    provider = tables.Column('provider', verbose_name=_('Provider'))

    state = tables.Column('state', verbose_name=_('State'))

    class Meta:
        name = "attachment"
        verbose_name = _("Attachments")        
        table_actions = (CreateAttachment, TerminateAttachment, AttachmentFilterAction)
        row_actions = (TerminateAttachment, )
        