const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export const handbookUrl = `${API_BASE_URL}/documents/handbook.pdf`

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      ...options,
    })
  } catch {
    throw new Error('PolicyPilot could not reach the knowledge service. Please confirm the API is running and try again.')
  }
  return response
}

export async function getSession() {
  const response = await request('/auth/session')
  if (response.status === 401) return false
  if (!response.ok) throw new Error('Unable to confirm your access. Please try again.')
  return true
}

export async function signIn(username, password) {
  const response = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (response.status === 401) throw new Error('The username or password is incorrect.')
  if (!response.ok) throw new Error('Unable to sign in at this time. Please try again.')
}

export async function signOut() {
  const response = await request('/auth/logout', { method: 'POST' })
  if (!response.ok) throw new Error('Unable to sign out. Please try again.')
}

export async function askPolicyQuestion(question) {
  const response = await request('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  if (response.status === 401) {
    const error = new Error('Your session has expired. Please sign in again.')
    error.code = 'SESSION_EXPIRED'
    throw error
  }

  if (!response.ok) {
    let detail = 'The knowledge service could not process this request. Please try again.'
    try {
      const body = await response.json()
      if (typeof body.detail === 'string') detail = body.detail
    } catch {
      // Use the professional fallback message when the API response is not JSON.
    }
    throw new Error(detail)
  }

  return response.json()
}
