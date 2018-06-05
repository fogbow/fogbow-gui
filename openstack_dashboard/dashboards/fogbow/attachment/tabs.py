from django.utils.translation import ugettext_lazy as _
from horizon import tabs
import openstack_dashboard.models as fogbow_models
                
COMPUTE_TERM = fogbow_models.FogbowConstants.COMPUTE_TERM
STATE_TERM = fogbow_models.FogbowConstants.STATE_TERM
SHH_PUBLIC_KEY_TERM = fogbow_models.FogbowConstants.SHH_PUBLIC_KEY_TERM
CONSOLE_VNC_TERM = fogbow_models.FogbowConstants.CONSOLE_VNC_TERM
MEMORY_TERM = fogbow_models.FogbowConstants.MEMORY_TERM
CORES_TERM = fogbow_models.FogbowConstants.CORES_TERM
IMAGE_SCHEME = fogbow_models.FogbowConstants.IMAGE_SCHEME     
EXTRA_PORT_SCHEME = fogbow_models.FogbowConstants.EXTRA_PORT_SCHEME

STORAGE_TERM = fogbow_models.FogbowConstants.STORAGE_TERM
LINK_TERM = fogbow_models.FogbowConstants.LINK_TERM

TARGET = fogbow_models.FogbowConstants.TARGET
SOURCE = fogbow_models.FogbowConstants.SOURCE
DEVICE_ID = fogbow_models.FogbowConstants.DEVICE_ID
PROVADING_MEMBER_ID = fogbow_models.FogbowConstants.PROVADING_MEMBER_ID

class AttachmentDetailTabInstancePanel(tabs.Tab):
    name = _("Attachment details")
    slug = "attachment_details"
    template_name = ("fogbow/attachment/_detail_attachment.html")

    def get_context_data(self, request):
        attachmentId = self.tab_group.kwargs['attachment_id']
        response = fogbow_models.doRequest('get', STORAGE_TERM + LINK_TERM + attachmentId,
                                             None, request)
        attachment = None
        try:
            attachment = getAttachmentPerResponse(attachmentId, response)
        except Exception:
            attachment = {'attachmentId': '-' , 'target': '-', 'source': '-',
             'deviceId' : '-', 'provadingMemberId' : '-'}

        return {'attachment' : attachment}
    
def getAttachmentPerResponse(attachmentId, response):
    if attachmentId == 'null':
        attachmentId = '-'
    
    instanceDetails = response.text.split('\n')
    
    target, source, deviceId, provadingMemberId = '-', '-', '-', '-'
    for detail in instanceDetails:
        if TARGET in detail:
            target = normalizeAttributes(detail, TARGET)
        elif SOURCE in detail:
            source = normalizeAttributes(detail, SOURCE)
        elif DEVICE_ID in detail:
            deviceId = normalizeAttributes(detail, DEVICE_ID)
        elif PROVADING_MEMBER_ID in detail:
            provadingMemberId = normalizeAttributes(detail, PROVADING_MEMBER_ID)
            
    return {'attachmentId': attachmentId , 'target': target, 'source': source,
             'deviceId' : deviceId, 'provadingMemberId' : provadingMemberId}
    
def normalizeAttributes(propertie, term):
    try:
        return propertie.split(term)[1].replace('=', '').replace('"', '')
    except:
        return ''            
                
class AttachmentDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (AttachmentDetailTabInstancePanel,)
