import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { GoogleLogin } from '@react-oauth/google'
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function ModernLogin() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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

    const handleGoogleSuccess = async (response) => {
        setError('')
        setLoading(true)
        try {
            const data = await authService.googleLogin(response.credential)
            login(data.token, { id: data.id, name: data.name, email: data.email, role: data.role })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4 shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-black mb-2">Smart Campus Hub</h1>
                    <p className="text-gray-600">Manage your campus facilities efficiently</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 text-sm">Sign in to access your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-red-800 text-sm font-medium">Authentication Failed</p>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Google Sign-in */}
                    <div className="mb-6 flex justify-center w-full">
                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google sign-in was unsuccessful or cancelled.')}
                                theme="outline"
                                size="large"
                                text="signin_with"
                                shape="rectangular"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Or sign in with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@campus.edu"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary underline font-bold transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center mb-4">
                            <p className="text-sm text-gray-600">Demo Accounts (Click to auto-fill credentials)</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => { setEmail('it23367258@my.sliit.lk'); setPassword('Dish@123'); }}
                                className="text-left p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors duration-200 group"
                            >
                                <div className="text-xs font-medium text-sky-900 group-hover:text-blue-800">Dishani (Student)</div>
                                <div className="text-xs text-sky-600 truncate">it23367258@my.sliit.lk</div>
                            </button>
                            <button
                                onClick={() => { setEmail('it23456789@my.sliit.lk'); setPassword('password'); }}
                                className="text-left p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors duration-200 group"
                            >
                                <div className="text-xs font-medium text-sky-900 group-hover:text-blue-800">Student</div>
                                <div className="text-xs text-sky-600 truncate">it23456789@my.sliit.lk</div>
                            </button>
                            <button
                                onClick={() => { setEmail('staff@sliit.lk'); setPassword('password'); }}
                                className="text-left p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200 group"
                            >
                                <div className="text-xs font-medium text-sky-900 group-hover:text-sky-800">Staff</div>
                                <div className="text-xs text-sky-600 truncate">staff@sliit.lk</div>
                            </button>
                            <button
                                onClick={() => { setEmail('admin@admincampus.edu'); setPassword('password'); }}
                                className="text-left p-3 bg-white hover:bg-gradient-app hover:text-white rounded-lg transition-colors duration-200 group"
                            >
                                <div className="text-xs font-medium text-slate-900 group-hover:text-slate-800">Admin</div>
                                <div className="text-xs text-primary truncate">admin@admincampus.edu</div>
                            </button>
                            <button
                                onClick={() => { setEmail('tech@techcampus.edu'); setPassword('password'); }}
                                className="text-left p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200 group"
                            >
                                <div className="text-xs font-medium text-sky-900 group-hover:text-green-800">Tech</div>
                                <div className="text-xs text-sky-600 truncate">tech@techcampus.edu</div>
                            </button>
                            <button
                                onClick={() => { setEmail('ops@opscampus.edu'); setPassword('password'); }}
                                className="text-left p-3 bg-white hover:bg-primary hover:text-white rounded-lg transition-colors duration-200 group"
                            >
                                <div className="text-xs font-medium text-slate-900 group-hover:text-slate-800">Ops</div>
                                <div className="text-xs text-primary truncate">ops@opscampus.edu</div>
                            </button>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary underline font-bold transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        © 2024 Smart Campus Hub. All rights reserved.
                    </p>
                    <div className="mt-2 flex justify-center space-x-4">
                        <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-700">Privacy</Link>
                        <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-700">Terms</Link>
                        <Link to="/help" className="text-xs text-gray-500 hover:text-gray-700">Help</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}




