import VisitorDashboard from './dashboard.vue'

export default [
    {
        path: '/dashboard',
        component: VisitorDashboard
    },
    {
        path: '/recorrido/:id',
        name: 'recorrido',
        component: () => import('./RecorridoView.vue')
    }
]