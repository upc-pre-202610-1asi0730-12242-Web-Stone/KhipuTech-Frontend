import { defineStore } from 'pinia'
import { ref } from 'vue'
import { VisitorApi } from '../infrastructure/visitor-api.js'

export const useVisitorStore = defineStore('visitor', () => {
    const artworks = ref([])
    const selectedArtwork = ref(null)
    const loading = ref(false)

    async function fetchArtworks() {
        loading.value = true
        artworks.value = await VisitorApi.getAll()
        loading.value = false
    }

    async function fetchArtworkById(id) {
        selectedArtwork.value = await VisitorApi.getById(id)
    }

    async function createArtwork(entity) {
        await VisitorApi.create(entity)
        await fetchArtworks()
    }

    return { artworks, selectedArtwork, loading, fetchArtworks, fetchArtworkById, createArtwork }
})