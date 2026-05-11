<template>
  <div>
    <!-- Tarjetas de resumen -->
    <div class="stats-grid-small">
      <div class="stat-card-small">
        <span class="icon">💰</span>
        <div class="info">
          <span class="value">{{ formatMoney(ingresosMes) }}</span>
          <span class="label">Ingresos mes</span>
        </div>
      </div>
      <div class="stat-card-small">
        <span class="icon">🤝</span>
        <div class="info">
          <span class="value">{{ sponsorsActivos }}</span>
          <span class="label">Sponsors activos</span>
        </div>
      </div>
      <div class="stat-card-small">
        <span class="icon">👁️</span>
        <div class="info">
          <span class="value">{{ impresionesTotales.toLocaleString() }}</span>
          <span class="label">Impresiones</span>
        </div>
      </div>
    </div>

    <!-- Tabla de sponsors -->
    <div class="card">
      <div class="card-header">
        <span class="card-icon">🤝</span>
        <h3>Tabla de sponsors</h3>
        <div class="action-buttons-header">
          <button @click="$emit('add-sponsor')" class="btn-add">+ Agregar sponsor</button>
          <button @click="$emit('export-pdf')" class="export-btn pdf">📄 Exportar PDF</button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
          <tr>
            <th>SPONSOR</th>
            <th>SALA PATROCINADA</th>
            <th>IMPRESIONES</th>
            <th>$ APORTADO</th>
            <th>ESTADO</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="sponsor in sponsors" :key="sponsor.id">
            <td><strong>{{ sponsor.nombre }}</strong></td>
            <td>{{ sponsor.sala }}</td>
            <td>{{ sponsor.impresiones.toLocaleString() }}</td>
            <td class="money">{{ formatMoney(sponsor.aportado) }}</td>
            <td>
                <span :class="['status-badge', sponsor.estado]">
                  {{ sponsor.estado === 'activo' ? '✅ Activo' : '⏸️ Inactivo' }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  ingresosMes: { type: Number, default: 0 },
  sponsorsActivos: { type: Number, default: 0 },
  impresionesTotales: { type: Number, default: 0 },
  sponsors: { type: Array, required: true }
})

defineEmits(['add-sponsor', 'export-pdf'])

const formatMoney = (value) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}
</script>

<style scoped>
.stats-grid-small {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card-small {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stat-card-small .icon {
  font-size: 35px;
}

.stat-card-small .value {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-card-small .label {
  font-size: 12px;
  color: #7f8c8d;
}

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
  flex-wrap: wrap;
  justify-content: space-between;
}

.card-icon {
  font-size: 24px;
}

.card-header h3 {
  margin: 0;
  flex: 1;
  color: #2c3e50;
}

.action-buttons-header {
  display: flex;
  gap: 10px;
}

.btn-add {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.export-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
}

.export-btn.pdf {
  background: #e74c3c;
  color: white;
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

.money {
  color: #27ae60;
  font-weight: bold;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
}

.status-badge.activo {
  background: #d5f4e6;
  color: #27ae60;
}

.status-badge.inactivo {
  background: #fde5e5;
  color: #e74c3c;
}

@media (max-width: 768px) {
  .stats-grid-small {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons-header {
    width: 100%;
  }

  .btn-add, .export-btn {
    flex: 1;
  }
}
</style>