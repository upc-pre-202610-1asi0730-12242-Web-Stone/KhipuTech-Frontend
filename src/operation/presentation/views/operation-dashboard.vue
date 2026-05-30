<template>
  <SharedLayout
      :menu-items="menuItems"
      :current-tab="activeTab"
      @update:tab="navegarATab"
      @logout="handleLogout"
  >
    <template #content>
      <div class="content-area">
        <!-- TAB: CONTROL DE AFORO -->
        <div v-if="activeTab === 'aforo'" class="tab-content">
          <CapacityCards
              :total-en-museo="operationStore.aforo.totalEnMuseo"
              :salas-criticas="operationStore.aforo.salasCriticas"
              :capacidad-total="operationStore.aforo.capacidadTotal"
              :ingresos-hoy="operationStore.aforo.ingresosHoy"
          />
          <CapacityTable :salas="operationStore.aforoPorSala" />
          <MapaVisual
              :mapas="operationStore.mapasSalas"
              @guardar-config="guardarConfigMapas"
              @exportar-pdf="exportarMapasPDF"
              @exportar-excel="exportarMapasExcel"
          />
        </div>
        <!-- TAB: ALERTAS -->
        <div v-if="activeTab === 'alertas'" class="tab-content">
          <div class="two-columns">
            <AlertasActivas :alertas="operationStore.alertasActivas" />
            <ConfigAlertas
                :umbral-moderada="operationStore.config.umbralModerada"
                :umbral-critica="operationStore.config.umbralCritica"
                :notificaciones="operationStore.config.notificaciones"
                :contacto-defensa-civil="operationStore.config.contactoDefensaCivil"
                @update:umbral-moderada="updateUmbral('moderada', $event)"
                @update:umbral-critica="updateUmbral('critica', $event)"
                @update:notificaciones="updateNotificaciones"
                @update:contacto-defensa-civil="updateContacto"
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
          <EstadoSensores :sensores="operationStore.sensores" />
        </div>
        <!-- TAB: MANTENIMIENTO -->
        <div v-if="activeTab === 'mantenimiento'" class="tab-content">
          <MaintenanceList />
        </div>
      </div>
    </template>
  </SharedLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useIamStore } from '../../../iam/application/iam-store'
import { useOperationStore } from '../../application/operation.store'
import SharedLayout from '../../../shared/presentation/components/layout.vue'
import CapacityCards from '../components/capacitycards.vue'
import CapacityTable from '../components/capacitytable.vue'
import MapaVisual from '../components/mapavisual.vue'
import AlertasActivas from '../components/alertasactivas.vue'
import ConfigAlertas from '../components/configalertas.vue'
import ProtocoloEvacuacion from '../components/protocoloevacuacion.vue'
import ReporteAutoridades from '../components/reporteautoridades.vue'
import EstadoSensores from '../components/estadosensores.vue'
import MaintenanceList from '../components/maintenance-list.vue'

const props = defineProps({
  tab: { type: String, default: 'aforo' }
})

const iamStore = useIamStore()
const operationStore = useOperationStore()
const router = useRouter()
const route = useRoute()
const activeTab = ref(props.tab)

// Lista de tabs válidas
const validTabs = ['aforo', 'alertas', 'defensaCivil', 'mantenimiento']
const tabToPath = {
  aforo: 'aforo',
  alertas: 'alertas',
  defensaCivil: 'defensa-civil',
  mantenimiento: 'mantenimiento'
}
const pathToTab = {
  aforo: 'aforo',
  alertas: 'alertas',
  'defensa-civil': 'defensaCivil',
  'mantenimiento': 'mantenimiento'
}

// Sincronizar activeTab con el parámetro de ruta
watch(() => props.tab, (newTab) => {
  if (newTab && validTabs.includes(newTab)) {
    activeTab.value = newTab
  } else if (newTab && pathToTab[newTab]) {
    activeTab.value = pathToTab[newTab]
  } else {
    activeTab.value = 'aforo'
  }
}, { immediate: true })

// Navegar cuando cambia la pestaña desde el menú
const navegarATab = (tabId) => {
  const path = tabToPath[tabId]
  if (path && route.params.tab !== path) {
    router.push(`/operation/${path}`)
  }
}

const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}

const updateUmbral = (tipo, valor) => {
  if (tipo === 'moderada') operationStore.config.umbralModerada = valor
  else operationStore.config.umbralCritica = valor
}
const updateNotificaciones = (notif) => { operationStore.config.notificaciones = notif }
const updateContacto = (contacto) => { operationStore.config.contactoDefensaCivil = contacto }
const guardarConfiguracion = () => operationStore.guardarConfiguracion(operationStore.config)

const guardarConfigMapas = () => alert('Configuración de mapas guardada')
const exportarMapasPDF = () => alert('Exportando mapas a PDF')
const exportarMapasExcel = () => alert('Exportando mapas a Excel')
const activarAlertaGeneral = () => alert('ALERTA GENERAL - Evacuación')
const llamarDefensaCivil = () => alert(`Llamando a ${operationStore.config.contactoDefensaCivil}`)
const verProtocolo = () => alert('Protocolo de evacuación')
const enviarReporte = () => alert('Reporte enviado')

// Menu items (id debe coincidir con tabId que usamos en navegarATab)
const menuItems = [
  { id: 'aforo', name: 'Control de aforo', icon: '🚪' },
  { id: 'alertas', name: 'Alertas', icon: '⚠️' },
  { id: 'defensaCivil', name: 'Defensa Civil', icon: '🛡️' },
  { id: 'mantenimiento', name: 'Mantenimiento', icon: '🔧' }   // nuevo
]
</script>

<style scoped>
.content-area { padding: 30px; }
.two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
@media (max-width: 768px) { .two-columns { grid-template-columns: 1fr; } }
</style>