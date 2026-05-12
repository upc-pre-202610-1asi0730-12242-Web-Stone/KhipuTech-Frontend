<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">📊</span>
      <h3>{{ t('museum.capacity.title') }}</h3>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
        <tr>
          <th>{{ t('museum.capacity.colRoom') }}</th>
          <th>{{ t('museum.capacity.colCurrent') }}</th>
          <th>{{ t('museum.capacity.colCapacity') }}</th>
          <th>{{ t('museum.capacity.colOccupancy') }}</th>
          <th>{{ t('museum.capacity.colStatus') }}</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="sala in salas" :key="sala.id">
          <td><strong>{{ sala.nombre }}</strong></td>
          <td>{{ sala.actual }}</td>
          <td>{{ sala.capacidad }}</td>
          <td>
            <div class="ocupacion-bar">
              <div class="bar-fill" :class="sala.estadoClase" :style="{ width: sala.porcentaje + '%' }"></div>
              <span class="porcentaje">{{ sala.porcentaje }}%</span>
            </div>
          </td>
          <td><span :class="['status-badge', sala.estadoClase]">{{ sala.estadoTexto }}</span></td>
          <td><div class="color-indicator" :class="sala.estadoClase"></div></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({ salas: { type: Array, required: true } })
</script>

<style scoped>
.card { background: white; border-radius: 15px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; color: #2c3e50; }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
.data-table th { background: #f8f9fa; font-weight: 600; color: #2c3e50; }
.ocupacion-bar { display: flex; align-items: center; gap: 8px; min-width: 150px; }
.bar-fill { height: 8px; border-radius: 4px; transition: width 0.3s; }
.bar-fill.normal { background: #27ae60; }
.bar-fill.moderada { background: #f39c12; }
.bar-fill.critica { background: #e74c3c; }
.porcentaje { font-size: 12px; min-width: 40px; }
.status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
.status-badge.normal { background: #d5f4e6; color: #27ae60; }
.status-badge.moderada { background: #fff3e0; color: #f39c12; }
.status-badge.critica { background: #fde5e5; color: #e74c3c; }
.color-indicator { width: 20px; height: 20px; border-radius: 4px; }
.color-indicator.normal { background: #27ae60; }
.color-indicator.moderada { background: #f39c12; }
.color-indicator.critica { background: #e74c3c; }
</style>
