import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resourceService } from '../services/resourceService'
import { MapPin, Users, Clock, Search, Filter } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ResourceForm from '../components/ResourceForm'
import ConfirmDelete from '../components/ConfirmDelete'

const TYPE_ICONS = { ROOM: '🏛', LAB: '🔬', EQUIPMENT: '🔧' }

export default function Resources() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [showInactive, setShowInactive] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => { loadResources() }, [])

    const loadResources = async (params = {}) => {
        setLoading(true)
        try {
            const data = await resourceService.getAll(params)
            setResources(data)
        } finally { setLoading(false) }
    }

    const filtered = resources.filter(r => {
        const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
            (r.location || '').toLowerCase().includes(search.toLowerCase())
        const matchType = !typeFilter || r.type === typeFilter
        const matchStatus = showInactive || r.status === 'ACTIVE'
        return matchSearch && matchType && matchStatus
    })

    const handleBook = (resource) => {
        navigate('/bookings', { state: { resourceId: resource.id } })
    }

    const openCreate = () => { setEditing(null); setShowForm(true) }
    const openEdit = (r) => { setEditing(r); setShowForm(true) }

    const handleSaved = () => { setShowForm(false); loadResources() }

    const confirmDelete = (r) => { setDeletingId(r.id); setShowConfirm(true) }

    const handleDelete = async () => {
        if (!deletingId) return
        try {
            await resourceService.delete(deletingId)
            setShowConfirm(false)
            setDeletingId(null)
            loadResources()
        } catch (err) {
            console.error(err)
            if (err.response?.status === 409) alert('Cannot delete — active bookings exist')
            else alert(err.response?.data?.message || 'Delete failed')
        }
    }

    const toggleStatus = async (r) => {
        const next = r.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE'
        try {
            await resourceService.update(r.id, { status: next })
            loadResources()
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.message || 'Status update failed')
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Campus Resources</div>
                    <div className="page-subtitle">Browse available facilities, labs, and equipment</div>
                </div>
            </div>

            <div className="filter-bar">
                <div className="search-input-wrapper">
                    <Search />
                    <input
                        className="form-control"
                        placeholder="Search resources..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select className="select-control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="ROOM">Room</option>
                    <option value="LAB">Lab</option>
                    <option value="EQUIPMENT">Equipment</option>
                </select>
                <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} />
                    Show out of service
                </label>
                <div className="ml-auto flex gap-2 items-center">
                    <div className="text-sm text-gray-500">{filtered.length} resource{filtered.length !== 1 ? 's' : ''} found</div>
                    {user?.role === 'ADMIN' && (
                        <button className="btn btn-primary btn-sm" onClick={openCreate}>Add Resource</button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <Search size={36} />
                    <div className="empty-state-title">No resources found</div>
                    <div className="empty-state-desc">Try adjusting your search or filters</div>
                </div>
            ) : (
                <div className="resource-grid">
                    {filtered.map(r => (
                        <div key={r.id} className="resource-card">
                            <div className="resource-card-header">
                                <div className={`resource-type-icon ${r.type?.toLowerCase()}`}>
                                    {r.type === 'ROOM' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg> :
                                        r.type === 'LAB' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-4" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg> :
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-gray-800">{r.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{r.type}</div>
                                </div>
                                <span className={`status-badge ${r.status === 'ACTIVE' ? 'approved' : 'cancelled'}`}>
                                    {r.status === 'ACTIVE' ? 'Available' : 'Out of Service'}
                                </span>
                            </div>

                            <div className="resource-card-body">
                                {r.description && (
                                    <p className="text-sm text-gray-600 mb-2.5 leading-relaxed">
                                        {r.description}
                                    </p>
                                )}
                                <div className="resource-meta">
                                    {r.location && (
                                        <div className="resource-meta-item"><MapPin />{r.location}</div>
                                    )}
                                    {r.capacity && (
                                        <div className="resource-meta-item"><Users />Capacity: {r.capacity}</div>
                                    )}
                                    {r.availabilityStart && (
                                        <div className="resource-meta-item">
                                            <Clock />{r.availabilityStart} – {r.availabilityEnd}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="resource-card-actions">
                                {(user?.role === 'USER' || user?.role === 'ADMIN') && (
                                    <button
                                        className="btn btn-primary btn-sm flex-1 justify-center"
                                        disabled={r.status !== 'ACTIVE'}
                                        onClick={() => handleBook(r)}
                                    >
                                        Book Now
                                    </button>
                                )}

                                {user?.role === 'ADMIN' && (
                                    <div className="flex gap-2 ml-2">
                                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}>Edit</button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(r)}>{r.status === 'ACTIVE' ? 'Mark OUT_OF_SERVICE' : 'Mark ACTIVE'}</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(r)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
                    <div className="w-full max-w-2xl bg-white rounded-lg p-5">
                        <div className="flex justify-between items-center mb-3">
                            <div className="font-bold">{editing ? 'Edit Resource' : 'Create Resource'}</div>
                            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Close</button>
                        </div>
                        <ResourceForm resource={editing} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
                    </div>
                </div>
            )}

            {showConfirm && (
                <ConfirmDelete
                    title="Delete resource?"
                    description="Deleting a resource is irreversible."
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleDelete}
                    loading={false}
                />
            )}
        </div>
    )
}
