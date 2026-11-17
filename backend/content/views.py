from django.http import Http404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from . import models, serializers


class SiteSettingsView(APIView):
    def get(self, request):
        obj = models.SiteSettings.load()
        if obj is None:
            raise Http404("Site settings have not been configured.")
        return Response(serializers.SiteSettingsSerializer(obj).data)


class PromotionList(generics.ListAPIView):
    serializer_class = serializers.PromotionSerializer
    pagination_class = None
    queryset = models.Promotion.objects.filter(is_active=True)


class VideoList(generics.ListAPIView):
    serializer_class = serializers.VideoSerializer
    pagination_class = None

    def get_queryset(self):
        qs = models.Video.objects.all()
        placement = self.request.query_params.get("placement")
        return qs.filter(placement=placement) if placement else qs


class ServiceList(generics.ListAPIView):
    serializer_class = serializers.ServiceListSerializer
    pagination_class = None
    queryset = models.Service.objects.filter(is_published=True)


class ServiceDetail(generics.RetrieveAPIView):
    serializer_class = serializers.ServiceDetailSerializer
    lookup_field = "slug"
    queryset = models.Service.objects.filter(is_published=True).prefetch_related("sections", "packages")


class PageDetail(generics.RetrieveAPIView):
    serializer_class = serializers.PageSerializer
    lookup_field = "slug"
    queryset = models.Page.objects.prefetch_related("sections")
