export class ArtworkAvailability {
    constructor({ artworkCode, isBlocked, blockedUntil, reason }) {
        this.artworkCode = artworkCode
        this.isBlocked = isBlocked
        this.blockedUntil = blockedUntil ? new Date(blockedUntil) : null
        this.reason = reason
    }

    isAvailable() {
        return !this.isBlocked || (this.blockedUntil && this.blockedUntil < new Date())
    }
}