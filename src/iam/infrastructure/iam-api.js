import { httpClient } from '../../shared/infrastructure/http/http-client'
import { endpoints } from '../../shared/infrastructure/http/endpoints'
import { notify } from '../../shared/infrastructure/notify/notify.service'

export const iamApi = {
    async signIn(credentials) {
        try {
            if (import.meta.env.VITE_USE_MOCK === 'true' && !import.meta.env.VITE_API_BASE_URL) {
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
            }
            const response = await httpClient.post(endpoints.auth.signIn, credentials)
            return response.data
        } catch (error) {
            notify.error('Error al iniciar sesión')
            throw error
        }
    },

    async signUp(userData) {
        return { ...userData, id: Date.now() }
    }
}

