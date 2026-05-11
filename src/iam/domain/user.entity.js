export class UserEntity {
    constructor({ id, email, name, role, type }) {
        this.id = id
        this.email = email
        this.name = name
        this.role = role
        this.type = type  // 'visitor', 'private', 'public'
        this.createdAt = new Date()
    }

    isVisitor() { return this.role === 'visitor' }
    isPrivate() { return this.type === 'private' }
    isPublic() { return this.type === 'public' }
}