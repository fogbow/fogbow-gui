import logging

from django.utils.translation import ugettext_lazy as _
from horizon import tabs
import openstack_dashboard.models as fogbow_models
                
from openstack_dashboard.dashboards.fogbow.models import ComputeUtil

LOG = logging.getLogger(__name__)

class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Compute details")
    slug = "compute_details"
    template_name = ("fogbow/instance/_detail_instance.html")

    def get_context_data(self, request):
        compute_id = self.tab_group.kwargs['instance_id']
        LOG.info("Trying to get the compute: {compute_id}".format(compute_id=compute_id))

        federation_token_value = request.user.token.id
        try:
            compute = ComputeUtil.get_compute(compute_id, federation_token_value)
        except Exception as e:
            LOG.info("Is not possible get the compute. Message exception is {error_msg}:".format(error_msg=str(e)))
            compute = None

        return {'compute' : compute}
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "compute_details"
    tabs = (InstanceDetailTabInstancePanel, )
