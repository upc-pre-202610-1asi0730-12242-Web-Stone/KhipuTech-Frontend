export class ScanArtworkCodeCommand {
    constructor(qrCode) {
        this.qrCode = qrCode
    }

    execute() {
        return {
            scanned: true,
            qrCode: this.qrCode,
            scannedAt: new Date()
        }
    }
}