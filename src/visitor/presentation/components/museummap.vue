<template>
  <div class="map-section">
    <div class="exploration-card">
      <div class="exploration-header">
        <span class="exploration-icon">🗺️</span>
        <h4>{{ t('visitor.map.explorationTitle') }}</h4>
      </div>
      <div class="exploration-stats">
        <div class="stat-item">
          <div class="stat-value">{{ exploredRooms }}/{{ totalRooms }}</div>
          <div class="stat-label">{{ t('visitor.map.roomsExplored') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ exploredPercentage }}%</div>
          <div class="stat-label">{{ t('visitor.map.museumCompleted') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ artworksFound }}</div>
          <div class="stat-label">{{ t('visitor.map.artworksFound') }}</div>
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
        <div class="legend-item"><span class="dot current"></span> {{ t('visitor.map.currentLocation') }}</div>
        <div class="legend-item"><span class="dot visited"></span> {{ t('visitor.map.visited') }}</div>
        <div class="legend-item"><span class="dot pending"></span> {{ t('visitor.map.toVisit') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({
  rooms: { type: Array, required: true },
  currentRoom: { type: String, default: '' },
  exploredPercentage: { type: Number, default: 0 },
  exploredRooms: { type: Number, default: 0 },
  totalRooms: { type: Number, default: 0 },
  artworksFound: { type: Number, default: 0 }
})
defineEmits(['go-to-room'])

const getRoomClass = (room) => {
  if (room.id === 'room2') return 'current'
  if (room.explored) return 'visited'
  return 'pending'
}
</script>

<style scoped>
.map-section { display: flex; flex-direction: column; gap: 25px; }
.exploration-card { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.exploration-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.exploration-icon { font-size: 28px; }
.exploration-header h4 { margin: 0; color: #2c3e50; font-size: 18px; }
.exploration-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
.stat-item { text-align: center; }
.stat-value { font-size: 28px; font-weight: bold; color: #667eea; }
.stat-label { font-size: 12px; color: #7f8c8d; margin-top: 5px; }
.exploration-bar-container { background: #e0e0e0; border-radius: 10px; height: 12px; overflow: hidden; margin-bottom: 20px; }
.exploration-bar-fill { background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; border-radius: 10px; transition: width 0.5s ease; }
.rooms-grid-mini { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
.room-mini-card { background: #f8f9fa; border-radius: 10px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; }
.room-mini-card:hover { transform: translateY(-3px); }
.room-mini-card.explored { border-color: #27ae60; background: #d5f4e6; }
.room-mini-card.current { border-color: #667eea; background: rgba(102,126,234,0.1); }
.room-mini-icon { display: block; font-size: 24px; margin-bottom: 5px; }
.room-mini-name { font-size: 11px; font-weight: 500; color: #2c3e50; }
.room-check { display: block; font-size: 12px; margin-top: 3px; }
.museum-map { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.map-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
.map-node { background: #f8f9fa; border-radius: 12px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; font-size: 13px; font-weight: 500; }
.map-node small { display: block; font-size: 10px; color: #7f8c8d; margin-top: 3px; font-weight: normal; }
.map-node:hover { transform: translateY(-3px); }
.map-node.current { border-color: #667eea; background: rgba(102,126,234,0.15); }
.map-node.visited { border-color: #27ae60; background: #d5f4e6; }
.map-node.pending { border-color: #e0e0e0; }
.map-legend { display: flex; gap: 20px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #7f8c8d; }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.dot.current { background: #667eea; }
.dot.visited { background: #27ae60; }
.dot.pending { background: #e0e0e0; border: 1px solid #ccc; }
</style>
