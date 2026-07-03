## 1. Backend Project Setup

- [x] 1.1 Create backend/ Django project (config) + entities app, add Django, djangorestframework, pydantic to backend/requirements.txt
- [x] 1.2 Configure settings (INSTALLED_APPS, DRF, SQLite DB path, CSV source path)

## 2. Data Model & Loading

- [x] 2.1 Define Entity model (id as CSV-sourced primary key, name, country, entity_type, date_added, program, notes) + migration
- [x] 2.2 Implement `load_entities` management command: idempotent upsert from entities.csv by id
- [x] 2.3 Verify command loads all 100 records correctly and is safe to re-run

## 3. API Endpoint

- [x] 3.1 Add EntitySerializer (all 7 fields)
- [x] 3.2 Add pydantic EntityFilterParams model (country: optional str, entity_type: optional Literal["Individual","Organization"])
- [x] 3.3 Implement EntityViewSet/ListAPIView for GET /api/entities/ validating query params via pydantic, filtering via ORM, returning 400 on invalid entity_type
- [x] 3.4 Wire up urls.py (backend/config + entities app) for /api/entities/

## 4. Backend Tests

- [x] 4.1 Test: GET /api/entities/ returns 200 and 100 records
- [x] 4.2 Test: filtering by country returns only matching records
- [x] 4.3 Test: filtering by entity_type returns only matching records
- [x] 4.4 Test: combined country + entity_type filter returns correct subset
- [x] 4.5 Test: invalid entity_type returns 400

## 5. Frontend Project Setup

- [x] 5.1 Scaffold frontend/ with Vite + React, add Vitest + React Testing Library as dev deps
- [x] 5.2 Add API base URL config (env var, defaults to http://localhost:8000)

## 6. Frontend Table & Filters

- [ ] 6.1 Build API client function (fetch with country/entity_type params)
- [ ] 6.2 Build EntityTable component (name, country, entity_type, date_added, program columns)
- [ ] 6.3 Build filter controls (country + entity_type dropdowns) wired to trigger new API requests
- [ ] 6.4 Wire up App: loading state, error state, render table on success

## 7. Frontend Tests

- [ ] 7.1 Test: table renders rows from mocked API response
- [ ] 7.2 Test: loading state renders while request is pending
- [ ] 7.3 Test: error state renders on failed request
- [ ] 7.4 Test: changing a filter triggers a new fetch call with correct query params

## 8. Docker Compose

- [ ] 8.1 Write backend Dockerfile + entrypoint (migrate, load_entities, runserver)
- [ ] 8.2 Write frontend Dockerfile (Vite dev server)
- [ ] 8.3 Write docker-compose.yml wiring both services + ports + API URL env var
- [ ] 8.4 Verify `docker compose up` serves a working app end-to-end

## 9. README & Wrap-up

- [ ] 9.1 Write setup instructions (local, non-Docker) for backend and frontend
- [ ] 9.2 Write Docker Compose instructions
- [ ] 9.3 Document test-run commands (backend and frontend)
- [ ] 9.4 Add OpenSpec/AI-disclosure block (provider + model per part)
- [ ] 9.5 Write reflection paragraph (3-5 sentences) on a key decision/tradeoff
- [ ] 9.6 Final pass: run full test suites, verify app end-to-end, review diff
