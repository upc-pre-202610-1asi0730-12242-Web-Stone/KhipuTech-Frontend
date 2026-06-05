export class ToggleFavoriteCommand {
    constructor(artworkId, userId) {
        this.artworkId = artworkId
        this.userId = userId
    }

    execute() {
        return {
            artworkId: this.artworkId,
            userId: this.userId,
            favorite: true,
            updatedAt: new Date()
        }
    }
}