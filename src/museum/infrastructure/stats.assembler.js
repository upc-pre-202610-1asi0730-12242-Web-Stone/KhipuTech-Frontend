import { ArtworkStats } from '../domain/model/artwork-stats.entity.js'

export class StatsAssembler {
    static toEntityFromResource(resource) {
        return new ArtworkStats({
            id: resource.id,
            artworkId: resource.artworkId,
            visits: resource.visits,
            retentionPercentage: resource.retentionPercentage,
            retentionMinutes: resource.retentionMinutes,
            score: resource.score
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            artworkId: entity.artworkId,
            visits: entity.visits,
            retentionPercentage: entity.retentionPercentage,
            retentionMinutes: entity.retentionMinutes,
            score: entity.score
        }
    }
}