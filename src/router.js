import { createRouter, createWebHistory } from 'vue-router'
import iamRoutes from './iam/presentation/views/iam-routes'
import visitingRoutes from './visiting/presentation/views/visiting-routes'
import operationRoutes from './operation/presentation/views/operation-routes'
import analyticsRoutes from './analytics/presentation/views/analytics-routes'
import capacityRoutes from './capacity/presentation/views/capacity-routes'
import managerRoutes from './manager/presentation/views/manager-routes'

const routes = [
    ...iamRoutes,
    ...visitingRoutes,
    ...operationRoutes,
    ...analyticsRoutes,
    ...capacityRoutes,
    ...managerRoutes,

    { path: '/dashboard-museum', redirect: '/manager/capacity' },
    { path: '/dashboard', redirect: '/visiting/scan' },
    { path: '/operation', redirect: '/manager/operation' },
    { path: '/capacity', redirect: '/manager/capacity' },
    { path: '/', redirect: '/sign-in' },
    { path: '/:pathMatch(.*)*', redirect: '/sign-in' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token')
    const userStr = localStorage.getItem('user')
    let user = null
    try { user = userStr ? JSON.parse(userStr) : null } catch(e) {}

    const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
    if (requiresAuth && !token) {
        next('/sign-in')
        return
    }

    if (to.meta?.roles && user && !to.meta.roles.includes(user.type)) {
        if (user.type === 'gestor') {next('/manager/capacity/rooms')}
        else if (user.type === 'curator') next('/analytics/dashboard')
        else next('/visiting/scan')
        return
    }

    if (to.path.startsWith('/manager/')) {
        const section = to.params.section
        if (user && !user.permissions?.includes(section)) {
            next('/manager/capacity')
            return
        }
    }

    next()
})
export default router