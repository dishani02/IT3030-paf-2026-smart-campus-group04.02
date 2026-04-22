import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Building2, CalendarDays, BookOpen,
    Wrench, ShieldCheck, LogOut, Users, Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRoleAccess } from '../hooks/useRoleAccess'

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, accessFn: (access) => access.canAccessAll() || access.canAccessStaff() },
    { to: '/resources', label: 'Resources', icon: Building2, accessFn: (access) => access.canAccessAll() || access.canAccessStaff() },
    { to: '/bookings', label: 'Book Resource', icon: CalendarDays, accessFn: (access) => access.canAccessAll() || access.canAccessStaff() || access.hasRole('USER') },
    { to: '/my-bookings', label: 'My Bookings', icon: BookOpen, accessFn: (access) => access.canAccessAll() || access.canAccessStaff() || access.hasRole('USER') },
    { to: '/tickets', label: 'Tickets', icon: Wrench, accessFn: (access) => access.canAccessAll() || access.canAccessTechnicalOps() || access.hasRole('USER') },
    { to: '/admin', label: 'Admin Panel', icon: ShieldCheck, accessFn: (access) => access.canManageUsers() },
    { to: '/admin/resources', label: 'Manage Resources', icon: Building2, accessFn: (access) => access.canManageUsers() },
    { to: '/admin/users', label: 'User Management', icon: Users, accessFn: (access) => access.canManageUsers() },
    { to: '/settings', label: 'Settings', icon: Settings, accessFn: (access) => access.canAccessAll() },
]

function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function getRoleLabel(role) {
    const labels = { 
        USER: 'Student', 
        STAFF: 'Staff Member', 
        ADMIN: 'Administrator', 
        TECHNICIAN: 'Technician', 
        OPERATIONS: 'Operations Staff' 
    }
    return labels[role] || role
}

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const roleAccess = useRoleAccess()

    const visible = navItems.filter(item => item.accessFn(roleAccess))

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="app-sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <div className="sidebar-logo-text">
                    Smart Campus
                    <span>Operations Hub</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    <div className="sidebar-section-label">Navigation</div>
                    {visible.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar flex items-center justify-center text-base" style={{ 
                        background: roleAccess.getRoleColor()
                    }}>
                        {roleAccess.getRoleIcon()}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user?.name || 'User'}</div>
                        <div className="sidebar-user-role font-semibold" style={{ 
                            color: roleAccess.getRoleColor()
                        }}>
                            {getRoleLabel(user?.role)}
                        </div>
                    </div>
                </div>
                <button className="btn btn-ghost btn-sm w-full mt-1" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                </button>
            </div>
        </aside>
    )
}
