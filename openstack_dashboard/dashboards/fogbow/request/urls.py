from django.conf.urls.defaults import patterns  # noqa
from django.conf.urls.defaults import url  # noqa

from openstack_dashboard.dashboards.fogbow.request import views

urlpatterns = patterns('',
    url(r'^create/$', views.CreateView.as_view(), name='create'),
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^(?P<instance_id>[^/]+)/instance-detail$', views.DetailInstanceView.as_view(), name='instance-detail'),
    url(r'^(?P<instance_id>[^/]+)/request-detail$', views.DetailRequestView.as_view(), name='request-detail')
)
