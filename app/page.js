'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMe } from '@/lib/api'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    getMe().then(user => {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    })
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f1117',
      color: '#94a3b8',
    }}>
      Loading...
    </div>
  )
}