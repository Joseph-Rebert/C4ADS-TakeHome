import csv
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from entities.models import Entity


class Command(BaseCommand):
    help = "Load (upsert) entity records from entities.csv into the database."

    def add_arguments(self, parser):
        parser.add_argument(
            "--csv",
            default=None,
            help="Path to the source CSV (defaults to settings.ENTITIES_CSV_PATH).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        csv_path = Path(options["csv"] or settings.ENTITIES_CSV_PATH)
        if not csv_path.exists():
            raise CommandError(f"CSV file not found: {csv_path}")

        created = updated = 0
        with csv_path.open(newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                _, was_created = Entity.objects.update_or_create(
                    id=int(row["id"]),
                    defaults={
                        "name": row["name"],
                        "country": row["country"],
                        "entity_type": row["entity_type"],
                        "date_added": row["date_added"],
                        "program": row["program"],
                        "notes": row["notes"],
                    },
                )
                if was_created:
                    created += 1
                else:
                    updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Loaded {created + updated} entities "
                f"({created} created, {updated} updated) from {csv_path}"
            )
        )
