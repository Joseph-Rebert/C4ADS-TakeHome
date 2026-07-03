from django.core.management import call_command
from django.test import TestCase

from entities.models import Entity

ENTITIES_URL = "/api/entities/"


class EntityAPITests(TestCase):
    """Tests run against the real entities.csv loaded into the test database."""

    @classmethod
    def setUpTestData(cls):
        call_command("load_entities", verbosity=0)

    def test_list_returns_200_and_all_100_records(self):
        response = self.client.get(ENTITIES_URL)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 100)
        expected_fields = {
            "id", "name", "country", "entity_type",
            "date_added", "program", "notes",
        }
        self.assertEqual(set(data[0].keys()), expected_fields)

    def test_filter_by_country_returns_only_matching(self):
        expected = Entity.objects.filter(country="Russia").count()
        response = self.client.get(ENTITIES_URL, {"country": "Russia"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data), 0)
        self.assertEqual(len(data), expected)
        self.assertTrue(all(e["country"] == "Russia" for e in data))

    def test_filter_by_entity_type_returns_only_matching(self):
        expected = Entity.objects.filter(entity_type="Individual").count()
        response = self.client.get(ENTITIES_URL, {"entity_type": "Individual"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data), 0)
        self.assertEqual(len(data), expected)
        self.assertTrue(all(e["entity_type"] == "Individual" for e in data))

    def test_combined_filters_return_intersection(self):
        expected = Entity.objects.filter(
            country="Russia", entity_type="Individual"
        ).count()
        response = self.client.get(
            ENTITIES_URL, {"country": "Russia", "entity_type": "Individual"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data), 0)
        self.assertEqual(len(data), expected)
        self.assertTrue(
            all(
                e["country"] == "Russia" and e["entity_type"] == "Individual"
                for e in data
            )
        )

    def test_invalid_entity_type_returns_400(self):
        response = self.client.get(ENTITIES_URL, {"entity_type": "foo"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("errors", response.json())

    def test_unmatched_country_returns_empty_list_not_error(self):
        response = self.client.get(ENTITIES_URL, {"country": "Atlantis"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])
