<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">📡</span>
      <h3>{{ t('museum.sensors.title') }}</h3>
    </div>
    <div class="sensores-grid">
      <div v-for="sensor in sensores" :key="sensor.id" class="sensor-card" :class="sensor.estado">
        <div class="sensor-icon">{{ sensor.estado === 'activo' ? '🟢' : '🔴' }}</div>
        <div class="sensor-info">
          <strong>{{ sensor.nombre }}</strong>
          <p>{{ sensor.ubicacion }}</p>
          <span class="sensor-status">{{ sensor.estado === 'activo' ? t('museum.sensors.connected') : t('museum.sensors.disconnected') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({ sensores: { type: Array, required: true } })
</script>

<style scoped>
.card { background: white; border-radius: 15px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; color: #2c3e50; }
.sensores-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
.sensor-card { display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 12px; transition: transform 0.2s; }
.sensor-card:hover { transform: translateX(5px); }
.sensor-card.activo { border-left: 4px solid #27ae60; }
.sensor-card.inactivo { border-left: 4px solid #e74c3c; opacity: 0.7; }
.sensor-icon { font-size: 32px; }
.sensor-info { flex: 1; }
.sensor-info strong { display: block; color: #2c3e50; margin-bottom: 4px; }
.sensor-info p { font-size: 12px; color: #7f8c8d; margin: 0 0 4px 0; }
.sensor-status { font-size: 11px; font-weight: bold; }
.sensor-card.activo .sensor-status { color: #27ae60; }
.sensor-card.inactivo .sensor-status { color: #e74c3c; }
</style>
