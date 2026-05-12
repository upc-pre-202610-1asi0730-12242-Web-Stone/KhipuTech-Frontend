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
          <!-- TAB: DASHBOARD PRINCIPAL -->
          <div v-if="activeTab === 'dashboard'" class="tab-content">
            <StatsCards
                :visitantes-hoy="stats.visitantesHoy"
                :visitantes-change="stats.visitantesChange"
                :obras-escaneadas="stats.obrasEscaneadas"
                :obras-change="stats.obrasChange"
                :duracion-media="stats.duracionMedia"
                :duracion-change="stats.duracionChange"
                :nps="stats.nps"
                :nps-change="stats.npsChange"
            />
            <div class="two-columns">
              <TopArtworksTable :obras="obrasMasVisitadas" />
              <VisitsChart
                  :data="visitsByHour"
                  :labels="hours"
                  :max-visitas="maxVisitsHour"
                  :promedio-visitas="avgVisitsPerHour"
                  @export-excel="exportToExcel"
                  @export-pdf="exportToPDF"
              />
            </div>
          </div>
          <!-- TAB: RANKING DE OBRAS -->
          <div v-if="activeTab === 'ranking'" class="tab-content">
            <RankingList
                :rankings="rankingObras"
                :periods="rankingPeriods"
                :current-period="currentRankingPeriod"
                @update:period="currentRankingPeriod = $event"
            />
          </div>
          <!-- TAB: SPONSORS -->
          <div v-if="activeTab === 'sponsors'" class="tab-content">
            <SponsorsSection
                :ingresos-mes="ingresosMes"
                :sponsors-activos="sponsorsActivos"
                :impresiones-totales="impresionesTotales"
                :sponsors="sponsors"
                @add-sponsor="agregarSponsor"
                @export-pdf="exportSponsorsPDF"
            />
          </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useIamStore } from '@/iam/application/iam-store.js'
import { usePrivateStore } from '@/museum/application/private.store.js'
import { useVisitorStore } from '@/visitor/application/visitor.store.js'
import { useRouter } from 'vue-router'
import SharedLayout from '../../../shared/presentation/components/layout.vue'
import StatsCards from '../components/statscards.vue'
import TopArtworksTable from '../components/topartworkstable.vue'
import VisitsChart from '../components/visitschart.vue'
import RankingList from '../components/rankinglist.vue'
import SponsorsSection from '../components/sponsorssection.vue'
import ConfigAlertas from "../components/configalertas.vue"
import ProtocoloEvacuacion from "../components/protocoloevacuacion.vue"
import CapacityTable from "../components/capacitytable.vue"
import ReporteAutoridades from "../components/reporteautoridades.vue"
import CapacityCards from "../components/capacitycards.vue"
import AlertasActivas from "../components/alertasactivas.vue"
import MapaVisual from "../components/mapavisual.vue"
import EstadoSensores from "../components/estadosensores.vue"

const iamStore = useIamStore()
const privateStore = usePrivateStore()
const visitorStore = useVisitorStore()
const router = useRouter()
const activeTab = ref('dashboard')

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'ranking', name: 'Ranking obras', icon: '🏆' },
  { id: 'sponsors', name: 'Sponsors', icon: '🤝' },
  { id: 'aforo', name: 'Control de aforo', icon: '🚪' },
  { id: 'alertas', name: 'Alertas', icon: '⚠️' },
  { id: 'defensaCivil', name: 'Defensa Civil', icon: '🛡️' }
]

// ========== DASHBOARD PRINCIPAL ==========
const stats = ref({
  visitantesHoy: 284,
  visitantesChange: 12,
  obrasEscaneadas: 1247,
  obrasChange: 8,
  duracionMedia: 47,
  duracionChange: 5,
  nps: 72,
  npsChange: 4
})

const obrasMasVisitadas = computed(() =>
    privateStore.artworkStats.map(s => {
      const artwork = visitorStore.artworks.find(a => a.id === s.artworkId)
      return {
        id: s.id,
        nombre: artwork?.name || 'Sin nombre',
        sala: artwork?.room || '-',
        visitas: s.visits,
        retencion: s.retentionPercentage,
        estado: 'abierto'
      }
    })
)

const visitsByHour = ref([12, 8, 5, 7, 15, 28, 45, 62, 58, 42, 35, 48, 72, 85, 68, 54, 38, 25, 18, 12, 8, 6, 4, 3])
const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
const maxVisitsHour = computed(() => Math.max(...visitsByHour.value))
const avgVisitsPerHour = computed(() => Math.round(visitsByHour.value.reduce((a, b) => a + b, 0) / 24))

// ========== RANKING ==========
const rankingPeriods = ref(['Hoy', 'Esta semana', 'Este mes'])
const currentRankingPeriod = ref('Esta semana')

const rankingObras = computed(() =>
    [...privateStore.artworkStats]
        .sort((a, b) => b.score - a.score)
        .map((s, index) => {
          const artwork = visitorStore.artworks.find(a => a.id === s.artworkId)
          return {
            id: s.id,
            nombre: artwork?.name || 'Sin nombre',
            sala: artwork?.room || '-',
            artista: artwork?.author || '-',
            engagement: s.retentionPercentage,
            tiempoPromedio: s.retentionMinutes,
            trend: index < 3 ? 'up' : 'down'
          }
        })
)

// ========== SPONSORS ==========
const ingresosMes = ref(28450)
const sponsorsActivos = ref(8)
const impresionesTotales = ref(15780)
const sponsors = ref([
  { id: 1, nombre: 'Coca-Cola', sala: 'Sala 1 - Arte Moderno', impresiones: 3420, aportado: 8500, estado: 'activo' },
  { id: 2, nombre: 'Banco Interbank', sala: 'Sala 2 - Contemporáneo', impresiones: 2890, aportado: 7200, estado: 'activo' }
])

// ========== ALERTAS ==========
const config = ref({
  umbralModerada: 80,
  umbralCritica: 95,
  notificaciones: { correo: true, whatsapp: false, sms: false, panel: true },
  contactoDefensaCivil: '911 - 123 456'
})

// ========== CONTROL DE AFORO ==========
const aforoPorSala = computed(() =>
    privateStore.sensors.map(s => {
      let estadoClase = 'normal'
      let estadoTexto = 'Normal'
      if (s.occupancyPercentage >= 100) { estadoClase = 'critica'; estadoTexto = 'Sobrepasado' }
      else if (s.occupancyPercentage >= config.value.umbralCritica) { estadoClase = 'critica'; estadoTexto = 'Crítico' }
      else if (s.occupancyPercentage >= config.value.umbralModerada) { estadoClase = 'moderada'; estadoTexto = 'Alerta' }
      return {
        id: s.id,
        nombre: s.room,
        actual: s.currentPersons,
        capacidad: s.capacity,
        porcentaje: s.occupancyPercentage,
        estadoClase,
        estadoTexto
      }
    })
)

const aforo = computed(() => ({
  totalEnMuseo: privateStore.sensors.reduce((acc, s) => acc + s.currentPersons, 0),
  salasCriticas: aforoPorSala.value.filter(s => s.estadoClase !== 'normal').length,
  capacidadTotal: privateStore.sensors.reduce((acc, s) => acc + s.capacity, 0),
  ingresosHoy: 1248
}))

const mapasSalas = computed(() =>
    privateStore.sensors.map(s => ({
      id: s.id,
      nombre: s.room,
      asientos: s.capacity,
      ocupados: s.currentPersons,
      estadoClase: aforoPorSala.value.find(a => a.id === s.id)?.estadoClase || 'normal',
      estadoTexto: aforoPorSala.value.find(a => a.id === s.id)?.estadoTexto || 'Normal'
    }))
)

// ========== SENSORES ==========
const sensores = computed(() =>
    privateStore.sensors.map(s => ({
      id: s.id,
      nombre: `Sensor ${s.room}`,
      ubicacion: s.room,
      estado: 'activo'
    }))
)

// ========== ALERTAS ACTIVAS ==========
const alertasActivas = computed(() =>
    aforoPorSala.value
        .filter(s => s.estadoClase !== 'normal')
        .map(s => ({
          id: s.id,
          sala: s.nombre,
          tipo: s.estadoClase,
          mensaje: s.estadoTexto === 'Sobrepasado'
              ? `¡OCUPACIÓN EXCEDIDA! ${s.porcentaje}% de capacidad`
              : `Ocupación al ${s.porcentaje}% - Cerca del umbral crítico`,
          tiempo: 'Ahora'
        }))
)

// ========== ONMOUNTED ==========
onMounted(async () => {
  await Promise.all([
    privateStore.fetchArtworkStats(),
    privateStore.fetchSensors(),
    visitorStore.fetchArtworks()
  ])
})

// ========== FUNCIONES ==========
const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}

const exportToExcel = () => alert('📊 Exportando a Excel...')
const exportToPDF = () => alert('📄 Exportando a PDF...')
const exportSponsorsPDF = () => alert('📄 Exportando sponsors a PDF')
const agregarSponsor = () => alert('➕ Agregar nuevo sponsor')
const guardarConfiguracion = () => alert('✅ Configuración guardada exitosamente')
const guardarConfigMapas = () => alert('💾 Configuración de mapas guardada')
const exportarMapasPDF = () => alert('📄 Exportando mapas a PDF')
const exportarMapasExcel = () => alert('📊 Exportando mapas a Excel')
const activarAlertaGeneral = () => alert('🚨 ALERTA GENERAL ACTIVADA')
const llamarDefensaCivil = () => alert(`📞 Llamando a Defensa Civil: ${config.value.contactoDefensaCivil}`)
const verProtocolo = () => alert('📄 Abriendo protocolo de evacuación completo')
const enviarReporte = () => alert('📨 Reporte enviado a Defensa Civil')

watch([() => config.value.umbralModerada, () => config.value.umbralCritica], () => {
  aforoPorSala.value
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

@media (max-width: 1200px) {
  .two-columns {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 15px;
  }
}
</style>