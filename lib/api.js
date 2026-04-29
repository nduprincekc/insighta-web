const API_URL = 'https://hng-task-3-05rc.onrender.com'

function getAccessToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

function getRefreshToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export async function apiFetch(path, options = {}) {
  const token = getAccessToken()

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '1',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return apiFetch(path, options)
    } else {
      clearTokens()
      window.location.href = '/login'
      return null
    }
  }

  return res
}

async function tryRefresh() {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) return false

    const data = await res.json()
    saveTokens(data.access_token, data.refresh_token)
    return true
  } catch {
    return false
  }
}

export async function getMe() {
  try {
    const token = getAccessToken()
    if (!token) return null

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Version': '1',
      },
      signal: controller.signal,
    })

    clearTimeout(timeout)
    if (!res.ok) return null
    const data = await res.json()
    return data.data
  } catch {
    return null
  }
}