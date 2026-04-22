import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { GoogleLogin } from '@react-oauth/google'
import api from '../services/api'
import { Building2 } from 'lucide-react'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    /* Inject Material Symbols if not already present */
    useEffect(() => {
        if (!document.querySelector('#material-symbols-login')) {
            const link = document.createElement('link')
            link.id = 'material-symbols-login'
            link.rel = 'stylesheet'
            link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
            document.head.appendChild(link)
        }
    }, [])

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
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
        } finally {
            setLoading(false)
        }
    }

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
            setError(err.response?.status === 403
                ? errorMessage + ' Please use your institutional email address.'
                : errorMessage
            )
        } finally {
            setLoading(false)
        }
    }

    const demoAccounts = [
        { label: 'Student', email: 'it23367258@my.sliit.lk', password: 'Dish@123', color: '#3F51B5', icon: 'school' },
        { label: 'Staff', email: 'staff@sliit.lk', password: 'password', color: '#7c3aed', icon: 'badge' },
        { label: 'Tech', email: 'tech@techcampus.edu', password: 'password', color: '#16a34a', icon: 'build' },
        { label: 'Ops', email: 'ops@opscampus.edu', password: 'password', color: '#d97706', icon: 'settings' },
        { label: 'Admin', email: 'admin@admincampus.edu', password: 'password', color: '#dc2626', icon: 'shield' },
    ]

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ color: '#191c1e' }}>
            
            {/* ── Background Image Layer ─────────────────────────── */}
            <div 
                className="absolute inset-0 z-0 scale-105 animate-pulse-slow"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 z-1 bg-white/70 backdrop-blur-[2px]" />

            {/* ══ TopAppBar ═══════════════════════════════════════════════ */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex justify-between items-center px-6 py-4 max-w-[1400px] mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-app rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-black leading-tight tracking-wider m-0">Unisphere</p>
                            <p className="text-[10px] text-zinc-500 font-medium tracking-wide m-0">Smart Operations</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* ══ Main Content ════════════════════════════════════════════ */}
            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6 relative z-10">
                <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* ── Left: Editorial Content ─────────────────────── */}
                    <div className="hidden lg:block lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <span className="font-bold tracking-[0.15em] text-xs uppercase" style={{ color: '#3F51B5' }}>
                                Campus Excellence Platform
                            </span>
                            <h2 className="text-[3.5rem] font-extrabold leading-[1.1] tracking-tighter" style={{ color: '#191c1e' }}>
                                Smart Campus <br />
                                <span style={{ color: '#3F51B5' }}>Operations Hub.</span>
                            </h2>
                            <p className="text-lg max-w-xl leading-relaxed" style={{ color: '#454652' }}>
                                Securely manage academic workflows, resource bookings, maintenance tickets,
                                and campus analytics within our high-performance administrative ecosystem.
                            </p>
                        </div>

                        {/* Available Demos (Moved from login card) */}
                        <div className="p-8 rounded-2xl space-y-6" style={{ background: '#ffffff', border: '1px solid rgba(197,197,212,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
                            <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#3F51B5' }}>Quick Demo Access</p>
                            <p className="text-sm text-slate-500 font-medium">Click on a role below to instantly load demo credentials into the form.</p>
                            <div className="flex gap-2.5 flex-wrap">
                                {demoAccounts.map((acc) => (
                                    <button
                                        key={acc.label}
                                        type="button"
                                        onClick={() => { setEmail(acc.email); setPassword(acc.password); setError('') }}
                                        className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                                        style={{
                                            background: acc.color + '12',
                                            color: acc.color,
                                            borderColor: acc.color + '30',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = acc.color + '20'
                                            e.currentTarget.style.borderColor = acc.color + '60'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = acc.color + '12'
                                            e.currentTarget.style.borderColor = acc.color + '30'
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{acc.icon}</span>
                                        {acc.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Login Panel ───────────────────────────── */}
                    <div className="lg:col-span-5 w-full max-w-[480px] mx-auto lg:max-w-none">
                        <div className="p-8 sm:p-10 rounded-2xl" style={{ background: '#ffffff', boxShadow: '0 24px 48px rgba(0,0,0,0.04)', border: '1px solid rgba(197,197,212,0.1)' }}>

                            {/* Header */}
                            <div className="text-center mb-10">
                                <h3 className="text-2xl font-bold mb-2" style={{ color: '#191c1e' }}>Welcome Back</h3>
                                <p className="text-sm" style={{ color: '#454652' }}>Please enter your credentials to continue</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-3 p-3 rounded-xl mb-5 text-sm font-medium" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Google Sign-In */}
                            <div className="mb-6 flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google sign-in was cancelled or failed.')}
                                    useOneTap={false}
                                    shape="pill"
                                    theme="outline"
                                    size="large"
                                    width="380"
                                    text="signin_with"
                                    logo_alignment="left"
                                />
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px" style={{ background: '#e6e8ea' }} />
                                <span className="text-[10px] uppercase tracking-[0.15em] font-bold whitespace-nowrap" style={{ color: '#454652' }}>
                                    Or login with email
                                </span>
                                <div className="flex-1 h-px" style={{ background: '#e6e8ea' }} />
                            </div>

                            {/* Email Login Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2 ml-1" style={{ color: '#454652' }}>Academic Email</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#3F51B5]" style={{ color: '#757684', fontSize: 20 }}>alternate_email</span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@campus.edu"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 rounded-lg border-none outline-none text-sm transition-all focus:ring-1 focus:ring-[#3F51B5]/20 focus:bg-white"
                                            style={{ background: '#f2f4f6', color: '#191c1e' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center px-1 mb-2">
                                        <label className="text-sm font-medium" style={{ color: '#454652' }}>Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-xs font-bold border-none bg-transparent cursor-pointer hover:underline"
                                            style={{ color: '#3F51B5' }}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#3F51B5]" style={{ color: '#757684', fontSize: 20 }}>lock</span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 rounded-lg border-none outline-none text-sm transition-all focus:ring-1 focus:ring-[#3F51B5]/20 focus:bg-white"
                                            style={{ background: '#f2f4f6', color: '#191c1e' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-full font-bold text-[15px] border-none transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700"
                                    style={{
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : 'Sign in to Hub'}
                                </button>
                            </form>

                            {/* Registration link */}
                            <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid #f2f4f6' }}>
                                <p className="text-xs" style={{ color: '#454652' }}>
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-bold hover:underline ml-1" style={{ color: '#3F51B5', textDecoration: 'none' }}>
                                        Create one now
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* ══ Footer ═════════════════════════════════════════════════ */}
            <footer className="w-full py-8 flex flex-col items-center gap-4 px-6 mt-auto" style={{ background: '#f7f9fb' }}>
                <p className="text-xs" style={{ color: '#454652', opacity: 0.8 }}>© 2024 Unisphere. All rights reserved.</p>
            </footer>
        </div>
    )
}
