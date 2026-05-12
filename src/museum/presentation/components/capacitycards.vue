<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">👥</div>
      <div class="stat-info">
        <span class="stat-value">{{ totalEnMuseo }}</span>
        <span class="stat-label">{{ t('museum.capacity.totalInMuseum') }}</span>
      </div>
    </div>
    <div class="stat-card" :class="{ warning: salasCriticas > 0 }">
      <div class="stat-icon">⚠️</div>
      <div class="stat-info">
        <span class="stat-value">{{ salasCriticas }}</span>
        <span class="stat-label">{{ t('museum.capacity.criticalRooms') }}</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🏛️</div>
      <div class="stat-info">
        <span class="stat-value">{{ capacidadTotal }}</span>
        <span class="stat-label">{{ t('museum.capacity.totalCapacity') }}</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📥</div>
      <div class="stat-info">
        <span class="stat-value">{{ ingresosHoy }}</span>
        <span class="stat-label">{{ t('museum.capacity.todayEntries') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({ totalEnMuseo: { type: Number, default: 0 }, salasCriticas: { type: Number, default: 0 }, capacidadTotal: { type: Number, default: 0 }, ingresosHoy: { type: Number, default: 0 } })
</script>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
.stat-card { background: white; border-radius: 15px; padding: 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.stat-card.warning .stat-value { color: #e74c3c; }
.stat-icon { font-size: 40px; }
.stat-info { flex: 1; }
.stat-value { display: block; font-size: 28px; font-weight: bold; color: #2c3e50; }
.stat-label { font-size: 13px; color: #7f8c8d; }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; } }
@media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
</style>
