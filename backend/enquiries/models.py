from django.db import models


class Enquiry(models.Model):
    class Kind(models.TextChoices):
        CONTACT = "contact", "General enquiry"
        CALLBACK = "callback", "Call-back request"
        QUOTE = "quote", "Itemised estimate"

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In progress"
        DONE = "done", "Done"

    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.CONTACT)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30)
    registration = models.CharField("Vehicle registration", max_length=12, blank=True)
    service = models.CharField(max_length=80, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    staff_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"

    def __str__(self):
        return f"{self.get_kind_display()} – {self.first_name} {self.last_name}".strip()
