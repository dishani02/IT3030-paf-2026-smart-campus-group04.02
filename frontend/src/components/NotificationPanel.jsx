import { useState, useEffect } from 'react'
import { X, Bell, CheckCheck, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { notificationService } from '../services/notificationService'

export default function NotificationPanel({ isOpen, onClose }) {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) loadNotifications()
    }, [isOpen])

    const loadNotifications = async () => {
        setLoading(true)
        try {
            const data = await notificationService.getAll()
            setNotifications(Array.isArray(data) ? data : [])
        } catch {
            setNotifications([])
        } finally {
            setLoading(false)
        }
    }

    const markRead = async (id) => {
        try {
            await notificationService.markRead(id)
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        } catch { }
    }

    const markAllRead = async () => {
        try {
            await notificationService.markAllRead()
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        } catch { }
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={onClose}
                />
            )}

            <div className={`notification-panel ${isOpen ? 'open' : 'closed'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Bell className="w-4.5 h-4.5 text-sky-600" style={{ width: '18px', height: '18px' }} />
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-red-600 text-white rounded-full font-bold shadow-sm">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                        <button onClick={onClose} className="btn-icon w-8 h-8">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="spinner w-6 h-6 border-2" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="empty-state py-12">
                            <Bell className="empty-state-icon mx-auto" style={{ width: '40px', height: '40px' }} />
                            <p className="empty-state-title">All caught up!</p>
                            <p className="empty-state-desc">No notifications yet</p>
                        </div>
                    ) : (
                        <div>
                            {notifications.map(n => (
                                <button
                                    key={n.id}
                                    onClick={() => markRead(n.id)}
                                    className={`w-full text-left px-5 py-4 border-b border-slate-50 transition-colors duration-150
                                            ? 'hover:bg-slate-50/80'
                                            : 'bg-white/30 hover:bg-white/60 border-l-2 border-l-sky-500'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-slate-300' : 'bg-red-600 shadow-sm'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-relaxed font-medium ${n.read ? 'text-slate-500' : 'text-slate-800'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-1 font-medium">
                                                {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

