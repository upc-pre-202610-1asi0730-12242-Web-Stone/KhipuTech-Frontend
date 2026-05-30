import { defineStore } from 'pinia'
import { iamApi } from '../infrastructure/iam-api'
import { SignInAssembler } from '../infrastructure/sign-in.assembler'
import { SignInCommand } from '../domain/sign-in.command'
import { storageService } from '../../shared/infrastructure/storage/storage.service'


export const useIamStore = defineStore('iam', {
    state: () => ({
        user: null,
        isAuthenticated: false
    }),

    actions: {
        async signIn(email, password) {
            const response = await iamApi.signIn({ email, password })
            const user = SignInAssembler.toDomain(response)
            this.user = user
            this.isAuthenticated = true
            storageService.setSession(response.token, user)
            return user
        },

        setVisitorMode(type) {
            let role = 'visitor'
            let name = 'Visitante'
            if (type === 'gestor') {
                role = 'gestor'
                name = 'Gestor'
            } else if (type === 'curator') {
                role = 'curator'
                name = 'Curador'
            }
            const user = {
                id: 999,
                name: name,
                email: `${type}@ejemplo.com`,
                role: role,
                type: type
            }
            this.user = user
            this.isAuthenticated = true
            localStorage.setItem('access_token', 'fake-token')
            localStorage.setItem('user', JSON.stringify(user))
        },

        signOut() {
            this.user = null
            this.isAuthenticated = false
            storageService.clearSession()
        }
    }
})