import { useState, useEffect } from 'react'
import { Bell, Shield, MessageSquare, Ticket, Calendar, ArrowLeft, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:/api'

export default function NotificationSettings() {
    const [preferences, setPreferences] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { token } = useAuth()

    useEffect(() => {
        fetchPreferences()
    }, [])

    const fetchPreferences = async () => {
        try {
            const res = await axios.get(`${API_URL}/notification-preferences`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPreferences(res.data)
        } catch (err) {
            setError('Failed to load notification settings.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const togglePreference = async (category, currentStatus) => {
        try {
            // Optimistic update
            setPreferences(prev => prev.map(p => 
                p.category === category ? { ...p, enabled: !currentStatus } : p
            ))

            await axios.put(`${API_URL}/notification-preferences/${category}`, 
                { enabled: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } catch (err) {
            // Revert on error
            setPreferences(prev => prev.map(p => 
                p.category === category ? { ...p, enabled: currentStatus } : p
            ))
            console.error('Failed to update preference:', err)
        }
    }

    const getIcon = (category) => {
        if (category.startsWith('BOOKING')) return <Calendar className="w-5 h-5 text-indigo-500" />
        if (category.startsWith('TICKET_STATUS')) return <Ticket className="w-5 h-5 text-emerald-500" />
        if (category.includes('COMMENT')) return <MessageSquare className="w-5 h-5 text-sky-500" />
        if (category.includes('ASSIGNED')) return <Shield className="w-5 h-5 text-violet-500" />
        return <Bell className="w-5 h-5 text-amber-500" />
    }

    const formatLabel = (category) => {
        return category
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="spinner w-8 h-8" />
        </div>
    )

    return (
        <div className="bg-[#f7f9fb] min-h-screen -m-5 lg:-m-7 p-6 lg:p-10 space-y-8 animate-fade-in font-['Inter']">
            {/* ── Editorial Header ──────────────────────────────────── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white text-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/5 border border-blue-50">
                        <Bell className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Notification Settings</h1>
                        <p className="text-sm text-slate-500 font-medium">Configure and manage your personalized campus alert preferences.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── Settings Panel ─────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm font-semibold">{error}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferences</span>
                            </div>
                        </div>
                        
                        <div className="divide-y divide-slate-50">
                            {preferences.length === 0 && !error && (
                                <div className="p-12 text-center text-slate-400">
                                     No settings available.
                                </div>
                            )}
                            {preferences.map((pref) => (
                                <div key={pref.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                            {getIcon(pref.category)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-[14px]">{formatLabel(pref.category)}</h3>
                                            <p className="text-[12px] text-slate-400 mt-0.5">Receive updates about {formatLabel(pref.category).toLowerCase()}</p>
                                        </div>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={pref.enabled}
                                            onChange={() => togglePreference(pref.category, pref.enabled)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Sidebar Component ──────────────────────────────── */}
                <div className="lg:col-span-1">
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Bell className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 text-[13px] uppercase tracking-wider">About System Notifications</h4>
                                <p className="text-[12px] text-amber-800/70 mt-2 leading-relaxed">
                                    Critical security alerts and system-wide announcements cannot be disabled. These ensure the safety and integrity of your account and Unisphere.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
