import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .serializers import EnquirySerializer

logger = logging.getLogger(__name__)


class EnquiryCreate(generics.CreateAPIView):
    serializer_class = EnquirySerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "enquiries"

    def create(self, request, *args, **kwargs):
        if request.data.get("website"):  # honeypot tripped: pretend success, store nothing
            return Response({"ok": True}, status=status.HTTP_201_CREATED)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enquiry = serializer.save()
        self.notify(enquiry)
        return Response({"ok": True, "id": enquiry.id}, status=status.HTTP_201_CREATED)

    def notify(self, e):
        body = "\n".join([
            f"Type: {e.get_kind_display()}",
            f"Name: {e.first_name} {e.last_name}".rstrip(),
            f"Phone: {e.phone}",
            f"Email: {e.email or '-'}",
            f"Registration: {e.registration or '-'}",
            f"Service: {e.service or '-'}",
            "",
            e.message or "(no message)",
        ])
        try:
            send_mail(
                f"Website {e.get_kind_display().lower()} from {e.first_name}",
                body,
                settings.DEFAULT_FROM_EMAIL,
                settings.ENQUIRY_NOTIFY_EMAILS,
            )
        except Exception:  # the enquiry is saved either way; staff can see it in admin
            logger.exception("Failed to send enquiry notification %s", e.pk)
