import VisitingDashboard from './visiting-dashboard.vue'

export default [
    {
        path: '/visiting/:tab?',
        name: 'visiting',
        component: VisitingDashboard,
        props: true,
        meta: { requiresAuth: true, roles: ['public'] }
    }
]