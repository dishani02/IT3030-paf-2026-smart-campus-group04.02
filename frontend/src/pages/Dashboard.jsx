import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingService } from '../services/bookingService'
import { ticketService } from '../services/ticketService'
import { resourceService } from '../services/resourceService'
import StatusBadge from '../components/StatusBadge'
import {
    CalendarDays, ArrowRight, Plus, Search, Wrench,
    BookOpen, Clock, CheckCircle, Building2, AlertCircle,
    ChevronRight, BarChart3, Ticket
} from 'lucide-react'

function fmt(d) {
    if (!d) return '—'
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) } catch { return d }
}

export default function Dashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0, pending: 0, approved: 0 })
    const [bookings, setBookings] = useState([])
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            try {
                const [res, tix, bk] = await Promise.all([
                    resourceService.getAll().catch(() => []),
                    ticketService.getAll().catch(() => []),
                    bookingService.getMyBookings().catch(() => []),
                ])
                setStats({
                    resources: res.length, bookings: bk.length, tickets: tix.length,
                    pending: bk.filter(b => b.status === 'PENDING').length,
                    approved: bk.filter(b => b.status === 'APPROVED').length,
                })
                setBookings(bk.slice(0, 5))
                setTickets(tix.slice(0, 4))
            } finally { setLoading(false) }
        })()
    }, [])

    const name = user?.name?.split(' ')[0] || 'Student'
    const openTix = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length
    const next = bookings.find(b => b.status === 'APPROVED')

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-7 h-7 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="space-y-6">

            {/* ── Header Row ──────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                        Welcome back, {name}
                    </h1>
                    <p className="text-[13px] text-slate-400 mt-0.5">Here's your campus overview</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/tickets" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20" style={{ textDecoration: 'none' }}>
                        <Wrench className="w-3.5 h-3.5" /> Report Issue
                    </Link>
                </div>
            </div>

            {/* ── Stats Row ───────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                    { icon: CalendarDays, label: 'Bookings', val: stats.bookings, accent: 'text-blue-600 bg-blue-50' },
                    { icon: Clock, label: 'Pending', val: stats.pending, accent: 'text-slate-600 bg-slate-50' },
                    { icon: CheckCircle, label: 'Approved', val: stats.approved, accent: 'text-blue-600 bg-blue-50' },
                    { icon: Ticket, label: 'Tickets', val: stats.tickets, accent: 'text-slate-600 bg-slate-50' },
                    { icon: Building2, label: 'Resources', val: stats.resources, accent: 'text-blue-600 bg-blue-50' },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3.5 hover:border-slate-200 transition-colors">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.accent}`}>
                            <s.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 leading-none">{s.val}</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Featured Booking Card ────────────────────────────── */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-0.5">Next Booking</p>
                        {next ? (
                            <>
                                <p className="text-[15px] font-semibold text-slate-900">{next.resourceName || 'Facility'}</p>
                                <p className="text-[12px] text-slate-500 mt-0.5">
                                    {fmt(next.date)}{next.startTime ? ` · ${next.startTime}` : ''}{next.endTime ? ` – ${next.endTime}` : ''}
                                </p>
                            </>
                        ) : (
                            <p className="text-[15px] font-semibold text-slate-900">No upcoming bookings</p>
                        )}
                    </div>
                </div>
                <Link to="/my-bookings" className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap" style={{ textDecoration: 'none' }}>
                    View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* ── Content Grid ────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Recent Bookings — 3 cols */}
                <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-blue-600" />
                            <h2 className="text-[13px] font-bold text-slate-800">Recent Bookings</h2>
                        </div>
                        <Link to="/my-bookings" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5" style={{ textDecoration: 'none' }}>
                            All <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {bookings.length === 0 ? (
                        <div className="px-5 py-12 text-center">
                            <CalendarDays className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                            <p className="text-[13px] font-medium text-slate-400">No bookings yet</p>
                            <Link to="/bookings" className="text-[12px] font-semibold text-blue-600 mt-2 inline-block" style={{ textDecoration: 'none' }}>
                                Book a resource →
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {bookings.map(b => (
                                <div key={b.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-medium text-slate-800 truncate">{b.resourceName || '—'}</p>
                                            <p className="text-[11px] text-slate-400">
                                                {fmt(b.date)}{b.startTime ? ` · ${b.startTime}` : ''}{b.endTime ? `–${b.endTime}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={b.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tickets — 2 cols */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                        <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-slate-500" />
                            <h2 className="text-[13px] font-bold text-slate-800">Tickets</h2>
                            {openTix > 0 && (
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{openTix} open</span>
                            )}
                        </div>
                        <Link to="/tickets" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5" style={{ textDecoration: 'none' }}>
                            All <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {tickets.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
                            <CheckCircle className="w-8 h-8 text-slate-200 mb-3" />
                            <p className="text-[13px] font-medium text-slate-400">All clear</p>
                            <p className="text-[11px] text-slate-300 mt-0.5">No open tickets</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 flex-1">
                            {tickets.map(t => (
                                <Link key={t.id} to={`/tickets/${t.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors group" style={{ textDecoration: 'none' }}>
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-medium text-slate-800 truncate">{t.title || '—'}</p>
                                        <p className="text-[11px] text-slate-400">#{t.id}{t.priority ? ` · ${t.priority}` : ''}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <StatusBadge status={t.status} />
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="px-5 py-3 border-t border-slate-50">
                        <Link to="/tickets" className="flex items-center justify-center gap-1.5 w-full py-2 text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md shadow-blue-500/10" style={{ textDecoration: 'none' }}>
                            <Plus className="w-3.5 h-3.5" /> Report issue
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Quick Links Row ──────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                    { to: '/resources', icon: Search, label: 'Browse Resources', sub: 'Labs, halls & rooms' },
                    { to: '/my-bookings', icon: BookOpen, label: 'My Bookings', sub: 'View reservations' },
                    { to: '/tickets', icon: Wrench, label: 'Report Issue', sub: 'Maintenance request' },
                ].map(a => (
                    <Link key={a.to} to={a.to} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3.5 hover:border-blue-200 hover:bg-blue-50/30 transition-all group" style={{ textDecoration: 'none' }}>
                        <div className="w-9 h-9 bg-slate-50 group-hover:bg-blue-50 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                            <a.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{a.label}</p>
                            <p className="text-[11px] text-slate-400 truncate">{a.sub}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ── Footer Banner ────────────────────────────────────── */}
            <div className="bg-blue-600 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200 mb-0.5">Campus Resources</p>
                    <p className="text-[15px] font-semibold text-white">Explore all {stats.resources} available facilities</p>
                    <p className="text-[12px] text-blue-200 mt-0.5">Labs, lecture halls, study rooms and more</p>
                </div>
                <Link to="/resources" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 text-[13px] font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap" style={{ textDecoration: 'none' }}>
                    <Search className="w-3.5 h-3.5" /> Browse Resources
                </Link>
            </div>
        </div>
    )
}
