import requests
import logging

from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse_lazy
from django.core.urlresolvers import reverse

from django.conf import settings
from horizon import tables
from horizon import messages

import openstack_dashboard.models as fogbow_models
import openstack_dashboard.dashboards.fogbow.instance.tables as tableInstanceDashboard
from openstack_dashboard.dashboards.fogbow.models import VolumeUtil

LOG = logging.getLogger(__name__)

class TerminateInstance(tables.BatchAction):
    name = "terminate"
    action_present = _("Terminate")
    action_past = _("Terminated")
    data_type_singular = _("volume")
    data_type_plural = _("volumes")
    classes = ("btn-danger", "btn-terminate")
    success_url = reverse_lazy("horizon:fogbow:storage:index")

    def allowed(self, request, instance=None):
        return True

    def action(self, request, obj_id):
        self.current_past_action = 0  
        LOG.info("Trying to delete the volume: {volume_id}".format(volume_id=obj_id))
        federation_token_value = request.user.token.id  
        try:
            VolumeUtil.delete_volume(obj_id, federation_token_value)
        except Exception as e:
            LOG.error("Is not possible delete the volume. Message exception is {error_msg}:".format(error_msg=str(e)))
            messages.error(request, _('Is was not possible to delete : %s') % obj_id)

class CreateVolume(tables.LinkAction):
    name = 'create'
    verbose_name = _('Create Volume')
    url = 'horizon:fogbow:storage:create'
    classes = ('ajax-modal', 'btn-create')

def get_volume_id(request):
    null_value = 'null'
    if null_value not in request.volume_id:
        return request.volume_id 
    else:
        return '-'

class InstancesFilterAction(tables.FilterAction):

    def filter(self, table, instances, filter_string):
        q = filter_string.lower()
        return [instance for instance in instances
                if q in instance.name.lower()]

class InstancesTable(tables.DataTable):
    volume_id = tables.Column(get_volume_id, link=("horizon:fogbow:storage:detail"),
                                verbose_name=_("Volume id"))

    provider = tables.Column('provider', verbose_name=_('Provider'))

    state = tables.Column('state', verbose_name=_('State'))

    class Meta:
        name = "volumes"
        verbose_name = _("Volumes")        
        table_actions = (CreateVolume, TerminateInstance, InstancesFilterAction, )
        row_actions = (TerminateInstance, )
        