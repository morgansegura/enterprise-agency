const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const TOKEN_KEY = 'builder_auth_token'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isSuperAdmin: boolean
  agencyRole: string | null
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  const data = await response.json()

  // Store token
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, data.access_token)
  }

  return data.user
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getToken()
  if (!token) return null

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      logout()
      return null
    }

    return await response.json()
  } catch (error) {
    logout()
    return null
  }
}
