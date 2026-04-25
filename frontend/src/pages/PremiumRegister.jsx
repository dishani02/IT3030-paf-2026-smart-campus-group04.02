import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { GoogleLogin } from '@react-oauth/google'
import {
    Building2, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle2,
    GraduationCap, Users, Shield, Wrench, Settings, ChevronRight,
    Sparkles, Zap, Check, X, Loader2
} from 'lucide-react'

export default function PremiumRegister() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)
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
    const [currentStep, setCurrentStep] = useState(1)

    useEffect(() => {
        setMounted(true)
    }, [])

    const roleOptions = [
        {
            value: 'USER',
            label: 'Student',
            description: 'Access campus resources and facilities',
            icon: GraduationCap,
            color: 'from-sky-500 to-sky-700',
            features: ['Book Resources', 'Submit Tickets', 'View Schedule'],
            emailPattern: 'it########@my.sliit.lk',
            example: 'it23456789@my.sliit.lk'
        },
        {
            value: 'STAFF',
            label: 'Staff',
            description: 'Manage and support campus operations',
            icon: Users,
            color: 'from-primary to-primary',
            features: ['Resource Management', 'Student Support', 'Reporting'],
            emailPattern: '*@sliit.lk',
            example: 'name@sliit.lk'
        },
        {
            value: 'ADMIN',
            label: 'Administrator',
            description: 'Full system access and user management',
            icon: Shield,
            color: 'from-sky-800 to-sky-950',
            features: ['System Administration', 'User Management', 'Full Access'],
            emailPattern: '*@admincampus.edu',
            example: 'admin@admincampus.edu'
        },
        {
            value: 'TECHNICIAN',
            label: 'Technician',
            description: 'Technical support and maintenance',
            icon: Wrench,
            color: 'from-sky-500 to-sky-700',
            features: ['Maintenance Tasks', 'Technical Support', 'Equipment Management'],
            emailPattern: '*@techcampus.edu',
            example: 'tech@techcampus.edu'
        },
        {
            value: 'OPERATIONS',
            label: 'Operations',
            description: 'Operations and logistics management',
            icon: Settings,
            color: 'from-primary to-emerald-600',
            features: ['Operations Management', 'Logistics', 'Facility Coordination'],
            emailPattern: '*@opscampus.edu',
            example: 'ops@opscampus.edu'
        }
    ]

    const selectedRole = roleOptions.find(r => r.value === formData.role)

    const validateEmail = () => {
        const rule = selectedRole
        if (rule.value === 'USER') {
            // Student: it########@my.sliit.lk
            return /^it\d{8}@my\.sliit\.lk$/.test(formData.email)
        } else if (rule.value === 'STAFF') {
            return /^[^@]+@sliit\.lk$/.test(formData.email)
        } else if (rule.value === 'ADMIN') {
            return /^[^@]+@admincampus\.edu$/.test(formData.email)
        } else if (rule.value === 'TECHNICIAN') {
            return /^[^@]+@techcampus\.edu$/.test(formData.email)
        } else if (rule.value === 'OPERATIONS') {
            return /^[^@]+@opscampus\.edu$/.test(formData.email)
        }
        return false
    }

    const validatePassword = () => {
        return formData.password.length >= 8 &&
            /[A-Z]/.test(formData.password) &&
            /[a-z]/.test(formData.password) &&
            /\d/.test(formData.password)
    }

    const getPasswordStrength = () => {
        let strength = 0
        if (formData.password.length >= 8) strength++
        if (formData.password.length >= 12) strength++
        if (/[A-Z]/.test(formData.password)) strength++
        if (/[a-z]/.test(formData.password)) strength++
        if (/\d/.test(formData.password)) strength++
        if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength++
        return strength
    }

    const getRoleRedirect = (role) => {
        switch (role) {
            case 'ADMIN': return '/admin'
            case 'OPERATIONS': return '/admin'
            case 'TECHNICIAN': return '/tickets'
            default: return '/'
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (!formData.name.trim()) {
            setError('Please enter your full name')
            setLoading(false)
            return
        }

        if (!validateEmail()) {
            setError(`Invalid email format. Use ${selectedRole.emailPattern} format. Example: ${selectedRole.example}`)
            setLoading(false)
            return
        }

        if (!validatePassword()) {
            setError('Password must be at least 8 characters with uppercase, lowercase, and numbers')
            setLoading(false)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            const data = await authService.register(formData.name, formData.email, formData.password, formData.role)
            // Backend returns a JWT — log the user in immediately
            login(data.token, { id: data.id, name: data.name, email: data.email, role: data.role })
            setSuccess('Account created! Redirecting to your dashboard...')
            setTimeout(() => navigate(getRoleRedirect(data.role)), 1500)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (response) => {
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            const data = await authService.googleLogin(response.credential)
            login(data.token, { id: data.id, name: data.name, email: data.email, role: data.role })
            setSuccess('Google account connected! Redirecting to your dashboard...')
            setTimeout(() => navigate('/'), 1500)
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
        setSuccess('')
    }


    const passwordStrength = getPasswordStrength()
    const strengthColors = ['bg-red-500', 'bg-gradient-app', 'bg-gradient-app', 'bg-sky-500', 'bg-sky-500', 'bg-sky-500']
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-transparent bg-grid flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-app opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-app opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-5xl mx-auto relative z-10 animate-fade-in">
                <div className="flex justify-center">
                    <div className="w-full max-w-xl">
                        <div className="card p-8">
                            <div className="mb-7">
                                <div className="flex items-center gap-2 mb-1">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    <h2 className="text-2xl font-extrabold text-slate-950">Create Account</h2>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Join the Smart Campus Hub community</p>
                            </div>

                        {error && (
                            <div className="alert-error mb-5 animate-slide-up">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                            </div>
                        )}

                        {success && (
                            <div className="alert-success mb-5">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{success}
                            </div>
                        )}


                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label required">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input id="name" name="name" type="text" value={formData.name}
                                        onChange={handleInputChange} placeholder="John Doe"
                                        className="form-control pl-10" required />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder={selectedRole.example}
                                        className={`w-full pl-10 pr-4 py-4 bg-white border border-sky-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 text-slate-950 placeholder-slate-400 shadow-sm ${formData.email && (validateEmail() ? 'border-sky-500/50' : 'border-rose-500/50')
                                            }`}
                                        required
                                    />
                                </div>
                                {formData.email && (
                                    <div className="mt-2 flex items-center space-x-2">
                                        {validateEmail() ? (
                                            <>
                                                <Check className="w-4 h-4 text-sky-600" />
                                                <span className="text-xs text-sky-600 font-bold">Valid email format for {selectedRole.label}</span>
                                            </>
                                        ) : (
                                            <>
                                                <X className="w-4 h-4 text-rose-600" />
                                                <span className="text-xs text-rose-600 font-bold">Invalid format. Use {selectedRole.emailPattern}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Create a strong password"
                                        className={`w-full pl-10 pr-12 py-4 bg-white border border-sky-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 text-slate-950 placeholder-slate-400 shadow-sm ${formData.password && (validatePassword() ? 'border-sky-500/50' : 'border-rose-500/50')
                                            }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                                        )}
                                    </button>
                                </div>

                                {formData.password && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 font-medium">Password Strength</span>
                                            <span className="text-xs text-slate-500 font-bold">{strengthLabels[passwordStrength - 1] || 'Very Weak'}</span>
                                        </div>
                                        <div className="flex space-x-1">
                                            {[...Array(6)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-2 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                {formData.password.length >= 8 ? (
                                                    <Check className="w-3 h-3 text-sky-400" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-400" />
                                                )}
                                                <span className="text-xs text-gray-400">At least 8 characters</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {/[A-Z]/.test(formData.password) ? (
                                                    <Check className="w-3 h-3 text-sky-400" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-400" />
                                                )}
                                                <span className="text-xs text-gray-400">One uppercase letter</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {/[a-z]/.test(formData.password) ? (
                                                    <Check className="w-3 h-3 text-sky-400" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-400" />
                                                )}
                                                <span className="text-xs text-gray-400">One lowercase letter</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {/\d/.test(formData.password) ? (
                                                    <Check className="w-3 h-3 text-sky-400" />
                                                ) : (
                                                    <X className="w-3 h-3 text-red-400" />
                                                )}
                                                <span className="text-xs text-gray-400">One number</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        className={`w-full pl-10 pr-12 py-4 bg-white border border-sky-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 text-slate-950 placeholder-slate-400 shadow-sm ${formData.confirmPassword && (formData.confirmPassword === formData.password ? 'border-sky-500/50' : 'border-rose-500/50')
                                            }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                                        )}
                                    </button>
                                </div>
                                {formData.confirmPassword && (
                                    <div className="mt-2 flex items-center space-x-2">
                                        {formData.confirmPassword === formData.password ? (
                                            <>
                                                <Check className="w-4 h-4 text-sky-600" />
                                                <span className="text-xs text-sky-600 font-bold">Passwords match</span>
                                            </>
                                        ) : (
                                            <>
                                                <X className="w-4 h-4 text-rose-600" />
                                                <span className="text-xs text-rose-600 font-bold">Passwords do not match</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" id="terms" className="w-4 h-4 accent-primary rounded border-sky-300" required />
                                <span className="text-sm text-slate-500 font-medium">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-primary hover:text-slate-700 font-bold font-bold">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-primary hover:text-slate-700 font-bold font-bold">Privacy Policy</Link>
                                </span>
                            </label>

                            <button type="submit" className="btn-primary btn-lg w-full"
                                disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Create Account <ChevronRight className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-5">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-slate-700 font-bold transition-colors">Sign in <ChevronRight className="inline w-3.5 h-3.5" /></Link>
                        </p>

                        {/* Divider for Roles */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-white" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Choose Your Role</span>
                            <div className="flex-1 h-px bg-white" />
                        </div>

                        {/* Role Selection (Simplified) */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            {roleOptions.map((role) => {
                                const Icon = role.icon
                                const isActive = formData.role === role.value
                                return (
                                    <button
                                        key={role.value}
                                        onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                                        className={`
                                            flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200
                                            ${isActive
                                                ? 'border-primary bg-white shadow-sm'
                                                : 'border-brand-blue-50 hover:border-sky-100 bg-white hover:bg-white shadow-sm'
                                            }
                                        `}
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                                            {isActive
                                                ? <CheckCircle2 className="w-4 h-4 text-white" />
                                                : <Icon className="w-4 h-4 text-white" />
                                            }
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium">{role.label}</span>
                                    </button>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
            </div>
        </div>
    )
}








