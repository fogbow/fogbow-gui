from django.utils.translation import ugettext_lazy as _

from django.core.urlresolvers import reverse_lazy  # noqa
from django.core.urlresolvers import reverse  # noqa

from django.conf import settings
import requests
from horizon import tables
from horizon import messages

import openstack_dashboard.models as fogbow_models
import openstack_dashboard.dashboards.fogbow.instance.tables as tableInstanceDashboard

STORAGE_TERM = fogbow_models.FogbowConstants.STORAGE_TERM
COMPUTE_TERM = '/compute/'

class TerminateInstance(tables.BatchAction):
    name = "terminate"
    action_present = _("Terminate")
    action_past = _("Terminated")
    data_type_singular = _("volume")
    data_type_plural = _("volumes")
    classes = ('btn-danger', 'btn-terminate')
    success_url = reverse_lazy("horizon:fogbow:storage:index")

    def allowed(self, request, instance=None):
        return True

    def action(self, request, obj_id):
        self.current_past_action = 0        
        response = fogbow_models.doRequest('delete', STORAGE_TERM + obj_id, None, request)
        if response == None or fogbow_models.isResponseOk(response.text) == False:
            messages.error(request, _('Is was not possible to delete : %s') % obj_id)          
            tableInstanceDashboard.checkAttachmentAssociateError(request, response.text)

class CreateVolume(tables.LinkAction):
    name = 'create'
    verbose_name = _('Create Volume')
    url = 'horizon:fogbow:storage:create'
    classes = ('ajax-modal', 'btn-create')

def get_instance_id(request):
    if 'null' not in request.instanceId:
        return request.instanceId 
    else:
        return '-'

class InstancesFilterAction(tables.FilterAction):

    def filter(self, table, instances, filter_string):
        q = filter_string.lower()
        return [instance for instance in instances
                if q in instance.name.lower()]

class InstancesTable(tables.DataTable):
    instanceId = tables.Column(get_instance_id, link=("horizon:fogbow:storage:detail"),
                                verbose_name=_("Volume ID"))

    class Meta:
        name = "volumes"
        verbose_name = _("Volumes")        
        table_actions = (TerminateInstance, InstancesFilterAction, CreateVolume)
        row_actions = (TerminateInstance, )
        