'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMe, apiFetch, saveTokens } from '@/lib/api'
import Navbar from '@/components/Navbar'


const API_URL = 'https://hng-task-3-05rc.onrender.com'
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken)
      window.history.replaceState({}, '', '/dashboard')
    }

    getMe().then(u => {
      if (!u) return router.push('/login')
      setUser(u)
      loadStats()
    })
  }, [])

  async function loadStats() {
    const res = await apiFetch('/api/profiles?limit=1')
    if (res && res.ok) {
      const data = await res.json()
      setStats({ total: data.total })
    }
    setLoading(false)
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0f1117',display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8'}}>
      Loading...
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#0f1117'}}>
      <Navbar user={user} />
      <div style={{padding:'40px 32px'}}>
        <h1 style={{fontSize:'28px',fontWeight:'700',marginBottom:'8px',color:'#f1f5f9'}}>
          Welcome back, @{user?.username}
        </h1>
        <p style={{color:'#64748b',marginBottom:'40px'}}>
          Here is what is happening on Insighta Labs
        </p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px',marginBottom:'40px'}}>
          {[
            {label:'Total Profiles', value: stats?.total ?? '—', color:'#3b82f6'},
            {label:'Your Role', value: user?.role?.toUpperCase(), color: user?.role === 'admin' ? '#f59e0b' : '#10b981'},
            {label:'Platform', value:'Active', color:'#10b981'},
          ].map((card, i) => (
            <div key={i} style={{background:'#1e2330',borderRadius:'12px',padding:'24px',borderLeft:`4px solid ${card.color}`}}>
              <p style={{color:'#64748b',fontSize:'13px',marginBottom:'8px'}}>{card.label}</p>
              <p style={{fontSize:'28px',fontWeight:'700',color:card.color}}>{card.value}</p>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
          <a href="/profiles" style={{padding:'12px 24px',background:'#3b82f6',color:'white',borderRadius:'8px',textDecoration:'none',fontWeight:'600',fontSize:'14px'}}>
            Browse Profiles
          </a>
          <a href="/search" style={{padding:'12px 24px',background:'#1e2330',color:'#94a3b8',borderRadius:'8px',textDecoration:'none',fontWeight:'600',fontSize:'14px',border:'1px solid #2d3748'}}>
            Search Profiles
          </a>
        </div>
      </div>
    </div>
  )
}