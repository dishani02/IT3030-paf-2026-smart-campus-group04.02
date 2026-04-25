import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import {
    Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle,
    GraduationCap, Briefcase, Wrench, Settings, Shield, User,
    Building2
} from 'lucide-react'

export default function ModernRegister() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
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

    const roleOptions = [
        { value: 'USER',       label: 'Student',    example: 'it23456789@my.sliit.lk',  pattern: /^it\d{8}@my\.sliit\.lk$/,  color: '#2563eb', icon: 'school' },
        { value: 'STAFF',      label: 'Staff',      example: 'name@sliit.lk',            pattern: /@sliit\.lk$/,               color: '#7c3aed', icon: 'badge' },
        { value: 'TECHNICIAN', label: 'Tech',       example: 'name@techcampus.edu',      pattern: /@techcampus\.edu$/,         color: '#16a34a', icon: 'build' },
        { value: 'OPERATIONS', label: 'Ops',        example: 'name@opscampus.edu',       pattern: /@opscampus\.edu$/,          color: '#d97706', icon: 'settings' },
        { value: 'ADMIN',      label: 'Admin',      example: 'name@admincampus.edu',     pattern: /@admincampus\.edu$/,        color: '#dc2626', icon: 'shield' },
    ]

    const selectedRole = roleOptions.find(r => r.value === formData.role)

    const validateEmail = () => selectedRole.pattern.test(formData.email)
    const validatePassword = () =>
        formData.password.length >= 8 &&
        /[A-Z]/.test(formData.password) &&
        /[a-z]/.test(formData.password) &&
        /\d/.test(formData.password)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
        setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (!formData.name.trim()) { setError('Please enter your full name.'); setLoading(false); return }
        if (!validateEmail()) {
            setError(`Invalid email format. Should be like: ${selectedRole.example}`)
            setLoading(false); return
        }
        if (!validatePassword()) {
            setError('Password must be at least 8 characters with uppercase, lowercase, and a number.')
            setLoading(false); return
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.'); setLoading(false); return
        }

        try {
            await authService.register(formData.name, formData.email, formData.password, formData.role)
            setSuccess('Account created! Redirecting to login...')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ color: '#191c1e' }}>

            {/* ── Background Image Layer ─────────────────────────── */}
            <div 
                className="absolute inset-0 z-0 scale-105"
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
                            <span className="font-bold tracking-[0.15em] text-xs uppercase text-blue-600">
                                Campus Excellence Platform
                            </span>
                            <h2 className="text-[3.5rem] font-extrabold leading-[1.1] tracking-tighter" style={{ color: '#191c1e' }}>
                                Smart Campus <br />
                                <span className="text-blue-600">Operations Hub.</span>
                            </h2>
                            <p className="text-lg max-w-xl leading-relaxed" style={{ color: '#454652' }}>
                                Securely manage academic workflows, resource bookings, maintenance tickets,
                                and campus analytics within our high-performance administrative ecosystem.
                            </p>
                        </div>

                        {/* Available Roles (Demos match Login style) */}
                        <div className="p-8 rounded-2xl space-y-6" style={{ background: '#ffffff', border: '1px solid rgba(197,197,212,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">Standard Account Roles</p>
                            <p className="text-sm text-slate-500 font-medium">Click on a role below to select your account type instantly.</p>
                            <div className="flex gap-2.5 flex-wrap">
                                {roleOptions.map((acc) => (
                                    <button
                                        key={acc.label}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, role: acc.value }))}
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

                    {/* ── Right: Register Panel ───────────────────────────── */}
                    <div className="lg:col-span-5 w-full max-w-[480px] mx-auto lg:max-w-none">
                        <div className="p-8 sm:p-10 rounded-2xl" style={{ background: '#ffffff', boxShadow: '0 24px 48px rgba(0,0,0,0.04)', border: '1px solid rgba(197,197,212,0.1)' }}>

                            {/* Header */}
                            <div className="text-center mb-10">
                                <h3 className="text-2xl font-bold mb-2" style={{ color: '#191c1e' }}>Join Unisphere</h3>
                                <p className="text-sm" style={{ color: '#454652' }}>Please enter your details to create an account</p>
                            </div>

                            {/* Messages */}
                            {error && (
                                <div className="flex items-center gap-3 p-3 rounded-xl mb-5 text-sm font-medium" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
                                    <span>{error}</span>
                                </div>
                            )}
                            {success && (
                                <div className="flex items-center gap-3 p-3 rounded-xl mb-5 text-sm font-medium" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Registration Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: '#454652' }}>Full Name</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-600" style={{ color: '#757684', fontSize: 20 }}>person</span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border-none outline-none text-sm transition-all focus:ring-1 focus:ring-blue-600/20 focus:bg-white"
                                            style={{ background: '#f2f4f6', color: '#191c1e' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: '#454652' }}>Academic Email</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-600" style={{ color: '#757684', fontSize: 20 }}>alternate_email</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder={selectedRole.example}
                                            required
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border-none outline-none text-sm transition-all focus:ring-1 focus:ring-blue-600/20 focus:bg-white"
                                            style={{ background: '#f2f4f6', color: '#191c1e', fontFamily: "'Inter', sans-serif" }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: '#454652' }}>Password</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-600" style={{ color: '#757684', fontSize: 20 }}>lock</span>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                required
                                                className="w-full pl-12 pr-4 py-3 rounded-lg border-none outline-none text-sm transition-all focus:ring-1 focus:ring-blue-600/20 focus:bg-white"
                                                style={{ background: '#f2f4f6', color: '#191c1e' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer"
                                                style={{ color: '#757684' }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: '#454652' }}>Confirm</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-600" style={{ color: '#757684', fontSize: 20 }}>lock</span>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                required
                                                className="w-full pl-12 pr-4 py-3 rounded-lg border-none outline-none text-sm transition-all focus:ring-1 focus:ring-blue-600/20 focus:bg-white"
                                                style={{ background: '#f2f4f6', color: '#191c1e' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer"
                                                style={{ color: '#757684' }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-full font-bold text-[15px] border-none transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700"
                                    style={{
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        marginTop: '2rem'
                                    }}
                                >
                                    {loading ? 'Creating Account...' : 'Join the Hub'}
                                </button>
                            </form>

                            {/* Sign In link */}
                            <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid #f2f4f6' }}>
                                <p className="text-xs" style={{ color: '#454652' }}>
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-bold hover:underline ml-1 text-blue-600" style={{ textDecoration: 'none' }}>
                                        Sign in instead
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
