'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMe, apiFetch } from '@/lib/api'
import Navbar from '@/components/Navbar'

const API_URL = 'https://hng-task-3-05rc.onrender.com'

export default function ProfilesPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ gender: '', country_id: '', age_group: '' })

  useEffect(() => {
    getMe().then(u => {
      if (!u) return router.push('/login')
      setUser(u)
    })
  }, [])

  useEffect(() => {
    if (user) loadProfiles()
  }, [user, page, filters])

  async function loadProfiles() {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 10 })
    if (filters.gender) params.append('gender', filters.gender)
    if (filters.country_id) params.append('country_id', filters.country_id)
    if (filters.age_group) params.append('age_group', filters.age_group)
    const res = await apiFetch('/api/profiles?' + params)
    if (res && res.ok) {
      const data = await res.json()
      setProfiles(data.data)
      setTotal(data.total)
    }
    setLoading(false)
  }

  const handleExport = async () => {
    const token = localStorage.getItem('access_token')
    const res = await fetch(`${API_URL}/api/profiles/export?format=csv`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Version': '1',
      },
    })

    if (!res.ok) {
      alert('Export failed — make sure you are logged in')
      return
    }

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profiles_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div style={{minHeight:'100vh',background:'#0f1117'}}>
      <Navbar user={user} />
      <div style={{padding:'40px 32px'}}>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
          <div>
            <h1 style={{fontSize:'24px',fontWeight:'700',color:'#f1f5f9'}}>Profiles</h1>
            <p style={{color:'#64748b',fontSize:'14px'}}>{total} total profiles</p>
          </div>
          <button
            onClick={handleExport}
            style={{padding:'10px 20px',background:'#1e2330',color:'#94a3b8',borderRadius:'8px',fontSize:'14px',border:'1px solid #2d3748',cursor:'pointer'}}
          >
            Export CSV
          </button>
        </div>

        <div style={{display:'flex',gap:'12px',marginBottom:'24px',flexWrap:'wrap'}}>
          <select
            value={filters.gender}
            onChange={e => { setFilters(p => ({...p, gender: e.target.value})); setPage(1) }}
            style={{padding:'8px 12px',background:'#1e2330',border:'1px solid #2d3748',borderRadius:'6px',color:'#e2e8f0',fontSize:'14px'}}
          >
            <option value="">Gender: All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={filters.age_group}
            onChange={e => { setFilters(p => ({...p, age_group: e.target.value})); setPage(1) }}
            style={{padding:'8px 12px',background:'#1e2330',border:'1px solid #2d3748',borderRadius:'6px',color:'#e2e8f0',fontSize:'14px'}}
          >
            <option value="">Age Group: All</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>

          <input
            placeholder="Country code e.g. NG"
            value={filters.country_id}
            onChange={e => { setFilters(p => ({...p, country_id: e.target.value})); setPage(1) }}
            style={{padding:'8px 12px',background:'#1e2330',border:'1px solid #2d3748',borderRadius:'6px',color:'#e2e8f0',fontSize:'14px',width:'180px'}}
          />
        </div>

        <div style={{background:'#1e2330',borderRadius:'12px',overflow:'hidden',border:'1px solid #2d3748'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #2d3748'}}>
                {['Name','Gender','Age','Age Group','Country','Created'].map(h => (
                  <th key={h} style={{padding:'14px 16px',textAlign:'left',fontSize:'12px',color:'#64748b',textTransform:'uppercase',fontWeight:'600'}}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{padding:'40px',textAlign:'center',color:'#64748b'}}>
                    Loading...
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{padding:'40px',textAlign:'center',color:'#64748b'}}>
                    No profiles found
                  </td>
                </tr>
              ) : profiles.map(p => (
                <tr
                  key={p.id}
                  onClick={() => router.push('/profiles/' + p.id)}
                  style={{borderBottom:'1px solid #1a1f2e',cursor:'pointer'}}
                >
                  <td style={{padding:'14px 16px',color:'#f1f5f9',fontSize:'14px'}}>{p.name}</td>
                  <td style={{padding:'14px 16px',color:'#94a3b8',fontSize:'14px'}}>{p.gender}</td>
                  <td style={{padding:'14px 16px',color:'#94a3b8',fontSize:'14px'}}>{p.age}</td>
                  <td style={{padding:'14px 16px',fontSize:'14px'}}>
                    <span style={{padding:'2px 8px',borderRadius:'4px',fontSize:'12px',background:'#1a2f1a',color:'#4ade80'}}>
                      {p.age_group}
                    </span>
                  </td>
                  <td style={{padding:'14px 16px',color:'#94a3b8',fontSize:'14px'}}>{p.country_id}</td>
                  <td style={{padding:'14px 16px',color:'#64748b',fontSize:'13px'}}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px',alignItems:'center'}}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{padding:'8px 16px',background:'#1e2330',border:'1px solid #2d3748',borderRadius:'6px',color:'#94a3b8',cursor:'pointer'}}
          >
            Previous
          </button>
          <span style={{padding:'8px 16px',color:'#64748b',fontSize:'14px'}}>
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            style={{padding:'8px 16px',background:'#1e2330',border:'1px solid #2d3748',borderRadius:'6px',color:'#94a3b8',cursor:'pointer'}}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  )
}