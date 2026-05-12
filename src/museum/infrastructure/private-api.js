import artworkStatsData from './artwork-stats.json'
import sensorsData from './sensors.json'
import { StatsAssembler } from './stats.assembler.js'

export class PrivateApi {
    static getAllStats() {
        return Promise.resolve(
            artworkStatsData.artworkStats.map(StatsAssembler.toEntityFromResource)
        )
    }

    static getStatsByArtworkId(artworkId) {
        const resource = artworkStatsData.artworkStats.find(s => s.artworkId === artworkId)
        return Promise.resolve(
            resource ? StatsAssembler.toEntityFromResource(resource) : null
        )
    }

    static getAllSensors() {
        return Promise.resolve(sensorsData.sensors)
    }
}