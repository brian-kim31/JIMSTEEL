from django.urls import path

from .views import EnquiryCreate

urlpatterns = [path("enquiries/", EnquiryCreate.as_view(), name="enquiry-create")]
