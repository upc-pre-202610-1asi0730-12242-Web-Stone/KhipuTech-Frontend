<template>
  <div class="map-section">
    <div class="exploration-card">
      <div class="exploration-header">
        <span class="exploration-icon">🗺️</span>
        <h4>Tu Progreso de Exploración</h4>
      </div>

      <div class="exploration-stats">
        <div class="stat-item">
          <div class="stat-value">{{ exploredRooms }}/{{ totalRooms }}</div>
          <div class="stat-label">Salas exploradas</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ exploredPercentage }}%</div>
          <div class="stat-label">Museo completado</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ artworksFound }}</div>
          <div class="stat-label">Obras descubiertas</div>
        </div>
      </div>

      <div class="exploration-bar-container">
        <div class="exploration-bar-fill" :style="{ width: exploredPercentage + '%' }"></div>
      </div>

      <div class="rooms-grid-mini">
        <div
            v-for="room in rooms"
            :key="room.id"
            :class="['room-mini-card', { explored: room.explored, current: room.id === currentRoom }]"
            @click="$emit('go-to-room', room.id)"
        >
          <span class="room-mini-icon">{{ room.icon }}</span>
          <span class="room-mini-name">{{ room.name }}</span>
          <span v-if="room.explored" class="room-check">✅</span>
        </div>
      </div>
    </div>

    <div class="museum-map">
      <div class="map-grid">
        <div
            v-for="room in rooms"
            :key="room.id"
            :class="['map-node', getRoomClass(room)]"
            @click="$emit('go-to-room', room.id)"
        >
          {{ room.icon }} {{ room.name }}
          <small v-if="room.description">{{ room.description }}</small>
        </div>
      </div>
      <div class="map-legend">
        <div class="legend-item"><span class="dot current"></span> Tu ubicación</div>
        <div class="legend-item"><span class="dot visited"></span> Visitado</div>
        <div class="legend-item"><span class="dot pending"></span> Por visitar</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rooms: {
    type: Array,
    required: true
  },
  currentRoom: {
    type: String,
    required: true
  },
  exploredPercentage: {
    type: Number,
    default: 0
  },
  exploredRooms: {
    type: Number,
    default: 0
  },
  totalRooms: {
    type: Number,
    default: 0
  },
  artworksFound: {
    type: Number,
    default: 0
  }
})

defineEmits(['go-to-room'])

const getRoomClass = (room) => {
  if (room.id === props.currentRoom) return 'current'
  if (room.explored) return 'visited'
  return 'pending'
}
</script>

<style scoped>
.map-section h3 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.exploration-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  color: white;
}

.exploration-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.exploration-icon {
  font-size: 32px;
}

.exploration-header h4 {
  margin: 0;
  font-size: 20px;
}

.exploration-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #42b983;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 5px;
}

.exploration-bar-container {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 12px;
  margin: 20px 0;
  overflow: hidden;
}

.exploration-bar-fill {
  background: linear-gradient(90deg, #42b983, #27ae60);
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.rooms-grid-mini {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.room-mini-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  border: 2px solid transparent;
}

.room-mini-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
}

.room-mini-card.explored {
  background: rgba(66, 185, 131, 0.3);
  border-color: #42b983;
}

.room-mini-card.current {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5);
}

.room-mini-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 5px;
}

.room-mini-name {
  font-size: 11px;
  display: block;
}

.room-check {
  position: absolute;
  top: 5px;
  right: 8px;
  font-size: 12px;
}

.museum-map {
  background: white;
  border-radius: 15px;
  padding: 25px;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.map-node {
  background: linear-gradient(135deg, #667eea10, #764ba210);
  padding: 15px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.map-node:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.map-node.current {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea20, #764ba220);
}

.map-node.visited {
  border-color: #27ae60;
  background: #d5f4e6;
}

.map-node.pending {
  opacity: 0.7;
}

.map-node small {
  display: block;
  font-size: 10px;
  color: #7f8c8d;
  margin-top: 5px;
}

.map-legend {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.current {
  background: #667eea;
}

.dot.visited {
  background: #27ae60;
}

.dot.pending {
  background: #bdc3c7;
}

@media (max-width: 768px) {
  .map-grid {
    grid-template-columns: 1fr;
  }

  .exploration-stats {
    gap: 10px;
  }

  .stat-value {
    font-size: 24px;
  }

  .rooms-grid-mini {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>