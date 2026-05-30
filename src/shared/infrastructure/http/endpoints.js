const baseURL = import.meta.env.VITE_API_BASE_URL || ''

const buildEndpoint = (path) => baseURL ? `${baseURL}${path}` : path

export const endpoints = {
    auth: {
        signIn: buildEndpoint(import.meta.env.VITE_SIGNIN_ENDPOINT || '/sign-in'),
        signOut: buildEndpoint(import.meta.env.VITE_SIGNOUT_ENDPOINT || '/sign-out')
    },
    visiting: {
        scan: buildEndpoint(import.meta.env.VITE_VISITING_SCAN_ENDPOINT || '/visiting/scan'),
        artworkDetail: (code) => buildEndpoint(`/visiting/artworks/${code}`),
        ranking: buildEndpoint('/visiting/ranking')
    },
    operation: {
        capacity: buildEndpoint(import.meta.env.VITE_OPERATION_CAPACITY_ENDPOINT || '/operation/capacity'),
        alerts: buildEndpoint('/operation/alerts'),
        sensors: buildEndpoint('/operation/sensors')
    },
    analytics: {
        stats: buildEndpoint(import.meta.env.VITE_ANALYTICS_STATS_ENDPOINT || '/analytics/stats'),
        ranking: buildEndpoint('/analytics/ranking'),
        sponsors: buildEndpoint('/analytics/sponsors')
    },
    maintenance: {
        schedule: buildEndpoint(import.meta.env.VITE_MAINTENANCE_SCHEDULE_ENDPOINT || '/maintenance/schedule'),
        restore: buildEndpoint(import.meta.env.VITE_MAINTENANCE_RESTORE_ENDPOINT || '/maintenance/restore'),
        tasks: buildEndpoint(import.meta.env.VITE_MAINTENANCE_TASKS_ENDPOINT || '/maintenance/tasks')
    }
}