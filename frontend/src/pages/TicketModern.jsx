import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../context/AuthContext'
import { Plus, X, AlertCircle, Wrench } from 'lucide-react'

const CATEGORIES = ['Equipment Failure', 'Facility Issue', 'Network Issue', 'Electrical', 'Plumbing', 'Safety Hazard', 'Other']

const getStatusColor = (status) => {
    switch (status) {
        case 'OPEN': return 'bg-primary'
        case 'IN_PROGRESS': return 'bg-[#ffb784]'
        case 'RESOLVED': return 'bg-emerald-500'
        case 'CLOSED': return 'bg-slate-400'
        default: return 'bg-primary'
    }
}

const getStatusBadgeStyle = (status) => {
    switch (status) {
        case 'OPEN': return 'bg-blue-50 text-blue-600 border border-blue-100'
        case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border border-amber-100'
        case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        case 'CLOSED': return 'bg-slate-50 text-slate-400 border border-slate-100'
        default: return 'bg-blue-50 text-blue-600'
    }
}

const getPriorityBadge = (priority) => {
    switch (priority) {
        case 'CRITICAL': return 'bg-error-container text-on-error-container'
        case 'HIGH': return 'bg-red-50 text-red-600 border border-red-100'
        case 'MEDIUM': return 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
        case 'LOW': return 'bg-secondary-fixed text-on-secondary-fixed-variant'
        default: return 'bg-secondary-fixed text-on-secondary-fixed-variant'
    }
}

const getCategoryIcon = (category) => {
    switch (category) {
        case 'Equipment Failure': return 'home_repair_service'
        case 'Facility Issue': return 'apartment'
        case 'Network Issue': return 'language'
        case 'Electrical': return 'bolt'
        case 'Plumbing': return 'water_drop'
        case 'Safety Hazard': return 'warning'
        case 'Other': return 'help'
        case 'IT Support': return 'terminal'
        case 'Media Services': return 'videocam'
        default: return 'confirmation_number'
    }
}

const formatDistanceToNow = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now - d) / 60000) // in minutes
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    const hours = Math.floor(diff / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

export default function TicketsModern() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('OPEN')
    const [showModal, setShowModal] = useState(false)

    // Form states
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [resourceOrLocation, setResourceOrLocation] = useState('')
    const [priority, setPriority] = useState('MEDIUM')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => { load() }, [])

    const load = async () => {
        try {
            const data = await ticketService.getAll()
            setTickets(data)
        } catch (err) {
            console.error('Failed to load tickets:', err)
        } finally { setLoading(false) }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        setError(''); setSubmitting(true)
        try {
            await ticketService.create({ title, category, description, resourceOrLocation, priority })
            setShowModal(false)
            setTitle(''); setCategory(''); setDescription(''); setResourceOrLocation(''); setPriority('MEDIUM')
            load()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create ticket')
        } finally { setSubmitting(false) }
    }

    const filteredTickets = tickets.filter(t => t.status === activeTab)

    const tabs = [
        { key: 'OPEN', label: 'Open' },
        { key: 'IN_PROGRESS', label: 'In Progress' },
        { key: 'RESOLVED', label: 'Resolved' },
        { key: 'CLOSED', label: 'Closed' }
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
                        <Wrench className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Support Tickets</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage and track your incident reports in one place.</p>
                    </div>
                </div>
                {(user?.role === 'USER' || user?.role === 'ADMIN') && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Report Issue
                    </button>
                )}
            </header>

            {/* ── Status Filter Tabs (Minimal Editorial Style) ────────── */}
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
                            {tickets.filter(t => t.status === tab.key).length}
                        </span>
                        {activeTab === tab.key && (
                            <span className="absolute bottom-[-1.5px] left-0 w-full h-[3px] bg-blue-600 rounded-full shadow-[0_2px_4px_rgba(37,99,235,0.2)] animate-scale-x" />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Ticket List Results ─────────────────────────────── */}
            <main className="pb-32">
                {filteredTickets.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-24 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">inbox</span>
                        <h3 className="text-base font-semibold text-slate-800 mb-1">Everything is sorted</h3>
                        <p className="text-[13px] text-slate-400">No tickets found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
                        {filteredTickets.map(ticket => (
                            <div 
                                key={ticket.id}
                                onClick={() => navigate(`/tickets/${ticket.id}`)}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 cursor-pointer flex flex-col"
                            >
                                {/* Card Header with Soft Colors */}
                                <div className="p-6 pb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                #{ticket.id?.toString().slice(-4) || '0000'}
                                            </span>
                                        </div>
                                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full capitalize tracking-tight ${getStatusBadgeStyle(ticket.status)}`}>
                                            {ticket.status.toLowerCase().replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-[17px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-4">
                                        {ticket.title}
                                    </h3>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 bg-blue-50/50 px-3.5 py-2 rounded-xl border border-blue-100/50">
                                            <span className="material-symbols-outlined text-[18px] text-blue-600">
                                                {getCategoryIcon(ticket.category)}
                                            </span>
                                            <span className="text-[11px] font-bold text-blue-700">{ticket.category}</span>
                                        </div>
                                        {ticket.resourceOrLocation && (
                                            <div className="flex items-center gap-2 bg-slate-50/70 px-3.5 py-2 rounded-xl border border-slate-100">
                                                <span className="material-symbols-outlined text-[18px] text-slate-400">location_on</span>
                                                <span className="text-[11px] font-bold text-slate-600 truncate max-w-[140px]">
                                                    {ticket.resourceOrLocation}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center group-hover:bg-blue-50/30 transition-colors">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(ticket.status)}`} />
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">
                                            Last update: {formatDistanceToNow(ticket.updatedAt || ticket.createdAt)}
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-400 transition-colors">chevron_right</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Ticket Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal max-w-xl">
                        <div className="modal-header">
                            <h3 className="modal-title">Report an Issue</h3>
                            <button className="btn-icon w-8 h-8" onClick={() => setShowModal(false)}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="modal-body space-y-4">
                                {error && (
                                    <div className="alert-error">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label required">Title</label>
                                    <input className="form-control" placeholder="Short description of the issue"
                                        value={title} onChange={e => setTitle(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label required">Category</label>
                                        <select className="form-control" value={category}
                                            onChange={e => setCategory(e.target.value)} required>
                                            <option value="">Select...</option>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label required">Priority</label>
                                        <select className="form-control" value={priority}
                                            onChange={e => setPriority(e.target.value)}>
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="CRITICAL">Critical</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location / Resource Affected</label>
                                    <input className="form-control" placeholder="e.g. CS Lab 01, Building 2"
                                        value={resourceOrLocation} onChange={e => setResourceOrLocation(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required">Description</label>
                                    <textarea className="form-control" rows={4}
                                        placeholder="Describe the issue in detail..."
                                        value={description} onChange={e => setDescription(e.target.value)} required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
