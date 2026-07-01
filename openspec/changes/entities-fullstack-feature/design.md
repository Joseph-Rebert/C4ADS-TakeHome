## Context

Greenfield take-home repo. No existing backend or frontend code. `entities.csv`
(100 real records, verified) sits at repo root. Repo already has `openspec/`
scaffolding and a Python venv; no Django/React/Docker tooling yet.

## Goals / Non-Goals

**Goals:**
- Minimal, readable Django + DRF API backed by SQLite, seeded from CSV.
- React table UI with server-side filtering, loading/error states.
- Deterministic, idempotent data load (safe to re-run).
- Test coverage matching the exercise's explicit rubric.
- Bonus: pydantic query validation, Docker Compose, frontend tests.

**Non-Goals:**
- Auth, pagination, write endpoints, or CSV upload UI — not requested.
- Production hardening (rate limiting, caching, multi-env config).
- Client-side-only filtering (explicitly disallowed by the exercise).

## Decisions

- **Repo layout**: `backend/` (Django project `config` + app `entities`) and
  `frontend/` (Vite + React) as siblings at repo root, alongside `entities.csv`
  and `docker-compose.yml`. Keeps each stack's tooling (venv, node_modules)
  self-contained and matches how the Docker Compose services will be built.
- **CSV loading**: a management command `load_entities` reads `entities.csv`
  from repo root (path configurable via Django setting), and upserts rows by
  `id` (the CSV's own id becomes the model's primary key) so re-running the
  command is idempotent rather than duplicating rows. Run manually per README
  instructions and automatically inside the Docker entrypoint — "on startup"
  per the task is satisfied by the container entrypoint running it before
  `runserver`.
- **Filtering + validation**: query params are parsed and validated with a
  pydantic model (`EntityFilterParams`) inside the DRF view before touching the
  ORM — rejects unknown/malformed `entity_type` values with a 400 instead of
  silently returning zero rows, which is more useful for API consumers than
  DRF's default `filterset_fields` exact-match behavior.
- **entity_type validation**: pydantic model restricts `entity_type` to the
  literal set `{"Individual", "Organization"}` observed in the data — an
  invalid value (e.g. `?entity_type=foo`) returns 400 rather than an empty list,
  making filter mistakes visible to the frontend/API consumer.
- **Frontend data flow**: plain React function components + hooks (`useState`/
  `useEffect`), no state management library — table state is just
  `{data, loading, error, filters}`. Filters are `<select>` dropdowns populated
  from a small fixed list derived from the dataset (all 56 countries, both
  entity types) rather than free text, per the task's "dropdowns or text
  inputs" allowance — dropdowns avoid client-side guessing of exact-match
  strings.
- **Docker Compose**: two services, `backend` (runs migrations + `load_entities`
  + `runserver` via an entrypoint script) and `frontend` (Vite dev server),
  backend exposes 8000, frontend exposes 5173 and is configured with the
  backend's URL via an env var.

## Risks / Trade-offs

- [SQLite file lives inside the backend container / local checkout and is
  rebuilt from CSV each run] → acceptable for a take-home; note in README that
  data is not persisted across `docker compose down -v`.
- [Country dropdown is a fixed list baked from the current CSV snapshot] →
  acceptable since the dataset is static for this exercise; documented as a
  simplification in the README reflection.
- [pydantic validation duplicates DRF's own request parsing] → accepted as the
  explicit bonus requested; kept scoped to query-param validation only, not a
  full pydantic/DRF hybrid architecture.

## Open Questions

None outstanding — scope is fixed by the take-home instructions.
