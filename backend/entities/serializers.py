from rest_framework import serializers

from entities.models import Entity


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = [
            "id",
            "name",
            "country",
            "entity_type",
            "date_added",
            "program",
            "notes",
        ]
