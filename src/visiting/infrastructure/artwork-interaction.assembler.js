import { ArtworkInteraction } from '../domain/model/artwork-interaction.entity.js'

export class ArtworkInteractionAssembler {
    static toEntityFromResource(resource) {
        return new ArtworkInteraction(
            resource.id,
            resource.artworkId,
            resource.visitorId,
            resource.qrCode,
            resource.interactionType,
            resource.createdAt
        )
    }

    static toResourceFromEntity(entity) {
        return {
            artworkId: entity.artworkId,
            visitorId: entity.visitorId,
            qrCode: entity.qrCode,
            interactionType: entity.interactionType,
            createdAt: entity.createdAt
        }
    }
}