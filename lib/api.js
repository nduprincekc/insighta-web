const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '1',
      ...(options.headers || {}),
    },
  })

  if (res.status === 401) {
    // Try to refresh
    const refreshed = await tryRefresh()
    if (refreshed) {
      // Retry original request
      return apiFetch(path, options)
    } else {
      window.location.href = '/login'
      return null
    }
  }

  return res
}

async function tryRefresh() {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    return res.ok
  } catch {
    return false
  }
}

export async function getMe() {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: 'include',
    headers: { 'X-API-Version': '1' },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.data
}