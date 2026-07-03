from pydantic import ValidationError
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from entities.filters import EntityFilterParams
from entities.models import Entity
from entities.serializers import EntitySerializer


class EntityListView(ListAPIView):
    serializer_class = EntitySerializer

    def list(self, request, *args, **kwargs):
        try:
            params = EntityFilterParams(
                country=request.query_params.get("country"),
                entity_type=request.query_params.get("entity_type"),
            )
        except ValidationError as exc:
            return Response(
                {"errors": exc.errors(include_url=False, include_input=False)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.filter_params = params
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return Entity.objects.filter(**self.filter_params.as_orm_filters())
