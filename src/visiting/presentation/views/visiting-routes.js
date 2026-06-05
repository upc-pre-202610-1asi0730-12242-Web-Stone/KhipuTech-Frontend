import VisitingDashboard from './visiting-dashboard.vue'
import RecorridoView from '../components/RecorridoView.vue'

export default [
    {
        path: '/visiting/:tab?',
        name: 'visiting',
        component: VisitingDashboard,
        props: true,
        meta: { requiresAuth: true, roles: ['public', 'visitor'] }
    },
    {
        path: '/recorrido/:tipo',
        name: 'recorrido',
        component: RecorridoView,
        props: true
    }
]