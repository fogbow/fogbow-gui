from horizon import views
from django.utils.translation import ugettext_lazy as _
from horizon import tables
from horizon import tabs
from horizon import forms

from openstack_dashboard.dashboards.fogbow.storage.forms import CreateStorage
from django.core.urlresolvers import reverse_lazy 

from openstack_dashboard.dashboards.fogbow.storage \
    import tabs as project_tabs
from openstack_dashboard.dashboards.fogbow.storage \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.storage.models import Volume  
import openstack_dashboard.models as fogbow_models

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/storage/index.html'

    _more = False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
#         response = fogbow_models.doRequest('get', STORAGE_TERM, None, self.request)        
        
        volumes = []
#         if response == None:
#             return instances
#         
#         responseStr = response.text  
        response_json = None      
        volumes = self.get_volumes_from_json(response_json)        
        
        return volumes
    
    def get_volumes_from_json(self, response_json):
        volumes = []

        volumes.append(Volume({'id': 'id_1', 'volume_id': 'id_1', 'state': 'OPEN'}))
        volumes.append(Volume({'id': 'id_2', 'volume_id': 'id_1', 'state': 'FULL'}))
            
        return volumes
        
class CreateView(forms.ModalFormView):
    form_class = CreateStorage
    template_name = 'fogbow/storage/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')

class DetailViewInstance(tabs.TabView):
    tab_group_class = project_tabs.InstanceDetailTabGroupInstancePanel
    template_name = 'fogbow/storage/detail.html'     
        