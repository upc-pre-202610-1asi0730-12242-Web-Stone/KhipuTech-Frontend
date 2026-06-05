import { httpClient } from '../../shared/infrastructure/http/http-client'
import { endpoints } from '../../shared/infrastructure/http/endpoints'

export const visitingApi = {

    async getArtworkByQrId(qrId) {
        const response = await httpClient.get(`/artifacts/${qrId}`)
        return response.data
    },

    async registerInteraction(resource) {
        const response = await httpClient.post('/artwork-interactions', resource)
        return response.data
    },

    async registerVisitHistory(resource) {
        const response = await httpClient.post('/visit-history', resource)
        return response.data
    },

    async addFavorite(resource) {
        const response = await httpClient.post('/favorites', resource)
        return response.data
    },

    async deleteFavorite(id) {
        const response = await httpClient.delete(`/favorites/${id}`)
        return response.data
    },

    async getFavorites(sessionId) {
        const response = await httpClient.get(`/favorites?sessionId=${sessionId}`)
        return response.data
    },

    async scanQR(code) {
        if (import.meta.env.VITE_USE_MOCK === 'true' && !import.meta.env.VITE_API_BASE_URL) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const validCodes = {
                        'KH-2025-001': {
                            id: 1,
                            code: 'KH-2025-001',
                            title: 'La persistencia de la memoria',
                            artist: 'Salvador Dalí',
                            year: '1931',
                            style: 'Surrealismo',
                            description: '...',
                            maintenanceBlocked: false,
                            needsMaintenance: false
                        }
                    }

                    const artwork = validCodes[code]

                    if (artwork) {
                        resolve(artwork)
                    } else {
                        reject(new Error('Código QR no válido'))
                    }
                }, 500)
            })
        }

        const response = await httpClient.post(endpoints.visiting.scan, { code })
        return response.data
    },

    async getRanking(period) {
        // Logica
    }
}