import MaintenanceDashboard from './maintenance-dashboard.vue'
export default [
    { path: '/maintenance/:tab?', component: MaintenanceDashboard,
        props: true, meta: { requiresAuth: true, roles: ['gestor'] } }
]