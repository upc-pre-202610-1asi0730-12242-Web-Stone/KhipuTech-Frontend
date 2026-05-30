const TOKEN_KEY = 'access_token'
const USER_KEY = 'user'

export const storageService = {
    // Token
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },
    setToken(token) {
        if (token) localStorage.setItem(TOKEN_KEY, token)
        else localStorage.removeItem(TOKEN_KEY)
    },
    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    },

    // Usuario
    getUser() {
        const userStr = localStorage.getItem(USER_KEY)
        try {
            return userStr ? JSON.parse(userStr) : null
        } catch {
            return null
        }
    },
    setUser(user) {
        if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
        else localStorage.removeItem(USER_KEY)
    },
    removeUser() {
        localStorage.removeItem(USER_KEY)
    },

    // Sesión completa
    clearSession() {
        this.removeToken()
        this.removeUser()
    },

    setSession(token, user) {
        this.setToken(token)
        this.setUser(user)
    }
}