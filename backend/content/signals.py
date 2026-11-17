"""Tell the Next.js frontend to refresh its cached content whenever content changes in the admin."""
import logging
import os
import threading
import urllib.request

from django.db import transaction
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from . import models

logger = logging.getLogger(__name__)

CONTENT_MODELS = (
    models.SiteSettings, models.Accreditation, models.Promotion, models.Video,
    models.Service, models.ServiceSection, models.PricePackage, models.Page, models.PageSection,
)


def _ping():
    url = os.environ.get("NEXT_REVALIDATE_URL")  # e.g. http://localhost:3000/api/revalidate
    secret = os.environ.get("REVALIDATE_SECRET")
    if not (url and secret):
        return
    req = urllib.request.Request(url, method="POST", headers={"x-revalidate-secret": secret})
    try:
        urllib.request.urlopen(req, timeout=5).close()
    except Exception as exc:  # frontend down is not fatal; content refreshes on its cache lifetime anyway
        logger.warning("Frontend revalidation failed: %s", exc)


@receiver([post_save, post_delete])
def content_changed(sender, raw=False, **kwargs):
    if raw or sender not in CONTENT_MODELS:
        return
    transaction.on_commit(lambda: threading.Thread(target=_ping, daemon=True).start())
