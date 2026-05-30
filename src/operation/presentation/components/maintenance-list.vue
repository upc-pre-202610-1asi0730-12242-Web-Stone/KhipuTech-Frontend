<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🔧</span>
      <h3>Mantenimiento de obras</h3>
      <button @click="loadTasks" class="refresh-btn">⟳ Actualizar</button>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Obra</th>
          <th>Razón</th>
          <th>Fecha programada</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.artworkId }}</td>
          <td>{{ task.reason }}</td>
          <td>{{ formatDate(task.scheduledDate) }}</td>
          <td>
              <span :class="['status-badge', task.status]">
                {{ translateStatus(task.status) }}
              </span>
          </td>
          <td>
            <button
                v-if="task.status === 'completed'"
                @click="restoreArtwork(task.artworkId)"
                class="btn-restore"
            >
              Restaurar disponibilidad
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { maintenanceApi } from '../../../maintenance/infrastructure/maintenance-api'
import { notify } from '../../../shared/infrastructure/notify/notify.service.js'

const tasks = ref([])

const loadTasks = async () => {
  try {
    tasks.value = await maintenanceApi.getTasks()
  } catch (error) {
    notify.error('Error al cargar tareas de mantenimiento')
  }
}

const restoreArtwork = async (artworkId) => {
  try {
    await maintenanceApi.restore(artworkId)
    notify.success(`Obra ${artworkId} restaurada y disponible para escaneo`)
    await loadTasks() // recargar lista
  } catch (error) {
    notify.error('Error al restaurar la obra')
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const translateStatus = (status) => {
  const map = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completado',
    cancelled: 'Cancelado'
  }
  return map[status] || status
}

onMounted(loadTasks)
</script>

<style scoped>
.card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.card-icon {
  font-size: 24px;
}
.card-header h3 {
  margin: 0;
  flex: 1;
  color: #2c3e50;
}
.refresh-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.table-responsive {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
}
.status-badge.pending { background: #f39c12; }
.status-badge.in_progress { background: #3498db; }
.status-badge.completed { background: #27ae60; }
.status-badge.cancelled { background: #95a5a6; }
.btn-restore {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>