## ADDED Requirements

### Requirement: Entity data is loaded from CSV into SQLite
The system SHALL provide a management command that reads `entities.csv` and
upserts each row into the SQLite database, keyed by the CSV's `id` column, such
that re-running the command does not create duplicate records.

#### Scenario: Fresh database load
- **WHEN** the management command is run against an empty database
- **THEN** all 100 records from `entities.csv` exist in the database with all
  seven fields (id, name, country, entity_type, date_added, program, notes)
  populated

#### Scenario: Re-running the load command is idempotent
- **WHEN** the management command is run a second time without changes to the CSV
- **THEN** the database still contains exactly 100 records, with no duplicates

### Requirement: List all entities
The system SHALL expose `GET /api/entities/` returning a 200 response with a
JSON array containing every field of every entity record when no filters are
supplied.

#### Scenario: Unfiltered list returns all records
- **WHEN** a client sends `GET /api/entities/` with no query parameters
- **THEN** the response is 200 and contains 100 entity objects, each with id,
  name, country, entity_type, date_added, program, and notes fields

### Requirement: Filter entities by country
The system SHALL support an exact-match `country` query parameter on
`GET /api/entities/` that returns only records whose country equals the given
value.

#### Scenario: Filtering by a known country
- **WHEN** a client sends `GET /api/entities/?country=Russia`
- **THEN** the response is 200 and contains only records where country equals
  "Russia"

### Requirement: Filter entities by entity_type
The system SHALL support an exact-match `entity_type` query parameter on
`GET /api/entities/` restricted to the values `Individual` and `Organization`,
returning only records whose entity_type equals the given value.

#### Scenario: Filtering by a valid entity_type
- **WHEN** a client sends `GET /api/entities/?entity_type=Individual`
- **THEN** the response is 200 and contains only records where entity_type
  equals "Individual"

#### Scenario: Filtering by an invalid entity_type
- **WHEN** a client sends `GET /api/entities/?entity_type=foo`
- **THEN** the response is 400 with an error indicating entity_type is invalid

### Requirement: Combine country and entity_type filters
The system SHALL support supplying both `country` and `entity_type` query
parameters simultaneously, returning only records matching both filters.

#### Scenario: Combined filter
- **WHEN** a client sends `GET /api/entities/?country=Russia&entity_type=Individual`
- **THEN** the response is 200 and contains only records where country equals
  "Russia" AND entity_type equals "Individual"
