import { Artwork } from '../domain/model/artwork.entity.js'

export class ArtworkAssembler {
    static toEntityFromResource(resource) {
        return new Artwork({
            id: resource.id,
            name: resource.name,
            author: resource.author,
            room: resource.room
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            name: entity.name,
            author: entity.author,
            room: entity.room
        }
    }
}