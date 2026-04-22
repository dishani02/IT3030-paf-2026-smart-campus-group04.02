import api from './api'

export const ticketService = {
    create: (data) =>
        api.post('/tickets', data).then(r => r.data),
    getAll: () =>
        api.get('/tickets').then(r => r.data),
    getById: (id) =>
        api.get(`/tickets/${id}`).then(r => r.data),
    assign: (id, technicianId) =>
        api.put(`/tickets/${id}/assign`, { technicianId }).then(r => r.data),
    updateStatus: (id, status, resolutionNotes, rejectionReason) =>
        api.put(`/tickets/${id}/status`, { status, resolutionNotes, rejectionReason }).then(r => r.data),
    addComment: (id, content) =>
        api.post(`/tickets/${id}/comments`, { content }).then(r => r.data),
    addAttachment: (id, file) => {
        const form = new FormData()
        form.append('file', file)
        return api.post(`/tickets/${id}/attachments`, form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(r => r.data)
    }
}
