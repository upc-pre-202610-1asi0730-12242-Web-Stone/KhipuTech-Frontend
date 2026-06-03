import ManagerDashboard from './manager-dashboard.vue'

export default [
    {
        path: '/manager/:section/:tab?',
        name: 'manager',
        component: ManagerDashboard,
        props: true,
        meta: { requiresAuth: true, roles: ['gestor'] }
    }
]