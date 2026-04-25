import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import LayoutModern from './components/LayoutModern'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/ModernRegister'
import DashboardModern from './pages/DashboardModern'
import Dashboard from './pages/Dashboard'
import ResourcesModern from './pages/ResourcesModern'
import ResourceDetail from './pages/ResourceDetail'
import Bookings from './pages/BookingsModern'
import MyBookings from './pages/MyBookings'
import Tickets from './pages/TicketsModern'
import TicketDetail from './pages/TicketDetail'
import AdminPanel from './pages/AdminPanel'
import Profile from './pages/Profile'
import QRCheckin from './pages/QRCheckin'
import NotificationSettings from './pages/NotificationSettings'

export default function App() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner" />
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />

            <Route element={<ProtectedRoute><LayoutModern /></ProtectedRoute>}>
                <Route 
                    path="/" 
                    element={
                        (user?.role === 'ADMIN' || user?.role === 'OPERATIONS') 
                            ? <DashboardModern /> 
                            : <Dashboard />
                    } 
                />
                <Route path="/resources" element={<ResourcesModern />} />
                <Route path="/resources/:id" element={<ResourceDetail />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/tickets/:id" element={<TicketDetail />} />
                <Route path="/notification-settings" element={<NotificationSettings />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'OPERATIONS']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'OPERATIONS']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/resources"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'OPERATIONS']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/checkin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'OPERATIONS']}>
                            <QRCheckin />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="*" element={<Navigate to={!user ? "/home" : "/"} replace />} />
        </Routes>
    )
}
