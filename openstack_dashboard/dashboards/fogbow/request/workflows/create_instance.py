
import json
import logging

from django.conf import settings  # noqa
from django.template.defaultfilters import filesizeformat  # noqa
from django.utils.text import normalize_newlines  # noqa
from django.utils.translation import ugettext_lazy as _  # noqa
from django.utils.translation import ungettext_lazy  # noqa
from django.views.decorators.debug import sensitive_variables  # noqa

from horizon import exceptions
from horizon import forms
from horizon.utils import fields
from horizon.utils import functions
from horizon.utils import validators
from horizon import workflows

LOG = logging.getLogger(__name__)

class LaunchInstance(workflows.Workflow):
    slug = "launch_instance"
    name = _("Launch Instance")
    finalize_button_name = _("Launch")
    success_message = _('Launched %(count)s named "%(name)s".')
    failure_message = _('Unable to launch %(count)s named "%(name)s".')
    success_url = "horizon:project:instances:index"

    def format_status_message(self, message):
        name = self.context.get('name', 'unknown instance')        

    @sensitive_variables('context')
    def handle(self, request, context):
        return True
