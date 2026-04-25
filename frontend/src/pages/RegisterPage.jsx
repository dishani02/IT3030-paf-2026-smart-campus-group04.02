import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { GoogleLogin } from '@react-oauth/google'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, GraduationCap, BookOpen, Layers, BarChart3 } from 'lucide-react'

export default function RegisterPage() {
    const { login } = useAuth()
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

    const roleOptions = [
        { value: 'USER', label: 'Student' },
        { value: 'STAFF', label: 'Staff' },
        { value: 'TECHNICIAN', label: 'Technician' },
        { value: 'OPERATIONS', label: 'Operations' },
        { value: 'ADMIN', label: 'Administrator' },
    ]

    const emailValidationRules = {
        USER: { pattern: /^it\d{8}@my\.sliit\.lk$/, example: 'it23456789@my.sliit.lk', description: 'Student email (e.g. it23456789@my.sliit.lk)' },
        STAFF: { pattern: /@sliit\.lk$/, example: 'name@sliit.lk', description: 'Staff email (e.g. name@sliit.lk)' },
        TECHNICIAN: { pattern: /@techcampus\.edu$/, example: 'name@techcampus.edu', description: 'Technician email (e.g. name@techcampus.edu)' },
        OPERATIONS: { pattern: /@opscampus\.edu$/, example: 'name@opscampus.edu', description: 'Operations email (e.g. name@opscampus.edu)' },
        ADMIN: { pattern: /@admincampus\.edu$/, example: 'name@admincampus.edu', description: 'Admin email (e.g. name@admincampus.edu)' }
    }

    const validateEmail = () => emailValidationRules[formData.role].pattern.test(formData.email)
    const validatePassword = () =>
        formData.password.length >= 8 &&
        /[A-Z]/.test(formData.password) &&
        /[a-z]/.test(formData.password) &&
        /\d/.test(formData.password)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        if (!formData.name.trim()) { setError('Please enter your full name'); setLoading(false); return }
        if (!validateEmail()) { setError(`Invalid email format. ${emailValidationRules[formData.role].description}`); setLoading(false); return }
        if (!validatePassword()) { setError('Password must be at least 8 characters with uppercase, lowercase, and numbers'); setLoading(false); return }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setLoading(false); return }
        try {
            await authService.register(formData.name, formData.email, formData.password, formData.role)
            setSuccess('Registration successful! Redirecting to login...')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
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
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-up failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const features = [
        { icon: BookOpen, title: 'Resource Booking', desc: 'Reserve classrooms, labs & equipment instantly' },
        { icon: Layers, title: 'Ticket Tracking', desc: 'Report & monitor maintenance issues' },
        { icon: GraduationCap, title: 'Role-Based Access', desc: 'Dashboard tailored to your campus role' },
        { icon: BarChart3, title: 'Campus Analytics', desc: 'Real-time facility utilization insights' },
    ]

    return (
        <div className="min-h-screen flex">
            {/* Left Hero Panel */}
            <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 text-white relative overflow-hidden flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' }}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight">Smart Campus Hub</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-black leading-tight mb-4">
                            Join thousands<br />
                            <span className="text-white/80">of students.</span>
                        </h2>
                        <p className="text-white/70 text-base leading-relaxed max-w-sm">
                            Create your free account and start managing your campus experience in minutes.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm font-bold text-white mb-0.5">{title}</p>
                                <p className="text-xs text-white/60">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-white/50 text-xs">
                    © 2024 Smart Campus Hub. All rights reserved.
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-lg py-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' }}>
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-black text-slate-900">Smart Campus Hub</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                        <div className="mb-6">
                            <h1 className="text-2xl font-black text-slate-900 mb-1">Create your account ✨</h1>
                            <p className="text-slate-500 text-sm">Join the Smart Campus Hub community</p>
                        </div>

                        {error && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <p className="text-emerald-700 text-sm font-medium">{success}</p>
                            </div>
                        )}

                        {/* Google Sign-up */}
                        <div className="mb-5 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google sign-up was unsuccessful or cancelled.')}
                                theme="outline" size="large" text="signup_with" shape="rectangular"
                            />
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">or register with email</span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white"
                                            required />
                                    </div>
                                </div>

                                {/* Account Type */}
                                <div>
                                    <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-1.5">Account Type</label>
                                    <select id="role" name="role" value={formData.role} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all text-slate-900 bg-slate-50 focus:bg-white">
                                        {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange}
                                        placeholder={emailValidationRules[formData.role].example}
                                        className={`w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white ${formData.email ? (validateEmail() ? 'border-emerald-300' : 'border-red-300') : 'border-slate-200'}`}
                                        required />
                                </div>
                                {formData.email && (
                                    <p className={`mt-1.5 text-xs font-medium ${validateEmail() ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {validateEmail() ? '✓ Valid email format' : `✗ ${emailValidationRules[formData.role].description}`}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange}
                                            placeholder="Create password"
                                            className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white ${formData.password ? (validatePassword() ? 'border-emerald-300' : 'border-red-300') : 'border-slate-200'}`}
                                            required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {formData.password && !validatePassword() && (
                                        <p className="mt-1.5 text-xs text-red-500">Min 8 chars, uppercase, lowercase & number</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange}
                                            placeholder="Confirm password"
                                            className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white ${formData.confirmPassword ? (formData.confirmPassword === formData.password ? 'border-emerald-300' : 'border-red-300') : 'border-slate-200'}`}
                                            required />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {formData.confirmPassword && (
                                        <p className={`mt-1.5 text-xs font-medium ${formData.confirmPassword === formData.password ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {formData.confirmPassword === formData.password ? '✓ Passwords match' : '✗ Passwords do not match'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-2 pt-1">
                                <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500/30" required />
                                <label htmlFor="terms" className="text-sm text-slate-600 leading-tight">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-sky-600 hover:text-sky-700 font-semibold">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-sky-600 hover:text-sky-700 font-semibold">Privacy Policy</Link>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !validateEmail() || !validatePassword() || formData.password !== formData.confirmPassword}
                                className="w-full text-white py-3 px-4 rounded-xl font-bold text-sm hover:opacity-90 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 mt-2"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-5 text-center">
                            <p className="text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-sky-600 hover:text-sky-700 font-bold transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
