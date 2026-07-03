from django.db import models


class Entity(models.Model):
    """A sanctioned entity record sourced from entities.csv."""

    class EntityType(models.TextChoices):
        INDIVIDUAL = "Individual"
        ORGANIZATION = "Organization"

    # The CSV's own id column is the primary key so re-loads upsert by id.
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=20, choices=EntityType.choices)
    date_added = models.DateField()
    program = models.CharField(max_length=100)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "entities"
        ordering = ["id"]

    def __str__(self):
        return f"{self.name} ({self.country})"
