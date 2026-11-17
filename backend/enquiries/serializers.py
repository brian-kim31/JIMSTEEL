from rest_framework import serializers

from .models import Enquiry


class EnquirySerializer(serializers.ModelSerializer):
    # Honeypot: real visitors never see or fill this field.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Enquiry
        fields = ["id", "kind", "first_name", "last_name", "email", "phone",
                  "registration", "service", "message", "website"]
        read_only_fields = ["id"]

    def validate_phone(self, value):
        digits = [c for c in value if c.isdigit()]
        if len(digits) < 10:
            raise serializers.ValidationError("Please enter a valid UK phone number.")
        return value.strip()

    def validate_registration(self, value):
        return value.replace(" ", "").upper()

    def validate(self, attrs):
        if attrs.get("kind") in (Enquiry.Kind.CONTACT, Enquiry.Kind.QUOTE) and not attrs.get("email"):
            raise serializers.ValidationError({"email": "Please give us an email address so we can reply."})
        if attrs.get("kind") != Enquiry.Kind.CALLBACK and not attrs.get("message"):
            raise serializers.ValidationError({"message": "Please tell us how we can help."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("website", None)
        return super().create(validated_data)
