from django.conf import settings
from rest_framework import serializers

from . import models


def absolute_media(field):
    if not field:
        return None
    url = field.url
    if url.startswith(("http://", "https://")):  # e.g. Vercel Blob
        return url
    return f"{settings.PUBLIC_API_URL.rstrip('/')}{url}"


def lines(text):
    return [ln.strip() for ln in (text or "").splitlines() if ln.strip()]


def paragraphs(text):
    return [p.strip() for p in (text or "").split("\n\n") if p.strip()]


class MediaField(serializers.Field):
    def __init__(self, **kwargs):
        kwargs["read_only"] = True
        super().__init__(**kwargs)

    def get_attribute(self, instance):
        return getattr(instance, self.source or self.field_name)

    def to_representation(self, value):
        return absolute_media(value)


class SiteSettingsSerializer(serializers.ModelSerializer):
    opening_hours = serializers.SerializerMethodField()
    logo = MediaField()
    icon = MediaField()
    privacy_policy = MediaField()
    accreditations = serializers.SerializerMethodField()

    class Meta:
        model = models.SiteSettings
        exclude = ["id"]

    def get_opening_hours(self, obj):
        return lines(obj.opening_hours)

    def get_accreditations(self, obj):
        return list(models.Accreditation.objects.values("name", "description"))


class PromotionSerializer(serializers.ModelSerializer):
    image = MediaField()

    class Meta:
        model = models.Promotion
        fields = ["id", "title", "price_label", "blurb", "link", "image"]


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Video
        fields = ["id", "title", "youtube_id", "placement"]


class SectionMixin(serializers.Serializer):
    body = serializers.SerializerMethodField()
    bullets = serializers.SerializerMethodField()

    def get_body(self, obj):
        return paragraphs(obj.body)

    def get_bullets(self, obj):
        return lines(obj.bullets)


class ServiceSectionSerializer(SectionMixin, serializers.ModelSerializer):
    image = MediaField()

    class Meta:
        model = models.ServiceSection
        fields = ["id", "heading", "body", "bullets", "image", "image_alt", "style"]


class PricePackageSerializer(serializers.ModelSerializer):
    includes = serializers.SerializerMethodField()

    class Meta:
        model = models.PricePackage
        fields = ["id", "name", "price", "price_prefix", "description", "includes", "note", "is_featured"]

    def get_includes(self, obj):
        return lines(obj.includes)


class ServiceListSerializer(serializers.ModelSerializer):
    hero_image = MediaField()

    class Meta:
        model = models.Service
        fields = ["slug", "title", "headline", "summary", "icon", "price_from", "hero_image"]


class ServiceDetailSerializer(ServiceListSerializer):
    sections = ServiceSectionSerializer(many=True, read_only=True)
    packages = PricePackageSerializer(many=True, read_only=True)

    class Meta(ServiceListSerializer.Meta):
        fields = ServiceListSerializer.Meta.fields + ["sections", "packages"]


class PageSectionSerializer(SectionMixin, serializers.ModelSerializer):
    class Meta:
        model = models.PageSection
        fields = ["id", "heading", "body", "bullets", "style"]


class PageSerializer(serializers.ModelSerializer):
    sections = PageSectionSerializer(many=True, read_only=True)
    intro = serializers.SerializerMethodField()

    class Meta:
        model = models.Page
        fields = ["slug", "title", "headline", "intro", "sections"]

    def get_intro(self, obj):
        return paragraphs(obj.intro)
