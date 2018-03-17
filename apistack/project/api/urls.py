from django.conf.urls import url, include
from rest_framework import routers
from project.api import views
from .views import HospitalsView, HospitalOwnershipView, HomeView

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

app_name = 'api'
urlpatterns = [
    #url(r'^', include(router.urls)),
    url(r'^$', HomeView.as_view(), name='home'),
    url(r'^get/hospitals/(?P<pk>\d+)/$',HospitalsView.as_view(), name='get-hospitals'),
    #url(r'^get/owner/(?P<pk>\d+)/$',HospitalOwnershipView.as_view(), name='get-owner'),
    url(r'^get/owner/$',HospitalOwnershipView.as_view())
]