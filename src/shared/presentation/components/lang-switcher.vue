<template>
  <div class="lang-switcher">
    <button
        v-for="lang in languages"
        :key="lang.code"
        @click="setLocale(lang.code)"
        :class="['lang-btn', { active: locale === lang.code }]"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' }
]

const setLocale = (code) => {
  locale.value = code
}
</script>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 6px;
}

.lang-btn {
  padding: 5px 10px;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 8px;
  background: rgba(255,255,255,0.15);
  color: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.lang-btn:hover {
  background: rgba(255,255,255,0.25);
}

.lang-btn.active {
  background: rgba(255,255,255,0.35);
  border-color: white;
}
</style>
