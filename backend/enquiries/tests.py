from django.core import mail
from django.test import TestCase

from .models import Enquiry


class EnquiryApiTests(TestCase):
    url = "/api/enquiries/"

    def test_contact_enquiry_saved_and_emailed(self):
        r = self.client.post(self.url, {
            "kind": "contact", "first_name": "Ann", "last_name": "Smith", "email": "ann@example.com",
            "phone": "0115 922 7805", "registration": "ab12 cde", "message": "Brakes squeaking",
        }, content_type="application/json")
        self.assertEqual(r.status_code, 201, r.content)
        e = Enquiry.objects.get()
        self.assertEqual(e.registration, "AB12CDE")
        self.assertEqual(len(mail.outbox), 1)

    def test_callback_needs_only_name_and_phone(self):
        r = self.client.post(self.url, {"kind": "callback", "first_name": "Bob", "phone": "07700900123"},
                             content_type="application/json")
        self.assertEqual(r.status_code, 201, r.content)

    def test_contact_requires_email_and_message(self):
        r = self.client.post(self.url, {"kind": "contact", "first_name": "C", "phone": "07700900123"},
                             content_type="application/json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("email", r.json())

    def test_bad_phone_rejected(self):
        r = self.client.post(self.url, {"kind": "callback", "first_name": "D", "phone": "123"},
                             content_type="application/json")
        self.assertEqual(r.status_code, 400)

    def test_honeypot_discards(self):
        r = self.client.post(self.url, {"kind": "callback", "first_name": "Bot", "phone": "07700900123",
                                        "website": "spam.example"}, content_type="application/json")
        self.assertEqual(r.status_code, 201)
        self.assertFalse(Enquiry.objects.exists())
