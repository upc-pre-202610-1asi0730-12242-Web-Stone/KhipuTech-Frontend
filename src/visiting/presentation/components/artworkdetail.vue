<template>
  <div v-if="artwork" class="artwork-detail-container">
    <!-- Encabezado de la obra -->
    <div class="artwork-header">
      <div class="artwork-image-large">
        <div class="image-placeholder">
          <span class="artwork-icon">🖼️</span>
        </div>
      </div>
      <div class="artwork-header-info">
        <h2>{{ artwork.title }}</h2>
        <p class="artist-name">{{ artwork.artist }}</p>
        <p class="artwork-year">{{ artwork.year }}</p>
        <div class="artwork-tags">
          <span class="tag">{{ artwork.style || 'Surrealismo' }}</span>
          <span class="tag">{{ artwork.technique || 'Óleo sobre lienzo' }}</span>
          <span class="tag">{{ artwork.period || 'Siglo XX' }}</span>
        </div>
      </div>
    </div>

    <!-- Descripción -->
    <div class="artwork-description">
      <h3>📖 Descripción</h3>
      <p>{{ artwork.description }}</p>
    </div>

    <!-- Guía de Audio -->
    <div class="audio-guide-card">
      <div class="audio-header">
        <span class="audio-icon">🎧</span>
        <h3>Guía de Audio</h3>
      </div>
      <div class="audio-player">
        <div class="audio-controls">
          <button @click="toggleAudio" class="audio-btn" :class="{ playing: isPlaying }">
            <span v-if="!isPlaying">▶️</span>
            <span v-else>⏸️</span>
          </button>
          <div class="audio-info">
            <p class="audio-title">{{ artwork.audioTitle || 'Explicación de la obra' }}</p>
            <p class="audio-duration">{{ audioDuration }}</p>
          </div>
        </div>
        <div class="audio-progress-container" @click="seekAudio">
          <div class="audio-progress" :style="{ width: audioProgress + '%' }"></div>
        </div>
        <div class="audio-volume">
          <span class="volume-icon">🔊</span>
          <input type="range" v-model="volume" min="0" max="100" class="volume-slider" @input="changeVolume">
        </div>
      </div>
      <div class="audio-transcript" v-if="showTranscript">
        <h4>📝 Transcripción</h4>
        <p>{{ artwork.transcript || 'Esta obra maestra representa una fusión única entre el arte tradicional y las nuevas tecnologías.' }}</p>
      </div>
      <button @click="showTranscript = !showTranscript" class="transcript-btn">
        {{ showTranscript ? 'Ocultar transcripción' : 'Ver transcripción' }}
      </button>
    </div>

    <!-- Ubicación y obras relacionadas -->
    <div class="detail-two-columns">
      <!-- Ubicación en museo -->
      <div class="location-card">
        <div class="card-header">
          <span class="card-icon">📍</span>
          <h3>Ubicación en museo</h3>
        </div>
        <div class="location-content">
          <div class="mini-map">
            <div class="map-rooms">
              <div class="mini-room" :class="{ active: artwork.location === 'Entrada' }">🚪</div>
              <div class="mini-room" :class="{ active: artwork.location === 'Sala 1' }">🎨</div>
              <div class="mini-room" :class="{ active: artwork.location === 'Sala 2' }">🖼️</div>
              <div class="mini-room" :class="{ active: artwork.location === 'Sala 3' }">🏺</div>
            </div>
            <div class="location-marker">
              <span class="marker-icon">📍</span>
              <span class="marker-text">{{ artwork.location || 'Sala 2 - Arte Contemporáneo' }}</span>
            </div>
          </div>
          <div class="location-details">
            <p><strong>Piso:</strong> {{ artwork.floor || '2° Piso' }}</p>
            <p><strong>Sala:</strong> {{ artwork.room || 'Sala de Arte Contemporáneo' }}</p>
            <p><strong>Código de obra:</strong> {{ artwork.code || artwork.title.substring(0, 8).toUpperCase() }}</p>
          </div>
          <button @click="$emit('go-to-location')" class="navigate-btn">
            🗺️ Ir a esta sala
          </button>
        </div>
      </div>

      <!-- Obras relacionadas -->
      <div class="related-works-card">
        <div class="card-header">
          <span class="card-icon">🔗</span>
          <h3>Obras relacionadas</h3>
        </div>
        <div class="related-works-list">
          <div
              v-for="related in relatedWorks"
              :key="related.id"
              class="related-work-item"
              @click="$emit('view-related', related)"
          >
            <div class="related-image">
              <span>{{ related.icon || '🎨' }}</span>
            </div>
            <div class="related-info">
              <h4>{{ related.title }}</h4>
              <p>{{ related.artist }}</p>
              <span class="related-year">{{ related.year }}</span>
            </div>
            <div class="related-action">
              <span class="arrow-icon">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="action-buttons">
      <button @click="$emit('add-to-favorites')" class="action-btn favorite">
        ❤️ Agregar a favoritos
      </button>
      <button @click="$emit('share-artwork')" class="action-btn share">
        📤 Compartir obra
      </button>
      <button @click="$emit('scan-another')" class="action-btn scan">
        📷 Escanear otra obra
      </button>
    </div>
  </div>

  <div v-else class="empty-state">
    <div class="empty-icon">🔍</div>
    <h3>No hay obra seleccionada</h3>
    <p>Escanea un código QR o busca una obra manualmente para ver sus detalles</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  artwork: {
    type: Object,
    default: null
  },
  relatedWorks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['go-to-location', 'view-related', 'add-to-favorites', 'share-artwork', 'scan-another'])

// Audio
const isPlaying = ref(false)
const audioProgress = ref(0)
const audioDuration = ref('02:30')
const volume = ref(70)
const showTranscript = ref(false)
let audioInterval = null

const toggleAudio = () => {
  isPlaying.value = !isPlaying.value

  if (isPlaying.value) {
    audioInterval = setInterval(() => {
      if (audioProgress.value < 100) {
        audioProgress.value += 1
      } else {
        stopAudio()
      }
    }, 1500)
  } else {
    stopAudio()
  }
}

const stopAudio = () => {
  isPlaying.value = false
  if (audioInterval) {
    clearInterval(audioInterval)
    audioInterval = null
  }
}

const seekAudio = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = (x / rect.width) * 100
  audioProgress.value = Math.min(100, Math.max(0, percentage))
}

const changeVolume = () => {
  console.log('Volumen cambiado a:', volume.value)
}
</script>

<style scoped>
.artwork-detail-container {
  animation: fadeIn 0.5s ease;
}

.artwork-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 25px;
  margin-bottom: 30px;
  background: white;
  border-radius: 20px;
  padding: 25px;
}

.artwork-image-large {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  text-align: center;
}

.artwork-icon {
  font-size: 80px;
}

.artwork-header-info h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.artist-name {
  font-size: 18px;
  color: #667eea;
  margin-bottom: 5px;
}

.artwork-year {
  color: #7f8c8d;
  margin-bottom: 15px;
}

.artwork-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #2c3e50;
}

.artwork-description {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
}

.artwork-description h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.audio-guide-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
}

.audio-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.audio-icon {
  font-size: 28px;
}

.audio-player {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.audio-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.audio-btn:hover {
  transform: scale(1.05);
}

.audio-btn.playing {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
}

.audio-info {
  flex: 1;
}

.audio-title {
  font-weight: 600;
  color: #2c3e50;
}

.audio-duration {
  font-size: 12px;
  color: #7f8c8d;
}

.audio-progress-container {
  height: 5px;
  background: #e0e0e0;
  border-radius: 5px;
  margin: 15px 0;
  cursor: pointer;
}

.audio-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 5px;
  transition: width 0.1s linear;
}

.audio-volume {
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-slider {
  width: 100px;
  cursor: pointer;
}

.transcript-btn {
  margin-top: 15px;
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 13px;
}

.audio-transcript {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.audio-transcript h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.detail-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 25px;
}

.location-card, .related-works-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.card-icon {
  font-size: 24px;
}

.mini-map {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
}

.map-rooms {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

.mini-room {
  font-size: 30px;
  opacity: 0.5;
  transition: all 0.3s;
}

.mini-room.active {
  opacity: 1;
  transform: scale(1.1);
}

.location-marker {
  text-align: center;
  padding: 10px;
  background: #667eea20;
  border-radius: 10px;
}

.marker-icon {
  font-size: 20px;
  margin-right: 8px;
}

.marker-text {
  font-weight: 600;
  color: #667eea;
}

.location-details {
  margin: 15px 0;
}

.location-details p {
  margin: 8px 0;
  font-size: 14px;
}

.navigate-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.related-works-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-work-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.related-work-item:hover {
  transform: translateX(5px);
  background: #667eea10;
}

.related-image {
  font-size: 40px;
}

.related-info {
  flex: 1;
}

.related-info h4 {
  margin-bottom: 3px;
  font-size: 14px;
  color: #2c3e50;
}

.related-info p {
  font-size: 12px;
  color: #7f8c8d;
}

.related-year {
  font-size: 11px;
  color: #667eea;
}

.arrow-icon {
  font-size: 20px;
  color: #bdc3c7;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.favorite {
  background: #ff6b6b;
  color: white;
}

.action-btn.share {
  background: #3498db;
  color: white;
}

.action-btn.scan {
  background: #95a5a6;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .artwork-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .detail-two-columns {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>