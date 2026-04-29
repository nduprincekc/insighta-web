'use client'
import { useRouter } from 'next/navigation'
import { clearTokens } from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Navbar({ user }) {
  const router = useRouter()

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    clearTokens()
    router.push('/login')
  }

  return (
    <nav style={{background:'#1e2330',borderBottom:'1px solid #2d3748',padding:'0 32px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{display:'flex',alignItems:'center',gap:'32px'}}>
        <span style={{fontWeight:'700',fontSize:'18px',color:'#3b82f6'}}>Insighta Labs</span>
        <a href="/dashboard" style={{color:'#94a3b8',textDecoration:'none',fontSize:'14px'}}>Dashboard</a>
        <a href="/profiles" style={{color:'#94a3b8',textDecoration:'none',fontSize:'14px'}}>Profiles</a>
        <a href="/search" style={{color:'#94a3b8',textDecoration:'none',fontSize:'14px'}}>Search</a>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
        {user && (
          <>
            <span style={{fontSize:'13px',color:'#64748b'}}>@{user.username}</span>
            <span style={{fontSize:'11px',padding:'2px 8px',borderRadius:'4px',background: user.role === 'admin' ? '#1e3a5f' : '#1a2f1a',color: user.role === 'admin' ? '#60a5fa' : '#4ade80',textTransform:'uppercase',fontWeight:'600'}}>
              {user.role}
            </span>
            <a href="/account" style={{color:'#94a3b8',textDecoration:'none',fontSize:'14px'}}>Account</a>
            <button
              onClick={handleLogout}
              style={{padding:'6px 14px',background:'transparent',border:'1px solid #374151',borderRadius:'6px',color:'#94a3b8',cursor:'pointer',fontSize:'13px'}}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}