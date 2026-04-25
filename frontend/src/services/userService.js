import api from './api'

export const userService = {
    getAll: () => api.get('/users').then(r => r.data),
    delete: (id) => api.delete(`/users/${id}`).then(r => r.data),
}
