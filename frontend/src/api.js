export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/**
 * Fetch entities from the API, optionally filtered server-side.
 * @param {{country?: string, entityType?: string}} filters
 * @returns {Promise<Array>} entity records
 */
export async function fetchEntities({ country, entityType } = {}) {
  const params = new URLSearchParams()
  if (country) params.set('country', country)
  if (entityType) params.set('entity_type', entityType)
  const query = params.toString()
  const url = `${API_BASE_URL}/api/entities/${query ? `?${query}` : ''}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  return response.json()
}
