import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import api from '../services/api'
import EmailValidator from '../components/EmailValidator'

const DEMO_ACCOUNTS = [
    { role: 'STUDENT', email: 'it23456789@my.sliit.lk', color: '#1d4ed8', description: 'Student Account' },
    { role: 'STAFF', email: 'staff@sliit.lk', color: '#7c3aed', description: 'Staff Member' },
    { role: 'ADMIN', email: 'admin@admincampus.edu', color: '#3b82f6', description: 'Administrator' },
    { role: 'TECHNICIAN', email: 'tech@techcampus.edu', color: '#16a34a', description: 'Technician' },
    { role: 'OPERATIONS', email: 'ops@opscampus.edu', color: '#d97706', description: 'Operations Staff' },
]

export default function EnhancedLogin() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [validatedEmail, setValidatedEmail] = useState('')
    const [assignedRole, setAssignedRole] = useState('')
    const [roleDescription, setRoleDescription] = useState('')

    /* ── Email / password ─────────────────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const data = await authService.login(email, password)
            login(data.token, { 
                id: data.id, 
                name: data.name, 
                email: data.email, 
                role: data.role,
                roleDescription: data.roleDescription 
            })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    /* ── Google OAuth2 ────────────────────────────────────────────────────── */
    const handleGoogleSuccess = async (credentialResponse) => {
        setError('')
        setLoading(true)
        try {
            const res = await api.post('/auth/google', { idToken: credentialResponse.credential })
            const data = res.data
            login(data.token, { 
                id: data.id, 
                name: data.name, 
                email: data.email, 
                role: data.role,
                roleDescription: data.roleDescription 
            })
            navigate('/')
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Google sign-in failed. Please try again.'
            setError(errorMessage)
            
            // If it's an access denied error (403), show additional guidance
            if (err.response?.status === 403) {
                setError(errorMessage + ' Please use your institutional email address.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleEmailValid = (email, role, roleDesc) => {
        setValidatedEmail(email)
        setAssignedRole(role)
        setRoleDescription(roleDesc)
        setError('')
    }

    const handleEmailInvalid = (email, message) => {
        setValidatedEmail('')
        setAssignedRole('')
        setRoleDescription('')
        setError(message)
    }

    return (
        <div className="login-root">

            {/* ══ LEFT – form panel ══════════════════════════════════════════════ */}
            <div className="login-left">
                <div className="login-inner" style={{ width: '100%', maxWidth: 450 }}>

                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
                        <div style={{
                            width: 48, height: 48,
                            background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
                            borderRadius: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: '#111827' }}>Smart Campus Hub</div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>SLIIT University</div>
                        </div>
                    </div>

                    <div style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Welcome back</div>
                    <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
                        Sign in with your institutional email address
                    </div>

                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: 20 }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Email Validator Component */}
                    <EmailValidator 
                        onEmailValid={handleEmailValid}
                        onEmailInvalid={handleEmailInvalid}
                    />

                    {/* ── Google button – BIG ── */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Google Sign-In
                        </div>
                        
                        {validatedEmail && (
                            <div style={{
                                padding: '10px 14px',
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: 8,
                                marginBottom: 12,
                                fontSize: 13,
                                color: '#166534'
                            }}>
                                ✅ Ready to sign in as <strong>{validatedEmail}</strong> 
                                {roleDescription && ` (${roleDescription})`}
                            </div>
                        )}

                        {/* Wrapper stretches the Google button to full width */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'stretch',
                            border: '1.5px solid #e5e7eb',
                            borderRadius: 10,
                            overflow: 'hidden',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            minHeight: 52,
                        }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google sign-in was cancelled or failed.')}
                                useOneTap={false}
                                shape="rectangular"
                                theme="outline"
                                size="large"
                                width="450"
                                text="signin_with"
                                logo_alignment="left"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>or continue with email</span>
                        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                    </div>

                    {/* Email / password form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label required">Email Address</label>
                            <input type="email" className="form-control" placeholder="your@campus.edu"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Password</label>
                            <input type="password" className="form-control" placeholder="Enter your password"
                                value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: 15, borderRadius: 10 }}>
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo accounts */}
                    <div style={{
                        marginTop: 24,
                        padding: '14px 16px',
                        background: '#f9fafb',
                        borderRadius: 10,
                        border: '1px solid #e5e7eb',
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
                            🎓 Demo Accounts — password: <code style={{ background: '#e5e7eb', padding: '1px 5px', borderRadius: 4 }}>password</code>
                        </div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, lineHeight: 1.4 }}>
                            Institutional email patterns only (Google OAuth) or email/password for demo
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {DEMO_ACCOUNTS.map(acc => (
                                <div key={acc.role}
                                    onClick={() => { setEmail(acc.email); setPassword('password'); setError('') }}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                                        border: '1px solid #e5e7eb', background: '#fff',
                                        transition: 'border-color 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = acc.color}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 700, padding: '2px 7px',
                                            borderRadius: 4, background: acc.color + '18', color: acc.color,
                                            textTransform: 'uppercase', letterSpacing: '0.04em'
                                        }}>{acc.role}</span>
                                        <span style={{ fontSize: 12, color: '#6b7280' }}>{acc.description}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 12, color: '#374151' }}>{acc.email}</span>
                                        <span style={{ fontSize: 11, color: acc.color, fontWeight: 600 }}>↗</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ RIGHT – compact info panel ════════════════════════════════════ */}
            <div className="login-right">
                {/* decoration blobs */}
                <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(249,115,22,0.12)' }} />
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                <div style={{ position: 'relative', zIndex: 1, color: 'white', maxWidth: 380, textAlign: 'center' }}>
                    {/* Big icon */}
                    <div style={{
                        width: 72, height: 72, borderRadius: 18,
                        background: 'rgba(249,115,22,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                        border: '2px solid rgba(249,115,22,0.4)',
                    }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                            stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>

                    <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>
                        Secure Campus Access
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.7, marginBottom: 32 }}>
                        Institutional authentication with<br />automatic role-based access control
                    </div>

                    {/* Feature pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                        {[
                            ['🔐', 'Institutional email validation'],
                            ['🎓', 'Automatic role assignment'],
                            ['🔑', 'Google OAuth sign-in'],
                            ['🛡️', 'Role-based access control'],
                            ['📅', 'Facility & resource booking'],
                            ['🔧', 'Maintenance ticket tracking'],
                        ].map(([icon, text]) => (
                            <div key={text} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10, padding: '10px 14px',
                                fontSize: 13, fontWeight: 500,
                            }}>
                                <span style={{ fontSize: 18 }}>{icon}</span>{text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

