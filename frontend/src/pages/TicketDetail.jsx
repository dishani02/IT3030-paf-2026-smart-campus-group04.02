import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../context/AuthContext'
import { 
    Send, AlertCircle, ArrowLeft, Clock, MessageSquare, 
    Info, Calendar, AlertTriangle, MapPin, Tag
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const getStatusConfig = (status) => {
    switch (status) {
        case 'OPEN': return { bg: 'bg-[#dfe0ff]', text: 'text-[#293898]', border: 'border-[#293898]/10', dot: 'bg-[#293898]' }
        case 'IN_PROGRESS': return { bg: 'bg-[#ffdcc6]', text: 'text-[#6c3400]', border: 'border-[#6c3400]/10', dot: 'bg-[#ffb784]' }
        case 'RESOLVED': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' }
        case 'CLOSED': return { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-100', dot: 'bg-slate-400' }
        case 'REJECTED': return { bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]', border: 'border-[#ba1a1a]/10', dot: 'bg-[#ba1a1a]' }
        default: return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-600' }
    }
}

const getPriorityConfig = (priority) => {
    switch (priority) {
        case 'CRITICAL': return { bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]', border: 'border-[#ba1a1a]/20' }
        case 'HIGH': return { bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]', border: 'border-[#ba1a1a]/20' }
        case 'MEDIUM': return { bg: 'bg-[#dfe0ff]', text: 'text-[#293898]', border: 'border-[#293898]/20' }
        case 'LOW': return { bg: 'bg-slate-100/50', text: 'text-slate-500', border: 'border-slate-200' }
        default: return { bg: 'bg-slate-100/50', text: 'text-slate-500', border: 'border-slate-200' }
    }
}

const roleColors = {
    ADMIN: 'bg-[#293898] text-white',
    TECHNICIAN: 'bg-emerald-500 text-white',
    USER: 'bg-slate-100 text-slate-600',
}

export default function TicketDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState('')
    const [sending, setSending] = useState(false)
    const [statusNote, setStatusNote] = useState('')
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => { load() }, [id])

    const load = async () => {
        try {
            const data = await ticketService.getById(id)
            setTicket(data)
        } catch { navigate('/tickets') }
        finally { setLoading(false) }
    }

    const sendComment = async (e) => {
        e.preventDefault()
        if (!comment.trim()) return
        setSending(true)
        try {
            const updated = await ticketService.addComment(id, comment)
            setTicket(updated); setComment('')
        } catch { setError('Failed to send comment') }
        finally { setSending(false) }
    }

    const updateStatus = async (newStatus) => {
        setUpdating(true); setError('')
        try {
            const updated = await ticketService.updateStatus(id, newStatus, statusNote)
            setTicket(updated); setStatusNote('')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status')
        } finally { setUpdating(false) }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-[#293898] rounded-full animate-spin" />
        </div>
    )
    if (!ticket) return null

    const isAdmin = user.role === 'ADMIN'
    const isTech = user.role === 'TECHNICIAN'
    const canUpdate = isAdmin || isTech
    
    const showAdminActions = isAdmin && ticket.status === 'OPEN'

    const availableStatuses = {
        OPEN: isAdmin ? ['IN_PROGRESS', 'REJECTED'] : [],
        IN_PROGRESS: canUpdate ? ['RESOLVED'] : [],
        RESOLVED: isAdmin ? ['CLOSED'] : [],
    }[ticket.status] || []

    const statusStyle = getStatusConfig(ticket.status)
    const priorityStyle = getPriorityConfig(ticket.priority)

    return (
        <div className="max-w-2xl pb-12 animate-fade-in space-y-4">
            {/* ── Top Bar ────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-1">
                <button 
                    onClick={() => navigate('/tickets')}
                    className="flex items-center gap-2 text-[12px] font-bold text-[#293898] hover:opacity-70 transition-colors group"
                >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Back to catalog
                </button>
            </div>

            {/* ── Ticket Detail Card ─────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-[#c5c5d4]/15 overflow-hidden transition-all duration-300">
                
                {/* 1. Header Area */}
                <div className="p-6 md:p-8 pb-3 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-2xl font-bold tracking-tight text-[#191c1e] leading-tight font-['Inter']">
                            {ticket.title}
                        </h1>
                        <span className={`${statusStyle.bg} ${statusStyle.text} px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${statusStyle.border} flex-shrink-0 capitalize`}>
                            {ticket.status.replace('_', ' ').toLowerCase()}
                        </span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-[#454652]/70">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-wider">Created On</span>
                                <span className="text-[12px] font-bold text-[#191c1e]">
                                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[#454652]/70">
                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-wider">Location</span>
                                <span className="text-[12px] font-bold text-[#191c1e]">{ticket.resourceOrLocation || 'Main Campus'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Content Body */}
                <div className="px-6 md:px-8 py-4 space-y-6">
                    {/* Description Section (No Header) */}
                    <p className="text-[#191c1e] leading-relaxed text-[14px] font-medium opacity-90 whitespace-pre-wrap">
                        {ticket.description}
                    </p>

                    {/* Activity Log Section (No Header) */}
                    <div className="pt-4 border-t border-[#f2f4f6] space-y-4">
                        <div className="space-y-4">
                            {ticket.comments?.map((c, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${roleColors[c.authorRole] || 'bg-slate-200'}`}>
                                        {c.authorName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-3 mb-0.5">
                                            <span className="text-[12px] font-bold text-[#191c1e]">{c.authorName}</span>
                                            <span className="text-[9px] font-bold text-[#454652]/50 italic">
                                                {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : ''}
                                            </span>
                                        </div>
                                        <div className="bg-[#f2f4f6]/40 p-3 rounded-xl rounded-tl-none border border-[#f2f4f6] text-[13px] font-medium text-[#191c1e]/80">
                                            {c.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comment Input */}
                        {(ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED') && (
                            <form onSubmit={sendComment} className="relative mt-4 group">
                                <textarea
                                    className="w-full px-5 py-4 bg-white border border-[#c5c5d4]/30 rounded-xl text-[13px] font-medium placeholder-[#454652]/30 focus:ring-4 focus:ring-[#293898]/5 focus:border-[#293898]/30 transition-all min-h-[100px] shadow-sm appearance-none"
                                    placeholder="Add internal note..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    className="absolute bottom-3 right-3 w-8 h-8 bg-[#293898] text-white rounded-lg flex items-center justify-center shadow-md shadow-[#293898]/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50" 
                                    disabled={sending || !comment.trim()}
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* 3. Operational Actions Footer */}
                {canUpdate && availableStatuses.length > 0 && (
                    <div className="p-6 md:p-8 pt-2 border-t border-[#f2f4f6] flex flex-col sm:flex-row gap-3">
                        {showAdminActions ? (
                            <>
                                <button 
                                    onClick={() => updateStatus('IN_PROGRESS')}
                                    disabled={updating}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold tracking-wide shadow-md shadow-[#293898]/20 transition-all hover:scale-[1.01] active:scale-95 bg-gradient-to-br from-[#293898] to-[#4351b1] text-xs"
                                >
                                    <span className="material-symbols-outlined text-[18px]">engineering</span>
                                    In Progress
                                </button>
                                <button 
                                    onClick={() => updateStatus('REJECTED')}
                                    disabled={updating}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[#ba1a1a] border border-[#ba1a1a]/20 hover:bg-[#ba1a1a]/5 font-bold tracking-wide transition-all hover:scale-[1.01] active:scale-95 text-xs"
                                >
                                    <span className="material-symbols-outlined text-[18px]">block</span>
                                    Reject
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex gap-3">
                                {availableStatuses.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => updateStatus(s)}
                                        disabled={updating}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold bg-[#191c1e] hover:bg-black transition-all active:scale-95 text-xs"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Update to {s.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#ba1a1a] text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-3 z-[100]">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span className="text-[12px] font-bold">{error}</span>
                    <button onClick={() => setError('')} className="ml-3 font-bold">&times;</button>
                </div>
            )}
        </div>
    )
}



