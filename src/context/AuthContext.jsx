import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getToken,
  getStoredUser,
  removeToken,
  apiLogin,
  apiRegister,
  apiGetProfile,
  setOnUnauthorizedCallback,
} from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setTokenState] = useState(() => getToken())
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    removeToken()
    setUser(null)
    setTokenState(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const data = await apiGetProfile()
    if (data.user) setUser(data.user)
    return data.user
  }, [])

  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      logout()
    })
  }, [logout])

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = getToken()
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const data = await apiGetProfile()
        if (data.user) {
          setUser(data.user)
          setTokenState(storedToken)
        }
      } catch (error) {
        console.warn('[AuthContext] Token verification failed on load, clearing token:', error.message)
        logout()
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [logout])

  const login = async (credentials) => {
    const data = await apiLogin(credentials)
    if (data.token && data.user) {
      setTokenState(data.token)
      setUser(data.user)
    }
    return data
  }

  const register = async (userData) => {
    const data = await apiRegister(userData)
    if (data.token && data.user) {
      setTokenState(data.token)
      setUser(data.user)
    }
    return data
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    refreshUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
