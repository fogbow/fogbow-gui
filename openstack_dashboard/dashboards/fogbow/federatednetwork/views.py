import json
import logging
import requests

from django.http import HttpResponse
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse_lazy 
from horizon import views
from horizon import tables
from horizon import tabs
from horizon import forms
from horizon import messages

from openstack_dashboard.dashboards.fogbow.federatednetwork.forms import CreateInstance
from openstack_dashboard.dashboards.fogbow.federatednetwork import tabs as project_tabs
from openstack_dashboard.dashboards.fogbow.federatednetwork import tables as project_tables
import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.models import FederatedNetworkUtil
from openstack_dashboard.dashboards.fogbow.federatednetwork.models import FederatedNetwork

LOG = logging.getLogger(__name__)

class IndexView(tables.DataTableView):
    table_class = project_tables.InstancesTable
    template_name = 'fogbow/federatednetwork/index.html'

    _more=False

    def has_more_data(self, table):
        return self._more

    def get_data(self):
        federation_token_value = self.request.user.token.id
        try:
            return FederatedNetworkUtil.get_federated_networks(federation_token_value)
        except Exception as e:
            error_msg = "Is not possible to get federated networks"
            error_msg_detail = "Error message: {error_msg}".format(error_msg=str(e))
            LOG.error("{error_msg}{error_msg_detail}".format(error_msg=error_msg, error_msg_detail=error_msg_detail))
            messages.error(self.request, error_msg)
            return {}
    
class CreateView(forms.ModalFormView):
    form_class = CreateInstance
    template_name = 'fogbow/federatednetwork/create.html'
    success_url = reverse_lazy('horizon:fogbow:index')

class DetailViewInstance(tabs.TabView):
    tab_group_class = project_tabs.InstanceDetailTabGroupInstancePanel
    template_name = 'fogbow/federatednetwork/detail.html'
