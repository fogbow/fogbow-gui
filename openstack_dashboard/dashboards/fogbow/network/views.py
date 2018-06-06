from horizon import views
from django.utils.translation import ugettext_lazy as _  # noqa
from horizon import tables
from horizon import tabs
from horizon import forms

from openstack_dashboard.dashboards.fogbow.network.forms import CreateNetwork
from django.core.urlresolvers import reverse_lazy 

from openstack_dashboard.dashboards.fogbow.network \
    import tabs as project_tabs
from openstack_dashboard.dashboards.fogbow.network \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.network.models import Network
import openstack_dashboard.models as fogbow_models

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/network/index.html'

    _more = False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
#         response = fogbow_models.doRequest('get', NETWORK_TERM, None, self.request)        
        
        networks = []
        
#         if response == None:
#             return instances
        
#         responseStr = response.text
        response_json = None
        networks = self.get_networks_from_json(response_json)        
        
        return networks
    
    def get_networks_from_json(self, response_json):
        networks = []
            
        networks.append(Network({'id': 'id_1', 'network_id': 'id_1', 'state': 'OPEN'}))
        networks.append(Network({'id': 'id_2', 'network_id': 'id_1', 'state': 'FULL'}))
            
        return networks
        
class CreateView(forms.ModalFormView):
    form_class = CreateNetwork
    template_name = 'fogbow/network/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')

class DetailViewInstance(tabs.TabView):
    tab_group_class = project_tabs.InstanceDetailTabGroupInstancePanel
    template_name = 'fogbow/network/detail.html'