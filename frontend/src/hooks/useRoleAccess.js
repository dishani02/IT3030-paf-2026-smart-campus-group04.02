import { useAuth } from '../context/AuthContext'

const ROLE_HIERARCHY = {
    USER: 1,
    STAFF: 2,
    OPERATIONS: 3,
    TECHNICIAN: 4,
    ADMIN: 5
}

export function useRoleAccess() {
    const { user } = useAuth()

    const getRoleLevel = (role) => {
        return ROLE_HIERARCHY[role] || 0
    }

    const hasRole = (role) => {
        if (!user || !role) return false
        return user.role === role
    }

    const hasAnyRole = (roles) => {
        if (!user || !roles || !Array.isArray(roles)) return false
        return roles.some(role => user.role === role)
    }

    const hasAllRoles = (roles) => {
        if (!user || !roles || !Array.isArray(roles)) return false
        return roles.every(role => user.role === role)
    }

    const canAccess = (requiredRole) => {
        if (!user || !requiredRole) return false
        
        const userLevel = getRoleLevel(user.role)
        const requiredLevel = getRoleLevel(requiredRole)
        
        return userLevel >= requiredLevel
    }

    const canAccessAny = (requiredRoles) => {
        if (!user || !requiredRoles || !Array.isArray(requiredRoles)) return false
        return requiredRoles.some(role => canAccess(role))
    }

    const canManageUsers = () => {
        return hasAnyRole(['ADMIN', 'OPERATIONS'])
    }

    const canAccessTechnicalOps = () => {
        return hasAnyRole(['ADMIN', 'TECHNICIAN'])
    }

    const canAccessOperations = () => {
        return hasAnyRole(['ADMIN', 'TECHNICIAN', 'OPERATIONS'])
    }

    const canAccessStaff = () => {
        return hasAnyRole(['ADMIN', 'TECHNICIAN', 'OPERATIONS', 'STAFF'])
    }

    const canAccessAll = () => {
        return hasRole('ADMIN')
    }

    const getRoleDescription = (role = user?.role) => {
        const descriptions = {
            USER: 'Student',
            STAFF: 'Staff Member',
            ADMIN: 'Administrator',
            TECHNICIAN: 'Technician',
            OPERATIONS: 'Operations Staff'
        }
        return descriptions[role] || 'Unknown Role'
    }

    const getRoleColor = (role = user?.role) => {
        const colors = {
            USER: '#1d4ed8',
            STAFF: '#7c3aed',
            ADMIN: '#3b82f6',
            TECHNICIAN: '#16a34a',
            OPERATIONS: '#d97706'
        }
        return colors[role] || '#6b7280'
    }

    const getRoleIcon = (role = user?.role) => {
        const icons = {
            USER: '🎓',
            STAFF: '👨‍🏫',
            ADMIN: '👔',
            TECHNICIAN: '🔧',
            OPERATIONS: '⚙️'
        }
        return icons[role] || '👤'
    }

    return {
        user,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        canAccess,
        canAccessAny,
        canManageUsers,
        canAccessTechnicalOps,
        canAccessOperations,
        canAccessStaff,
        canAccessAll,
        getRoleDescription,
        getRoleColor,
        getRoleIcon,
        roleLevel: user ? getRoleLevel(user.role) : 0
    }
}

