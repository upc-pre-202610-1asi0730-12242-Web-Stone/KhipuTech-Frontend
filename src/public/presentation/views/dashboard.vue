<template>
  <div class="dashboard-container">
    <SharedLayout
        :menu-items="menuItems"
        :current-tab="activeTab"
        @update:tab="activeTab = $event"
        @logout="handleLogout"
    >
      <template #content>
        <div class="content-area">
          <!-- TAB: CONTROL DE AFORO -->
          <div v-if="activeTab === 'aforo'" class="tab-content">
            <CapacityCards
                :total-en-museo="aforo.totalEnMuseo"
                :salas-criticas="aforo.salasCriticas"
                :capacidad-total="aforo.capacidadTotal"
                :ingresos-hoy="aforo.ingresosHoy"
            />
            <CapacityTable :salas="aforoPorSala" />
            <MapaVisual
                :mapas="mapasSalas"
                @guardar-config="guardarConfigMapas"
                @exportar-pdf="exportarMapasPDF"
                @exportar-excel="exportarMapasExcel"
            />
          </div>

          <!-- TAB: ALERTAS -->
          <div v-if="activeTab === 'alertas'" class="tab-content">
            <div class="two-columns">
              <AlertasActivas :alertas="alertasActivas" />
              <ConfigAlertas
                  :umbral-moderada="config.umbralModerada"
                  :umbral-critica="config.umbralCritica"
                  :notificaciones="config.notificaciones"
                  :contacto-defensa-civil="config.contactoDefensaCivil"
                  @update:umbral-moderada="config.umbralModerada = $event"
                  @update:umbral-critica="config.umbralCritica = $event"
                  @update:notificaciones="config.notificaciones = $event"
                  @update:contacto-defensa-civil="config.contactoDefensaCivil = $event"
                  @guardar="guardarConfiguracion"
              />
            </div>
          </div>

          <!-- TAB: DEFENSA CIVIL -->
          <div v-if="activeTab === 'defensaCivil'" class="tab-content">
            <div class="two-columns">
              <ProtocoloEvacuacion
                  @activar-alerta-general="activarAlertaGeneral"
                  @llamar-defensa-civil="llamarDefensaCivil"
                  @ver-protocolo="verProtocolo"
              />
              <ReporteAutoridades @enviar-reporte="enviarReporte" />
            </div>
            <EstadoSensores :sensores="sensores" />
          </div>
        </div>
      </template>
    </SharedLayout>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useIamStore } from '../../../iam/application/iam-store'
import SharedLayout from '../../../shared/presentation/components/layout.vue'
import CapacityCards from '../components/capacitycards.vue'
import CapacityTable from '../components/capacitytable.vue'
import MapaVisual from '../components/mapavisual.vue'
import AlertasActivas from '../components/alertasactivas.vue'
import ConfigAlertas from '../components/configalertas.vue'
import ProtocoloEvacuacion from '../components/protocoloevacuacion.vue'
import ReporteAutoridades from '../components/reporteautoridades.vue'
import EstadoSensores from '../components/estadosensores.vue'

const iamStore = useIamStore()
const router = useRouter()
const activeTab = ref('aforo')
const user = computed(() => iamStore.user)

const menuItems = [
  { id: 'aforo', name: 'Control de aforo', icon: '🚪' },
  { id: 'alertas', name: 'Alertas', icon: '⚠️' },
  { id: 'defensaCivil', name: 'Defensa Civil', icon: '🛡️' }
]

// ========== CONTROL DE AFORO ==========
const aforo = ref({
  totalEnMuseo: 851,
  salasCriticas: 2,
  capacidadTotal: 1000,
  ingresosHoy: 1248
})

const aforoPorSala = ref([
  { id: 1, nombre: 'Sala 1 - Arte Moderno', actual: 145, capacidad: 200, porcentaje: 73, estadoClase: 'normal', estadoTexto: 'Normal' },
  { id: 2, nombre: 'Sala 2 - Contemporáneo', actual: 178, capacidad: 200, porcentaje: 89, estadoClase: 'moderada', estadoTexto: 'Crítico' },
  { id: 3, nombre: 'Sala 3 - Clásico', actual: 210, capacidad: 200, porcentaje: 105, estadoClase: 'critica', estadoTexto: 'Sobrepasado' },
  { id: 4, nombre: 'Sala 4 - Temporal', actual: 95, capacidad: 150, porcentaje: 63, estadoClase: 'normal', estadoTexto: 'Normal' },
  { id: 5, nombre: 'Sala 5 - Esculturas', actual: 82, capacidad: 120, porcentaje: 68, estadoClase: 'normal', estadoTexto: 'Normal' }
])

const mapasSalas = ref([
  { id: 1, nombre: 'Sala 1 - Arte Moderno', asientos: 200, ocupados: 145, estadoClase: 'normal', estadoTexto: 'Normal' },
  { id: 2, nombre: 'Sala 2 - Contemporáneo', asientos: 200, ocupados: 178, estadoClase: 'moderada', estadoTexto: 'Crítico' },
  { id: 3, nombre: 'Sala 3 - Clásico', asientos: 200, ocupados: 210, estadoClase: 'critica', estadoTexto: 'Sobrepasado' }
])

// ========== ALERTAS ==========
const config = ref({
  umbralModerada: 80,
  umbralCritica: 95,
  notificaciones: {
    correo: true,
    whatsapp: false,
    sms: false,
    panel: true
  },
  contactoDefensaCivil: '911 - 123 456'
})

const alertasActivas = ref([
  { id: 1, sala: 'Sala 2 - Contemporáneo', tipo: 'moderada', mensaje: 'Ocupación al 89% - Cerca del umbral crítico', tiempo: 'Hace 5 minutos' },
  { id: 2, sala: 'Sala 3 - Clásico', tipo: 'critica', mensaje: '¡OCUPACIÓN EXCEDIDA! 105% de capacidad', tiempo: 'Hace 12 minutos' }
])

// ========== SENSORES ==========
const sensores = ref([
  { id: 1, nombre: 'Sensor entrada principal', ubicacion: 'Puerta principal', estado: 'activo' },
  { id: 2, nombre: 'Sensor Sala Central', ubicacion: 'Sala 2', estado: 'activo' },
  { id: 3, nombre: 'Sensor jardín', ubicacion: 'Jardín esculturas', estado: 'inactivo' },
  { id: 4, nombre: 'Sensor Sala 3', ubicacion: 'Sala Clásica', estado: 'activo' }
])

// ========== FUNCIONES ==========
const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}

const actualizarPorcentajes = () => {
  aforoPorSala.value.forEach(sala => {
    sala.porcentaje = Math.round((sala.actual / sala.capacidad) * 100)
    if (sala.porcentaje >= 100) {
      sala.estadoClase = 'critica'
      sala.estadoTexto = 'Sobrepasado'
    } else if (sala.porcentaje >= config.value.umbralCritica) {
      sala.estadoClase = 'critica'
      sala.estadoTexto = 'Crítico'
    } else if (sala.porcentaje >= config.value.umbralModerada) {
      sala.estadoClase = 'moderada'
      sala.estadoTexto = 'Alerta'
    } else {
      sala.estadoClase = 'normal'
      sala.estadoTexto = 'Normal'
    }
  })
  aforo.value.salasCriticas = aforoPorSala.value.filter(s => s.estadoClase !== 'normal').length
}

const guardarConfiguracion = () => {
  actualizarPorcentajes()
  alert('✅ Configuración guardada exitosamente')
}

const guardarConfigMapas = () => alert('💾 Configuración de mapas guardada')
const exportarMapasPDF = () => alert('📄 Exportando mapas a PDF')
const exportarMapasExcel = () => alert('📊 Exportando mapas a Excel')

const activarAlertaGeneral = () => alert('🚨 ALERTA GENERAL ACTIVADA - Protocolo de evacuación iniciado')
const llamarDefensaCivil = () => alert(`📞 Llamando a Defensa Civil: ${config.value.contactoDefensaCivil}`)
const verProtocolo = () => alert('📄 Abriendo protocolo de evacuación completo')
const enviarReporte = () => alert('📨 Reporte enviado a Defensa Civil')

watch([() => config.value.umbralModerada, () => config.value.umbralCritica], () => {
  actualizarPorcentajes()
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.content-area {
  padding: 30px;
  width: 100%;
}

.tab-content {
  width: 100%;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 25px;
}

@media (max-width: 1024px) {
  .two-columns {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 15px;
  }
}
</style>