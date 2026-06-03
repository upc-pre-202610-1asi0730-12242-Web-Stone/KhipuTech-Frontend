import CapacityDashboard from './capacity-dashboard.vue'

export default [
    {
        path: '/capacity/:tab?',
        name: 'capacity',
        component: CapacityDashboard,
        props: true,
        meta: { requiresAuth: true, roles: ['gestor'] }
    }
]