from horizon import views
from django.utils.translation import ugettext_lazy as _
from horizon import tables
from horizon import tabs
from horizon import forms

from openstack_dashboard.dashboards.fogbow.storage.forms import CreateStorage
from django.core.urlresolvers import reverse_lazy 

from openstack_dashboard.dashboards.fogbow.storage import tabs as project_tabs    
from openstack_dashboard.dashboards.fogbow.storage import tables as project_tables
from openstack_dashboard.dashboards.fogbow.storage.models import Volume  
import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.models import VolumeUtil

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/storage/index.html'

    _more = False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
        federation_token_value = self.request.user.token.id
        # TODO check what happen in exception case
        try:
            return VolumeUtil.get_volumes(federation_token_value)
        except Exception as e:
            return {}        
        
class CreateView(forms.ModalFormView):
    form_class = CreateStorage
    template_name = 'fogbow/storage/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')

class DetailViewInstance(tabs.TabView):
    tab_group_class = project_tabs.InstanceDetailTabGroupInstancePanel
    template_name = 'fogbow/storage/detail.html'     
        