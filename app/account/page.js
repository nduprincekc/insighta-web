'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMe } from '@/lib/api'
import Navbar from '@/components/Navbar'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    getMe().then(u => {
      if (!u) return router.push('/login')
      setUser(u)
    })
  }, [])

  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Navbar user={user} />
      <div style={{ padding: '40px 32px', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '32px' }}>Account</h1>

        <div style={{ background: '#1e2330', borderRadius: '12px', padding: '32px', border: '1px solid #2d3748' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            {user.avatar_url && (
              <img src={user.avatar_url} alt="avatar" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
            )}
            <div>
              <p style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '18px' }}>@{user.username}</p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>{user.email}</p>
            </div>
          </div>

          {[
            { label: 'Role', value: user.role?.toUpperCase() },
            { label: 'Email', value: user.email || 'Not provided' },
            { label: 'Username', value: `@${user.username}` },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1a1f2e' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>{item.label}</span>
              <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{item.value}</span>
            </div>
          ))}

          <button onClick={handleLogout} style={{
            marginTop: '24px', width: '100%', padding: '12px',
            background: '#7f1d1d', color: '#fca5a5', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
          }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}