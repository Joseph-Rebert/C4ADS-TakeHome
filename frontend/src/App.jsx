import { useEffect, useState } from 'react'
import { fetchEntities } from './api'
import EntityFilters from './components/EntityFilters'
import EntityTable from './components/EntityTable'
import './App.css'

function App() {
  const [filters, setFilters] = useState({ country: '', entityType: '' })
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchEntities(filters)
      .then((data) => {
        if (!cancelled) setEntities(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [filters])

  return (
    <main>
      <h1>Sanctioned Entities Explorer</h1>
      <EntityFilters filters={filters} onChange={setFilters} />
      {loading ? (
        <p role="status">Loading entities…</p>
      ) : error ? (
        <p role="alert" className="error">
          Failed to load entities: {error}
        </p>
      ) : (
        <EntityTable entities={entities} />
      )}
    </main>
  )
}

export default App
