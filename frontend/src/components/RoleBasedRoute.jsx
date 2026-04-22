import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ROLE_HIERARCHY = {
    USER: 1,
    STAFF: 2,
    OPERATIONS: 3,
    TECHNICIAN: 4,
    ADMIN: 5
}

export default function RoleBasedRoute({ children, requiredRole, requireAll = false }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: 16
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <div style={{ color: '#6b7280', fontSize: 14 }}>Loading...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Check if user has the required role(s)
    const hasRequiredRole = (required) => {
        if (!required) return true // No role requirement
        
        if (Array.isArray(required)) {
            if (requireAll) {
                return required.every(role => user.role === role)
            } else {
                return required.includes(user.role)
            }
        }
        
        return user.role === required
    }

    // Check role hierarchy (higher roles can access lower role resources)
    const canAccessByHierarchy = (required) => {
        if (!required) return true
        
        const userLevel = ROLE_HIERARCHY[user.role] || 0
        const requiredLevel = ROLE_HIERARCHY[required] || 0
        
        return userLevel >= requiredLevel
    }

    // Check access based on role requirements
    let hasAccess = false
    
    if (Array.isArray(requiredRole)) {
        hasAccess = requireAll 
            ? requiredRole.every(role => user.role === role)
            : requiredRole.some(role => canAccessByHierarchy(role))
    } else if (requiredRole) {
        hasAccess = canAccessByHierarchy(requiredRole)
    } else {
        hasAccess = true
    }

    if (!hasAccess) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: 24,
                padding: 24
            }}>
                <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: '#fef2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fecaca'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        Access Denied
                    </h2>
                    <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 16, lineHeight: 1.5 }}>
                        You don't have permission to access this page. This area requires 
                        <strong> {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}</strong> 
                        privileges, but your current role is <strong>{user.role}</strong>.
                    </p>
                    <div style={{
                        padding: '12px 16px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 14,
                        color: '#475569'
                    }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Your Role:</div>
                        <div>{user.role} - {getRoleDescription(user.role)}</div>
                    </div>
                </div>
                
                <button
                    onClick={() => window.history.back()}
                    style={{
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}
                >
                    Go Back
                </button>
            </div>
        )
    }

    return children
}

function getRoleDescription(role) {
    const descriptions = {
        USER: 'Student',
        STAFF: 'Staff Member',
        ADMIN: 'Administrator',
        TECHNICIAN: 'Technician',
        OPERATIONS: 'Operations Staff'
    }
    return descriptions[role] || 'Unknown Role'
}
