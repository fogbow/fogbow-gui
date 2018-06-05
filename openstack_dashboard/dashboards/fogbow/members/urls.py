from django.conf.urls.defaults import patterns  # noqa
from django.conf.urls.defaults import url  # noqa

from openstack_dashboard.dashboards.fogbow.members import views
from openstack_dashboard.dashboards.fogbow.members.views import IndexView

urlpatterns = patterns('',
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^(?P<member_id>.*)/quota$', views.getSpecificMemberQuota, name='quota'),
)
