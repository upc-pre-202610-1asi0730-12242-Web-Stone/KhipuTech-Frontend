<template>
  <div class="scanner-card">
    <div class="card-title">
      <span class="title-icon">📷</span>
      <h4>{{ t('visitor.scan.qrTitle') }}</h4>
    </div>
    <div class="qr-result" :class="scanStatus">
      <div class="qr-placeholder">
        <span v-if="!scannedData" class="placeholder-icon">📸</span>
        <div v-else class="qr-data">
          <span class="qr-code">{{ scannedData.code }}</span>
          <span class="qr-type">{{ scannedData.title || scannedData.type }}</span>
        </div>
      </div>
    </div>
    <p class="qr-hint">{{ scanMessage }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({ scannedData: { type: Object, default: null }, scanStatus: { type: String, default: '' }, scanMessage: { type: String, default: '' } })
</script>

<style scoped>
.scanner-card { background: white; border-radius: 15px; padding: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); transition: transform 0.3s; }
.scanner-card:hover { transform: translateY(-5px); }
.card-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; }
.title-icon { font-size: 24px; }
.card-title h4 { margin: 0; color: #2c3e50; }
.qr-result { min-height: 200px; background: #f8f9fa; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; border: 3px solid #e0e0e0; }
.qr-result.success { border-color: #27ae60; background: #d5f4e6; }
.qr-result.error { border-color: #e74c3c; background: #fde5e5; }
.qr-result.warning { border-color: #f39c12; background: #fff3e0; }
.qr-placeholder { text-align: center; }
.placeholder-icon { font-size: 60px; opacity: 0.5; }
.qr-data { text-align: center; }
.qr-code { display: block; font-size: 18px; font-weight: bold; color: #2c3e50; margin-bottom: 5px; font-family: monospace; }
.qr-type { font-size: 12px; color: #7f8c8d; }
.qr-hint { margin-top: 15px; font-size: 12px; color: #7f8c8d; text-align: center; }
</style>
