import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resourceService } from '../services/resourceService'
import { bookingService } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import { 
    AlertCircle, CheckCircle, Search, Calendar, 
    Clock, Users, Building2, MapPin, ArrowRight,
    Wifi, Zap, Info, FlaskConical, Wrench
} from 'lucide-react'

// Color configuration consistent with ResourcesModern, lightened as requested
const TYPE_CONFIG = {
    ROOM: { icon: Building2, label: 'Room', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', bannerBg: 'bg-gradient-to-br from-emerald-400/20 to-emerald-300/20' },
    LAB: { icon: FlaskConical, label: 'Lab', bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', bannerBg: 'bg-gradient-to-br from-violet-400/20 to-violet-300/20' },
    EQUIPMENT: { icon: Wrench, label: 'Equipment', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', bannerBg: 'bg-gradient-to-br from-amber-400/20 to-amber-300/20' },
    DEFAULT: { icon: Building2, label: 'Resource', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', bannerBg: 'bg-gradient-to-br from-slate-200/20 to-slate-100/20' }
}

export default function BookingsModern() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const preselectedId = location.state?.resourceId

    const [resources, setResources] = useState([])
    const [resourceId, setResourceId] = useState(preselectedId || '')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('11:00')
    const [attendees, setAttendees] = useState('')
    const [purpose, setPurpose] = useState('')
    const [loading, setLoading] = useState(false)
    const [resLoading, setResLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        resourceService.getAll({ status: 'ACTIVE' })
            .then(data => {
                setResources(data)
                setResLoading(false)
            })
            .catch(() => setResLoading(false))
    }, [])

    const selectedResource = resources.find(r => String(r.id) === String(resourceId))
    const typeConfig = selectedResource ? (TYPE_CONFIG[selectedResource.type?.toUpperCase()] || TYPE_CONFIG.DEFAULT) : TYPE_CONFIG.DEFAULT
    const TypeIcon = typeConfig.icon

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!resourceId) return setError('Please select a resource.')
        if (!date) return setError('Please select a date.')
        if (startTime >= endTime) return setError('End time must be after start time.')

        setError(''); setSuccess(''); setLoading(true)
        try {
            await bookingService.create({ 
                resourceId: Number(resourceId), 
                date, 
                startTime, 
                endTime, 
                purpose,
                expectedAttendees: attendees ? Number(attendees) : undefined
            })
            setSuccess('Booking submitted! Awaiting admin approval.')
            setTimeout(() => navigate('/my-bookings'), 2000)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking. The slot may already be taken.')
        } finally { setLoading(false) }
    }

    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in bg-[#fdfdfd]">
            
            {/* ── Editorial Header ────────────────────────────────── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white text-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/5 border border-blue-50">
                        <Calendar className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Book a Resource</h1>
                        <p className="text-sm text-slate-500 font-medium font-medium">Reserve campus facilities or equipment for your next event.</p>
                    </div>
                </div>
            </header>

            {/* ── Bento Layout ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Booking Form */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                        <h3 className="text-[15px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            Booking Details
                        </h3>
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-500 border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                           Standard Request
                        </span>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-3 animate-fade-in text-[13px] font-medium">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center gap-3 animate-fade-in text-[13px] font-medium">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Resource Picker */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Select Resource</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <select 
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-200 text-[13px] text-slate-700 appearance-none cursor-pointer transition-all outline-none"
                                        value={resourceId}
                                        onChange={e => setResourceId(e.target.value)}
                                        required
                                    >
                                        <option disabled value="">Choose a facility or equipment...</option>
                                        {resources.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                        {resLoading && <option disabled>Loading resources...</option>}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                        <ArrowRight className="w-4 h-4 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Date</label>
                                    <input 
                                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-200 text-[13px] text-slate-700 transition-all outline-none" 
                                        type="date"
                                        min={today}
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Attendees</label>
                                    <input 
                                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-200 text-[13px] text-slate-700 transition-all outline-none placeholder-slate-300" 
                                        placeholder="e.g. 15" 
                                        type="number"
                                        value={attendees}
                                        onChange={e => setAttendees(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Start Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input 
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-200 text-[13px] text-slate-700 transition-all outline-none" 
                                            type="time"
                                            value={startTime}
                                            onChange={e => setStartTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">End Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input 
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-200 text-[13px] text-slate-700 transition-all outline-none" 
                                            type="time"
                                            value={endTime}
                                            onChange={e => setEndTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Purpose</label>
                                <textarea 
                                    className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-200 text-[13px] text-slate-700 transition-all outline-none resize-none placeholder-slate-300" 
                                    placeholder="Briefly describe the event purpose..." 
                                    rows="4"
                                    value={purpose}
                                    onChange={e => setPurpose(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <button 
                                    disabled={loading}
                                    className={`w-full sm:w-auto px-10 py-3.5 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-400/10 hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-[13px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                                    type="submit"
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/resources')}
                                    className="text-slate-400 font-bold text-[12px] uppercase tracking-wider hover:text-blue-500 transition-colors px-4 py-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Info Panels */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* Lightened Abstract Color Banner Preview */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 group transition-all duration-300">
                        <div className={`relative h-48 rounded-2xl overflow-hidden mb-6 border transition-all duration-500 ${typeConfig.bannerBg} flex flex-col items-center justify-center border-slate-100/30`}>
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
                            
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`p-4 ${typeConfig.bg} rounded-2xl shadow-sm border ${typeConfig.border}`}>
                                    <TypeIcon className={`w-10 h-10 stroke-[2px] ${typeConfig.text}`} />
                                </div>
                                <div className="text-center">
                                    <span className={`${typeConfig.bg} ${typeConfig.text} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-2 inline-block border ${typeConfig.border}`}>
                                        {selectedResource ? typeConfig.label : 'Select Type'}
                                    </span>
                                    <p className="font-bold text-xl leading-tight px-4 truncate max-w-[280px] text-slate-800">
                                        {selectedResource ? selectedResource.name : 'Choose an Asset'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {selectedResource ? (
                            <div className="space-y-4 animate-fade-in px-2">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-lg ${typeConfig.bg} flex items-center justify-center border ${typeConfig.border}`}>
                                        <Users className={`w-4 h-4 ${typeConfig.text}`} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase leading-none mb-1 text-xs">Capacity</p>
                                        <p className="text-[13px] font-bold text-slate-600">{selectedResource.capacity || 'Flexible'} Seats</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                        <Wifi className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase leading-none mb-1 text-xs">Connectivity</p>
                                        <p className="text-[13px] font-bold text-slate-600">Fiber High-Speed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                        <Clock className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase leading-none mb-1 text-xs">Availability</p>
                                        <p className="text-[13px] font-bold text-slate-600">{selectedResource.availabilityStart} - {selectedResource.availabilityEnd}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                                <Info className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300 px-4 leading-relaxed"> Choose a resource to view detailed specifications </p>
                            </div>
                        )}
                    </div>

                    {/* Light-Themed Booking Guidelines */}
                    <div className="bg-blue-50/50 rounded-3xl p-7 border border-blue-100 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Info className="w-4 h-4 text-blue-500" />
                            </div>
                            <h5 className="font-bold text-slate-800 text-[14px]">Booking Guidelines</h5>
                        </div>
                        <p className="text-[12px] text-slate-500 leading-relaxed">
                            Reservations must be made at least 24 hours in advance. For recurring events, please contact the Department Head.
                        </p>
                    </div>

                    {/* Weekly Utilization */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6 px-1">Quota Utilization</p>
                        <div className="space-y-6 px-1">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                                    <span>CREDIT HOURS</span>
                                    <span className="text-blue-500">60%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full">
                                    <div className="h-full bg-blue-400 w-[60%] rounded-full shadow-sm shadow-blue-500/20"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                                    <span>ACTIVE ASSETS</span>
                                    <span className="text-emerald-500">80%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full">
                                    <div className="h-full bg-emerald-400 w-[80%] rounded-full shadow-sm shadow-emerald-500/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
