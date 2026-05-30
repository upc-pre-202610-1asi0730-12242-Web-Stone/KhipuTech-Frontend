import { defineStore } from 'pinia'

export const useOperationStore = defineStore('operation', {
    state: () => ({
        aforo: {
            totalEnMuseo: 851,
            salasCriticas: 2,
            capacidadTotal: 1000,
            ingresosHoy: 1248
        },
        aforoPorSala: [
            { id: 1, nombre: 'Sala 1 - Arte Moderno', actual: 145, capacidad: 200, porcentaje: 73, estadoClase: 'normal', estadoTexto: 'Normal' },
            { id: 2, nombre: 'Sala 2 - Contemporáneo', actual: 178, capacidad: 200, porcentaje: 89, estadoClase: 'moderada', estadoTexto: 'Crítico' },
            { id: 3, nombre: 'Sala 3 - Clásico', actual: 210, capacidad: 200, porcentaje: 105, estadoClase: 'critica', estadoTexto: 'Sobrepasado' }
        ],
        mapasSalas: [
            { id: 1, nombre: 'Sala 1 - Arte Moderno', asientos: 200, ocupados: 145, estadoClase: 'normal', estadoTexto: 'Normal' },
            { id: 2, nombre: 'Sala 2 - Contemporáneo', asientos: 200, ocupados: 178, estadoClase: 'moderada', estadoTexto: 'Crítico' },
            { id: 3, nombre: 'Sala 3 - Clásico', asientos: 200, ocupados: 210, estadoClase: 'critica', estadoTexto: 'Sobrepasado' }
        ],
        config: {
            umbralModerada: 80,
            umbralCritica: 95,
            notificaciones: { correo: true, whatsapp: false, sms: false, panel: true },
            contactoDefensaCivil: '911 - 123 456'
        },
        alertasActivas: [
            { id: 1, sala: 'Sala 2 - Contemporáneo', tipo: 'moderada', mensaje: 'Ocupación al 89% - Cerca del umbral crítico', tiempo: 'Hace 5 minutos' },
            { id: 2, sala: 'Sala 3 - Clásico', tipo: 'critica', mensaje: '¡OCUPACIÓN EXCEDIDA! 105% de capacidad', tiempo: 'Hace 12 minutos' }
        ],
        sensores: [
            { id: 1, nombre: 'Sensor entrada principal', ubicacion: 'Puerta principal', estado: 'activo' },
            { id: 2, nombre: 'Sensor Sala Central', ubicacion: 'Sala 2', estado: 'activo' }
        ]
    }),
    actions: {
        actualizarPorcentajes() {
            this.aforoPorSala.forEach(sala => {
                sala.porcentaje = Math.round((sala.actual / sala.capacidad) * 100)
                if (sala.porcentaje >= 100) {
                    sala.estadoClase = 'critica'
                    sala.estadoTexto = 'Sobrepasado'
                } else if (sala.porcentaje >= this.config.umbralCritica) {
                    sala.estadoClase = 'critica'
                    sala.estadoTexto = 'Crítico'
                } else if (sala.porcentaje >= this.config.umbralModerada) {
                    sala.estadoClase = 'moderada'
                    sala.estadoTexto = 'Alerta'
                } else {
                    sala.estadoClase = 'normal'
                    sala.estadoTexto = 'Normal'
                }
            })
            this.aforo.salasCriticas = this.aforoPorSala.filter(s => s.estadoClase !== 'normal').length
        },
        guardarConfiguracion(config) {
            this.config = { ...this.config, ...config }
            this.actualizarPorcentajes()
        }
    }
})