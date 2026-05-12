import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PrivateApi } from '../infrastructure/private-api.js'

export const usePrivateStore = defineStore('private', () => {
    const artworkStats = ref([])
    const sensors = ref([])
    const loading = ref(false)

    async function fetchArtworkStats() {
        loading.value = true
        artworkStats.value = await PrivateApi.getAllStats()
        loading.value = false
    }

    async function fetchSensors() {
        loading.value = true
        sensors.value = await PrivateApi.getAllSensors()
        loading.value = false
    }

    return { artworkStats, sensors, loading, fetchArtworkStats, fetchSensors }
})