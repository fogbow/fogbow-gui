import logging
import requests
import sys

from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse_lazy
from django.core.urlresolvers import reverse
from django.conf import settings
from django import shortcuts
from horizon import tables
from horizon import messages
from horizon import exceptions
from horizon import messages

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.models import ComputeUtil

LOG = logging.getLogger(__name__)

class TerminateInstance(tables.BatchAction):
    name = "terminate"
    action_present = _("Terminate")
    action_past = _("Terminated")
    data_type_singular = _("federated network")
    data_type_plural = _("federated networks")
    classes = ('btn-danger', 'btn-terminate')
    success_url = reverse_lazy("horizon:fogbow:federatednetwork:index")

    def allowed(self, request, instance=None):
        return True

    def action(self, request, obj_id):
        self.current_past_action = 0     
            
class CreateInstance(tables.LinkAction):
    name = 'create'
    verbose_name = _('Create federated network')
    url = 'horizon:fogbow:federatednetwork:create'
    classes = ('ajax-modal', 'btn-create')                     

def get_instance_id(request):
    null_value = "null"
    if null_value not in request.federatednetwork_id:
        return request.federatednetwork_id 
    else:        
        return '-' # TODO check this value

class InstancesFilterAction(tables.FilterAction):

    def filter(self, table, instances, filter_string):
        q = filter_string.lower()
        return [instance for instance in instances
                if q in instance.name.lower()]

class InstancesTable(tables.DataTable):
    federatednetwork_id = tables.Column(get_instance_id, link=("horizon:fogbow:federatednetwork:detail"),
                                verbose_name=_("Federated Network id"))
    
    state = tables.Column('state', verbose_name=_('State'))

    class Meta:
        name = "federated network"
        verbose_name = _("Federated Networks")        
        table_actions = (CreateInstance, TerminateInstance, InstancesFilterAction, )
        row_actions = (TerminateInstance, )
                