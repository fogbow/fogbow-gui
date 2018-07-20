from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import url

from openstack_dashboard.dashboards.fogbow.instance import views

urlpatterns = patterns('',
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^create/$', views.CreateView.as_view(), name='create'),
    url(r'^(?P<instance_id>[^/]+)/details$', views.DetailViewInstance.as_view(), name='detail'),
    # TODO review this. is it the correct location ?
    url(r'^(?P<member_id>.*)/images$', views.getImages, name='images'),
    url(r'^networks/$', views.getNetworks, name='networks')
)
