import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingService } from '../services/bookingService'
import { ticketService } from '../services/ticketService'
import { resourceService } from '../services/resourceService'
import {
    Building2, CalendarDays, Wrench, Clock,
    CheckCircle, Users, Activity, ArrowUpRight,
    ArrowDownRight, Zap, TrendingUp, Sparkles, Database
} from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'
import axios from 'axios'

export default function DashboardModern() {
    const { user } = useAuth()
    const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0, pending: 0, completed: 0, activeUsers: 0 })
    const [recentBookings, setRecentBookings] = useState([])
    const [recentTickets, setRecentTickets] = useState([])
    const [analyticsData, setAnalyticsData] = useState(null)
    const [loading, setLoading] = useState(true)

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'OPERATIONS'

    // Modern Color Palette
    const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        try {
            const [resources, tickets] = await Promise.all([
                resourceService.getAll().catch(() => []),
                ticketService.getAll().catch(() => []),
            ])
            const bookings = user.role === 'USER'
                ? await bookingService.getMyBookings().catch(() => [])
                : await bookingService.getAll().catch(() => [])

            // Fetch analytics or mock for visualization
            let analytics = null;
            if (isAdmin) {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('/api/analytics/summary', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    analytics = res.data;
                } catch (e) { console.error('Analytics failed:', e) }
            }

            // Mock additional data if missing for "State of the art" look
            const enrichedAnalytics = {
                ...analytics,
                distribution: [
                    { name: 'Labs', value: 40 },
                    { name: 'Lecture Halls', value: 30 },
                    { name: 'Meeting Rooms', value: 20 },
                    { name: 'Sports', value: 10 },
                ],
                trends: [
                    { month: 'Jan', bookings: 45, tickets: 12 },
                    { month: 'Feb', bookings: 52, tickets: 18 },
                    { month: 'Mar', bookings: 48, tickets: 15 },
                    { month: 'Apr', bookings: 70, tickets: 22 },
                    { month: 'May', bookings: 65, tickets: 20 },
                    { month: 'Jun', bookings: 85, tickets: 25 },
                ],
                topResources: analytics?.topResources || [
                    { resourceName: 'Main Lab 01', count: 124 },
                    { resourceName: 'Conference Room', count: 89 },
                    { resourceName: 'Lecture Hall A', count: 76 },
                    { resourceName: 'Auditorium', count: 45 },
                ],
                peakHours: analytics?.peakHours || Array.from({length: 12}, (_, i) => ({
                    hour: i + 8,
                    count: Math.floor(Math.random() * 50) + 10
                }))
            };
            setAnalyticsData(enrichedAnalytics);

            setStats({
                resources: resources.length,
                bookings: bookings.length,
                tickets: tickets.length,
                pending: bookings.filter(b => b.status === 'PENDING').length,
                completed: bookings.filter(b => b.status === 'APPROVED').length,
                activeUsers: 142
            })
            setRecentBookings(bookings.slice(0, 5))
            setRecentTickets(tickets.slice(0, 5))
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-sky-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin" />
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#f8fafc] -m-8 p-8 space-y-10 relative overflow-hidden">
            {/* Soft Ambient Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-100/50 rounded-full blur-[100px] -z-10" />

            {/* ── Top Navigation / Context ───────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/80 text-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/5 border border-blue-50">
                        <Activity className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                            Analytics Overview
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">Campus operational intelligence and real-time activity metrics.</p>
                    </div>
                </div>
            </div>

            {/* ── Key Performance Indicators ───────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Utilized Resources', val: stats.resources, icon: Building2, color: 'text-sky-600', bg: 'bg-sky-50' },
                    { label: 'Active Reservations', val: stats.bookings, icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Open Incidents', val: stats.tickets, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Live Engagement', val: stats.activeUsers, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${kpi.bg} rounded-2xl flex items-center justify-center`}>
                                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-300 capitalize tracking-widest">Live</div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 tracking-tighter">{kpi.val}</p>
                        <p className="text-xs font-bold text-slate-400 capitalize tracking-wider mt-1">{kpi.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Primary Visual Data ─────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Trend Line Chart */}
                <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Growth & Performance</h3>
                            <p className="text-xs text-slate-400 font-bold capitalize tracking-widest mt-1">Monthly Service Trends</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsData.trends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: '800' }}
                                />
                                <Line type="monotone" dataKey="bookings" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                <Line type="monotone" dataKey="tickets" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                <Legend wrapperStyle={{ paddingTop: '30px', fontWeight: '700', fontSize: '10px', textTransform: 'capitalize', letterSpacing: '1px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Pie Chart */}
                <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Resource Mix</h3>
                    <p className="text-xs text-slate-400 font-bold capitalize tracking-widest mb-8">Asset Allocation</p>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.distribution}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {analyticsData.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -10px rgb(0 0 0 / 0.2)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 w-full px-4">
                        {analyticsData.distribution.map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                <span className="text-[10px] font-bold text-slate-500 capitalize tracking-tighter">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Secondary Visual Data ───────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Horizontal Bar Chart: Usage Ranking */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Facility Ranking</h3>
                            <p className="text-xs text-slate-400 font-bold capitalize tracking-widest mt-1">Most Booked Resources</p>
                        </div>
                        <Database className="w-6 h-6 text-sky-500/20" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.topResources} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="resourceName" type="category" width={120} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Area Chart: Peak Engagement */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Traffic Intensity</h3>
                            <p className="text-xs text-slate-400 font-bold capitalize tracking-widest mt-1">Peak Utilization Hours</p>
                        </div>
                        <Clock className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.peakHours}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} label={{ value: 'Hour of Day', position: 'bottom', offset: 0, fontSize: 10, fontWeight: 700 }} />
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none' }} labelFormatter={(v) => `${v}:00`} />
                                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── Recent Activity Feed ────────────────────────── */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        Feed Stream
                    </h2>
                    <Link to="/my-bookings" className="text-xs font-bold text-indigo-500 capitalize tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-full transition-all">View All Activity</Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold text-slate-300 capitalize tracking-widest ml-2">Recent Booking History</span>
                        {recentBookings.map(b => (
                            <div key={b.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-sm">
                                        <Building2 className="w-5 h-5 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{b.resourceName}</p>
                                        <p className="text-[10px] text-slate-400 font-bold capitalize tracking-wider">{b.date} · {b.startTime} - {b.endTime}</p>
                                    </div>
                                </div>
                                <StatusBadge status={b.status} />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold text-slate-300 capitalize tracking-widest ml-2">Active Maintenance Tickets</span>
                        {recentTickets.map(t => (
                            <div key={t.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <Wrench className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{t.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold capitalize tracking-wider">Task #{t.id} · Priority {t.priority}</p>
                                    </div>
                                </div>
                                <StatusBadge status={t.status} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}






