export class RoomEntity {
    constructor({ id, name, currentOccupancy, capacity, status, sensors = [] }) {
        this.id = id
        this.name = name
        this.currentOccupancy = currentOccupancy
        this.capacity = capacity
        this.status = status
        this.sensors = sensors
        this.lastUpdated = new Date()
    }

    get occupancyPercentage() {
        return Math.round((this.currentOccupancy / this.capacity) * 100)
    }

    isOverCapacity() {
        return this.currentOccupancy > this.capacity
    }

    isNearCapacity(threshold = 0.9) {
        return this.currentOccupancy >= this.capacity * threshold
    }

    updateOccupancy(newOccupancy) {
        this.currentOccupancy = newOccupancy
        this.lastUpdated = new Date()
        if (this.isOverCapacity()) {
            console.log(`[DOMAIN EVENT] Maximum capacity notice sent for room ${this.name}`)
        }
    }
}