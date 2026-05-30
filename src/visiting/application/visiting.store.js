import { defineStore } from 'pinia'
import { visitorApi } from '../infrastructure/visiting-api.js'
import { ArtworkAssembler } from '../infrastructure/artwork.assembler'

export const useVisitorStore = defineStore('visitor', {
    state: () => ({
        currentArtwork: null,
        scannedArtworks: [],
        achievements: [],
        currentXP: 450,
        userRanking: []
    }),

    actions: {
        async scanArtwork(code) {
            const response = await visitorApi.scanQR(code)
            this.currentArtwork = ArtworkAssembler.toDomain(response)
            this.scannedArtworks.push(this.currentArtwork)
            return this.currentArtwork
        },

        async getRanking(period) {
            const response = await visitorApi.getRanking(period)
            this.userRanking = response
        }
    }
})