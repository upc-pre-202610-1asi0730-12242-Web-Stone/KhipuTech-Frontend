<template>
  <div class="ranking-card">
    <div class="ranking-header">
      <h3>{{ t('visitor.achievements.rankingTitle') }}</h3>
      <span class="ranking-period">{{ period }}</span>
    </div>

    <div class="ranking-tabs">
      <button
          v-for="p in periods"
          :key="p"
          @click="$emit('update:period', p)"
          :class="['period-tab', { active: period === p }]"
      >{{ p }}</button>
    </div>

    <div class="ranking-list">
      <div
          v-for="(visitor, index) in ranking"
          :key="visitor.id"
          :class="['ranking-item', { 'is-current-user': visitor.id === currentUserId }]"
      >
        <div class="ranking-position">
          <span v-if="index === 0" class="medal gold">🥇</span>
          <span v-else-if="index === 1" class="medal silver">🥈</span>
          <span v-else-if="index === 2" class="medal bronze">🥉</span>
          <span v-else class="position-number">{{ index + 1 }}</span>
        </div>
        <div class="ranking-avatar"><span class="avatar-initials">{{ visitor.name.charAt(0) }}</span></div>
        <div class="ranking-info">
          <div class="ranking-name">{{ visitor.name }}</div>
          <div class="ranking-badge">{{ visitor.role }}</div>
        </div>
        <div class="ranking-stats">
          <div class="ranking-xp">
            <span class="xp-icon">✨</span>
            <span class="xp-value">{{ visitor.xp }}</span>
            <span class="xp-label">XP</span>
          </div>
          <div class="ranking-scans">
            <span class="scan-icon">📱</span>
            <span class="scan-value">{{ visitor.scans }}</span>
            <span class="scan-label">{{ t('visitor.achievements.scans') }}</span>
          </div>
        </div>
        <div v-if="visitor.id === currentUserId" class="current-user-badge">{{ t('visitor.achievements.you') }}</div>
      </div>
    </div>

    <div class="ranking-footer">
      <div class="your-stats">
        <span>{{ t('visitor.achievements.yourRank') }}: <strong>#{{ currentUserRank }}</strong> {{ t('visitor.achievements.of') }} {{ totalVisitors }}</span>
        <span v-if="xpToNextRank > 0">{{ xpToNextRank }} {{ t('visitor.achievements.xpToNextRank') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({
  ranking: { type: Array, required: true },
  currentUserId: { type: Number, required: true },
  currentUserRank: { type: Number, default: 0 },
  totalVisitors: { type: Number, default: 0 },
  xpToNextRank: { type: Number, default: 0 },
  periods: { type: Array, required: true },
  period: { type: String, required: true }
})
defineEmits(['update:period'])
</script>

<style scoped>
.ranking-card { background: white; border-radius: 15px; padding: 20px; margin-top: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.ranking-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.ranking-header h3 { margin: 0; color: #2c3e50; }
.ranking-period { font-size: 12px; color: #7f8c8d; background: #f0f0f0; padding: 4px 10px; border-radius: 20px; }
.ranking-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.period-tab { padding: 6px 14px; background: #f0f0f0; border: none; border-radius: 20px; cursor: pointer; font-size: 12px; }
.period-tab.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
.ranking-list { display: flex; flex-direction: column; gap: 10px; }
.ranking-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border-radius: 12px; }
.ranking-item.is-current-user { background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1)); border: 1px solid rgba(102,126,234,0.3); }
.ranking-position { width: 35px; text-align: center; }
.medal { font-size: 24px; }
.position-number { font-size: 16px; font-weight: bold; color: #7f8c8d; }
.ranking-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
.ranking-info { flex: 1; }
.ranking-name { font-weight: 600; color: #2c3e50; }
.ranking-badge { font-size: 11px; color: #7f8c8d; }
.ranking-stats { display: flex; gap: 15px; }
.ranking-xp, .ranking-scans { display: flex; align-items: center; gap: 4px; font-size: 13px; }
.xp-value, .scan-value { font-weight: bold; color: #2c3e50; }
.xp-label, .scan-label { font-size: 10px; color: #7f8c8d; }
.current-user-badge { background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 10px; }
.ranking-footer { margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
.your-stats { display: flex; justify-content: space-between; font-size: 13px; color: #7f8c8d; }
.your-stats strong { color: #667eea; }
</style>
