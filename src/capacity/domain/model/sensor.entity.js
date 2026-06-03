export class SensorEntity {
    constructor({ id, name, location, type, status, lastReading }) {
        this.id = id
        this.name = name
        this.location = location
        this.type = type
        this.status = status
        this.lastReading = lastReading || null
        this.lastSeen = new Date()
    }

    isActive() {
        return this.status === 'active'
    }

    updateReading(value) {
        this.lastReading = value
        this.lastSeen = new Date()
    }
}