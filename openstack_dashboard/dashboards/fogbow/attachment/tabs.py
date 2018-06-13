import logging

from django.utils.translation import ugettext_lazy as _
from horizon import tabs

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.models import AttachmentUtil

LOG = logging.getLogger(__name__)
                
class AttachmentDetailTabInstancePanel(tabs.Tab):
    name = _("Attachment details")
    slug = "attachment_details"
    template_name = ("fogbow/attachment/_detail_attachment.html")

    def get_context_data(self, request):
        attachment_id = self.tab_group.kwargs['attachment_id']
        LOG.info("Trying to get the attachment: {attachment_id}".format(attachment_id=attachment_id))

        federation_token_value = request.user.token.id  
        try:
            attachment = AttachmentUtil.get_attachment(attachment_id, federation_token_value)
        except Exception as e:
            LOG.info("Is not possible get the attachment. Message exception is {error_msg}:".format(error_msg=str(e)))
            attachment = None

        return {'attachment' : attachment}
    
def get_attachment_per_response(response_json):
    target, source, deviceId, provadingMemberId = '-', '-', '-', '-'            
    return {'attachmentId': attachmentId , 'target': target, 'source': source,
             'deviceId' : deviceId, 'provadingMemberId' : provadingMemberId}
    
class AttachmentDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (AttachmentDetailTabInstancePanel,)
