from typing import Literal, Optional

from pydantic import BaseModel


class EntityFilterParams(BaseModel):
    """Validated query params for GET /api/entities/.

    An unrecognized entity_type is a validation error (400) rather than a
    silently empty result set.
    """

    country: Optional[str] = None
    entity_type: Optional[Literal["Individual", "Organization"]] = None

    def as_orm_filters(self) -> dict:
        return {
            field: value
            for field, value in self.model_dump().items()
            if value is not None
        }
