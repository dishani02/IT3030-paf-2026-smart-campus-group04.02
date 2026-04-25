import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { GoogleLogin } from '@react-oauth/google'
import {
    Building2, Mail, Lock, Eye, EyeOff, AlertCircle,
    Shield, GraduationCap, Users, Wrench, Settings,
    ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react'

const demoAccounts = [
    {
        role: 'USER', email: 'it23367258@my.sliit.lk', password: 'Dish@123',
        gradient: 'from-sky-500 to-sky-700', icon: GraduationCap, label: 'Student'
    },
    {
        role: 'STAFF', email: 'staff@sliit.lk', password: 'password',
        gradient: 'from-primary to-primary', icon: Users, label: 'Staff'
    },
    {
        role: 'ADMIN', email: 'admin@admincampus.edu', password: 'password',
        gradient: 'from-sky-800 to-sky-950', icon: Shield, label: 'Admin'
    },
    {
        role: 'TECHNICIAN', email: 'tech@techcampus.edu', password: 'password',
        gradient: 'from-sky-500 to-sky-700', icon: Wrench, label: 'Technician'
    },
    {
        role: 'OPERATIONS', email: 'ops@opscampus.edu', password: 'password',
        gradient: 'from-primary to-emerald-600', icon: Settings, label: 'Operations'
    },
]


export default function PremiumLogin() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [activeDemo, setActiveDemo] = useState(null)

    const getRoleRedirect = (role) => {
        switch (role) {
            case 'ADMIN': return '/admin'
            case 'OPERATIONS': return '/admin'
            case 'TECHNICIAN': return '/tickets'
            case 'STAFF': return '/'
            case 'USER': return '/'
            default: return '/'
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            const data = await authService.login(email, password)
            login(data.token, { id: data.id, name: data.name, email: data.email, role: data.role })
            navigate(getRoleRedirect(data.role))
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (response) => {
        setError('')
        setLoading(true)
        try {
            const data = await authService.googleLogin(response.credential)
            login(data.token, { id: data.id, name: data.name, email: data.email, role: data.role })
            // Redirect the user directly to the Student Dashboard after login per requirement
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDemo = (demo, i) => {
        setActiveDemo(i); setEmail(demo.email); setPassword(demo.password)
        setTimeout(() => setActiveDemo(null), 1500)
    }

    return (
        <div className="min-h-screen bg-transparent bg-grid flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-app opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-app opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-5xl mx-auto relative z-10 animate-fade-in">
                <div className="flex justify-center">
                    {/* ── Center: Form + Demo ───────────────────────── */}
                    <div className="w-full max-w-xl">
                        <div className="card p-8">
                            {/* Header */}
                            <div className="mb-7">
                                <div className="flex items-center gap-2 mb-1">
                                    <Building2 className="w-5 h-5 text-primary lg:hidden" />
                                    <h2 className="text-2xl font-extrabold text-slate-950">Welcome back</h2>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Sign in to your campus dashboard</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="alert-error mb-5 animate-slide-up">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}


                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-group mb-0">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            id="email" type="email" required autoComplete="email"
                                            value={email} onChange={e => setEmail(e.target.value)}
                                            placeholder="your.email@campus.edu"
                                            className="form-control pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-0">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            id="password"
                                            type={showPwd ? 'text' : 'password'}
                                            required autoComplete="current-password"
                                            value={password} onChange={e => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="form-control pl-10 pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd(!showPwd)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 accent-primary rounded border-sky-300" />
                                        <span className="text-sm text-slate-600 font-medium">Remember me</span>
                                    </label>
                                    <a href="#" className="text-sm text-primary hover:text-slate-700 font-bold transition-colors">
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="btn-primary btn-lg w-full mt-2"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Sign In <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Divider for Google */}
                            <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Or sign in with Google</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            {/* Google Sign-in */}
                            <div className="mb-6 flex justify-center w-full">
                                <div className="w-full filter drop-shadow-sm flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError('Google sign-in was unsuccessful or cancelled.')}
                                        theme="outline"
                                        size="large"
                                        text="signin_with"
                                        shape="rectangular"
                                        width="512"
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-white" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Demo Accounts</span>
                                <div className="flex-1 h-px bg-white" />
                            </div>

                            {/* Demo Accounts */}
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                                {demoAccounts.map((demo, i) => {
                                    const Icon = demo.icon
                                    return (
                                        <button
                                            key={demo.email}
                                            onClick={() => handleDemo(demo, i)}
                                            className={`
                                                flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200
                                                ${activeDemo === i
                                                    ? 'border-primary bg-white shadow-sm'
                                                    : 'border-brand-blue-50 hover:border-sky-100 bg-white hover:bg-white shadow-sm'
                                                }
                                            `}
                                            title={`${demo.email} / ${demo.password}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${demo.gradient} flex items-center justify-center`}>
                                                {activeDemo === i
                                                    ? <CheckCircle2 className="w-4 h-4 text-white" />
                                                    : <Icon className="w-4 h-4 text-white" />
                                                }
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium">{demo.label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Register Link */}
                            <p className="text-center text-sm text-slate-500 mt-6 font-medium">
                                New to Smart Campus?{' '}
                                <Link to="/register" className="text-primary hover:text-slate-700 font-bold transition-colors">
                                    Create account <ChevronRight className="inline w-3.5 h-3.5" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}







