<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">📑</span>
      <h3>{{ t('museum.report.title') }}</h3>
    </div>
    <div class="reporte-content">
      <p>{{ t('museum.report.description') }}</p>
      <button @click="$emit('enviar-reporte')" class="btn-enviar">{{ t('museum.report.sendBtn') }}</button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineEmits(['enviar-reporte'])
</script>

<style scoped>
.card { background: white; border-radius: 15px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; color: #2c3e50; }
.reporte-content { text-align: center; padding: 20px; }
.reporte-content p { margin-bottom: 20px; color: #7f8c8d; }
.btn-enviar { padding: 12px 24px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: transform 0.2s; }
.btn-enviar:hover { transform: translateY(-2px); }
</style>
