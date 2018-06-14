import json
import logging

from django.http import HttpResponse
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse_lazy 
from horizon import views
from horizon import tables
from horizon import tabs
from horizon import forms
from horizon import messages

from openstack_dashboard.dashboards.fogbow.instance.forms import CreateInstance
from openstack_dashboard.dashboards.fogbow.instance \
    import tabs as project_tabs
from openstack_dashboard.dashboards.fogbow.instance \
    import tables as project_tables
from openstack_dashboard.dashboards.fogbow.instance.models import Compute
import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.models import ComputeUtil

LOG = logging.getLogger(__name__)

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/instance/index.html'

    _more=False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
        federation_token_value = self.request.user.token.id
        try:
            return ComputeUtil.get_computes(federation_token_value)
        except Exception as e:
            error_msg = "Is not possible to get computes"
            error_msg_detail = "Error message: {error_msg}".format(error_msg=str(e))
            LOG.error("{error_msg}{error_msg_detail}".format(error_msg=error_msg, error_msg_detail=error_msg_detail))
            messages.error(self.request, error_msg)
            return {}
    
class CreateView(forms.ModalFormView):
    form_class = CreateInstance
    template_name = 'fogbow/instance/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')

class DetailViewInstance(tabs.TabView):
    tab_group_class = project_tabs.InstanceDetailTabGroupInstancePanel
    template_name = 'fogbow/instance/detail.html'     
        
# TODO change local Method
def getImages(request, member_id):
    response = requests.get(fowbow_endpoint + '/2/images')
    r = response.text.encode('ascii')
    return HttpResponse(r)
