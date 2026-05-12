<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🗺️</span>
      <h3>{{ t('museum.map.title') }}</h3>
      <div class="export-buttons">
        <button @click="$emit('guardar-config')" class="export-btn">{{ t('museum.map.saveConfig') }}</button>
        <button @click="$emit('exportar-pdf')" class="export-btn pdf">{{ t('museum.map.exportPdf') }}</button>
        <button @click="$emit('exportar-excel')" class="export-btn excel">{{ t('museum.map.exportExcel') }}</button>
      </div>
    </div>
    <div class="mapas-container">
      <div v-for="sala in mapas" :key="sala.id" class="mapa-card" :class="sala.estadoClase">
        <h4>{{ sala.nombre }}</h4>
        <div class="mapa-preview">
          <div class="mapa-grid">
            <div v-for="i in sala.asientos" :key="i" class="asiento" :class="{ ocupado: i <= sala.ocupados }"></div>
          </div>
        </div>
        <div class="mapa-info">
          <span>👥 {{ sala.ocupados }}/{{ sala.asientos }}</span>
          <span class="estado-text">{{ sala.estadoTexto }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({ mapas: { type: Array, required: true } })
defineEmits(['guardar-config', 'exportar-pdf', 'exportar-excel'])
</script>

<style scoped>
.card { background: white; border-radius: 15px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; flex: 1; color: #2c3e50; }
.export-buttons { display: flex; gap: 10px; }
.export-btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; background: #667eea; color: white; }
.export-btn.pdf { background: #e74c3c; }
.export-btn.excel { background: #27ae60; }
.mapas-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.mapa-card { background: #f8f9fa; border-radius: 12px; padding: 15px; border-left: 4px solid; }
.mapa-card.normal { border-left-color: #27ae60; }
.mapa-card.moderada { border-left-color: #f39c12; }
.mapa-card.critica { border-left-color: #e74c3c; }
.mapa-card h4 { margin: 0 0 15px 0; color: #2c3e50; }
.mapa-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; margin: 15px 0; }
.asiento { width: 100%; padding-top: 100%; background: #ddd; border-radius: 4px; }
.asiento.ocupado { background: #667eea; }
.mapa-info { display: flex; justify-content: space-between; margin-top: 10px; font-size: 14px; }
.estado-text { font-weight: bold; }
.mapa-card.normal .estado-text { color: #27ae60; }
.mapa-card.moderada .estado-text { color: #f39c12; }
.mapa-card.critica .estado-text { color: #e74c3c; }
</style>