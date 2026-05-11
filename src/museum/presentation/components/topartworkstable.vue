<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🏆</span>
      <h3>Obras más visitadas</h3>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
        <tr>
          <th>OBRA</th>
          <th>SALA</th>
          <th>VISITAS</th>
          <th>% RETENCIÓN</th>
          <th>ESTADO</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="obra in obras" :key="obra.id">
          <td><strong>{{ obra.nombre }}</strong></td>
          <td>{{ obra.sala }}</td>
          <td>{{ obra.visitas }}</td>
          <td>
            <div class="progress-mini">
              <div class="progress-bar-mini" :style="{ width: obra.retencion + '%' }"></div>
              <span>{{ obra.retencion }}%</span>
            </div>
          </td>
          <td>
              <span :class="['status-badge', obra.estado]">
                {{ obra.estado === 'abierto' ? '🟢 Abierto' : obra.estado === 'mantenimiento' ? '🟡 Mantenimiento' : '🔴 Cerrado' }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  obras: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.card-icon {
  font-size: 24px;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.progress-mini {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar-mini {
  height: 6px;
  background: #27ae60;
  border-radius: 3px;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
}

.status-badge.abierto {
  background: #d5f4e6;
  color: #27ae60;
}

.status-badge.mantenimiento {
  background: #fff3e0;
  color: #f39c12;
}

.status-badge.cerrado {
  background: #fde5e5;
  color: #e74c3c;
}
</style>