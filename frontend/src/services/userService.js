import api from './api'

export const userService = {
    getAll: () => api.get('/users').then(r => r.data),
}
