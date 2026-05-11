import { baseApi } from '../../shared/infrastructure/base-api'

export const iamApi = {
    async signIn(credentials) {
        // Mock - reemplazar con llamada real
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 1,
                    email: credentials.email,
                    name: 'Usuario Demo',
                    role: 'user',
                    token: 'fake-jwt-token'
                })
            }, 500)
        })
    },

    async signUp(userData) {
        // Mock
        return { ...userData, id: Date.now() }
    }
}