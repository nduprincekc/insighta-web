'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getMe, apiFetch } from '@/lib/api'
import Navbar from '@/components/Navbar'

export default function ProfileDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe().then(u => {
      if (!u) return router.push('/login')
      setUser(u)
      loadProfile()
    })
  }, [])

  async function loadProfile() {
    const res = await apiFetch('/api/profiles/' + id)
    if (res && res.ok) {
      const data = await res.json()
      setProfile(data.data)
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
      <div style={{padding:'40px 32px',maxWidth:'600px'}}>
        <button
          onClick={() => router.back()}
          style={{background:'none',border:'none',color:'#64748b',cursor:'pointer',marginBottom:'24px',fontSize:'14px'}}
        >
          Back
        </button>

        {profile ? (
          <div style={{background:'#1e2330',borderRadius:'12px',padding:'32px',border:'1px solid #2d3748'}}>
            <h1 style={{fontSize:'28px',fontWeight:'700',color:'#f1f5f9',marginBottom:'24px'}}>{profile.name}</h1>
            {[
              {label:'Gender', value: profile.gender + ' (' + (profile.gender_probability * 100).toFixed(0) + '% confidence)'},
              {label:'Age', value: profile.age},
              {label:'Age Group', value: profile.age_group},
              {label:'Country', value: profile.country_name + ' (' + profile.country_id + ')'},
              {label:'Country Confidence', value: (profile.country_probability * 100).toFixed(0) + '%'},
              {label:'Created', value: new Date(profile.created_at).toLocaleString()},
            ].map(item => (
              <div key={item.label} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid #1a1f2e'}}>
                <span style={{color:'#64748b',fontSize:'14px'}}>{item.label}</span>
                <span style={{color:'#e2e8f0',fontSize:'14px',fontWeight:'500'}}>{item.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{color:'#64748b'}}>Profile not found</p>
        )}
      </div>
    </div>
  )
}