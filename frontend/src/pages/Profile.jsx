import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { User, Mail, Shield, Calendar, MapPin, Camera, Edit2, ShieldAlert, BadgeCheck, X, Check, Loader2 } from 'lucide-react'

export default function Profile() {
    const { user, refreshUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [newName, setNewName] = useState(user?.name || '')
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

    const handleSave = async () => {
        if (!newName.trim()) return
        setIsSaving(true)
        setMessage({ type: '', text: '' })
        try {
            const updated = await authService.updateProfile({ name: newName })
            refreshUser(updated)
            setIsEditing(false)
            setMessage({ type: 'success', text: 'Name updated successfully!' })
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update name' })
        } finally {
            setIsSaving(false)
        }
    }

    const cancelEdit = () => {
        setNewName(user?.name || '')
        setIsEditing(false)
        setMessage({ type: '', text: '' })
    }

    const stats = [
        { label: 'Resource Bookings', value: '12', color: 'text-primary', bg: 'bg-white' },
        { label: 'Active Tickets', value: '3', color: 'text-emerald-500', bg: 'bg-white' },
        { label: 'System Access', value: 'Premium', color: 'text-sky-600', bg: 'bg-sky-50' },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            
            {message.type && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-rose-50 border-rose-100 text-rose-700'} flex items-center justify-between`}>
                    <p className="text-sm font-bold">{message.text}</p>
                    <button onClick={() => setMessage({ type: '', text: '' })}><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* ── Header Card ─────────────────────────────── */}
            <div className="card overflow-hidden border-0 shadow-2xl shadow-blue-900/5">
                <div className="h-32 bg-blue-50 relative" />
                <div className="px-8 pb-8 flex flex-col items-center sm:items-start sm:flex-row gap-6 -mt-12 relative z-10 text-center sm:text-left">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl">
                            <div className="w-full h-full rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-4xl font-extrabold">
                                {initials}
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 sm:pt-14 space-y-1">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            {isEditing ? (
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="text-2xl font-extrabold text-slate-950 bg-slate-50 border-b-2 border-primary focus:outline-none"
                                    autoFocus
                                />
                            ) : (
                                <h1 className="text-2xl font-extrabold text-slate-950">{user?.name}</h1>
                            )}
                            {user?.role === 'ADMIN' && <BadgeCheck className="w-6 h-6 text-blue-400" />}
                        </div>
                        <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs flex items-center gap-1.5 justify-center sm:justify-start">
                            <Shield className="w-3 h-3 text-slate-600" />
                            {user?.roleDescription || user?.role}
                        </p>
                    </div>

                    <div className="sm:ml-auto pt-4 sm:pt-14">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={cancelEdit}
                                    className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                                    disabled={isSaving}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                    <span className="text-xs font-bold uppercase tracking-widest px-1">Save</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Name
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Personal Information ────────────────────── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-slate-600" />
                            Account Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Full Name</label>
                                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    {isEditing ? (
                                        <input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="text-sm font-bold text-slate-900 bg-transparent w-full focus:outline-none"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-sm font-bold text-slate-700">{user?.email}</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Designation</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-sm font-bold text-slate-700">{user?.roleDescription || user?.role}</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Campus Location</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-sm font-bold text-slate-700">Main Campus, Sri Lanka</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className={`p-4 rounded-2xl ${stat.bg} border border-blue-50 text-center`}>
                                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Sidebar ───────────────────────────────────── */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-600" />
                            Activity Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium">Last Sign In</span>
                                <span className="text-xs font-bold text-slate-900">Today, 10:45 AM</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium">Joined Campus</span>
                                <span className="text-xs font-bold text-slate-900">Feb 2026</span>
                            </div>
                            <div className="pt-4 border-t border-blue-50">
                                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase">Online Now</span>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
