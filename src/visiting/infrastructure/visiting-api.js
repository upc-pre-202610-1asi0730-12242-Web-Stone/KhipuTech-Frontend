import { httpClient } from '../../shared/infrastructure/http/http-client'
import { endpoints } from '../../shared/infrastructure/http/endpoints'

export const visitingApi = {
    async scanQR(code) {
        // Si estamos en modo mock sin backend real, devolver datos simulados
        if (import.meta.env.VITE_USE_MOCK === 'true' && !import.meta.env.VITE_API_BASE_URL) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const validCodes = {
                        'KH-2025-001': {
                            id: 1,
                            code: 'KH-2025-001',
                            title: 'La persistencia de la memoria',
                            artist: 'Salvador Dalí',
                            year: '1931',
                            style: 'Surrealismo',
                            description: '...',
                            maintenanceBlocked: false,
                            needsMaintenance: false
                        },
                        'MOMA-001': {
                            id: 2,
                            code: 'MOMA-001',
                            title: 'La noche estrellada',
                            artist: 'Van Gogh',
                            year: '1889',
                            maintenanceBlocked: false,
                            needsMaintenance: true
                        },
                        'BLOCKED-001': {
                            id: 3,
                            code: 'BLOCKED-001',
                            title: 'Obra en mantenimiento',
                            artist: 'Desconocido',
                            year: '2024',
                            maintenanceBlocked: true,
                            needsMaintenance: false
                        }
                    }
                    const artwork = validCodes[code]
                    if (artwork) {
                        resolve(artwork)
                    } else {
                        reject(new Error('Código QR no válido'))
                    }
                }, 500)
            })
        }

        const response = await httpClient.post(endpoints.visiting.scan, { code })
        return response.data
    },

    async getRanking(period) {
        // Logica
    }
}