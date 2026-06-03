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
            let permissions = []
            let role = ''
            let name = ''
            switch (type) {
                case 'public':
                    role = 'public'
                    name = 'Visitante'
                    permissions = []
                    break
                case 'gestor':
                    role = 'gestor'
                    name = 'Gestor'
                    permissions = ['capacity', 'operation', 'maintenance']
                    break
                case 'curator':
                    role = 'curator'
                    name = 'Curador'
                    permissions = ['analytics']
                    break
                default:
                    role = 'public'
                    name = 'Visitante'
                    permissions = []
            }
            const user = {
                id: 999,
                name: name,
                email: `${type}@ejemplo.com`,
                role: type,
                type: type,
                permissions: permissions
            }
            this.user = user
            this.isAuthenticated = true
            storageService.setSession('fake-token', user)
        },
        signOut() {
            this.user = null
            this.isAuthenticated = false
            storageService.clearSession()
        }
    }
})