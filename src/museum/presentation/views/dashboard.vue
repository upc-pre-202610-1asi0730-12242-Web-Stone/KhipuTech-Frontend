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
          <div v-if="activeTab === 'ranking'" class="tab-content">
            <RankingList
                :rankings="rankingObras"
                :periods="rankingPeriods"
                :current-period="currentRankingPeriod"
                @update:period="currentRankingPeriod = $event"
            />
          </div>
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
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../../iam/application/iam-store'
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

const { t } = useI18n()
const iamStore = useIamStore()
const router = useRouter()
const activeTab = ref('dashboard')

const menuItems = computed(() => [
  { id: 'dashboard', name: t('nav.dashboard'), icon: '📊' },
  { id: 'ranking', name: t('nav.ranking'), icon: '🏆' },
  { id: 'sponsors', name: t('nav.sponsors'), icon: '🤝' },
  { id: 'aforo', name: t('nav.aforo'), icon: '🚪' },
  { id: 'alertas', name: t('nav.alertas'), icon: '⚠️' },
  { id: 'defensaCivil', name: t('nav.defensaCivil'), icon: '🛡️' }
])

const stats = ref({ visitantesHoy: 284, visitantesChange: 12, obrasEscaneadas: 1247, obrasChange: 8, duracionMedia: 47, duracionChange: 5, nps: 72, npsChange: 4 })

const obrasMasVisitadas = ref([
  { id: 1, nombre: 'La persistencia de la memoria', sala: 'Sala 2', visitas: 342, retencion: 78, estado: 'abierto' },
  { id: 2, nombre: 'La noche estrellada', sala: 'Sala 1', visitas: 298, retencion: 65, estado: 'abierto' },
  { id: 3, nombre: 'El grito', sala: 'Sala 1', visitas: 256, retencion: 54, estado: 'mantenimiento' },
  { id: 4, nombre: 'Guernica', sala: 'Sala 3', visitas: 187, retencion: 82, estado: 'abierto' },
  { id: 5, nombre: 'El beso', sala: 'Sala 2', visitas: 165, retencion: 71, estado: 'abierto' }
])

const visitsByHour = ref([12, 8, 5, 7, 15, 28, 45, 62, 58, 42, 35, 48, 72, 85, 68, 54, 38, 25, 18, 12, 8, 6, 4, 3])
const hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
const maxVisitsHour = computed(() => Math.max(...visitsByHour.value))
const avgVisitsPerHour = computed(() => Math.round(visitsByHour.value.reduce((a, b) => a + b, 0) / 24))

const rankingPeriods = computed(() => [t('rankingPeriods.today'), t('rankingPeriods.thisWeek'), t('rankingPeriods.thisMonth')])
const currentRankingPeriod = ref('')
watch(rankingPeriods, (val) => { if (!currentRankingPeriod.value) currentRankingPeriod.value = val[1] }, { immediate: true })

const rankingObras = ref([
  { id: 1, nombre: 'La persistencia de la memoria', sala: 'Sala 2', artista: 'Salvador Dalí', engagement: 98, tiempoPromedio: 4.2, trend: 'up' },
  { id: 2, nombre: 'La noche estrellada', sala: 'Sala 1', artista: 'Van Gogh', engagement: 92, tiempoPromedio: 3.8, trend: 'up' },
  { id: 3, nombre: 'El beso', sala: 'Sala 2', artista: 'Gustav Klimt', engagement: 87, tiempoPromedio: 3.5, trend: 'down' },
  { id: 4, nombre: 'Guernica', sala: 'Sala 3', artista: 'Picasso', engagement: 81, tiempoPromedio: 4.5, trend: 'down' },
  { id: 5, nombre: 'El pensador', sala: 'Sala 3', artista: 'Rodin', engagement: 76, tiempoPromedio: 3.2, trend: 'up' }
])

const ingresosMes = ref(28450)
const sponsorsActivos = ref(8)
const impresionesTotales = ref(15780)
const sponsors = ref([
  { id: 1, nombre: 'Coca-Cola', sala: 'Sala 1 - Arte Moderno', impresiones: 3420, aportado: 8500, estado: 'activo' },
  { id: 2, nombre: 'Banco Interbank', sala: 'Sala 2 - Contemporáneo', impresiones: 2890, aportado: 7200, estado: 'activo' },
  { id: 3, nombre: 'Movistar', sala: 'Sala 3 - Clásico', impresiones: 2150, aportado: 5400, estado: 'activo' },
  { id: 4, nombre: 'Backus', sala: 'Cafetería', impresiones: 1890, aportado: 4200, estado: 'inactivo' },
  { id: 5, nombre: 'Samsung', sala: 'Entrada Principal', impresiones: 3120, aportado: 7800, estado: 'activo' }
])

const aforo = ref({ totalEnMuseo: 851, salasCriticas: 2, capacidadTotal: 1000, ingresosHoy: 1248 })

const aforoPorSala = computed(() => [
  { id: 1, nombre: 'Sala 1 - Arte Moderno', actual: 145, capacidad: 200, porcentaje: 73, estadoClase: 'normal', estadoTexto: t('museum.capacity.statusNormal') },
  { id: 2, nombre: 'Sala 2 - Contemporáneo', actual: 178, capacidad: 200, porcentaje: 89, estadoClase: 'moderada', estadoTexto: t('museum.capacity.statusCritical') },
  { id: 3, nombre: 'Sala 3 - Clásico', actual: 210, capacidad: 200, porcentaje: 105, estadoClase: 'critica', estadoTexto: t('museum.capacity.statusExceeded') },
  { id: 4, nombre: 'Sala 4 - Temporal', actual: 95, capacidad: 150, porcentaje: 63, estadoClase: 'normal', estadoTexto: t('museum.capacity.statusNormal') },
  { id: 5, nombre: 'Sala 5 - Esculturas', actual: 82, capacidad: 120, porcentaje: 68, estadoClase: 'normal', estadoTexto: t('museum.capacity.statusNormal') }
])

const mapasSalas = computed(() => [
  { id: 1, nombre: 'Sala 1 - Arte Moderno', asientos: 200, ocupados: 145, estadoClase: 'normal', estadoTexto: t('museum.capacity.statusNormal') },
  { id: 2, nombre: 'Sala 2 - Contemporáneo', asientos: 200, ocupados: 178, estadoClase: 'moderada', estadoTexto: t('museum.capacity.statusCritical') },
  { id: 3, nombre: 'Sala 3 - Clásico', asientos: 200, ocupados: 210, estadoClase: 'critica', estadoTexto: t('museum.capacity.statusExceeded') }
])

const config = ref({ umbralModerada: 80, umbralCritica: 95, notificaciones: { correo: true, whatsapp: false, sms: false, panel: true }, contactoDefensaCivil: '911 - 123 456' })

const alertasActivas = ref([
  { id: 1, sala: 'Sala 2 - Contemporáneo', tipo: 'moderada', mensaje: 'Ocupación al 89% - Cerca del umbral crítico', tiempo: 'Hace 5 minutos' },
  { id: 2, sala: 'Sala 3 - Clásico', tipo: 'critica', mensaje: '¡OCUPACIÓN EXCEDIDA! 105% de capacidad', tiempo: 'Hace 12 minutos' }
])

const sensores = ref([
  { id: 1, nombre: 'Sensor entrada principal', ubicacion: 'Puerta principal', estado: 'activo' },
  { id: 2, nombre: 'Sensor Sala Central', ubicacion: 'Sala 2', estado: 'activo' },
  { id: 3, nombre: 'Sensor jardín', ubicacion: 'Jardín esculturas', estado: 'inactivo' },
  { id: 4, nombre: 'Sensor Sala 3', ubicacion: 'Sala Clásica', estado: 'activo' }
])

const handleLogout = () => { iamStore.signOut(); router.push('/sign-in') }
const exportToExcel = () => alert('📊 Exporting to Excel...')
const exportToPDF = () => alert('📄 Exporting to PDF...')
const exportSponsorsPDF = () => alert('📄 Exporting sponsors to PDF')
const agregarSponsor = () => alert('➕ Add new sponsor')
const guardarConfiguracion = () => { alert('✅ Configuration saved successfully') }
const guardarConfigMapas = () => alert('💾 Map configuration saved')
const exportarMapasPDF = () => alert('📄 Exporting maps to PDF')
const exportarMapasExcel = () => alert('📊 Exporting maps to Excel')
const activarAlertaGeneral = () => alert('🚨 GENERAL ALERT ACTIVATED – Evacuation protocol started')
const llamarDefensaCivil = () => alert(`📞 Calling Civil Defense: ${config.value.contactoDefensaCivil}`)
const verProtocolo = () => alert('📄 Opening complete evacuation protocol')
const enviarReporte = () => alert('📨 Report sent to Civil Defense')
</script>

<style scoped>
.dashboard-container { display: flex; min-height: 100vh; background: #f5f7fb; }
.content-area { padding: 30px; width: 100%; }
.tab-content { width: 100%; }
.two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px; }
@media (max-width: 1200px) { .two-columns { grid-template-columns: 1fr; gap: 20px; } }
@media (max-width: 768px) { .content-area { padding: 15px; } }
</style>
