<template>
  <div class="ranking-card">
    <div class="ranking-header">
      <h3>📊 Ranking de Visitantes</h3>
      <span class="ranking-period">{{ currentPeriod }}</span>
    </div>

    <div class="ranking-tabs">
      <button
          v-for="period in periods"
          :key="period"
          @click="$emit('update:period', period)"
          :class="['period-tab', { active: currentPeriod === period }]"
      >
        {{ period }}
      </button>
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

        <div class="ranking-avatar">
          <span class="avatar-initials">{{ visitor.name.charAt(0) }}</span>
        </div>

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
            <span class="scan-label">escaneos</span>
          </div>
        </div>

        <div v-if="visitor.id === currentUserId" class="current-user-badge">
          TÚ
        </div>
      </div>
    </div>

    <div class="ranking-footer">
      <div class="your-rank">
        <span>Tu posición actual:</span>
        <strong>#{{ currentUserRank }}</strong>
        <span>de {{ totalVisitors }}</span>
      </div>
      <div class="next-rank-info">
        <span>Para superar al siguiente visitante necesitas:</span>
        <strong>{{ xpToNextRank }} XP</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ranking: {
    type: Array,
    default: () => []
  },
  currentUserId: {
    type: Number,
    default: null
  },
  currentUserRank: {
    type: Number,
    default: 0
  },
  totalVisitors: {
    type: Number,
    default: 0
  },
  xpToNextRank: {
    type: Number,
    default: 0
  },
  periods: {
    type: Array,
    default: () => ['Esta semana', 'Este mes', 'Todo el tiempo']
  },
  currentPeriod: {
    type: String,
    default: 'Esta semana'
  }
})

defineEmits(['update:period'])
</script>

<style scoped>
.ranking-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-top: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.ranking-header h3 {
  margin: 0;
  color: #2c3e50;
}

.ranking-period {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.ranking-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.period-tab {
  padding: 8px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #7f8c8d;
  transition: all 0.3s;
  border-radius: 20px;
}

.period-tab:hover {
  background: #f0f0f0;
}

.period-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s;
}

.ranking-item:hover {
  transform: translateX(5px);
  background: #f0f0f0;
}

.ranking-item.is-current-user {
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border: 2px solid #667eea;
}

.ranking-position {
  width: 50px;
  text-align: center;
}

.medal {
  font-size: 24px;
}

.position-number {
  font-size: 18px;
  font-weight: bold;
  color: #7f8c8d;
}

.ranking-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.ranking-badge {
  font-size: 11px;
  color: #7f8c8d;
  margin-top: 2px;
}

.ranking-stats {
  display: flex;
  gap: 20px;
  align-items: center;
}

.ranking-xp, .ranking-scans {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.xp-icon, .scan-icon {
  font-size: 16px;
}

.xp-value, .scan-value {
  font-weight: bold;
  color: #2c3e50;
}

.xp-label, .scan-label {
  font-size: 11px;
  color: #7f8c8d;
}

.current-user-badge {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;
}

.ranking-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.your-rank {
  background: #f8f9fa;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
}

.your-rank strong {
  color: #667eea;
  font-size: 18px;
  margin: 0 5px;
}

.next-rank-info {
  background: #fff3e0;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
}

.next-rank-info strong {
  color: #f39c12;
  margin-left: 8px;
}

@media (max-width: 768px) {
  .ranking-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .ranking-item {
    flex-wrap: wrap;
  }

  .ranking-stats {
    width: 100%;
    justify-content: space-around;
    margin-top: 10px;
  }

  .ranking-footer {
    flex-direction: column;
    text-align: center;
  }
}
</style>