import { VisitHistory } from '../domain/model/visit-history.entity.js'

export class VisitHistoryAssembler {
    static toEntityFromResource(resource) {
        return new VisitHistory(
            resource.id,
            resource.sessionId,
            resource.artworkId,
            resource.visitedAt
        )
    }

    static toResourceFromEntity(entity) {
        return {
            sessionId: entity.sessionId,
            artworkId: entity.artworkId,
            visitedAt: entity.visitedAt
        }
    }
}