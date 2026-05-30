import { httpClient } from '../../../shared/infrastructure/http/http-client'
import { endpoints } from '../../../shared/infrastructure/http/endpoints'

export const maintenanceApi = {
    async schedule(artworkCode, scheduledDate, notes) {
        // Mock mientras no hay backend
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        id: Date.now(),
                        artworkCode,
                        scheduledDate,
                        notes,
                        status: 'pending'
                    })
                }, 500)
            })
        }
        const response = await httpClient.post(endpoints.maintenance.schedule, { artworkCode, scheduledDate, notes })
        return response.data
    },

    async restore(artworkCode) {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return new Promise((resolve) => resolve({ success: true }))
        }
        const response = await httpClient.post(endpoints.maintenance.restore, { artworkCode })
        return response.data
    },

    async fetchBlockedArtworks() {
        //  Lista de obras bloqueadas
    }
}