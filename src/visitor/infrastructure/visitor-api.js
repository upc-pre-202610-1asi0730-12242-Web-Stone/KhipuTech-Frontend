import artworksData from './artworks.json'
import { ArtworkAssembler } from './artwork.assembler.js'

export class VisitorApi {
    static getAll() {
        return Promise.resolve(
            artworksData.artworks.map(ArtworkAssembler.toEntityFromResource)
        )
    }

    static getById(id) {
        const resource = artworksData.artworks.find(a => a.id === id)
        return Promise.resolve(
            resource ? ArtworkAssembler.toEntityFromResource(resource) : null
        )
    }

    static create(entity) {
        const resource = ArtworkAssembler.toResourceFromEntity(entity)
        return Promise.resolve(resource)
    }
}