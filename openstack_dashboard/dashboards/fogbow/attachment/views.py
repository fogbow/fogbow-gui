import logging

from django.core.urlresolvers import reverse_lazy 
from horizon import views
from django.utils.translation import ugettext_lazy as _
from horizon import tables
from horizon import tabs
from horizon import forms 
from horizon import messages

from openstack_dashboard.dashboards.fogbow.attachment \
    import tabs as project_tabs
from openstack_dashboard.dashboards.fogbow.attachment \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.attachment \
    import models as project_models    
import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.attachment.forms import CreateAttachment
from openstack_dashboard.dashboards.fogbow.attachment.models import Attachment
from openstack_dashboard.dashboards.fogbow.models import AttachmentUtil

LOG = logging.getLogger(__name__)

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/attachment/index.html'

    _more = False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
        federation_token_value = self.request.user.token.id
        # TODO check what happen in exception case
        try:
            return AttachmentUtil.get_attachments(federation_token_value)
        except Exception as e:
            error_msg = "Is not possible to get attachments. Error message: {error_msg}".format(error_msg=str(e))
            LOG.error(error_msg)
            messages.error(self.request, error_msg)
            return {}        

class DetailViewAttachment(tabs.TabView):
    tab_group_class = project_tabs.AttachmentDetailTabGroupInstancePanel
    template_name = 'fogbow/attachment/detail.html'     
    
class CreateView(forms.ModalFormView):
    form_class = CreateAttachment
    template_name = 'fogbow/attachment/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')
    
        