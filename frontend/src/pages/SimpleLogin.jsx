import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

const DEMO_ACCOUNTS = [
    { role: 'STUDENT', email: 'it23456789@my.sliit.lk', color: '#1d4ed8', description: 'Student Account' },
    { role: 'STAFF', email: 'staff@sliit.lk', color: '#7c3aed', description: 'Staff Member' },
    { role: 'ADMIN', email: 'admin@admincampus.edu', color: '#3b82f6', description: 'Administrator' },
    { role: 'TECHNICIAN', email: 'tech@techcampus.edu', color: '#16a34a', description: 'Technician' },
    { role: 'OPERATIONS', email: 'ops@opscampus.edu', color: '#d97706', description: 'Operations Staff' },
]

export default function SimpleLogin() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const data = await authService.login(email, password)
            login(data.token, { id: data.id, name: data.name, email: data.email, role: data.role })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    const handleDemoLogin = (demoEmail) => {
        setEmail(demoEmail)
        setPassword('password')
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <h1>Smart Campus Hub</h1>
                    <p>Sign in to access campus facilities</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your institutional email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-divider">
                    <span>or use demo accounts</span>
                </div>

                <div className="demo-accounts">
                    <h3>Demo Accounts</h3>
                    <div className="demo-grid">
                        {DEMO_ACCOUNTS.map((account) => (
                            <button
                                key={account.email}
                                className="demo-card"
                                onClick={() => handleDemoLogin(account.email)}
                                style={{ borderColor: account.color }}
                            >
                                <div className="demo-icon" style={{ background: account.color }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <div className="demo-info">
                                    <div className="demo-role">{account.role}</div>
                                    <div className="demo-email">{account.email}</div>
                                    <div className="demo-desc">{account.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        <strong>Password:</strong> password (for all demo accounts)
                    </p>
                </div>

                <div className="login-footer">
                    <div className="feature-pills">
                        <span className="pill">🔐 Institutional Email Only</span>
                        <span className="pill">🎓 Role-Based Access</span>
                        <span className="pill">🏢 Campus Facilities</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

