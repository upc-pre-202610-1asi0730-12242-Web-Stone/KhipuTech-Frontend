<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">👥</div>
      <div class="stat-info">
        <span class="stat-value">{{ visitantesHoy }}</span>
        <span class="stat-label">{{ t('museum.stats.visitorsToday') }}</span>
        <span class="stat-change positive">↑ {{ visitantesChange }}%</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📱</div>
      <div class="stat-info">
        <span class="stat-value">{{ obrasEscaneadas }}</span>
        <span class="stat-label">{{ t('museum.stats.artworksScanned') }}</span>
        <span class="stat-change positive">↑ {{ obrasChange }}%</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">⏱️</div>
      <div class="stat-info">
        <span class="stat-value">{{ duracionMedia }} min</span>
        <span class="stat-label">{{ t('museum.stats.avgDuration') }}</span>
        <span class="stat-change negative">↓ {{ duracionChange }}%</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">⭐</div>
      <div class="stat-info">
        <span class="stat-value">{{ nps }}</span>
        <span class="stat-label">{{ t('museum.stats.nps') }}</span>
        <span class="stat-change positive">↑ {{ npsChange }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({
  visitantesHoy: { type: Number, default: 0 },
  visitantesChange: { type: Number, default: 0 },
  obrasEscaneadas: { type: Number, default: 0 },
  obrasChange: { type: Number, default: 0 },
  duracionMedia: { type: Number, default: 0 },
  duracionChange: { type: Number, default: 0 },
  nps: { type: Number, default: 0 },
  npsChange: { type: Number, default: 0 }
})
</script>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
.stat-card { background: white; border-radius: 15px; padding: 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.stat-icon { font-size: 40px; }
.stat-info { flex: 1; }
.stat-value { display: block; font-size: 28px; font-weight: bold; color: #2c3e50; }
.stat-label { font-size: 13px; color: #7f8c8d; }
.stat-change { font-size: 12px; margin-left: 5px; }
.stat-change.positive { color: #27ae60; }
.stat-change.negative { color: #e74c3c; }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; } }
@media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
</style>
