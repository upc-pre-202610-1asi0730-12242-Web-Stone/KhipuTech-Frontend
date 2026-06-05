export class ArtworkInteraction {
    constructor(id, artworkId, visitorId, qrCode, interactionType, createdAt) {
        this.id = id
        this.artworkId = artworkId
        this.visitorId = visitorId
        this.qrCode = qrCode
        this.interactionType = interactionType
        this.createdAt = createdAt
    }
}