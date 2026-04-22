export default function StatusBadge({ status }) {
    const s = status?.toUpperCase?.() || ''
    
    const config = {
        // Bookings
        PENDING:    { bg: 'bg-amber-50',  text: 'text-amber-600',  label: 'Pending' },
        APPROVED:   { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Approved' },
        REJECTED:   { bg: 'bg-rose-50',    text: 'text-rose-600',    label: 'Rejected' },
        CANCELLED:  { bg: 'bg-slate-50',   text: 'text-slate-500',   label: 'Cancelled' },
        
        // Tickets
        OPEN:        { bg: 'bg-blue-50',    text: 'text-blue-600',    label: 'Open' },
        IN_PROGRESS: { bg: 'bg-orange-50',  text: 'text-orange-600',  label: 'In Progress' },
        RESOLVED:    { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Resolved' },
        CLOSED:      { bg: 'bg-slate-50',   text: 'text-slate-400',   label: 'Closed' },
        
        // Resources / Users
        ACTIVE:      { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Active' },
        AVAILABLE:   { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Available' },
        OUT_OF_SERVICE: { bg: 'bg-rose-50', text: 'text-rose-600',    label: 'Out of Service' },
        UNAVAILABLE: { bg: 'bg-rose-50',    text: 'text-rose-600',    label: 'Unavailable' },
        MAINTENANCE: { bg: 'bg-amber-50',   text: 'text-amber-600',   label: 'Maintenance' },
    }

    const { bg, text, label } = config[s] || { bg: 'bg-slate-50', text: 'text-slate-500', label: status }

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${bg} ${text}`}>
            {label}
        </span>
    )
}

export function PriorityBadge({ priority }) {
    const config = {
        LOW:      { text: 'text-slate-400',   dot: 'bg-slate-300' },
        MEDIUM:   { text: 'text-slate-500',   dot: 'bg-slate-400' },
        HIGH:     { text: 'text-slate-600',   dot: 'bg-slate-500' },
        CRITICAL: { text: 'text-slate-700',   dot: 'bg-slate-600' },
    }
    const s = priority?.toUpperCase?.() || ''
    const { text, dot } = config[s] || { text: 'text-slate-400', dot: 'bg-slate-300' }

    return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight ${text}`}>
             <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {priority}
        </span>
    )
}
