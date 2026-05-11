import { createRouter, createWebHistory } from 'vue-router'

// Importar rutas de módulos
import iamRoutes from './iam/presentation/views/iam-routes'
import visitorRoutes from './visitor/presentation/views/visitor-routes'
import privateRoutes from './private/presentation/views/private-routes'
import publicRoutes from './public/presentation/views/public-routes'

const routes = [
    ...iamRoutes,
    ...visitorRoutes,
    ...privateRoutes,
    ...publicRoutes,
    { path: '/:pathMatch(.*)*', redirect: '/sign-in' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router


