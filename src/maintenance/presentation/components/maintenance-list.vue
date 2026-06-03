<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🔧</span>
      <h3>Tareas de mantenimiento</h3>
      <button @click="loadTasks" class="refresh-btn">⟳ Actualizar</button>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
        <tr><th>ID</th><th>Obra</th><th>Razón</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.artworkId }}</td>
          <td>{{ task.reason }}</td>
          <td><span :class="['status-badge', task.status]">{{ task.status }}</span></td>
          <td><button v-if="task.status === 'completed'" @click="restore(task.artworkId)" class="btn-restore">Restaurar</button></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { maintenanceApi } from '../../infrastructure/maintenance-api'
import { notify } from '../../../shared/infrastructure/notify/notify.service'

const tasks = ref([])
const loadTasks = async () => { tasks.value = await maintenanceApi.getTasks() }
const restore = async (artworkId) => {
  await maintenanceApi.restore(artworkId)
  notify.success(`Obra ${artworkId} restaurada`)
  loadTasks()
}
onMounted(loadTasks)
</script>

<style scoped>
/* estilos similares a los anteriores */
.card { background: white; border-radius: 15px; padding: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.refresh-btn { background: #3498db; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
.status-badge { padding: 4px 12px; border-radius: 20px; color: white; }
.status-badge.pending { background: #f39c12; }
.status-badge.completed { background: #27ae60; }
.btn-restore { background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
</style>