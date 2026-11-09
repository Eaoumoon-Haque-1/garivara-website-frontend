import { useState } from 'react'
import { getStoredSessionToken } from '../features/auth/utils/authStorage'
import { AuthStateContext } from './AuthStateContext'

function clearStoredAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

function readStoredAuth() {
  const token = getStoredSessionToken()
  const storedUser = localStorage.getItem('user')

  if (!token || !storedUser) {
    clearStoredAuth()
    return { token: null, user: null }
  }

  try {
    const user = JSON.parse(storedUser)

    if (!user || typeof user !== 'object') {
      throw new Error('Invalid stored user')
    }

    return { token, user }
  } catch {
    clearStoredAuth()
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [initialAuth] = useState(readStoredAuth)
  const [user, setUser] = useState(initialAuth.user)
  const [token, setToken] = useState(initialAuth.token)

  const login = (userData, authToken) => {
    const normalizedToken =
      typeof authToken === 'string' ? authToken.trim() : ''

    if (!normalizedToken || !userData || typeof userData !== 'object') {
      clearStoredAuth()
      setUser(null)
      setToken(null)
      return false
    }

    localStorage.setItem('token', normalizedToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setToken(normalizedToken)
    return true
  }

  const logout = () => {
    clearStoredAuth()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthStateContext.Provider
      value={{
        user,
        token,
        loading: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  )
}