from horizon import views
from django.utils.translation import ugettext_lazy as _  # noqa
from horizon import tables
from horizon import tabs
from horizon import forms 

from openstack_dashboard.dashboards.fogbow.attachment \
    import tabs as project_tabs
from openstack_dashboard.dashboards.fogbow.attachment \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.attachment \
    import models as project_models    
import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.attachment.forms import CreateAttachment
from openstack_dashboard.dashboards.fogbow.attachment.models import Attachment
from django.core.urlresolvers import reverse_lazy 

THERE_ARE_NOT_ATTACHMENT = 'There are not attachment'
X_OCCI_LOCATION = 'X-OCCI-Location: '
STORAGE_TERM = fogbow_models.FogbowConstants.STORAGE_TERM
LINK_TERM = fogbow_models.FogbowConstants.LINK_TERM
LINK_TERM_WITH_VERBOSE = fogbow_models.FogbowConstants.LINK_TERM_WITH_VERBOSE

TARGET = fogbow_models.FogbowConstants.TARGET
SOURCE = fogbow_models.FogbowConstants.SOURCE
DEVICE_ID = fogbow_models.FogbowConstants.DEVICE_ID
PROVADING_MEMBER_ID = fogbow_models.FogbowConstants.PROVADING_MEMBER_ID

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/attachment/index.html'

    def has_more_data(self, table):
        return self._more

    def get_data(self):
        response = fogbow_models.doRequest('get', STORAGE_TERM + LINK_TERM_WITH_VERBOSE, None, self.request)                
        
        attachments = []
        self._more = False
        if response == None:
            return attachments
        
        responseStr = response.text
        print responseStr        
        attachments = self.getAttachments(responseStr)        
        
        return attachments
    
    def normalizeAttributes(self, propertie, term):        
        return propertie.split(term)[1].replace('"', '').replace('=','')

    def getAttachments(self, responseStr):
        listAttachments = []
        print responseStr
        propertiesRequests = responseStr.split('\n')
        for propertiesOneRequest in propertiesRequests:
            propertiesOneRequest = propertiesOneRequest.split(STORAGE_TERM + LINK_TERM_WITH_VERBOSE + '/')
            if len(propertiesOneRequest) > 1:
                propertiesOneRequest = propertiesOneRequest[1]                
                properties = propertiesOneRequest.split(';')
                
                target, source, deviceId, provadingMemberId = '-', '-', '-', '-'
                for propertie in properties:
                    if TARGET in propertie:                        
                        target = self.normalizeAttributes(propertie, TARGET)
                    elif SOURCE in propertie:
                        source = self.normalizeAttributes(propertie, SOURCE)
                    elif DEVICE_ID in propertie:
                        deviceId = self.normalizeAttributes(propertie, DEVICE_ID)
                    elif PROVADING_MEMBER_ID in propertie:
                        provadingMemberId = self.normalizeAttributes(propertie, PROVADING_MEMBER_ID)
                
                id = properties[0]
                attachmentId = '%s' % (id)
                request = {'id' : attachmentId, 'attachmentId' : attachmentId + "@" + provadingMemberId, 'target' : target, 'source' : source,
                            'deviceId': deviceId, 'provadingMemberId': provadingMemberId}
                listAttachments.append(Attachment(request))                
        
        return listAttachments        

class DetailViewAttachment(tabs.TabView):
    tab_group_class = project_tabs.AttachmentDetailTabGroupInstancePanel
    template_name = 'fogbow/attachment/detail.html'     
    
class CreateView(forms.ModalFormView):
    form_class = CreateAttachment
    template_name = 'fogbow/attachment/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')
    
        