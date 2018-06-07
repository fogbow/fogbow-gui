from django.core.urlresolvers import reverse_lazy 
from horizon import views
from django.utils.translation import ugettext_lazy as _
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

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/attachment/index.html'

    _more = False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
        # TODO ask to fogbow manager core for attachments information
#         response = fogbow_models.doRequest('get', STORAGE_TERM + LINK_TERM_WITH_VERBOSE, None, self.request)                
        
        attachments = []
        
        response_json = None
        attachments = self.get_attachments_from_json(response_json)        
        
        return attachments
    
    def get_attachments_from_json(self, response_json):
        attachments = []
        
        attachments.append(Attachment({'id': 'id_1', 'attachment_id': 'id_1', 'state': 'OPEN'}))
        attachments.append(Attachment({'id': 'id_2', 'attachment_id': 'id_1', 'state': 'FULL'}))        
        
        return attachments        

class DetailViewAttachment(tabs.TabView):
    tab_group_class = project_tabs.AttachmentDetailTabGroupInstancePanel
    template_name = 'fogbow/attachment/detail.html'     
    
class CreateView(forms.ModalFormView):
    form_class = CreateAttachment
    template_name = 'fogbow/attachment/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')
    
        