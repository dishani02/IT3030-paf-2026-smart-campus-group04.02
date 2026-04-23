import { useState, useEffect } from 'react'
import { Clock, CheckCircle, Zap } from 'lucide-react'

export default function SLATimer({ createdAt, firstResponseAt, resolvedAt }) {
    const [elapsed, setElapsed] = useState('')

    useEffect(() => {
        // Only run timer if not resolved
        if (resolvedAt) {
            setElapsed(formatDuration(new Date(createdAt), new Date(resolvedAt)))
            return
        }

        const interval = setInterval(() => {
            setElapsed(formatDuration(new Date(createdAt), new Date()))
        }, 1000)

        return () => clearInterval(interval)
    }, [createdAt, firstResponseAt, resolvedAt])

    function formatDuration(start, end) {
        const diff = Math.max(0, end - start)
        const hrs = Math.floor(diff / (1000 * 60 * 60))
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const secs = Math.floor((diff % (1000 * 60)) / 1000)
        
        let str = ''
        if (hrs > 0) str += `${hrs}h `
        str += `${mins}m ${secs}s`
        return str
    }

    if (resolvedAt) {
        return (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Total Resolution Time</p>
                    <p className="text-sm font-bold">{elapsed}</p>
                </div>
            </div>
        )
    }

    if (firstResponseAt) {
        const responseTime = formatDuration(new Date(createdAt), new Date(firstResponseAt))
        return (
            <div className="flex items-center gap-3 p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400">
                <Zap className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">First Response</p>
                    <p className="text-sm font-bold">{responseTime}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Ongoing</p>
                    <p className="text-xs font-mono">{elapsed}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
            <Clock className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Waiting for Response</p>
                <p className="text-lg font-black font-mono leading-none mt-1">{elapsed}</p>
            </div>
        </div>
    )
}
