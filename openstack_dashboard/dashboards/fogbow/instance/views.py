from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse_lazy 
from horizon import views
from horizon import tables
from horizon import tabs
from horizon import forms

from openstack_dashboard.dashboards.fogbow.instance.forms import CreateInstance
from openstack_dashboard.dashboards.fogbow.instance \
    import tabs as project_tabs
from openstack_dashboard.dashboards.fogbow.instance \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.instance.models import Compute    
import openstack_dashboard.models as fogbow_models

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/instance/index.html'

    _more=False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
        
        computes = []
        
        # TODO get json response of thw new fogbow manager. Get computes 
#        response = fogbow_models.doRequest('get', COMPUTE_TERM, None, self.request)        
        response_str = '' 
        computes = self.get_instances_from_json(response_str)        
        
        return computes
    
    def get_instances_from_json(self, response_json):
        computes = []

        computes.append(Compute({'id': 'id_1', 'compute_id': 'id_1', 'state': 'OPEN'}))
        computes.append(Compute({'id': 'id_2', 'compute_id': 'id_1', 'state': 'FULL'}))
            
        return computes
    
class CreateView(forms.ModalFormView):
    form_class = CreateInstance
    template_name = 'fogbow/instance/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')

class DetailViewInstance(tabs.TabView):
    tab_group_class = project_tabs.InstanceDetailTabGroupInstancePanel
    template_name = 'fogbow/instance/detail.html'     
        