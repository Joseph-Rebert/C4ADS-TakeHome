# C4ADS Take-Home: Sanctioned Entities Explorer

A small full-stack app for browsing 100 fictitious sanctioned-entity records
from `entities.csv`: a Django REST API backed by SQLite, and a React frontend
with a filterable table.

## Project layout

```
entities.csv     # source dataset (100 records)
backend/         # Django + DRF API (project: config, app: entities)
frontend/        # Vite + React UI
openspec/        # OpenSpec change artifacts (proposal, design, specs, tasks)
```

## Backend setup

Requires Python 3.11+ (developed on 3.13).

```bash
cd backend
python3 -m venv .venv           # or reuse an existing venv at repo root
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py load_entities   # idempotent CSV -> SQLite upsert
python manage.py runserver       # serves http://localhost:8000
```

The API is then available at `http://localhost:8000/api/entities/` with
optional exact-match query params:

- `?country=Russia`
- `?entity_type=Individual` (only `Individual` or `Organization`; anything
  else returns a 400 with a validation error)
- Both params combine: `?country=Russia&entity_type=Individual`

`load_entities` upserts by the CSV's `id` column, so re-running it never
creates duplicates. The SQLite file (`backend/db.sqlite3`) is gitignored and
fully regenerable.

## Frontend setup

Requires Node 20+ (developed on 24).

```bash
cd frontend
npm install
npm run dev                      # serves http://localhost:5173
```

The UI expects the backend at `http://localhost:8000` by default; override
with a `VITE_API_URL` env var if needed. Country and entity-type dropdowns
trigger new API requests (filtering is server-side, not client-side).

## Running tests

Backend (Django test runner; loads the real CSV into a test database):

```bash
cd backend
python manage.py test
```

Frontend (Vitest + React Testing Library, API mocked):

```bash
cd frontend
npm test
```

## AI disclosure

This submission was built with AI assistance, documented via the OpenSpec
workflow in `openspec/changes/entities-fullstack-feature/` (proposal, design,
specs, tasks — all committed as they were produced, before implementation).

- **Planning (proposal/design/specs/tasks)**: Anthropic — Claude Fable 5
  (`claude-fable-5`) via the Claude Code CLI.
- **Backend implementation & tests**: Anthropic — Claude Fable 5
  (`claude-fable-5`) via the Claude Code CLI, reviewed and directed by me.
- **Frontend implementation & tests**: Anthropic — Claude Fable 5
  (`claude-fable-5`) via the Claude Code CLI, reviewed and directed by me.
- **README**: Anthropic — Claude Fable 5 (`claude-fable-5`) via the Claude
  Code CLI, edited by me.

The commit history reflects the actual development sequence: each OpenSpec
task section was implemented, tested, and committed incrementally.

## Reflection

The decision I spent the most thought on was how to handle filter validation.
DRF's idiomatic approach (`filterset_fields` or manual `request.query_params`
reads) silently returns an empty list for a typo like `?entity_type=Individal`,
which hides bugs from API consumers. I instead validated query params with a
pydantic model that restricts `entity_type` to a `Literal` of the two real
values, returning a structured 400 error — at the cost of a second validation
layer that partially duplicates what DRF serializers could do. For a two-param
API the duplication is negligible, and it made the invalid-filter test case
trivial to write; in a larger system I'd standardize on one validation layer
(likely DRF serializers for consistency) rather than mixing both.
