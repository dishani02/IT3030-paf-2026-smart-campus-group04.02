import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - attach stored token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// Response interceptor - handle 401
api.interceptors.response.use(
    response => response,
    error => {
        const url = error.config?.url || ''
        const isAuthEndpoint = url.includes('/auth/login') ||
            url.includes('/auth/register') ||
            url.includes('/auth/me')
        // Only redirect for 401s on protected API calls (not during the login/auth flow itself)
        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
