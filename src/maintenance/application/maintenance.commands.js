import { maintenanceApi } from '../infrastructure/maintenance-api'
import { notify } from '../../shared/infrastructure/notify/notify.service'

export const maintenanceCommands = {
    async scheduleMaintenance(artworkId, reason) {
        try {
            // 1. Llamar a la API para programar mantenimiento
            const task = await maintenanceApi.schedule({ artworkId, reason })

            // 2. Disparar evento de dominio: "Maintenance Notice Deployed"
            console.log('[DOMAIN EVENT] MaintenanceNoticeDeployed', { task })

            // 3. Notificar al gestor
            notify.info(`Se ha programado mantenimiento para la obra ID: ${artworkId}`)

            return task
        } catch (error) {
            notify.error('Error al programar mantenimiento')
            throw error
        }
    },

    async restoreArtworkAvailability(artworkId) {
        // Comando para restaurar disponibilidad después del mantenimiento
        await maintenanceApi.restore(artworkId)
        notify.success(`La obra ${artworkId} ya está disponible nuevamente`)
    }
}