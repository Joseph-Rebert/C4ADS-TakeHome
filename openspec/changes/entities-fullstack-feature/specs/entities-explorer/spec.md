## ADDED Requirements

### Requirement: Display entities in a table
The frontend SHALL fetch entity records from `GET /api/entities/` and render
them in a table showing name, country, entity_type, date_added, and program
columns.

#### Scenario: Successful initial load
- **WHEN** the page loads and the API request succeeds
- **THEN** the table displays one row per returned entity with the five
  specified columns

### Requirement: Loading state
The frontend SHALL display a loading indicator while an API request is in
flight and hide it once the request settles.

#### Scenario: Request in flight
- **WHEN** an API request has been sent but not yet resolved
- **THEN** the UI shows a loading indicator instead of a stale or empty table

### Requirement: Error state
The frontend SHALL display a visible error message if the API request fails,
without leaving the user looking at a silently empty table.

#### Scenario: API request fails
- **WHEN** the API request returns an error or network failure
- **THEN** the UI displays an error message instead of a table

### Requirement: Server-side filtering by country and entity_type
The frontend SHALL provide dropdown controls for country and entity_type that,
when changed, issue a new API request with the corresponding query parameters
rather than filtering already-fetched data client-side.

#### Scenario: User selects a country filter
- **WHEN** the user selects a country from the country dropdown
- **THEN** the frontend issues `GET /api/entities/?country=<value>` and
  re-renders the table with the response

#### Scenario: User selects both filters
- **WHEN** the user selects both a country and an entity_type
- **THEN** the frontend issues a single request with both query parameters and
  renders the combined result
