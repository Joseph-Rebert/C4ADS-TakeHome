const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'country', label: 'Country' },
  { key: 'entity_type', label: 'Type' },
  { key: 'date_added', label: 'Date Added' },
  { key: 'program', label: 'Program' },
]

export default function EntityTable({ entities }) {
  if (entities.length === 0) {
    return <p>No entities match the current filters.</p>
  }
  return (
    <table>
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {entities.map((entity) => (
          <tr key={entity.id}>
            {COLUMNS.map((col) => (
              <td key={col.key}>{entity[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
