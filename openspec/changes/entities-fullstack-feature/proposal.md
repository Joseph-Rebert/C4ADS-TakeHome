## Why

C4ADS analysts need to research sanctioned entities from tabular source data.
This change delivers a small end-to-end feature — a Django REST API over the
provided `entities.csv` and a React UI to browse and filter it — as the take-home
exercise deliverable. It establishes the minimal backend + frontend contract that
lets a user list and filter 100 fictitious sanctioned-entity records.

## What Changes

- Add a Django project with a single app exposing `GET /api/entities/` (DRF
  viewset + serializer) that returns all fields of every entity record (id,
  name, country, entity_type, date_added, program, notes) as JSON.
- Load `entities.csv` (100 records) into SQLite via an idempotent management
  command; all queries use the Django ORM.
- Support exact-match, combinable filtering by `country` and `entity_type` query
  params, validated with pydantic before hitting the ORM.
- Add a React frontend: a filterable table (name, country, entity_type,
  date_added, program) whose country/entity_type filters call the API
  server-side, with explicit loading and error states.
- Add Django unit tests (list 200 + count, country filter, entity_type filter,
  combined filters) and React component tests (Vitest + React Testing Library).
- Add Docker Compose to run backend + frontend together.
- Add a README with setup, test commands, per-part AI-disclosure blocks, and a
  reflection paragraph.

## Capabilities

### New Capabilities
- `entities-api`: Backend REST endpoint that loads entity data from CSV into
  SQLite and serves it as JSON with exact-match `country` / `entity_type`
  filtering and query-param validation.
- `entities-explorer`: React frontend that fetches from the API and displays
  results in a filterable table with server-side filters and loading/error
  states.

### Modified Capabilities
<!-- None — this is a greenfield feature. -->

## Impact

- **New code**: Django project/app (models, serializer, viewset, URLs, management
  command, tests), React app (table + filter components, API client, tests).
- **Dependencies (new)**: Django, djangorestframework, pydantic (backend);
  React, Vite, Vitest, React Testing Library (frontend).
- **Data**: `entities.csv` → SQLite DB seeded at setup time.
- **Infra**: `docker-compose.yml`, per-service Dockerfiles.
- **No existing systems affected** (greenfield repo).
