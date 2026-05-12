<template>
  <div class="manual-code-section">
    <div class="divider-text">
      <span>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
      <span>{{ t('visitor.scan.manualOr') }}</span>
      <span>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
    </div>
    <div class="code-input-group">
      <input type="text" :value="code" @input="$emit('update:code', $event.target.value)" :placeholder="t('visitor.scan.codePlaceholder')" class="code-input" @keyup.enter="$emit('search')" />
      <button @click="$emit('search')" class="search-btn">{{ t('visitor.scan.searchBtn') }}</button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({ code: { type: String, default: '' } })
defineEmits(['update:code', 'search'])
</script>

<style scoped>
.manual-code-section { background: white; border-radius: 15px; padding: 25px; margin-top: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
.divider-text { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; color: #7f8c8d; font-size: 13px; }
.divider-text span:first-child, .divider-text span:last-child { flex: 1; font-family: monospace; letter-spacing: -1px; }
.code-input-group { display: flex; gap: 15px; }
.code-input { flex: 1; padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; transition: all 0.3s; font-family: monospace; }
.code-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
.search-btn { padding: 14px 32px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; }
.search-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
@media (max-width: 768px) { .divider-text { flex-direction: column; gap: 10px; } .code-input-group { flex-direction: column; } }
</style>
