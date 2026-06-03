<template>
  <div class="operation-container">
    <!-- Pestañas internas -->
    <div class="operation-tabs">
      <button
          v-for="item in menuItems"
          :key="item.id"
          @click="navegarATab(item.id)"
          :class="['tab-button', { active: activeTab === item.id }]"
      >
        <span>{{ item.icon }}</span> {{ item.name }}
      </button>
    </div>

    <div class="operation-content">
      <!-- TAB: ALERTAS -->
      <div v-if="activeTab === 'alertas'" class="tab-content">
        <div class="two-columns">
          <AlertasActivas :alertas="store.alertasActivas" />
          <ConfigAlertas
              :umbral-moderada="store.config.umbralModerada"
              :umbral-critica="store.config.umbralCritica"
              :notificaciones="store.config.notificaciones"
              :contacto-defensa-civil="store.config.contactoDefensaCivil"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useOperationStore } from '../../application/operation.store'
import AlertasActivas from '../components/alertasactivas.vue'
import ConfigAlertas from '../components/configalertas.vue'
import ProtocoloEvacuacion from '../components/protocoloevacuacion.vue'
import ReporteAutoridades from '../components/reporteautoridades.vue'

const props = defineProps({
  tab: { type: String, default: 'alertas' }
})

const emit = defineEmits(['update:tab'])

const store = useOperationStore()
const activeTab = ref(props.tab)

const menuItems = [
  { id: 'alertas', name: 'Alertas', icon: '⚠️' },
  { id: 'defensaCivil', name: 'Defensa Civil', icon: '🛡️' }
]

watch(() => props.tab, (newTab) => {
  if (newTab) activeTab.value = newTab
}, { immediate: true })

const navegarATab = (tabId) => {
  if (tabId !== activeTab.value) {
    activeTab.value = tabId
    emit('update:tab', tabId)
  }
}

// Funciones de operación (igual que antes)
const updateUmbral = (tipo, valor) => {
  if (tipo === 'moderada') store.config.umbralModerada = valor
  else store.config.umbralCritica = valor
}
const updateNotificaciones = (notif) => { store.config.notificaciones = notif }
const updateContacto = (contacto) => { store.config.contactoDefensaCivil = contacto }
const guardarConfiguracion = () => store.guardarConfiguracion(store.config)

const activarAlertaGeneral = () => alert('ALERTA GENERAL - Evacuación')
const llamarDefensaCivil = () => alert(`Llamando a ${store.config.contactoDefensaCivil}`)
const verProtocolo = () => alert('Protocolo de evacuación')
const enviarReporte = () => alert('Reporte enviado')
</script>

<style scoped>
.operation-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
}
.operation-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}
.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #7f8c8d;
  transition: all 0.3s;
}
.tab-button.active {
  color: #667eea;
  border-bottom: 2px solid #667eea;
}
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}
@media (max-width: 768px) {
  .two-columns { grid-template-columns: 1fr; }
}
</style>