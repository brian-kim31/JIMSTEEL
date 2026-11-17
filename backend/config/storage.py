"""Django file storage backed by Vercel Blob (public store).

Files are stored at ``media/<name>`` in the Blob store and served straight from Vercel's CDN.
Enabled automatically when BLOB_READ_WRITE_TOKEN is set (Vercel adds it when you connect a Blob store).
"""
import mimetypes
import os
from urllib.parse import quote

from django.core.files.base import ContentFile
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from vercel.blob import BlobNotFoundError
from vercel.blob import sync as blob

ONE_YEAR = 60 * 60 * 24 * 365


@deconstructible
class VercelBlobStorage(Storage):
    def __init__(self, prefix="media/"):
        self.prefix = prefix

    @property
    def base_url(self):
        # Token format: vercel_blob_rw_<storeId>_<secret>; public URL: https://<storeid>.public.blob.vercel-storage.com
        token = os.environ.get("BLOB_READ_WRITE_TOKEN", "")
        store_id = token.removeprefix("vercel_blob_rw_").partition("_")[0].removeprefix("store_").lower()
        return f"https://{store_id}.public.blob.vercel-storage.com/"

    def _key(self, name):
        return f"{self.prefix}{name.replace(os.sep, '/').lstrip('/')}"

    def _save(self, name, content):
        if hasattr(content, "seek"):
            content.seek(0)
        data = content.read()
        if isinstance(data, str):
            data = data.encode()
        content_type = (
            getattr(content, "content_type", None) or mimetypes.guess_type(name)[0] or "application/octet-stream"
        )
        blob.put_blob(
            self._key(name), data, access="public", content_type=content_type,
            add_random_suffix=False, allow_overwrite=False, cache_control_max_age=ONE_YEAR,
        )
        return name

    def _open(self, name, mode="rb"):
        return ContentFile(blob.get_blob(self.url(name), access="public").body, name=name)

    def exists(self, name):
        try:
            blob.head_blob(self._key(name))
            return True
        except BlobNotFoundError:
            return False

    def delete(self, name):
        if name:
            try:
                blob.delete_blob(self._key(name))
            except BlobNotFoundError:
                pass

    def size(self, name):
        return blob.head_blob(self._key(name)).size

    def url(self, name):
        return self.base_url + quote(self._key(name), safe="/")
