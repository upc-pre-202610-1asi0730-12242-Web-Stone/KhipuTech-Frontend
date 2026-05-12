export class ArtworkStats {
    constructor({ id, artworkId, visits, retentionPercentage, retentionMinutes, score }) {
        this.id = id
        this.artworkId = artworkId
        this.visits = visits
        this.retentionPercentage = retentionPercentage
        this.retentionMinutes = retentionMinutes
        this.score = score
    }
}