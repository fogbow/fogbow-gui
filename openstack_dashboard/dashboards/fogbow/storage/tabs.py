import logging

from django.utils.translation import ugettext_lazy as _
from horizon import tabs

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.dashboards.fogbow.models import VolumeUtil

LOG = logging.getLogger(__name__)
                
class InstanceDetailTabInstancePanel(tabs.Tab):
    name = _("Volume details")
    slug = "instance_details"
    template_name = ("fogbow/storage/_detail_instance.html")

    def get_context_data(self, request):
        # TODO change to volume_id
        volume_id = self.tab_group.kwargs['instance_id']
        LOG.info("Trying to get the volume: {volume_id}".format(volume_id=volume_id))

        federation_token_value = request.user.token.id  
        try:
            volume = VolumeUtil.get_volume(volume_id, federation_token_value)
        except Exception as e:
            LOG.info("Is not possible get the volume. Message exception is {error_msg}:".format(error_msg=str(e)))
            volume = None

        return {'volume' : volume}
    
class InstanceDetailTabGroupInstancePanel(tabs.TabGroup):
    slug = "instance_details"
    tabs = (InstanceDetailTabInstancePanel,)
