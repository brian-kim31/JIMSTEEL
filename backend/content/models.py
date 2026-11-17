from django.core.exceptions import ValidationError
from django.db import models


class Orderable(models.Model):
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        abstract = True
        ordering = ["order", "id"]


class SiteSettings(models.Model):
    """Singleton holding business-wide details shown in the header, footer and contact page."""

    business_name = models.CharField(max_length=120, default="Jim Steel Garage Services")
    tagline = models.CharField(max_length=200, blank=True)
    motto = models.CharField(max_length=200, blank=True)
    established_year = models.PositiveIntegerField(default=1982)
    phone = models.CharField(max_length=40)
    email = models.EmailField()
    address_line1 = models.CharField(max_length=120)
    address_line2 = models.CharField(max_length=120, blank=True)
    town = models.CharField(max_length=80)
    county = models.CharField(max_length=80, blank=True)
    postcode = models.CharField(max_length=12)
    opening_hours = models.TextField(help_text="One line per entry, e.g. 'Mon–Thu: 8am–5:30pm'")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    map_embed_url = models.URLField(max_length=600, blank=True)
    google_reviews_url = models.URLField(max_length=600, blank=True)
    facebook_url = models.URLField(blank=True)
    x_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    booking_url = models.URLField(blank=True, help_text="Online booking system (TechMan) URL")
    service_history_url = models.URLField(blank=True, help_text="Customer service-history portal URL")
    privacy_policy = models.FileField(upload_to="documents/", blank=True)
    logo = models.ImageField(upload_to="branding/", blank=True)
    icon = models.ImageField(upload_to="branding/", blank=True)

    class Meta:
        verbose_name = verbose_name_plural = "Site settings"

    def __str__(self):
        return self.business_name

    def clean(self):
        if not self.pk and SiteSettings.objects.exists():
            raise ValidationError("Only one Site settings record is allowed.")

    @classmethod
    def load(cls):
        return cls.objects.first()


class Accreditation(Orderable):
    name = models.CharField(max_length=120)
    description = models.CharField(max_length=300, blank=True)

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.name


class Promotion(Orderable):
    """Offer shown in the homepage hero / offers strip (replaces the old image slider)."""

    title = models.CharField(max_length=80)
    price_label = models.CharField(max_length=40, blank=True, help_text="e.g. 'From £48.00'")
    blurb = models.CharField(max_length=200, blank=True)
    link = models.CharField(max_length=200, default="/book")
    image = models.ImageField(upload_to="promotions/", blank=True)
    is_active = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.title


class Video(Orderable):
    title = models.CharField(max_length=120)
    youtube_id = models.CharField(max_length=20)
    placement = models.CharField(
        max_length=20,
        choices=[("home", "Home page"), ("about", "About page"), ("gallery", "Gallery only")],
        default="gallery",
    )

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.title


class Service(Orderable):
    ICONS = [
        ("wrench", "Wrench"),
        ("clipboard-check", "Clipboard check"),
        ("gauge", "Gauge / diagnostics"),
        ("zap", "Electric"),
        ("snowflake", "Air conditioning"),
        ("gift", "Loyalty"),
        ("car", "Car"),
    ]
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=80)
    headline = models.CharField(max_length=200, blank=True)
    summary = models.TextField(help_text="Short description for cards and meta descriptions")
    icon = models.CharField(max_length=30, choices=ICONS, default="wrench")
    price_from = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    hero_image = models.ImageField(upload_to="services/", blank=True)
    is_published = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.title


class ServiceSection(Orderable):
    service = models.ForeignKey(Service, related_name="sections", on_delete=models.CASCADE)
    heading = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=True, help_text="Paragraphs separated by a blank line")
    bullets = models.TextField(blank=True, help_text="One bullet per line")
    image = models.ImageField(upload_to="services/", blank=True)
    image_alt = models.CharField(max_length=200, blank=True)
    style = models.CharField(
        max_length=20,
        choices=[("default", "Default"), ("callout", "Callout"), ("tip", "Did you know")],
        default="default",
    )

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.heading or f"Section {self.pk}"


class PricePackage(Orderable):
    service = models.ForeignKey(Service, related_name="packages", on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    price_prefix = models.CharField(max_length=20, blank=True, default="From")
    description = models.TextField(blank=True)
    includes = models.TextField(blank=True, help_text="One item per line")
    note = models.CharField(max_length=300, blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return f"{self.service.title} – {self.name}"


class Page(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    headline = models.CharField(max_length=200, blank=True)
    intro = models.TextField(blank=True)

    def __str__(self):
        return self.title


class PageSection(Orderable):
    page = models.ForeignKey(Page, related_name="sections", on_delete=models.CASCADE)
    heading = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=True, help_text="Paragraphs separated by a blank line")
    bullets = models.TextField(blank=True, help_text="One bullet per line")
    style = models.CharField(
        max_length=20,
        choices=[("default", "Default"), ("callout", "Callout"), ("checklist", "Checklist grid")],
        default="default",
    )

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.heading or f"Section {self.pk}"
