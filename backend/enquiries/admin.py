from django.contrib import admin

from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ["created_at", "kind", "first_name", "last_name", "phone", "registration", "status"]
    list_filter = ["kind", "status", "created_at"]
    list_editable = ["status"]
    search_fields = ["first_name", "last_name", "email", "phone", "registration", "message"]
    readonly_fields = ["created_at"]
    date_hierarchy = "created_at"
