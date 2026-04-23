import { createContext, useContext, useState, useEffect, useRef } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

// Helper to persist/restore user from localStorage
function getSavedUser() {
    try {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getSavedUser)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)
    // Track if this is the initial mount (not triggered by a fresh login)
    const justLoggedIn = useRef(false)

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            // If we JUST logged in, user is already set — skip /auth/me to avoid
            // a race condition that clears the user on a slow/failed request
            if (justLoggedIn.current) {
                justLoggedIn.current = false
                setLoading(false)
                return
            }

            // On page refresh: try to restore session via /auth/me
            api.get('/auth/me')
                .then(res => {
                    const userData = res.data
                    localStorage.setItem('user', JSON.stringify(userData))
                    setUser(userData)
                })
                .catch(() => {
                    // /auth/me failed — token is invalid; clear everything
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    setToken(null)
                    setUser(null)
                    delete api.defaults.headers.common['Authorization']
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [token])

    const login = (tokenValue, userData) => {
        justLoggedIn.current = true
        localStorage.setItem('token', tokenValue)
        localStorage.setItem('user', JSON.stringify(userData))
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`
        setUser(userData)
        setToken(tokenValue)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
        setToken(null)
        setUser(null)
    }

    const refreshUser = (updatedData) => {
        if (updatedData) {
            localStorage.setItem('user', JSON.stringify(updatedData))
            setUser(updatedData)
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
