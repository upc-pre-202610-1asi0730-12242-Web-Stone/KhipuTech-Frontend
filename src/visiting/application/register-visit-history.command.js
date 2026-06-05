export class RegisterVisitHistoryCommand {
    constructor(sessionId, artworkId) {
        this.sessionId = sessionId
        this.artworkId = artworkId
    }

    execute() {
        return {
            sessionId: this.sessionId,
            artworkId: this.artworkId,
            visitedAt: new Date()
        }
    }
}