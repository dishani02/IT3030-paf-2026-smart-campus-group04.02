import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
    ShieldCheck, CheckCircle, X, UserCheck, Plus, 
    Edit2, Trash2, AlertCircle, Filter, Search, Users,
    LayoutDashboard, Activity, Settings, Building2, Wrench
} from 'lucide-react'
import { bookingService } from '../services/bookingService'
import { ticketService } from '../services/ticketService'
import { resourceService } from '../services/resourceService'
import { userService } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'
import ConfirmDelete from '../components/ConfirmDelete'
import ImageUploadArea from '../components/ImageUploadArea'
import GalleryModal from '../components/GalleryModal'

const TABS = [
    { label: 'Pending Bookings', icon: Activity },
    { label: 'All Bookings', icon: LayoutDashboard },
    { label: 'Tickets', icon: Wrench },
    { label: 'Resources', icon: Building2 },
    { label: 'Users', icon: Users }
]

export default function AdminPanel() {
    const { user } = useAuth()
    const location = useLocation()
    const [tab, setTab] = useState(0)
    const [bookings, setBookings] = useState([])
    const [tickets, setTickets] = useState([])
    const [resources, setResources] = useState([])
    const [users, setUsers] = useState([])
    const [userFilter, setUserFilter] = useState('ALL')
    const [userSearch, setUserSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [userError, setUserError] = useState('')
    const [rejectModal, setRejectModal] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [assignModal, setAssignModal] = useState(null)
    const [techId, setTechId] = useState('')
    const [resourceModal, setResourceModal] = useState(null)
    const [resourceForm, setResourceForm] = useState({ name: '', type: 'ROOM', capacity: '', location: '', description: '', availabilityStart: '08:00', availabilityEnd: '21:00', status: 'ACTIVE', images: [] })
    const [actionError, setActionError] = useState('')
    const [showServerConflict, setShowServerConflict] = useState(false)
    const [serverConflictMessage, setServerConflictMessage] = useState('')
    const [bookingToCancel, setBookingToCancel] = useState(null)
    const [bookingToDelete, setBookingToDelete] = useState(null)
    const [resourceToDelete, setResourceToDelete] = useState(null)
    const [userToDelete, setUserToDelete] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        loadAll()
    }, [])

    const loadAll = async () => {
        setLoading(true)
        try {
            const [b, t, r] = await Promise.all([
                bookingService.getAll().catch(() => []),
                ticketService.getAll().catch(() => []),
                resourceService.getAll().catch(() => []),
            ])
            setBookings(b); setTickets(t); setResources(r);

            try {
                const u = await userService.getAll()
                setUsers(u)
                setUserError('')
            } catch (err) {
                setUserError(`DB Failed: Could not load users.`)
                setUsers([])
            }
        } finally { setLoading(false) }
    }

    const approve = async (id) => {
        try {
            await bookingService.approve(id)
            await loadAll()
        } catch (e) {
            const msg = e.response?.data?.message || 'Failed'
            if (e.response?.status === 409) { setServerConflictMessage(msg); setShowServerConflict(true) }
            else alert(msg)
            await loadAll()
        }
    }

    const reject = async () => {
        try {
            const b = await bookingService.reject(rejectModal, rejectReason)
            setBookings(prev => prev.map(x => x.id === rejectModal ? b : x))
            setRejectModal(null); setRejectReason('')
        } catch (e) { alert(e.response?.data?.message || 'Failed') }
    }

    const cancelBooking = async () => {
        if (!bookingToCancel) return
        const id = bookingToCancel.id
        setActionLoading(true)
        try {
            await bookingService.cancel(id)
            setBookingToCancel(null)
            await loadAll()
        } catch (e) { alert(e.response?.data?.message || 'Failed to cancel') }
        finally { setActionLoading(false) }
    }

    const deleteBooking = async () => {
        if (!bookingToDelete) return
        const id = bookingToDelete.id
        setActionLoading(true)
        try {
            await bookingService.delete(id)
            setBookingToDelete(null)
            await loadAll()
        } catch (e) { alert(e.response?.data?.message || 'Failed to delete') }
        finally { setActionLoading(false) }
    }

    const assign = async () => {
        if (!techId) return
        try {
            const t = await ticketService.assign(assignModal, Number(techId))
            setTickets(prev => prev.map(x => x.id === assignModal ? t : x))
            setAssignModal(null); setTechId('')
        } catch (e) { setActionError(e.response?.data?.message || 'Failed to assign') }
    }

    const handleDeleteTicket = async (id) => {
        if (!confirm('Are you sure you want to permanently delete this ticket?')) return
        setActionLoading(true)
        try {
            await ticketService.delete(id)
            setTickets(prev => prev.filter(t => t.id !== id))
        } catch (e) { alert(e.response?.data?.message || 'Failed to delete ticket') }
        finally { setActionLoading(false) }
    }

    const deleteResource = async () => {
        if (!resourceToDelete) return
        const id = resourceToDelete.id
        setActionLoading(true)
        try { 
            await resourceService.delete(id)
            setResources(prev => prev.filter(r => r.id !== id))
            setResourceToDelete(null)
        } catch (e) { alert(e.response?.data?.message || 'Failed') }
        finally { setActionLoading(false) }
    }

    const deleteUser = async () => {
        if (!userToDelete) return
        const id = userToDelete.id
        setActionLoading(true)
        try {
            await userService.delete(id)
            setUsers(prev => prev.filter(u => u.id !== id))
            setUserToDelete(null)
        } catch (e) { alert(e.response?.data?.message || 'Failed to delete user') }
        finally { setActionLoading(false) }
    }

    const openResourceModal = (resource = null) => {
        if (resource) {
            setResourceForm({ name: resource.name, type: resource.type, capacity: resource.capacity || '', location: resource.location || '', description: resource.description || '', availabilityStart: resource.availabilityStart || '08:00', availabilityEnd: resource.availabilityEnd || '21:00', status: resource.status, images: resource.images || [] })
            setResourceModal(resource.id)
        } else {
            setResourceForm({ name: '', type: 'ROOM', capacity: '', location: '', description: '', availabilityStart: '08:00', availabilityEnd: '21:00', status: 'ACTIVE', images: [] })
            setResourceModal('new')
        }
        setActionError('')
    }

    const saveResource = async (e) => {
        e.preventDefault(); setActionError('')
        const payload = { ...resourceForm, capacity: Number(resourceForm.capacity) || null }
        try {
            if (resourceModal === 'new') { 
                const r = await resourceService.create(payload); 
                setResources(prev => [...prev, r]);
                if (resourceForm.newImages && resourceForm.newImages.length > 0) {
                    for (const file of resourceForm.newImages) {
                        await resourceService.uploadImage(r.id, file);
                    }
                    await loadAll();
                }
            } else { 
                const r = await resourceService.update(resourceModal, payload); 
                setResources(prev => prev.map(x => x.id === resourceModal ? r : x));
                if (resourceForm.newImages && resourceForm.newImages.length > 0) {
                    for (const file of resourceForm.newImages) {
                        await resourceService.uploadImage(resourceModal, file);
                    }
                    await loadAll();
                }
            }
            setResourceModal(null)
        } catch (e) { setActionError(e.response?.data?.message || 'Failed to save resource') }
    }

    const handleUploadImage = (files) => {
        setResourceForm(p => ({ ...p, newImages: [...(p.newImages || []), ...files] }));
    }

    const handleDeleteImage = async (imageUrl) => {
        if (resourceModal === 'new') return; // Not supported before creation
        try {
            await resourceService.deleteImage(resourceModal, imageUrl);
            setResourceForm(p => ({ ...p, images: p.images.filter(img => img !== imageUrl) }));
            await loadAll();
        } catch (e) { alert('Failed to delete image') }
    }

    const toMinutes = (t) => { if (!t) return null; const [hh, mm] = ('' + t).split(':').map(Number); return hh * 60 + mm }
    const conflictMap = new Map()
    try {
        const approved = bookings.filter(b => b.status === 'APPROVED')
        for (const p of bookings.filter(b => b.status === 'PENDING')) {
            const pS = toMinutes(p.startTime), pE = toMinutes(p.endTime)
            const c = approved.find(a => a.resourceId === p.resourceId && a.date === p.date && toMinutes(a.startTime) < pE && pS < toMinutes(a.endTime))
            if (c) conflictMap.set(p.id, c)
        }
    } catch { }

    const pending = bookings.filter(b => b.status === 'PENDING')
    const isReadOnly = user.role === 'OPERATIONS'

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-12" style={{ fontFamily: "'SF Pro Display', 'Inter', sans-serif" }}>
            
            {/* ── Admin Header ────────────────────────────────────────── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white text-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/5 border border-blue-50">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Admin Operations</h1>
                        <p className="text-sm text-slate-500 font-medium">Platform-wide management and campus intelligence dashboard</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button onClick={loadAll} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                        <Activity className={`w-5 h-5 ${actionLoading ? 'animate-spin' : ''}`} />
                    </button>
                    {tab === 3 && !isReadOnly && (
                        <button onClick={() => openResourceModal()} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Resource
                        </button>
                    )}
                </div>
            </header>

            {/* ── Standardized Tabs ─────────────────────────────────── */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-2xl w-fit">
                {TABS.map((t, i) => (
                    <button 
                        key={t.label} 
                        onClick={() => setTab(i)} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${tab === i ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                        {i === 0 && pending.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{pending.length}</span>}
                    </button>
                ))}
            </div>

            <main className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
                
                {/* ── PENDING & ALL BOOKINGS ──────────────────── */}
                {(tab === 0 || tab === 1) && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                    <th className="px-6 py-4 text-left">Facility</th>
                                    <th className="px-6 py-4 text-left">Academic User</th>
                                    <th className="px-6 py-4 text-left">Schedule</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    {!isReadOnly && <th className="px-6 py-4 text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {(tab === 0 ? pending : bookings).map(b => (
                                    <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900">{b.resourceName}</p>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">{b.resourceLocation}</p>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <p className="font-bold text-slate-900">{b.userName}</p>
                                            <p className="text-xs text-slate-400">{b.userEmail}</p>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <p className="font-medium text-slate-800">{b.date}</p>
                                            <p className="text-xs text-slate-400 font-bold">{b.startTime} - {b.endTime}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={b.status} />
                                        </td>
                                        {!isReadOnly && (
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    {b.status === 'PENDING' && (
                                                        <>
                                                            <button 
                                                                onClick={() => approve(b.id)} 
                                                                disabled={!!conflictMap.get(b.id)}
                                                                className={`p-2 rounded-lg transition-all ${conflictMap.has(b.id) ? 'bg-slate-50 text-slate-300' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                            >
                                                                <CheckCircle className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => setRejectModal(b.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all">
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {(b.status === 'APPROVED') && (
                                                        <button onClick={() => setBookingToCancel(b)} className="px-3 py-1.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg text-[11px] font-bold hover:bg-rose-50 hover:text-rose-600 transition-all">
                                                            Cancel
                                                        </button>
                                                    )}
                                                    <button onClick={() => setBookingToDelete(b)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all ml-1" title="Delete Booking">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── TICKETS MANAGEMENT ──────────────────────── */}
                {tab === 2 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                    <th className="px-6 py-4 text-left">Incident Title</th>
                                    <th className="px-6 py-4 text-left">Category</th>
                                    <th className="px-6 py-4 text-left">Urgency</th>
                                    <th className="px-6 py-4 text-left">State</th>
                                    <th className="px-6 py-4 text-left">Assignee</th>
                                    {!isReadOnly && <th className="px-6 py-4"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(t => (
                                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900">{t.title}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">#{t.id} • {t.reporterName}</p>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{t.category}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <PriorityBadge priority={t.priority} />
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <StatusBadge status={t.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            {t.assignedTechnicianName ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                        {t.assignedTechnicianName[0]}
                                                    </div>
                                                    <p className="font-bold text-slate-700 text-xs">{t.assignedTechnicianName}</p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 italic text-xs font-medium">Unclaimed</span>
                                            )}
                                        </td>
                                        {!isReadOnly && (
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {t.status !== 'CLOSED' && (
                                                        <button onClick={() => setAssignModal(t.id)} className="text-blue-600 font-bold hover:underline text-xs">Assign</button>
                                                    )}
                                                    <button onClick={() => handleDeleteTicket(t.id)} className="text-[#c5c5d4] hover:text-rose-500 transition-colors" title="Delete Ticket">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── RESOURCES MANAGEMENT ────────────────────── */}
                {tab === 3 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                    <th className="px-6 py-4 text-left">Resource Hub</th>
                                    <th className="px-6 py-4 text-left">Class</th>
                                    <th className="px-6 py-4 text-left">Sizing</th>
                                    <th className="px-6 py-4 text-left">Operational State</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map(r => (
                                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900">{r.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{r.location}</p>
                                        </td>
                                        <td className="px-6 py-5 text-slate-600 font-bold text-xs uppercase">{r.type}</td>
                                        <td className="px-6 py-5 text-slate-600 font-bold text-xs">{r.capacity || '—'} pax</td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={r.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openResourceModal(r)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => setResourceToDelete(r)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── USERS DIRECTORY ─────────────────────────── */}
                {tab === 4 && (
                    <div className="space-y-0">
                        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                                {['ALL', 'USER', 'STAFF', 'TECHNICIAN', 'OPERATIONS', 'ADMIN'].map(f => (
                                    <button 
                                        key={f} 
                                        onClick={() => setUserFilter(f)} 
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${userFilter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-200'}`}
                                    >
                                        {f === 'USER' ? 'STUDENTS' : f}
                                    </button>
                                ))}
                            </div>
                            <div className="relative md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Find users..." 
                                    value={userSearch} 
                                    onChange={e => setUserSearch(e.target.value)} 
                                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium" 
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                        <th className="px-6 py-4 text-left">Academic Identity</th>
                                        <th className="px-6 py-4 text-left">Status Badge</th>
                                        <th className="px-6 py-4 text-left">Verified Role</th>
                                        <th className="px-6 py-4 text-right">System ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users
                                        .filter(u => (userFilter === 'ALL' || u.role === userFilter))
                                        .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                                        .map(u => (
                                            <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <p className="font-bold text-slate-900">{u.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
                                                        Active
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs font-bold text-slate-700 capitalize">{u.role === 'USER' ? 'Student' : u.role.toLowerCase()}</p>
                                                </td>
                                                <td className="px-6 py-5 text-right font-mono text-[10px] text-slate-400 font-bold flex items-center justify-end gap-3">
                                                    #{u.id}
                                                    {!isReadOnly && u.id !== user.id && (
                                                        <button onClick={() => setUserToDelete(u)} className="text-[#c5c5d4] hover:text-rose-500 transition-colors ml-2" title="Delete User">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* ── MODALS ─────────────────────────────────────────── */}
            
            {/* REJECT MODAL */}
            {rejectModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title flex items-center gap-2"><div className="w-2 h-6 bg-rose-500 rounded-full" /> Reject Request</h3>
                            <button className="p-2 hover:bg-slate-100 rounded-xl" onClick={() => setRejectModal(null)}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="modal-body space-y-4">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Rejection Reason</label>
                            <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 min-h-[120px]" 
                                value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Provide context for the rejection..." />
                        </div>
                        <div className="modal-footer">
                            <button className="px-5 py-2.5 text-sm font-bold text-slate-500" onClick={() => setRejectModal(null)}>Dismiss</button>
                            <button onClick={reject} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-600/20 hover:bg-rose-700">Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            )}

            {/* RESOURCE MODAL */}
            {resourceModal && (
                <div className="modal-overlay">
                    <div className="modal max-w-2xl">
                        <div className="modal-header">
                            <h3 className="modal-title flex items-center gap-2"><div className="w-2 h-6 bg-blue-600 rounded-full" /> {resourceModal === 'new' ? 'New Hub Resource' : 'Edit Resource'}</h3>
                            <button className="p-2 hover:bg-slate-100 rounded-xl" onClick={() => setResourceModal(null)}><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={saveResource}>
                            <div className="modal-body grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="col-span-2 md:col-span-1 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Internal Name</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600" 
                                        value={resourceForm.name} onChange={e => setResourceForm(p => ({ ...p, name: e.target.value }))} required />
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Resource Category</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600" 
                                        value={resourceForm.type} onChange={e => setResourceForm(p => ({ ...p, type: e.target.value }))}>
                                        <option value="ROOM">Room</option>
                                        <option value="LAB">Laboratory</option>
                                        <option value="EQUIPMENT">Field Equipment</option>
                                    </select>
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Physical Location</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600" 
                                        value={resourceForm.location} onChange={e => setResourceForm(p => ({ ...p, location: e.target.value }))} />
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Optimal Capacity</label>
                                    <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600" 
                                        value={resourceForm.capacity} onChange={e => setResourceForm(p => ({ ...p, capacity: e.target.value }))} />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600" 
                                        value={resourceForm.status} onChange={e => setResourceForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="ACTIVE">System Active</option>
                                        <option value="OUT_OF_SERVICE">Out of Service</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-1.5 mt-4 border-t border-slate-100 pt-4">
                                    <ImageUploadArea 
                                        images={resourceForm.images} 
                                        onUpload={handleUploadImage}
                                        onDelete={handleDeleteImage}
                                        maxImages={5}
                                    />
                                    {resourceForm.newImages && resourceForm.newImages.length > 0 && (
                                        <p className="text-xs text-blue-600 font-bold mt-2">
                                            {resourceForm.newImages.length} new image(s) ready to upload on save.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="px-5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all" onClick={() => setResourceModal(null)}>Cancel</button>
                                <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700">Commit Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ASSIGN MODAL */}
            {assignModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title flex items-center gap-2"><div className="w-2 h-6 bg-blue-600 rounded-full" /> Assign Specialist</h3>
                            <button className="p-2 hover:bg-slate-100 rounded-xl" onClick={() => setAssignModal(null)}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="modal-body space-y-4">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Select Technician</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600" 
                                value={techId} onChange={e => setTechId(e.target.value)}>
                                <option value="">Select Available Staff...</option>
                                {users.filter(u => u.role === 'TECHNICIAN' || u.role === 'OPERATIONS').map(u => (
                                    <option key={u.id} value={u.id}>{u.name} (ID: #{u.id})</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button className="px-5 py-2.5 text-sm font-bold text-slate-500" onClick={() => setAssignModal(null)}>Cancel</button>
                            <button onClick={assign} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700" disabled={!techId}>Update Assignee</button>
                        </div>
                    </div>
                </div>
            )}

            {bookingToCancel && (
                <ConfirmDelete title="Cancel Booking" description="Are you sure you want to cancel this booking?" onConfirm={cancelBooking} onCancel={() => setBookingToCancel(null)} loading={actionLoading} confirmText="Confirm Cancellation" confirmClass="bg-rose-600 text-white hover:bg-rose-700 px-6 py-2.5 rounded-xl font-bold text-sm" />
            )}

            {bookingToDelete && (
                <ConfirmDelete title="Delete Booking" description="Are you sure you want to permanently delete this booking? This action cannot be undone." onConfirm={deleteBooking} onCancel={() => setBookingToDelete(null)} loading={actionLoading} confirmText="Delete Permanently" confirmClass="bg-rose-600 text-white hover:bg-rose-700 px-6 py-2.5 rounded-xl font-bold text-sm" />
            )}
            
            {resourceToDelete && (
                <ConfirmDelete title="Remove Resource" description={`Are you sure you want to remove "${resourceToDelete.name}"? This action cannot be undone.`} onConfirm={deleteResource} onCancel={() => setResourceToDelete(null)} loading={actionLoading} confirmText="Remove Resource" confirmClass="bg-rose-600 text-white hover:bg-rose-700 px-6 py-2.5 rounded-xl font-bold text-sm" />
            )}

            {userToDelete && (
                <ConfirmDelete title="Delete User" description={`Are you sure you want to permanently delete user "${userToDelete.name}"? This action cannot be undone.`} onConfirm={deleteUser} onCancel={() => setUserToDelete(null)} loading={actionLoading} confirmText="Delete User" confirmClass="bg-rose-600 text-white hover:bg-rose-700 px-6 py-2.5 rounded-xl font-bold text-sm" />
            )}
        </div>
    )
}
