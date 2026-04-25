import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../context/AuthContext'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'
import { Wrench, Plus, X, AlertCircle } from 'lucide-react'

const CATEGORIES = ['Equipment Failure', 'Facility Issue', 'Network Issue', 'Electrical', 'Plumbing', 'Safety Hazard', 'Other']

export default function Tickets() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

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

    const subtitle = user.role === 'USER' ? 'Your submitted incident reports'
        : user.role === 'TECHNICIAN' ? 'Tickets assigned to you'
            : 'All maintenance and incident tickets'

    if (loading) return <div className="loading-spinner"><div className="spinner" /></div>

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title text-slate-900">Maintenance Tickets</h1>
                    <p className="page-subtitle text-slate-500 font-medium">{subtitle}</p>
                </div>
                {(user.role === 'USER' || user.role === 'ADMIN') && (
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <Plus className="w-4 h-4" /> Report Issue
                    </button>
                )}
            </div>

            {tickets.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <Wrench className="empty-state-icon" style={{ width: '48px', height: '48px' }} />
                        <p className="empty-state-title">No tickets found</p>
                        <p className="empty-state-desc">
                            {user.role === 'TECHNICIAN' ? 'No tickets assigned to you yet' : 'No maintenance issues reported yet'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50">
                        <h2 className="text-sm font-bold text-slate-900">{tickets.length} Ticket{tickets.length !== 1 ? 's' : ''}</h2>
                    </div>
                    <div className="table-wrapper border-0 rounded-none">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th className="text-center">Priority</th>
                                    <th className="text-center">Status</th>
                                    <th>Reporter</th>
                                    <th>Technician</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(t => (
                                    <tr key={t.id} className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate(`/tickets/${t.id}`)}>
                                        <td>
                                            <div className="font-bold text-slate-900">{t.title}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">#{t.id}</div>
                                        </td>
                                        <td className="text-slate-700 font-medium">{t.category}</td>
                                        <td>
                                            <p className="max-w-[120px] truncate text-slate-600 font-medium">{t.resourceOrLocation || '—'}</p>
                                        </td>
                                        <td className="text-center"><PriorityBadge priority={t.priority} /></td>
                                        <td className="text-center"><StatusBadge status={t.status} /></td>
                                        <td className="text-slate-700 font-medium">{t.reporterName}</td>
                                        <td>
                                            {t.assignedTechnicianName
                                                ? <span className="text-slate-700 font-medium">{t.assignedTechnicianName}</span>
                                                : <span className="badge-neutral">Unassigned</span>
                                            }
                                        </td>
                                        <td className="text-slate-400 whitespace-nowrap text-[10px] font-medium">
                                            {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
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
