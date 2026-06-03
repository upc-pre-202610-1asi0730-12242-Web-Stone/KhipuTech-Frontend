<template>
  <div class="capacity-container">
    <!-- Tus pestañas internas -->
    <div class="capacity-tabs">
      <button
          v-for="item in menuItems"
          :key="item.id"
          @click="navegarATab(item.id)"
          :class="['tab-button', { active: activeTab === item.id }]"
      >
        <span>{{ item.icon }}</span> {{ item.name }}
      </button>
    </div>

    <div class="capacity-content">
      <div v-if="activeTab === 'rooms'" class="tab-content">
        <CapacityCards
            :total-en-museo="store.totalOccupancy"
            :salas-criticas="store.criticalRooms.length"
            :capacidad-total="store.totalCapacity"
            :ingresos-hoy="store.ingresosHoy"
        />
        <CapacityTable :salas="store.rooms" />
      </div>

      <div v-if="activeTab === 'sensors'" class="tab-content">
        <EstadoSensores :sensores="store.sensors" />
      </div>

      <div v-if="activeTab === 'map'" class="tab-content">
        <MapaVisual :mapas="mapasSalas" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCapacityStore } from '../../application/capacity.store'
import CapacityCards from '../components/capacity-cards.vue'
import CapacityTable from '../components/capacity-table.vue'
import MapaVisual from '../components/sensor-map.vue'
import EstadoSensores from '../components/sensor-status.vue'

const props = defineProps({
  tab: { type: String, default: 'rooms' }
})

const emit = defineEmits(['update:tab'])

const store = useCapacityStore()
const activeTab = ref(props.tab)

const menuItems = [
  { id: 'rooms', name: 'Salas', icon: '🏛️' },
  { id: 'sensors', name: 'Sensores', icon: '📡' },
  { id: 'map', name: 'Mapa visual', icon: '🗺️' }
]

const mapasSalas = computed(() => store.rooms.map(room => ({
  id: room.id,
  nombre: room.name,
  asientos: room.capacity,
  ocupados: room.currentOccupancy,
  estadoClase: room.status,
  estadoTexto: room.status === 'normal' ? 'Normal' : (room.status === 'critical' ? 'Crítico' : 'Sobrepasado')
})))

watch(() => props.tab, (newTab) => {
  if (newTab) activeTab.value = newTab
}, { immediate: true })

const navegarATab = (tabId) => {
  if (tabId !== activeTab.value) {
    activeTab.value = tabId
    emit('update:tab', tabId)
  }
}

onMounted(() => {
  store.fetchRooms()
  store.fetchSensors()
})
</script>

<style scoped>
.capacity-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
}
.capacity-tabs {
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
.capacity-content {
  padding: 10px 0;
}
</style>