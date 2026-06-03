export class UserEntity {
    constructor({ id, email, name, role, type }) {
        this.id = id
        this.email = email
        this.name = name
        this.role = role
        this.type = type
        this.createdAt = new Date()
    }

    isVisitor() { return this.role === 'visitor' }
    isPrivate() { return this.type === 'gestor' }
    isPublic() { return this.type === 'public' }
}