from django.urls import path

from entities.views import EntityListView

urlpatterns = [
    path("entities/", EntityListView.as_view(), name="entity-list"),
]
