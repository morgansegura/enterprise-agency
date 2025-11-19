import { apiClient } from './api-client'
import { useAuthStore } from './stores/auth-store'
import { logger } from './logger'
import { AuthError, getErrorMessage } from './errors'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isSuperAdmin: boolean
  agencyRole: string | null
  emailVerified: boolean
  status: string
  createdAt: string
  updatedAt: string
}

interface LoginResponse {
  user: User
  message: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

/**
 * Login with email and password
 * Uses HTTP-only cookies for secure token storage
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    logger.log('Attempting login', { email })

    const credentials: LoginCredentials = { email, password }
    const response = await apiClient.authPost<LoginResponse, LoginCredentials>('/login', credentials)

    // Update Zustand store
    useAuthStore.getState().login(response.user, null)

    logger.log('Login successful', { userId: response.user.id })
    return response.user
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error('Login failed', error as Error, { email })
    throw new AuthError(message, 'INVALID_CREDENTIALS')
  }
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<User> {
  try {
    logger.log('Attempting registration', { email: data.email })

    const response = await apiClient.authPost<LoginResponse, RegisterData>('/register', data)

    // Auto-login after registration
    useAuthStore.getState().login(response.user, null)

    logger.log('Registration successful', { userId: response.user.id })
    return response.user
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error('Registration failed', error as Error, { email: data.email })
    throw new AuthError(message, 'INVALID_CREDENTIALS')
  }
}

/**
 * Logout current user
 * Clears HTTP-only cookies on server and clears local state
 */
export async function logout(): Promise<void> {
  try {
    logger.log('Attempting logout')

    // Call API to clear HTTP-only cookies
    await apiClient.authPost<void>('/logout')

    // Clear Zustand store
    useAuthStore.getState().logout()

    logger.log('Logout successful')
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error('Logout failed', error as Error)

    // Clear store anyway
    useAuthStore.getState().logout()

    throw new AuthError(message, 'UNAUTHORIZED')
  }
}

/**
 * Get current authenticated user
 * Validates session via HTTP-only cookie
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await apiClient.authGet<User>('/me')

    // Update Zustand store
    useAuthStore.getState().setUser(user)
    useAuthStore.getState().setLoading(false)

    logger.log('Current user fetched', { userId: user.id })
    return user
  } catch (error) {
    logger.log('No authenticated user')

    // Clear store on auth failure
    useAuthStore.getState().logout()

    return null
  }
}

/**
 * Refresh access token
 * Uses refresh token from HTTP-only cookie
 */
export async function refreshToken(): Promise<boolean> {
  try {
    logger.log('Refreshing access token')

    await apiClient.authPost<void>('/refresh')

    logger.log('Token refreshed successfully')
    return true
  } catch (error) {
    logger.error('Token refresh failed', error as Error)

    // Clear store on refresh failure
    useAuthStore.getState().logout()

    return false
  }
}

/**
 * Initialize auth state on app load
 * Fetches current user if session exists
 */
export async function initializeAuth(): Promise<void> {
  try {
    logger.log('Initializing auth')

    const user = await getCurrentUser()

    if (user) {
      logger.log('Auth initialized with user', { userId: user.id })
    } else {
      logger.log('Auth initialized without user')
      useAuthStore.getState().setLoading(false)
    }
  } catch (error) {
    logger.error('Auth initialization failed', error as Error)
    useAuthStore.getState().setLoading(false)
  }
}
