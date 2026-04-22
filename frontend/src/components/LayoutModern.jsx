import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    Menu, X, Bell, Search, LogOut, Settings,
    Building2, LayoutDashboard, CalendarDays, BookOpen, User, Users,
    Wrench, ShieldCheck, ChevronDown, Sparkles, TrendingUp, Activity
} from 'lucide-react'
import NotificationPanel from './NotificationPanel'

const navGroups = [
    {
        label: 'General',
        items: [
            { to: '/', label: 'Dashboard', icon: Activity, exact: true },
            { to: '/resources', label: 'Resources', icon: Building2 },
            { to: '/my-bookings', label: 'My Bookings', icon: BookOpen },
            { to: '/profile', label: 'Account Profile', icon: User },
            { to: '/tickets', label: 'Tickets', icon: Wrench },
            { to: '/notification-settings', label: 'Notification Settings', icon: Settings },
        ]
    },
    {
        label: 'Administration',
        adminOnly: true,
        items: [
            { to: '/admin', label: 'Admin Panel', icon: ShieldCheck, adminOnly: true },
            { to: '/admin/checkin', label: 'QR Scan Check-in', icon: Sparkles, adminOnly: true },
        ]
    }
]

export default function LayoutModern() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'OPERATIONS'
    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Close user menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="min-h-screen bg-transparent flex">
            {/* Sidebar Mobile Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            />

            {/* ── Sidebar ──────────────────────────────────────── */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-64 flex flex-col
                bg-white border-r border-gray-100 shadow-xl
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-sky-50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-app rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-black leading-tight tracking-wider">Unisphere</p>
                            <p className="text-[10px] text-zinc-500 font-medium tracking-wide">Smart Operations</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden btn-icon w-8 h-8"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-6">
                    {navGroups.map(group => {
                        if (group.adminOnly && !isAdmin) return null
                        const visibleItems = group.items.filter(i => !i.adminOnly || isAdmin)
                        if (!visibleItems.length) return null
                        return (
                            <div key={group.label}>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">
                                    {group.label}
                                </p>
                                <ul className="space-y-0.5">
                                    {visibleItems.map(item => {
                                        const Icon = item.icon
                                        return (
                                            <li key={item.to}>
                                                <NavLink
                                                    to={item.to}
                                                    end={item.exact}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={({ isActive }) =>
                                                        `sidebar-link ${isActive ? 'active' : ''}`
                                                    }
                                                >
                                                    <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '18px', height: '18px' }} />
                                                    <span>{item.label}</span>
                                                </NavLink>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })}
                </nav>

                {/* User Profile at Bottom */}
                {/* User Profile removed as per request */}
            </aside>

            {/* ── Main Content ───────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
                {/* Top Navbar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-sky-100">
                    <div className="flex items-center gap-4 px-5 h-16">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="btn-icon lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Search */}
                        <div className="relative flex-1 max-w-sm hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search resources, bookings..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-sky-100 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                            />
                        </div>

                        {/* Spacer to push icons to the right */}
                        <div className="flex-1" />

                        {/* Actions */}
                        <div className="flex items-center gap-2">

                            {/* Notifications */}
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="btn-icon relative"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
                            </button>

                            {/* User Menu */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white text-xs font-bold">
                                        {initials}
                                    </div>
                                    <span className="hidden sm:block text-sm font-bold text-slate-700">
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-sky-100 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-sky-50">
                                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate font-medium">{user?.email}</p>
                                        </div>
                                        <div className="p-1.5 border-b border-sky-50">
                                            <NavLink
                                                to="/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 font-semibold hover:bg-white rounded-lg transition-colors"
                                            >
                                                <User className="w-4 h-4 text-slate-400" />
                                                My Profile
                                            </NavLink>
                                        </div>
                                        <div className="p-1.5">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 font-semibold hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-5 lg:p-7 animate-fade-in overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Notification Panel */}
            <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
    )
}




