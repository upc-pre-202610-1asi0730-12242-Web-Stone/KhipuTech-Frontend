import { defineStore } from 'pinia'

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        stats: { visitantesHoy: 284, visitantesChange: 12, ... },
        obrasMasVisitadas: [],
        visitsByHour: [],
        rankingObras: [],
        sponsors: [],
        ingresosMes: 28450,
        sponsorsActivos: 8,
        impresionesTotales: 15780
    }),
    actions: {
        exportToExcel() { alert('📊 Exportando a Excel...') },
        exportToPDF() { alert('📄 Exportando a PDF...') },
        exportSponsorsPDF () { alert('📄 Exportando sponsors a PDF') },
        agregarSponsor() { alert('➕ Agregar nuevo sponsor') }
    }
})