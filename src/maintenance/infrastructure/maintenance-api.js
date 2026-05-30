import { httpClient } from '../../shared/infrastructure/http/http-client'
import { endpoints } from '../../shared/infrastructure/http/endpoints'

export const maintenanceApi = {
    async schedule({ artworkId, reason }) {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { id: Date.now(), artworkId, reason, status: 'pending', scheduledDate: new Date() }
        }
        const response = await httpClient.post(endpoints.maintenance.schedule, { artworkId, reason })
        return response.data
    },

    async restore(artworkId) {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            console.log(`Mock: restaurando obra ${artworkId}`)
            return { success: true }
        }
        const response = await httpClient.post(endpoints.maintenance.restore, { artworkId })
        return response.data
    },

    async getTasks() {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return [
                { id: 1, artworkId: 2, reason: 'Alta demanda de escaneos', scheduledDate: new Date(), status: 'pending' },
                { id: 2, artworkId: 5, reason: 'Daño en marco', scheduledDate: new Date(), status: 'completed' }
            ]
        }
        const response = await httpClient.get(endpoints.maintenance.tasks)
        return response.data
    }
}