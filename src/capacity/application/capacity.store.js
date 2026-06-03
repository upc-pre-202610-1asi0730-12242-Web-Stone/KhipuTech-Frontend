import { defineStore } from 'pinia'
import { capacityApi } from '../infrastructure/capacity-api'
import { RoomAssembler } from '../infrastructure/room.assembler'
import { notify } from '../../shared/infrastructure/notify/notify.service'

export const useCapacityStore = defineStore('capacity', {
    state: () => ({
        rooms: [],
        sensors: [],
        isLoading: false,
        error: null,
        ingresosHoy: 1248
    }),

    getters: {
        totalOccupancy: (state) => state.rooms.reduce((sum, room) => sum + room.currentOccupancy, 0),
        totalCapacity: (state) => state.rooms.reduce((sum, room) => sum + room.capacity, 0),
        criticalRooms: (state) => state.rooms.filter(room => room.status === 'critical' || room.status === 'overcapacity'),
        roomsByStatus: (state) => (status) => state.rooms.filter(room => room.status === status)
    },

    actions: {
        async fetchRooms() {
            this.isLoading = true
            try {
                const response = await capacityApi.getRooms()
                this.rooms = response.map(room => RoomAssembler.toDomain(room))
            } catch (error) {
                this.error = error.message
                notify.error('Error al cargar las salas')
            } finally {
                this.isLoading = false
            }
        },

        async fetchSensors() {
            try {
                this.sensors = await capacityApi.getSensors()
            } catch (error) {
                notify.error('Error al cargar los sensores')
            }
        },

        async updateRoomOccupancy(roomId, newOccupancy) {
            const room = this.rooms.find(r => r.id === roomId)
            if (room) {
                room.updateOccupancy(newOccupancy)
                await capacityApi.updateRoom(roomId, { currentOccupancy: newOccupancy })
                // Opcional: emitir evento de dominio hacia operation
                if (room.isOverCapacity()) {
                    console.log(`[DOMAIN EVENT] Maximum capacity notice sent for room ${room.name}`)
                }
            }
        },

        async registerEntry(roomId, visitorId) {
            const room = this.rooms.find(r => r.id === roomId)
            if (room) {
                const newOccupancy = room.currentOccupancy + 1
                await this.updateRoomOccupancy(roomId, newOccupancy)
                console.log(`[DOMAIN EVENT] Registered Entry in room ${room.name} by visitor ${visitorId}`)
            }
        }
    }
})