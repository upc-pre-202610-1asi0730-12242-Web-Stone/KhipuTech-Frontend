import { createRouter, createWebHistory } from 'vue-router'

import iamRoutes from './iam/presentation/views/iam-routes'
import visitingRoutes from './visiting/presentation/views/visiting-routes'
import operationRoutes from './operation/presentation/views/operation-routes'
import analyticsRoutes from './analytics/presentation/views/analytics-routes'


const routes = [
    ...iamRoutes,
    ...visitingRoutes,
    ...operationRoutes,
    ...analyticsRoutes,

    // Redirecciones de rutas antiguas a nuevas
    { path: '/dashboard-gestor', redirect: '/operation/aforo' },
    { path: '/dashboard', redirect: '/visiting/scan' },

    // Catch-all
    { path: '/:pathMatch(.*)*', redirect: '/sign-in' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Guardia de navegación (opcional pero recomendada)
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token')
    const userStr = localStorage.getItem('user')
    let user = null
    try { user = userStr ? JSON.parse(userStr) : null } catch(e) {}

    const requiresAuth = to.matched.some(record => record.meta && record.meta.requiresAuth)
    if (requiresAuth && !token) {
        next('/sign-in')
        return
    }

    // Verificar roles si la ruta los exige
    if (to.meta && to.meta.roles && user) {
        if (!to.meta.roles.includes(user.type)) {
            // Redirigir según su rol
            if (user.type === 'gestor') next('/operation/aforo')
            else if (user.type === 'public' || user.type === 'visitor') next('/visiting/scan')
            else next('/sign-in')
            return
        }
    }
    next()
})

export default router