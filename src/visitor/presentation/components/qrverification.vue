<template>
  <div class="scanner-card">
    <div class="card-title">
      <span class="title-icon">🔍</span>
      <h4>{{ t('visitor.scan.verifyTitle') }}</h4>
    </div>
    <div class="verification-box" :class="verificationStatus">
      <div class="verification-content">
        <div class="verification-icon">
          <span v-if="verificationStatus === 'success'">✅</span>
          <span v-else-if="verificationStatus === 'error'">❌</span>
          <span v-else-if="verificationStatus === 'warning'">⚠️</span>
          <span v-else>🔍</span>
        </div>
        <p>{{ verificationMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({ verificationStatus: { type: String, default: '' }, verificationMessage: { type: String, default: '' } })
</script>

<style scoped>
.scanner-card { background: white; border-radius: 15px; padding: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); transition: transform 0.3s; }
.scanner-card:hover { transform: translateY(-5px); }
.card-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; }
.title-icon { font-size: 24px; }
.card-title h4 { margin: 0; color: #2c3e50; }
.verification-box { min-height: 200px; background: #f8f9fa; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; border: 3px solid #e0e0e0; }
.verification-box.success { border-color: #27ae60; background: linear-gradient(135deg, #d5f4e6, #a8e6cf); animation: pulseSuccess 0.5s ease; }
.verification-box.error { border-color: #e74c3c; background: linear-gradient(135deg, #fde5e5, #f8c9c9); animation: shake 0.5s ease; }
.verification-box.warning { border-color: #f39c12; background: linear-gradient(135deg, #fff3e0, #ffe0b2); }
.verification-content { text-align: center; }
.verification-icon { font-size: 60px; margin-bottom: 15px; }
.verification-box p { margin: 0; font-weight: 500; color: #2c3e50; }
@keyframes pulseSuccess { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
</style>
