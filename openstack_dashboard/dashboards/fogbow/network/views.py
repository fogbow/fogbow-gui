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
from openstack_dashboard.dashboards.fogbow.models import NetworkUtil

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/network/index.html'

    _more = False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
        response = NetworkUtil.get_networks(self.request.user.token.id)        
        
        return response

class CreateView(forms.ModalFormView):
    form_class = CreateNetwork
    template_name = 'fogbow/network/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')

class DetailViewInstance(tabs.TabView):
    tab_group_class = project_tabs.InstanceDetailTabGroupInstancePanel
    template_name = 'fogbow/network/detail.html'