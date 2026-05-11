<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🏆</span>
      <h3>Ranking de obras por engagement</h3>
      <div class="ranking-period">
        <button
            v-for="period in periods"
            :key="period"
            @click="$emit('update:period', period)"
            :class="{ active: currentPeriod === period }"
        >
          {{ period }}
        </button>
      </div>
    </div>
    <div class="ranking-list">
      <div v-for="(obra, index) in rankings" :key="obra.id" class="ranking-item">
        <div class="ranking-number">{{ index + 1 }}</div>
        <div class="ranking-info">
          <div class="ranking-title">{{ obra.nombre }}</div>
          <div class="ranking-meta">{{ obra.sala }} • {{ obra.artista }}</div>
        </div>
        <div class="ranking-stats">
          <div class="engagement-score">
            <span class="score-value">{{ obra.engagement }}</span>
            <span class="score-label">pts</span>
          </div>
          <div class="time-spent">⏱️ {{ obra.tiempoPromedio }} min</div>
        </div>
        <div class="trend-icon" :class="obra.trend">📈</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rankings: { type: Array, required: true },
  periods: { type: Array, required: true },
  currentPeriod: { type: String, required: true }
})

defineEmits(['update:period'])
</script>

<style scoped>
.card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card-icon {
  font-size: 24px;
}

.card-header h3 {
  margin: 0;
  flex: 1;
  color: #2c3e50;
}

.ranking-period {
  display: flex;
  gap: 10px;
}

.ranking-period button {
  padding: 5px 12px;
  background: #f0f0f0;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
}

.ranking-period button.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.ranking-number {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.ranking-info {
  flex: 1;
}

.ranking-title {
  font-weight: 600;
}

.ranking-meta {
  font-size: 12px;
  color: #7f8c8d;
}

.ranking-stats {
  display: flex;
  gap: 20px;
  align-items: center;
}

.engagement-score {
  text-align: center;
}

.score-value {
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
}

.score-label {
  font-size: 10px;
  color: #7f8c8d;
}

.time-spent {
  font-size: 13px;
  color: #2c3e50;
}

.trend-icon.up {
  color: #27ae60;
}

.trend-icon.down {
  color: #e74c3c;
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .ranking-item {
    flex-wrap: wrap;
  }

  .ranking-stats {
    width: 100%;
    justify-content: space-between;
    margin-top: 10px;
  }
}
</style>