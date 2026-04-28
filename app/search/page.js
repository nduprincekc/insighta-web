'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMe, apiFetch } from '@/lib/api'
import Navbar from '@/components/Navbar'

export default function SearchPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    getMe().then(u => {
      if (!u) return router.push('/login')
      setUser(u)
    })
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    const res = await apiFetch(`/api/profiles/search?q=${encodeURIComponent(query)}`)
    if (res && res.ok) {
      const data = await res.json()
      setResults(data.data || [])
      setTotal(data.total || 0)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Navbar user={user} />
      <div style={{ padding: '40px 32px', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Search Profiles</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
          Use natural language — e.g. "young males from Nigeria" or "adult females above 30"
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. young males from Nigeria..."
            style={{
              flex: 1, padding: '12px 16px',
              background: '#1e2330', border: '1px solid #2d3748',
              borderRadius: '8px', color: '#e2e8f0', fontSize: '15px',
            }}
          />
          <button type="submit" style={{
            padding: '12px 24px', background: '#3b82f6',
            color: 'white', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600', fontSize: '14px',
          }}>
            Search
          </button>
        </form>

        {loading && <p style={{ color: '#64748b' }}>Searching...</p>}

        {searched && !loading && (
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
            {total} result{total !== 1 ? 's' : ''} found
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map(p => (
            <div key={p.id}
              onClick={() => router.push(`/profiles/${p.id}`)}
              style={{
                background: '#1e2330', borderRadius: '10px', padding: '20px',
                border: '1px solid #2d3748', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
              <div>
                <p style={{ fontWeight: '600', color: '#f1f5f9', marginBottom: '4px' }}>{p.name}</p>
                <p style={{ color: '#64748b', fontSize: '13px' }}>
                  {p.gender} · {p.age} years · {p.age_group} · {p.country_name}
                </p>
              </div>
              <span style={{ color: '#3b82f6', fontSize: '20px' }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}