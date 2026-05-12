<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">📋</span>
      <h3>{{ t('museum.evacuation.title') }}</h3>
    </div>
    <div class="protocolo-buttons">
      <button @click="$emit('activar-alerta-general')" class="protocolo-btn alerta">{{ t('museum.evacuation.activateAlert') }}</button>
      <button @click="$emit('llamar-defensa-civil')" class="protocolo-btn defensa">{{ t('museum.evacuation.callCivil') }}</button>
      <button @click="$emit('ver-protocolo')" class="protocolo-btn protocolo">{{ t('museum.evacuation.viewProtocol') }}</button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineEmits(['activar-alerta-general', 'llamar-defensa-civil', 'ver-protocolo'])
</script>

<style scoped>
.card { background: white; border-radius: 15px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; color: #2c3e50; }
.protocolo-buttons { display: flex; flex-direction: column; gap: 12px; }
.protocolo-btn { padding: 15px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: transform 0.2s; }
.protocolo-btn:hover { transform: translateY(-2px); }
.protocolo-btn.alerta { background: #e74c3c; color: white; }
.protocolo-btn.defensa { background: #f39c12; color: white; }
.protocolo-btn.protocolo { background: #3498db; color: white; }
</style>
