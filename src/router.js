import { createRouter, createWebHistory } from 'vue-router'

// Importar rutas de módulos
import iamRoutes from './iam/presentation/views/iam-routes'
import visitorRoutes from './visitor/presentation/views/visitor-routes'
import museumRoutes from "./museum/presentation/views/museum-routes.js";

const routes = [
    ...iamRoutes,
    ...visitorRoutes,
    ...museumRoutes,
    { path: '/:pathMatch(.*)*', redirect: '/sign-in' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router


