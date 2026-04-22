import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingService } from '../services/bookingService'
import { CalendarDays, X, Plus, Clock, MapPin, QrCode } from 'lucide-react'
import ConfirmDelete from '../components/ConfirmDelete'
import QRCodeDisplay from '../components/QRCodeDisplay'

const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING': return 'bg-[#ffb784]'
        case 'APPROVED': return 'bg-emerald-500'
        case 'REJECTED': return 'bg-red-500'
        case 'CANCELLED': return 'bg-slate-400'
        default: return 'bg-primary'
    }
}

const getStatusBadgeStyle = (status) => {
    switch (status) {
        case 'PENDING': return 'bg-amber-50 text-amber-600 border border-amber-100'
        case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        case 'REJECTED': return 'bg-red-50 text-red-600 border border-red-100'
        case 'CANCELLED': return 'bg-slate-50 text-slate-400 border border-slate-100'
        default: return 'bg-blue-50 text-blue-600'
    }
}

export default function MyBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancelling, setCancelling] = useState(null)
    const [bookingToCancel, setBookingToCancel] = useState(null)
    const [bookingForQR, setBookingForQR] = useState(null)
    const [activeTab, setActiveTab] = useState('PENDING')

    useEffect(() => { load() }, [])

    const load = async () => {
        try {
            const data = await bookingService.getMyBookings()
            setBookings(data)
        } finally { setLoading(false) }
    }

    const handleCancel = async () => {
        if (!bookingToCancel) return
        const id = bookingToCancel.id
        setCancelling(id)
        try {
            await bookingService.cancel(id)
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
            setBookingToCancel(null)
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking')
        } finally { setCancelling(null) }
    }

    const filteredBookings = bookings.filter(b => b.status === activeTab)

    const tabs = [
        { key: 'PENDING', label: 'Pending' },
        { key: 'APPROVED', label: 'Approved' },
        { key: 'REJECTED', label: 'Rejected' },
        { key: 'CANCELLED', label: 'Cancelled' }
    ]

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="bg-[#f7f9fb] min-h-screen -m-5 lg:-m-7 p-6 lg:p-10 space-y-8 animate-fade-in font-['Inter']">
            {/* ── Editorial Header ──────────────────────────────────── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white text-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/5 border border-blue-50">
                        <CalendarDays className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">My Reservations</h1>
                        <p className="text-sm text-slate-500 font-medium">Track your booking requests and their approval status.</p>
                    </div>
                </div>
                <Link
                    to="/bookings"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> New Booking
                </Link>
            </header>

            {/* ── Status Filter Tabs ─────────────────────────────────── */}
            <div className="flex items-center gap-10 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative pb-4 px-1 text-[15px] font-bold whitespace-nowrap transition-all flex items-center gap-3 group ${
                            activeTab === tab.key
                                ? 'text-blue-600'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            activeTab === tab.key 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        }`}>
                            {bookings.filter(b => b.status === tab.key).length}
                        </span>
                        {activeTab === tab.key && (
                            <span className="absolute bottom-[-1.5px] left-0 w-full h-[3px] bg-blue-600 rounded-full shadow-[0_2px_4px_rgba(37,99,235,0.2)] animate-scale-x" />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Booking List Results ─────────────────────────────── */}
            <main className="pb-32">
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-24 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">event_busy</span>
                        <h3 className="text-base font-semibold text-slate-800 mb-1">No bookings here</h3>
                        <p className="text-[13px] text-slate-400">You don't have any bookings in this status.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
                        {filteredBookings.map(b => (
                            <div 
                                key={b.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 flex flex-col"
                            >
                                <div className="p-6 pb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                #{b.id?.toString().slice(-4) || '0000'}
                                            </span>
                                        </div>
                                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full capitalize tracking-tight ${getStatusBadgeStyle(b.status)}`}>
                                            {b.status.toLowerCase().replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-[17px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-4">
                                        {b.resourceName}
                                    </h3>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 bg-blue-50/50 px-3.5 py-2 rounded-xl border border-blue-100/50">
                                            <CalendarDays className="w-4 h-4 text-blue-600" />
                                            <span className="text-[11px] font-bold text-blue-700">{b.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-50/70 px-3.5 py-2 rounded-xl border border-slate-100">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span className="text-[11px] font-bold text-slate-600">
                                                {b.startTime} - {b.endTime}
                                            </span>
                                        </div>
                                        {b.resourceLocation && (
                                            <div className="flex items-center gap-2 bg-slate-50/70 px-3.5 py-2 rounded-xl border border-slate-100">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span className="text-[11px] font-bold text-slate-600 truncate max-w-[140px]">
                                                    {b.resourceLocation}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-[13px] text-slate-500 line-clamp-2">
                                        {b.purpose}
                                    </div>
                                    
                                    {b.rejectionReason && (
                                        <div className="mt-3 text-[12px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                                            <span className="font-bold">Reason:</span> {b.rejectionReason}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center group-hover:bg-blue-50/30 transition-colors">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(b.status)}`} />
                                        <span className="text-[10px] font-bold text-slate-400">
                                            Status: <span className="capitalize">{b.status.toLowerCase()}</span>
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {b.status === 'APPROVED' && (
                                            <button
                                                className="btn btn-sm bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                                                onClick={(e) => { e.stopPropagation(); setBookingForQR(b); }}
                                                title="Check-in QR Code"
                                            >
                                                <QrCode className="w-3.5 h-3.5" /> QR
                                            </button>
                                        )}
                                        {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                                            <button
                                                className="btn btn-sm bg-white border-slate-200 text-slate-600 hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 flex items-center gap-1 py-1 px-3 rounded-lg font-semibold"
                                                onClick={(e) => { e.stopPropagation(); setBookingToCancel(b); }}
                                                disabled={cancelling === b.id}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                                {cancelling === b.id ? '...' : 'Cancel'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {bookingToCancel && (
                <ConfirmDelete
                    title="Cancel Booking"
                    description="Are you sure you want to cancel this booking?"
                    onConfirm={handleCancel}
                    onCancel={() => setBookingToCancel(null)}
                    loading={!!cancelling}
                    confirmText="Cancel Booking"
                    confirmClass="btn-danger"
                />
            )}
            {bookingForQR && (
                <QRCodeDisplay 
                    bookingId={bookingForQR.id} 
                    onClose={() => setBookingForQR(null)} 
                />
            )}
        </div>
    )
}
