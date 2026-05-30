import OperationDashboard from './operation-dashboard.vue'

export default [
    {
        path: '/operation/:tab?',
        name: 'operation',
        component: OperationDashboard,
        props: true,
        meta: { requiresAuth: true, roles: ['gestor'] }
    }
]