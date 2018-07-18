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

# TODO use constants
COMPUTE_TERM = '/compute/'

class TerminateInstance(tables.BatchAction):
    name = "terminate"
    action_present = _("Terminate")
    action_past = _("Terminated")
    data_type_singular = _("compute")
    data_type_plural = _("computes")
    classes = ('btn-danger', 'btn-terminate')
    success_url = reverse_lazy("horizon:fogbow:instance:index")

    def allowed(self, request, instance=None):
        return True

    def action(self, request, obj_id):
        self.current_past_action = 0     
        compute_id = obj_id
        LOG.info("Trying to delete the compute: {compute_id}".format(compute_id=compute_id))
        federation_token_value = request.user.token.id  
        try:
            ComputeUtil.delete_compute(compute_id, federation_token_value)
        except Exception as e:
            LOG.error("Is not possible delete the compute. Message exception is {error_msg}:".format(error_msg=str(e)))
            messages.error(request, _('Is was not possible to delete : %s') % compute_id)     
            
class CreateInstance(tables.LinkAction):
    name = 'create'
    verbose_name = _('Create compute')
    url = 'horizon:fogbow:instance:create'
    classes = ('ajax-modal', 'btn-create')                     

def get_instance_id(request):
    null_value = "null"
    if null_value not in request.compute_id:
        return request.compute_id 
    else:        
        return '-' # TODO check this value

class InstancesFilterAction(tables.FilterAction):

    def filter(self, table, instances, filter_string):
        q = filter_string.lower()
        return [instance for instance in instances
                if q in instance.name.lower()]

class InstancesTable(tables.DataTable):
    compute_id = tables.Column(get_instance_id, link=("horizon:fogbow:instance:detail"),
                                verbose_name=_("Compute id"))
    
    provider = tables.Column('provider', verbose_name=_('Provider'))

    state = tables.Column('state', verbose_name=_('State'))

    class Meta:
        name = "computes"
        verbose_name = _("Computes")        
        table_actions = (CreateInstance, TerminateInstance, InstancesFilterAction, )
        row_actions = (TerminateInstance, )
                