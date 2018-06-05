from django.conf.urls.defaults import patterns  # noqa
from django.conf.urls.defaults import url  # noqa

from openstack_dashboard.dashboards.fogbow.usage import views
from openstack_dashboard.dashboards.fogbow.usage.views import IndexView

urlpatterns = patterns('',
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^(?P<member_id>.*)/usage$', views.getSpecificMemberUsage, name='usage'),
)
