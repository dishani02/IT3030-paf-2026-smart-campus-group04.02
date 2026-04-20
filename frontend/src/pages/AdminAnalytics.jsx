import { useState, useEffect } from 'react'
import axios from 'axios'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
    TrendingUp, Users, Calendar, CheckCircle, Clock, AlertCircle, 
    ArrowUpRight, ArrowDownRight, LayoutDashboard, Database, Activity 
} from 'lucide-react'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/analytics/summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError('Failed to load metrics. Please ensure you have admin privileges and the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="spinner w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Aggregating campus data...</p>
        </div>
    );

    if (error) return (
        <div className="card border-rose-100 bg-rose-50/30 p-8 text-center max-w-2xl mx-auto mt-12">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Metrics Unavailable</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button onClick={fetchAnalytics} className="btn-primary inline-flex items-center gap-2">
                <Activity className="w-4 h-4" /> Try Again
            </button>
        </div>
    );

    const ticketSummary = data.ticketStats.reduce((acc, curr) => {
        acc.open += curr.openCount;
        acc.resolved += curr.resolvedCount;
        return acc;
    }, { open: 0, resolved: 0 });

    const totalBookings = data.bookingStatus.reduce((sum, s) => sum + s.count, 0);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <TrendingUp className="text-sky-500 w-8 h-8" />
                        Campus Analytics
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time overview of resource utilization and support tickets</p>
                </div>
                <button 
                    onClick={fetchAnalytics}
                    className="btn bg-white border border-sky-100 hover:bg-sky-50 text-sky-600 shadow-sm transition-all flex items-center gap-2 font-bold px-6"
                >
                    <Clock className="w-4 h-4" /> Refresh Dashboard
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Bookings" 
                    value={totalBookings} 
                    icon={Calendar} 
                    color="sky" 
                    trend="+12% from last month"
                />
                <StatCard 
                    title="Active Tickets" 
                    value={ticketSummary.open} 
                    icon={AlertCircle} 
                    color="amber" 
                    trend="-5% improvement"
                />
                <StatCard 
                    title="Resolved Tickets" 
                    value={ticketSummary.resolved} 
                    icon={CheckCircle} 
                    color="emerald" 
                    trend="Efficiency: 88%"
                />
                <StatCard 
                    title="Top Resource" 
                    value={data.topResources[0]?.resourceName || 'N/A'} 
                    icon={Database} 
                    color="indigo" 
                    trend={`${data.topResources[0]?.count || 0} total sessions`}
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Top 5 Most Booked Resources */}
                <div className="card p-6 shadow-xl shadow-slate-200/50 border-sky-50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Most Popular Resources</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Top 5 by booking frequency</p>
                        </div>
                        <LayoutDashboard className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topResources} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="resourceName" 
                                    type="category" 
                                    width={120} 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar 
                                    dataKey="count" 
                                    fill="#0ea5e9" 
                                    radius={[0, 4, 4, 0]} 
                                    barSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Booking Status Breakdown */}
                <div className="card p-6 shadow-xl shadow-slate-200/50 border-sky-50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Booking Pipeline</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Distribution by status</p>
                        </div>
                        <Activity className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.bookingStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {data.bookingStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Peak Hours Line Chart */}
                <div className="card p-6 shadow-xl shadow-slate-200/50 border-sky-50 lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Peak Usage Hours</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Activity distribution throughout the day</p>
                        </div>
                        <Clock className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.peakHours} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="hour" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    tickFormatter={(hour) => `${hour}:00`}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(hour) => `Time: ${hour}:00`}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#0ea5e9" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Ticket Stats by Month */}
                <div className="card p-6 shadow-xl shadow-slate-200/50 border-sky-50 lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Ticket Resolution Trends</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Open vs Resolved metrics by month</p>
                        </div>
                        < TrendingUp className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.ticketStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="openCount" 
                                    name="Open Tickets"
                                    stroke="#f59e0b" 
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="resolvedCount" 
                                    name="Resolved Tickets"
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
    const colorMap = {
        sky: 'from-sky-50 to-white text-sky-600 border-sky-100',
        amber: 'from-amber-50 to-white text-amber-600 border-amber-100',
        emerald: 'from-emerald-50 to-white text-emerald-600 border-emerald-100',
        indigo: 'from-indigo-50 to-white text-indigo-600 border-indigo-100',
    };

    return (
        <div className={`card p-6 border-0 bg-gradient-to-br shadow-xl shadow-slate-200/40 relative overflow-hidden group ${colorMap[color]}`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-xl bg-white shadow-sm ring-1 ring-slate-100`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {trend.includes('+') ? (
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <ArrowUpRight className="w-3 h-3" /> {trend.split(' ')[0]}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                            <Activity className="w-3 h-3" /> Info
                        </div>
                    )}
                </div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{title}</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-2">{trend}</p>
            </div>
            <Icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:scale-110 transition-transform duration-500" />
        </div>
    );
}
