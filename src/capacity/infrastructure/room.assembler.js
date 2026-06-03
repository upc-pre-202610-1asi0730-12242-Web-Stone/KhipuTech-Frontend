import { RoomEntity } from '../domain/model/room.entity'

export const RoomAssembler = {
    toDomain(dto) {
        return new RoomEntity({
            id: dto.id,
            name: dto.name,
            currentOccupancy: dto.currentOccupancy,
            capacity: dto.capacity,
            status: dto.status,
            sensors: dto.sensors || []
        })
    },
    toDTO(room) {
        return {
            id: room.id,
            name: room.name,
            currentOccupancy: room.currentOccupancy,
            capacity: room.capacity,
            status: room.status
        }
    }
}