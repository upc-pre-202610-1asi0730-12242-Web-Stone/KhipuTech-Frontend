import axios from 'axios'
import { storageService } from '../storage/storage.service'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const httpClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
})

// Interceptor para agregar token
httpClient.interceptors.request.use((config) => {
    const token = storageService.getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor para manejar errores 401
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            storageService.clearSession()
            window.location.href = '/sign-in'
        }
        return Promise.reject(error)
    }
)


if (useMock && !baseURL) {

    console.log('📦 Modo mock activo - usa mock-handler.js para respuestas falsas')
}