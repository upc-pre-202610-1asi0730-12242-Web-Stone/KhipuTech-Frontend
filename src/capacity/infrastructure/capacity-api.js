import { httpClient } from '../../shared/infrastructure/http/http-client'
import { endpoints } from '../../shared/infrastructure/http/endpoints'

export const capacityApi = {
    async getRooms() {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return [
                { id: 1, name: 'Sala 1 - Arte Moderno', currentOccupancy: 145, capacity: 200, status: 'normal' },
                { id: 2, name: 'Sala 2 - Contemporáneo', currentOccupancy: 178, capacity: 200, status: 'critical' },
                { id: 3, name: 'Sala 3 - Clásico', currentOccupancy: 210, capacity: 200, status: 'overcapacity' },
                { id: 4, name: 'Sala 4 - Temporal', currentOccupancy: 95, capacity: 150, status: 'normal' },
                { id: 5, name: 'Sala 5 - Esculturas', currentOccupancy: 82, capacity: 120, status: 'normal' }
            ]
        }
        const response = await httpClient.get(endpoints.capacity.rooms)
        return response.data
    },

    async getSensors() {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return [
                { id: 1, name: 'Sensor entrada principal', location: 'Puerta principal', type: 'entry', status: 'active' },
                { id: 2, name: 'Sensor Sala Central', location: 'Sala 2', type: 'motion', status: 'active' },
                { id: 3, name: 'Sensor jardín', location: 'Jardín esculturas', type: 'motion', status: 'inactive' },
                { id: 4, name: 'Sensor Sala 3', location: 'Sala Clásica', type: 'motion', status: 'active' }
            ]
        }
        const response = await httpClient.get(endpoints.capacity.sensors)
        return response.data
    },

    async updateRoom(roomId, data) {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            console.log(`Mock actualizando sala ${roomId}`, data)
            return { success: true }
        }
        const response = await httpClient.put(`${endpoints.capacity.rooms}/${roomId}`, data)
        return response.data
    }
}