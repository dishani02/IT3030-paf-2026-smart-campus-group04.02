import api from './api'

export const notificationService = {
    getAll: () =>
        api.get('/notifications').then(r => r.data),
    getUnreadCount: () =>
        api.get('/notifications/unread-count').then(r => r.data),
    markRead: (id) =>
        api.put(`/notifications/${id}/read`),
    markAllRead: () =>
        api.put('/notifications/read-all'),
    delete: (id) =>
        api.delete(`/notifications/${id}`),
    deleteAll: () =>
        api.delete('/notifications/all'),
}
