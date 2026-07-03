import { COUNTRIES, ENTITY_TYPES } from '../constants'

export default function EntityFilters({ filters, onChange }) {
  return (
    <div className="filters">
      <label>
        Country{' '}
        <select
          value={filters.country}
          onChange={(e) => onChange({ ...filters, country: e.target.value })}
        >
          <option value="">All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        Entity type{' '}
        <select
          value={filters.entityType}
          onChange={(e) => onChange({ ...filters, entityType: e.target.value })}
        >
          <option value="">All types</option>
          {ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
