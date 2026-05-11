import { UserEntity } from '../domain/user.entity'

export const SignInAssembler = {
    toDomain(response) {
        return new UserEntity({
            id: response.id,
            email: response.email,
            name: response.name,
            role: response.role,
            type: response.type || 'visitor'
        })
    }
}