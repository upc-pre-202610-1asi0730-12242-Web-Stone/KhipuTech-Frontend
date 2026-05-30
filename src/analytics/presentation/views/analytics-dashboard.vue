<template>
  <div class="dashboard-container">
    <SharedLayout
        :menu-items="menuItems"
        :current-tab="activeTab"
        @update:tab="navegarATab"
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
        </div>
      </template>
    </SharedLayout>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useIamStore } from '../../../iam/application/iam-store.js'
import SharedLayout from '../../../shared/presentation/components/layout.vue'
import StatsCards from '../components/statscards.vue'
import TopArtworksTable from '../components/topartworkstable.vue'
import VisitsChart from '../components/visitschart.vue'
import RankingList from '../components/rankinglist.vue'
import SponsorsSection from '../components/sponsorssection.vue'

const props = defineProps({
  tab: { type: String, default: 'dashboard' }
})

const iamStore = useIamStore()
const router = useRouter()
const route = useRoute()
const activeTab = ref(props.tab)

// Nombres internos de pestaña (id) y su correspondiente segmento URL
const tabToPath = {
  dashboard: 'dashboard',
  ranking: 'ranking',
  sponsors: 'sponsors'
}
const pathToTab = {
  dashboard: 'dashboard',
  ranking: 'ranking',
  sponsors: 'sponsors'
}
const validTabs = ['dashboard', 'ranking', 'sponsors']

// Sincronizar activeTab con el parámetro de ruta
watch(() => props.tab, (newTab) => {
  if (newTab && validTabs.includes(newTab)) {
    activeTab.value = newTab
  } else if (newTab && pathToTab[newTab]) {
    activeTab.value = pathToTab[newTab]
  } else {
    activeTab.value = 'dashboard'
  }
}, { immediate: true })

// Navegar cuando se cambia la pestaña desde el menú
const navegarATab = (tabId) => {
  const path = tabToPath[tabId]
  if (path && route.params.tab !== path) {
    router.push(`/analytics/${path}`)
  }
}

const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}

// ========== DATOS (pueden moverse a un store después) ==========
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

const obrasMasVisitadas = ref([
  { id: 1, nombre: 'La persistencia de la memoria', sala: 'Sala 2', visitas: 342, retencion: 78, estado: 'abierto' },
  { id: 2, nombre: 'La noche estrellada', sala: 'Sala 1', visitas: 298, retencion: 65, estado: 'abierto' },
  { id: 3, nombre: 'El grito', sala: 'Sala 1', visitas: 256, retencion: 54, estado: 'mantenimiento' },
  { id: 4, nombre: 'Guernica', sala: 'Sala 3', visitas: 187, retencion: 82, estado: 'abierto' },
  { id: 5, nombre: 'El beso', sala: 'Sala 2', visitas: 165, retencion: 71, estado: 'abierto' }
])

const visitsByHour = ref([12, 8, 5, 7, 15, 28, 45, 62, 58, 42, 35, 48, 72, 85, 68, 54, 38, 25, 18, 12, 8, 6, 4, 3])
const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']

const maxVisitsHour = computed(() => Math.max(...visitsByHour.value))
const avgVisitsPerHour = computed(() => Math.round(visitsByHour.value.reduce((a, b) => a + b, 0) / 24))

const rankingPeriods = ref(['Hoy', 'Esta semana', 'Este mes'])
const currentRankingPeriod = ref('Esta semana')

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

const exportToExcel = () => alert('📊 Exportando a Excel...')
const exportToPDF = () => alert('📄 Exportando a PDF...')
const exportSponsorsPDF = () => alert('📄 Exportando sponsors a PDF')
const agregarSponsor = () => alert('➕ Agregar nuevo sponsor')

// Menu items (solo los de analytics)
const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'ranking', name: 'Ranking obras', icon: '🏆' },
  { id: 'sponsors', name: 'Sponsors', icon: '🤝' }
]
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
  .two-columns { grid-template-columns: 1fr; gap: 20px; }
}
@media (max-width: 768px) {
  .content-area { padding: 15px; }
}
</style>