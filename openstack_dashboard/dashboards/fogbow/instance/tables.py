from django.utils.translation import ugettext_lazy as _

from django.core.urlresolvers import reverse_lazy  # noqa
from django.core.urlresolvers import reverse  # noqa

from django.conf import settings
import requests
from horizon import tables
from horizon import messages
from horizon import exceptions
from django import shortcuts
import sys

import openstack_dashboard.models as fogbow_models

COMPUTE_TERM = '/compute/'

class TerminateInstance(tables.BatchAction):
    name = "terminate"
    action_present = _("Terminate")
    action_past = _("Terminated")
    data_type_singular = _("instance")
    data_type_plural = _("instances")
    classes = ('btn-danger', 'btn-terminate')
    success_url = reverse_lazy("horizon:fogbow:instance:index")

    def allowed(self, request, instance=None):
        return True

    def action(self, request, obj_id):
        self.current_past_action = 0        
        response = fogbow_models.doRequest('delete',COMPUTE_TERM + obj_id, None, request)

        if response == None or fogbow_models.isResponseOk(response.text) == False:
            messages.error(request, _('Is was not possible to delete : %s') % obj_id)
            checkAttachmentAssociateError(request, response.text)
            return shortcuts.redirect(reverse("horizon:fogbow:instance:index"))
            
class CreateInstance(tables.LinkAction):
    name = 'create'
    verbose_name = _('Create Instance')
    url = 'horizon:fogbow:instance:create'
    classes = ('ajax-modal', 'btn-create')                     

def checkAttachmentAssociateError(request, responseStr):
    if 'Attachment IDs :' in responseStr:
        attachmentId = ''
        try:
            attachmentId = responseStr.split('Attachment IDs :')[1].split('</p>')[0]
        except Exception, err:
            pass
        messages.error(request, _('There are attachments(%s) associated.' ) % (attachmentId)) 
    else:
        pass

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
    instanceId = tables.Column(get_instance_id, link=("horizon:fogbow:instance:detail"),
                                verbose_name=_("Instance ID"))

    class Meta:
        name = "instances"
        verbose_name = _("Instances")        
        table_actions = (CreateInstance, TerminateInstance, InstancesFilterAction)
        row_actions = (TerminateInstance, )
        