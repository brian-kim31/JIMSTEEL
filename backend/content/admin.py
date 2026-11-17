from django.contrib import admin

from . import models


@admin.register(models.SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = [
        ("Business", {"fields": ["business_name", "tagline", "motto", "established_year", "logo", "icon"]}),
        ("Contact", {"fields": ["phone", "email", "opening_hours"]}),
        ("Address", {"fields": ["address_line1", "address_line2", "town", "county", "postcode",
                                "latitude", "longitude", "map_embed_url"]}),
        ("Links", {"fields": ["booking_url", "service_history_url", "google_reviews_url",
                              "facebook_url", "x_url", "linkedin_url", "privacy_policy"]}),
    ]

    def has_add_permission(self, request):
        return not models.SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class ServiceSectionInline(admin.StackedInline):
    model = models.ServiceSection
    extra = 0


class PricePackageInline(admin.StackedInline):
    model = models.PricePackage
    extra = 0


@admin.register(models.Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "price_from", "order", "is_published"]
    list_editable = ["order", "is_published"]
    prepopulated_fields = {"slug": ["title"]}
    inlines = [PricePackageInline, ServiceSectionInline]


class PageSectionInline(admin.StackedInline):
    model = models.PageSection
    extra = 0


@admin.register(models.Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ["title", "slug"]
    inlines = [PageSectionInline]


@admin.register(models.Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ["title", "price_label", "order", "is_active"]
    list_editable = ["order", "is_active"]


@admin.register(models.Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ["title", "youtube_id", "placement", "order"]
    list_editable = ["placement", "order"]


@admin.register(models.Accreditation)
class AccreditationAdmin(admin.ModelAdmin):
    list_display = ["name", "order"]
    list_editable = ["order"]
