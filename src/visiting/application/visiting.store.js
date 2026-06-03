import { defineStore } from 'pinia'
import { visitingApi } from '../infrastructure/visiting-api'
import { ArtworkAssembler } from '../infrastructure/artwork.assembler'
import { notify } from '../../shared/infrastructure/notify/notify.service'
import { maintenanceCommands } from '../../maintenance/application/maintenance.commands'


export const useVisitingStore = defineStore('visiting', {
    state: () => ({
        currentArtwork: null,
        scannedArtworks: [],
        achievements: [],
        currentXP: 0,
        userRanking: [],
        isLoading: false,
        error: null
    }),

    actions: {
        async scanArtwork(code) {
            this.isLoading = true
            this.error = null
            try {
                const response = await visitingApi.scanQR(code)

                if (response.maintenanceBlocked) {
                    notify.warning(`La obra "${response.title}" está en mantenimiento. No se puede escanear.`)
                    this.error = 'MAINTENANCE_BLOCKED'
                    return null
                }

                const artwork = ArtworkAssembler.toDomain(response)

                this.currentArtwork = artwork
                this.scannedArtworks.push(artwork)

                this.currentXP += 25
                this.checkAchievements()


                this.$emitDomainEvent('ARTWORK_SCANNED', { artwork, code })

                if (artwork.needsMaintenance) {
                    await maintenanceCommands.scheduleMaintenance(artwork.id, 'Por alta demanda de escaneos')
                }

                notify.success(`¡Escaneaste "${artwork.title}"! +25 XP`)
                return artwork

            } catch (error) {
                this.error = error.message
                notify.error('Error al escanear el código QR')
                throw error
            } finally {
                this.isLoading = false
            }
        },

        $emitDomainEvent(eventName, payload) {
            console.log(`[DOMAIN EVENT] ${eventName}`, payload)
        },

        checkAchievements() {
        },

        async getRanking(period) {
            const response = await visitorApi.getRanking(period)
            this.userRanking = response
        }
    }
})