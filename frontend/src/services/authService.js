import api from './api'

export const authService = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }).then(r => r.data),
    googleLogin: (idToken) =>
        api.post('/auth/google', { idToken }).then(r => r.data),
    register: (name, email, password, role) =>
        api.post('/auth/register', { name, email, password, role }).then(r => r.data),
    me: () =>
        api.get('/auth/me').then(r => r.data),
    updateProfile: (data) =>
        api.put('/auth/profile', data).then(r => r.data),
}
