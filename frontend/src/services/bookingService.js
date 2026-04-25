import api from './api'

export const bookingService = {
    create: (data) =>
        api.post('/bookings', data).then(r => r.data),
    getMyBookings: () =>
        api.get('/bookings/my').then(r => r.data),
    getAll: () =>
        api.get('/bookings').then(r => r.data),
    approve: (id) =>
        api.put(`/bookings/${id}/approve`).then(r => r.data),
    reject: (id, reason) =>
        api.put(`/bookings/${id}/reject`, { reason }).then(r => r.data),
    cancel: (id) =>
        api.put(`/bookings/${id}/cancel`).then(r => r.data),
    getQRCode: (id) =>
        api.get(`/bookings/${id}/qr`).then(r => r.data),
    verifyQRCode: (payload) =>
        api.post('/bookings/verify-qr', payload).then(r => r.data),
    delete: (id) =>
        api.delete(`/bookings/${id}`).then(r => r.data),
}
