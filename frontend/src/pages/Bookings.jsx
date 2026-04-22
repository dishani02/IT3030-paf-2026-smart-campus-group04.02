import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resourceService } from '../services/resourceService'
import { bookingService } from '../services/bookingService'
import { CalendarDays, Clock, Users, AlertCircle, CheckCircle, MapPin, Info, Building2 } from 'lucide-react'

export default function Bookings() {
    const location = useLocation()
    const navigate = useNavigate()
    const preselectedId = location.state?.resourceId

    const [resources, setResources] = useState([])
    const [resourceId, setResourceId] = useState(preselectedId || '')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('11:00')
    const [purpose, setPurpose] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        resourceService.getAll({ status: 'ACTIVE' }).then(setResources).catch(() => { })
    }, [])

    const selectedResource = resources.find(r => String(r.id) === String(resourceId))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!resourceId) return setError('Please select a resource.')
        if (!date) return setError('Please select a date.')
        if (startTime >= endTime) return setError('End time must be after start time.')

        setError(''); setSuccess(''); setLoading(true)
        try {
            await bookingService.create({ resourceId: Number(resourceId), date, startTime, endTime, purpose })
            setSuccess('Booking submitted! Awaiting admin approval.')
            setTimeout(() => navigate('/my-bookings'), 2000)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking. The slot may already be taken.')
        } finally { setLoading(false) }
    }

    const today = new Date().toISOString().split('T')[0]

    const steps = [
        'Submit your booking request',
        'Admin reviews and approves or rejects',
        'You receive a notification with the decision',
        'Approved bookings confirm your reservation',
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Book a Resource</h1>
                    <p className="page-subtitle">Submit a booking request for a campus facility or equipment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Form ─────────────────────────────── */}
                <div className="lg:col-span-2 card">
                    <h2 className="text-base font-bold text-slate-900 mb-5">Booking Details</h2>

                    {error && <div className="alert-error mb-4">      <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
                    {success && <div className="alert-success mb-4"><CheckCircle className="w-4 h-4 flex-shrink-0" />{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-group">
                            <label className="form-label required">Select Resource</label>
                            <select
                                className="form-control"
                                value={resourceId}
                                onChange={e => setResourceId(e.target.value)}
                                required
                            >
                                <option value="">Choose a resource...</option>
                                {resources.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.name} — {r.type} · {r.location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Date</label>
                            <input
                                type="date" className="form-control"
                                min={today} value={date}
                                onChange={e => setDate(e.target.value)} required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label required">Start Time</label>
                                <input type="time" className="form-control" value={startTime}
                                    onChange={e => setStartTime(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label required">End Time</label>
                                <input type="time" className="form-control" value={endTime}
                                    onChange={e => setEndTime(e.target.value)} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Purpose / Description</label>
                            <textarea
                                className="form-control" rows={4}
                                placeholder="What is this booking for?"
                                value={purpose}
                                onChange={e => setPurpose(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4" /> Submit Request
                                    </span>
                                )}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/resources')}>
                                Browse Resources
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Sidebar Info ────────────────────────── */}
                <div className="space-y-4">
                    {selectedResource ? (
                        <div className="card border-sky-500/20">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-slate-600" />
                                Selected Resource
                            </h3>
                            <div className="mb-3">
                                <p className="text-base font-bold text-slate-900">{selectedResource.name}</p>
                                <span className="badge-primary text-[10px] mt-1">{selectedResource.type}</span>
                            </div>
                            <div className="space-y-2 text-sm text-slate-400">
                                {selectedResource.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                                        {selectedResource.location}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-slate-600" />
                                    Capacity: {selectedResource.capacity || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                                    {selectedResource.availabilityStart} – {selectedResource.availabilityEnd}
                                </div>
                            </div>
                            {selectedResource.description && (
                                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                    {selectedResource.description}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="card border-dashed border-slate-700 flex flex-col items-center justify-center py-8 text-center">
                            <CalendarDays className="w-10 h-10 text-slate-700 mb-3" />
                            <p className="text-sm text-slate-500">Select a resource to see details</p>
                        </div>
                    )}

                    {/* How it Works */}
                    <div className="card">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4 text-slate-600" />
                            How Booking Works
                        </h3>
                        <ol className="space-y-3">
                            {steps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="w-5 h-5 rounded-full bg-sky-600/20 border border-sky-500/30 text-sky-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-xs text-slate-400 leading-relaxed">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}



