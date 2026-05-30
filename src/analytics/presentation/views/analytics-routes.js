import AnalyticsDashboard from './analytics-dashboard.vue'

export default [
    {
        path: '/analytics/:tab?',
        name: 'analytics',
        component: AnalyticsDashboard,
        props: true,
        meta: { requiresAuth: true, roles: ['gestor', 'curator'] }
    }
]