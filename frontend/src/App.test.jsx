import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const MOCK_ENTITIES = [
  {
    id: 1,
    name: 'Redstone Commerce LLC',
    country: 'Russia',
    entity_type: 'Organization',
    date_added: '2022-03-15',
    program: 'UKRAINE-EO13685',
    notes: 'Shell company',
  },
  {
    id: 2,
    name: 'Brightwave Shipping Co.',
    country: 'China',
    entity_type: 'Organization',
    date_added: '2021-08-04',
    program: 'DPRK-EO13722',
    notes: 'Vessel operator',
  },
]

function mockFetchResponse(data) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) })
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => mockFetchResponse(MOCK_ENTITIES)))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders table rows from the API response', async () => {
    render(<App />)
    expect(await screen.findByText('Redstone Commerce LLC')).toBeInTheDocument()
    expect(screen.getByText('Brightwave Shipping Co.')).toBeInTheDocument()
    // header row + one row per entity
    expect(screen.getAllByRole('row')).toHaveLength(1 + MOCK_ENTITIES.length)
  })

  it('shows a loading state while the request is pending', async () => {
    let resolveFetch
    fetch.mockImplementation(
      () => new Promise((resolve) => (resolveFetch = resolve)),
    )
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i)

    resolveFetch({ ok: true, json: () => Promise.resolve(MOCK_ENTITIES) })
    expect(await screen.findByText('Redstone Commerce LLC')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows an error message when the request fails', async () => {
    fetch.mockImplementation(() => Promise.reject(new Error('network down')))
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /failed to load entities/i,
    )
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('refetches with query params when filters change', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Redstone Commerce LLC')
    expect(fetch).toHaveBeenCalledTimes(1)

    await user.selectOptions(screen.getByLabelText(/country/i), 'Russia')
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
    expect(fetch.mock.calls[1][0]).toContain('/api/entities/?country=Russia')

    await user.selectOptions(screen.getByLabelText(/entity type/i), 'Individual')
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3))
    const thirdUrl = fetch.mock.calls[2][0]
    expect(thirdUrl).toContain('country=Russia')
    expect(thirdUrl).toContain('entity_type=Individual')
  })
})
