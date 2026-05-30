export class MaintenanceTaskEntity {
    constructor({ id, artworkId, reason, scheduledDate, status, createdAt }) {
        this.id = id
        this.artworkId = artworkId
        this.reason = reason
        this.scheduledDate = scheduledDate || new Date()
        this.status = status || 'pending' // pending, in_progress, completed, cancelled
        this.createdAt = createdAt || new Date()
    }

    start() {
        if (this.status !== 'pending') throw new Error('Solo se puede iniciar una tarea pendiente')
        this.status = 'in_progress'
    }

    complete() {
        if (this.status !== 'in_progress') throw new Error('La tarea debe estar en progreso para completarse')
        this.status = 'completed'
    }

    cancel() {
        if (this.status === 'completed') throw new Error('No se puede cancelar una tarea completada')
        this.status = 'cancelled'
    }
}