export class QrCode {
    constructor(id, code, artworkId, isActive = true) {
        this.id = id
        this.code = code
        this.artworkId = artworkId
        this.isActive = isActive
    }

    isValid() {
        return this.isActive && this.code !== null && this.code !== ''
    }
}