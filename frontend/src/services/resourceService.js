import api from './api'

export const resourceService = {
    getAll: (params) =>
        api.get('/resources', { params }).then(r => r.data),
    getById: (id) =>
        api.get(`/resources/${id}`).then(r => r.data),
    create: (data) =>
        api.post('/resources', data).then(r => r.data),
    update: (id, data) =>
        api.put(`/resources/${id}`, data).then(r => r.data),
    delete: (id) =>
        api.delete(`/resources/${id}`),
}
