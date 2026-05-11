<template>
  <div class="achievements-section">
    <div class="xp-card">
      <h3>🏆 Nivel de Visitante</h3>
      <div class="xp-bar-container">
        <div class="xp-bar-fill" :style="{ width: xpProgress + '%' }"></div>
        <span class="xp-text">{{ currentXP }} / {{ nextLevelXP }} XP</span>
      </div>
      <p class="level-text">Nivel {{ currentLevel }} - ¡Sigue escaneando obras!</p>
    </div>

    <div class="achievements-header">
      <h3>🎖️ Tus Logros</h3>
      <p>Completa desafíos para ganar más XP</p>
    </div>

    <div class="achievements-grid">
      <div class="achievement-card" v-for="achievement in achievements" :key="achievement.id">
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <div class="achievement-info">
          <h4>{{ achievement.name }}</h4>
          <p>{{ achievement.description }}</p>
          <div class="achievement-progress">
            <div class="progress-bar" :style="{ width: achievement.progress + '%' }"></div>
          </div>
          <span class="achievement-xp">+{{ achievement.xp }} XP</span>
        </div>
        <div v-if="achievement.completed" class="achievement-badge">✅</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentXP: {
    type: Number,
    default: 0
  },
  nextLevelXP: {
    type: Number,
    default: 1000
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  xpProgress: {
    type: Number,
    default: 0
  },
  achievements: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.achievements-section h3 {
  margin-bottom: 10px;
}

.xp-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
}

.xp-bar-container {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  height: 30px;
  position: relative;
  overflow: hidden;
  margin: 15px 0;
}

.xp-bar-fill {
  background: white;
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.xp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
  color: #2c3e50;
}

.level-text {
  font-size: 14px;
  opacity: 0.9;
}

.achievements-header {
  margin: 30px 0 20px;
}

.achievements-header h3 {
  margin-bottom: 5px;
  color: #2c3e50;
}

.achievements-header p {
  color: #7f8c8d;
  font-size: 13px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  gap: 15px;
  position: relative;
  transition: transform 0.3s;
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  font-size: 40px;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin-bottom: 5px;
  color: #2c3e50;
}

.achievement-info p {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.achievement-progress {
  background: #e0e0e0;
  border-radius: 5px;
  height: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  background: linear-gradient(90deg, #667eea, #764ba2);
  height: 100%;
  transition: width 0.5s ease;
}

.achievement-xp {
  font-size: 11px;
  color: #f39c12;
  font-weight: bold;
}

.achievement-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
}

@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>