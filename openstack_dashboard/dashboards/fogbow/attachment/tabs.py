from django.utils.translation import ugettext_lazy as _
from horizon import tabs

import openstack_dashboard.models as fogbow_models
                
class AttachmentDetailTabInstancePanel(tabs.Tab):
    name = _("Attachment details")
    slug = "attachment_details"
    template_name = ("fogbow/attachment/_detail_attachment.html")

    def get_context_data(self, request):
        attachment_id = self.tab_group.kwargs['attachment_id']
        # TODO ask to fogbow-manager-core
#         response = fogbow_models.doRequest('get', STORAGE_TERM + LINK_TERM + attachmentId, None, request)
        attachment = None
        try:
            attachment = get_attachment_per_response(response_json)
        except Exception:
            attachment = {'attachmentId': '-' , 'target': '-', 'source': '-',
             'deviceId' : '-', 'provadingMemberId' : '-'}

        return {'attachment' : attachment}
    
def get_attachment_per_response(response_json):
    target, source, deviceId, provadingMemberId = '-', '-', '-', '-'            
    return {'attachmentId': attachmentId , 'target': target, 'source': source,
             'deviceId' : deviceId, 'provadingMemberId' : provadingMemberId}
    
class AttachmentDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (AttachmentDetailTabInstancePanel,)
