import shutil
import tempfile

from django.core.management import call_command
from django.test import TestCase, override_settings

MEDIA = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA)
class ContentApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_content", verbosity=0)

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(MEDIA, ignore_errors=True)

    def test_site_settings(self):
        r = self.client.get("/api/site/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["postcode"], "NG9 2AZ")
        self.assertIsInstance(r.json()["opening_hours"], list)
        self.assertTrue(r.json()["logo"].startswith("http"))

    def test_service_list_and_detail(self):
        slugs = [s["slug"] for s in self.client.get("/api/services/").json()]
        self.assertIn("servicing", slugs)
        detail = self.client.get("/api/services/servicing/").json()
        self.assertEqual(len(detail["packages"]), 3)
        self.assertIsInstance(detail["sections"][0]["body"], list)

    def test_unpublished_service_is_hidden(self):
        from content.models import Service
        Service.objects.filter(slug="mot").update(is_published=False)
        self.assertEqual(self.client.get("/api/services/mot/").status_code, 404)

    def test_page_and_videos(self):
        self.assertEqual(self.client.get("/api/pages/about/").json()["title"], "About Us")
        vids = self.client.get("/api/videos/?placement=home").json()
        self.assertEqual([v["youtube_id"] for v in vids], ["QFKg2cna4Xg"])


class VercelBlobStorageTests(TestCase):
    def test_save_url_and_exists(self):
        from unittest import mock

        from django.core.files.base import ContentFile

        from config.storage import VercelBlobStorage
        from vercel.blob import BlobNotFoundError

        with mock.patch.dict("os.environ", {"BLOB_READ_WRITE_TOKEN": "vercel_blob_rw_AbC123_secret"}), \
                mock.patch("config.storage.blob") as blob:
            blob.head_blob.side_effect = BlobNotFoundError("missing")
            storage = VercelBlobStorage()
            name = storage.save("branding/logo.png", ContentFile(b"png", name="logo.png"))
            self.assertEqual(name, "branding/logo.png")
            args, kwargs = blob.put_blob.call_args
            self.assertEqual(args[0], "media/branding/logo.png")
            self.assertEqual(kwargs["content_type"], "image/png")
            self.assertEqual(storage.url(name), "https://abc123.public.blob.vercel-storage.com/media/branding/logo.png")
