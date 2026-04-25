import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Bell } from 'lucide-react'
import NotificationPanel from './NotificationPanel'
import { notificationService } from '../services/notificationService'

const pageTitles = {
    '/': 'Dashboard',
    '/resources': 'Resources',
    '/bookings': 'Book a Resource',
    '/my-bookings': 'My Bookings',
    '/tickets': 'Maintenance Tickets',
    '/admin': 'Admin Panel',
}

export default function Layout() {
    const location = useLocation()
    const [notifOpen, setNotifOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    const title = Object.entries(pageTitles).find(([path]) =>
        location.pathname === path || location.pathname.startsWith(path + '/')
    )?.[1] || 'Smart Campus Hub'

    useEffect(() => {
        loadUnreadCount()
        const interval = setInterval(loadUnreadCount, 30000)
        return () => clearInterval(interval)
    }, [])

    const loadUnreadCount = async () => {
        try {
            const data = await notificationService.getUnreadCount()
            setUnreadCount(data.count || 0)
        } catch { }
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="app-content">
                <header className="app-navbar">
                    <div className="navbar-title">{title}</div>
                    <div className="navbar-actions">
                        <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                        </button>
                    </div>
                </header>
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
            <NotificationPanel
                isOpen={notifOpen}
                onClose={() => { setNotifOpen(false); loadUnreadCount() }}
            />
        </div>
    )
}
