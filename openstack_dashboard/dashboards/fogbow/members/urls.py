from django.conf.urls.defaults import patterns  # noqa
from django.conf.urls.defaults import url  # noqa

from openstack_dashboard.dashboards.fogbow.members import views
from openstack_dashboard.dashboards.fogbow.members.views import IndexView

urlpatterns = patterns('',
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^quota$', views.getSpecificMemberQuota, name='quota'),
    url(r'^(?P<member_id>.*)/shared$', views.get_shared_quota, name='shared'),
    url(r'^(?P<member_id>.*)/free$', views.get_available_quota, name='free'),
    url(r'^(?P<member_id>.*)/my$', views.get_used_by_me_quota, name='my'),
    url(r'^members/$', views.get_members, name='members'),
    url(r'^aggregated', views.get_aggregated, name='aggregated'),
)
