'use client'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/github`
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1117 0%, #1a1f2e 100%)',
    }}>
      <div style={{
        background: '#1e2330',
        borderRadius: '16px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#3b82f6',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
        }}>
          IL
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#f1f5f9' }}>
          Insighta Labs
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px' }}>
          Demographic Intelligence Platform
        </p>

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '14px',
            background: '#24292e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <p style={{ marginTop: '24px', color: '#64748b', fontSize: '12px' }}>
          Sign in to access your demographic data
        </p>
      </div>
    </div>
  )
}