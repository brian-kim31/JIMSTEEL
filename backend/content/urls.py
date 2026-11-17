from django.urls import path

from . import views

urlpatterns = [
    path("site/", views.SiteSettingsView.as_view(), name="site-settings"),
    path("promotions/", views.PromotionList.as_view(), name="promotions"),
    path("videos/", views.VideoList.as_view(), name="videos"),
    path("services/", views.ServiceList.as_view(), name="services"),
    path("services/<slug:slug>/", views.ServiceDetail.as_view(), name="service-detail"),
    path("pages/<slug:slug>/", views.PageDetail.as_view(), name="page-detail"),
]
