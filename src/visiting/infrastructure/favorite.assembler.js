import { Favorite } from '../domain/model/favorite.entity.js'

export class FavoriteAssembler {
    static toEntityFromResource(resource) {
        return new Favorite(
            resource.id,
            resource.artworkId,
            resource.sessionId,
            resource.userId,
            resource.createdAt
        )
    }

    static toResourceFromEntity(entity) {
        return {
            artworkId: entity.artworkId,
            sessionId: entity.sessionId,
            userId: entity.userId,
            createdAt: entity.createdAt
        }
    }
}