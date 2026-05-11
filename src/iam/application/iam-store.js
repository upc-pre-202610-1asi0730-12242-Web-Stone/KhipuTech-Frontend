import { defineStore } from 'pinia'
import { iamApi } from '../infrastructure/iam-api'
import { SignInAssembler } from '../infrastructure/sign-in.assembler'
import { SignInCommand } from '../domain/sign-in.command'

export const useIamStore = defineStore('iam', {
    state: () => ({
        user: null,
        isAuthenticated: false
    }),

    actions: {
        async signIn(email, password) {
            const command = new SignInCommand(email, password)
            const response = await iamApi.signIn(command)
            const user = SignInAssembler.toDomain(response)
            this.user = user
            this.isAuthenticated = true
            return user
        },

        setVisitorMode(type) {
            this.user = {
                id: 999,
                name: 'Visitante',
                email: `visitante@${type}.com`,
                role: 'visitor',
                type: type
            }
            this.isAuthenticated = true
        },

        signOut() {
            this.user = null
            this.isAuthenticated = false
            localStorage.removeItem('access_token')
        }
    }
})