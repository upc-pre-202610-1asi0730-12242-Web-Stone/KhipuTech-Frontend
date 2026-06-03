<template>
  <div class="maintenance-container">
    <!-- Pestañas -->
    <div class="maintenance-tabs">
      <button
          v-for="item in menuItems"
          :key="item.id"
          @click="navegarATab(item.id)"
          :class="['tab-button', { active: activeTab === item.id }]"
      >
        <span>{{ item.icon }}</span> {{ item.name }}
      </button>
    </div>

    <!-- Contenido dinámico -->
    <div class="maintenance-content">
      <!-- Pestaña: Tareas actuales -->
      <div v-if="activeTab === 'tasks'" class="tab-content">
        <h2>🔧 Gestión de Mantenimiento</h2>
        <MaintenanceList />
      </div>

      <!-- Pestaña: Historial (placeholder) -->
      <div v-if="activeTab === 'history'" class="tab-content">
        <h2>📜 Historial de Mantenimiento</h2>
        <div class="history-placeholder">
          <p>Aquí se mostrarán las tareas de mantenimiento finalizadas.</p>
          <p><small>(Funcionalidad en desarrollo)</small></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MaintenanceList from '../components/maintenance-list.vue'

const props = defineProps({
  tab: { type: String, default: 'tasks' }
})
const emit = defineEmits(['update:tab'])

const activeTab = ref(props.tab)

const menuItems = [
  { id: 'tasks', name: 'Tareas actuales', icon: '🔧' },
  { id: 'history', name: 'Historial', icon: '📜' }
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
</script>

<style scoped>
.maintenance-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
}
.maintenance-tabs {
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
.maintenance-content {
  padding: 10px 0;
}
.history-placeholder {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #7f8c8d;
}
</style>