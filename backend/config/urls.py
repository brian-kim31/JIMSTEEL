from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

admin.site.site_header = "Jim Steel Garage Services"
admin.site.site_title = "Jim Steel Admin"
admin.site.index_title = "Website content & enquiries"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("content.urls")),
    path("api/", include("enquiries.urls")),
    # Uploaded images. Traffic is light and Next.js caches optimised copies, so Django can serve these.
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
