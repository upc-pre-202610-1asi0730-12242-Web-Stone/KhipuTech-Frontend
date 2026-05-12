<template>
  <div v-if="artwork" class="artwork-detail-container">
    <div class="artwork-header">
      <div class="artwork-image-large">
        <div class="image-placeholder"><span class="artwork-icon">🖼️</span></div>
      </div>
      <div class="artwork-header-info">
        <h2>{{ artwork.title }}</h2>
        <p class="artist-name">{{ artwork.artist }}</p>
        <p class="artwork-year">{{ artwork.year }}</p>
        <div class="artwork-tags">
          <span class="tag">{{ artwork.style || 'Surrealism' }}</span>
          <span class="tag">{{ artwork.technique || 'Oil on canvas' }}</span>
          <span class="tag">{{ artwork.period || '20th century' }}</span>
        </div>
      </div>
    </div>

    <div class="artwork-description">
      <h3>{{ t('visitor.artwork.description') }}</h3>
      <p>{{ artwork.description }}</p>
    </div>

    <div class="audio-guide-card">
      <div class="audio-header">
        <span class="audio-icon">🎧</span>
        <h3>{{ t('visitor.artwork.audioGuide') }}</h3>
      </div>
      <div class="audio-player">
        <div class="audio-controls">
          <button @click="toggleAudio" class="audio-btn" :class="{ playing: isPlaying }">
            <span v-if="!isPlaying">▶️</span>
            <span v-else>⏸️</span>
          </button>
          <div class="audio-info">
            <p class="audio-title">{{ artwork.audioTitle || t('visitor.artwork.audioTitle') }}</p>
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
        <h4>{{ t('visitor.artwork.transcript') }}</h4>
        <p>{{ artwork.transcript || 'This masterpiece represents a unique fusion between traditional art and new technologies.' }}</p>
      </div>
      <button @click="showTranscript = !showTranscript" class="transcript-btn">
        {{ showTranscript ? t('visitor.artwork.hideTranscript') : t('visitor.artwork.showTranscript') }}
      </button>
    </div>

    <div class="detail-two-columns">
      <div class="location-card">
        <div class="card-header">
          <span class="card-icon">📍</span>
          <h3>{{ t('visitor.artwork.location') }}</h3>
        </div>
        <div class="location-content">
          <div class="mini-map">
            <div class="map-rooms">
              <div class="mini-room" :class="{ active: artwork.location === 'Entrance' }">🚪</div>
              <div class="mini-room" :class="{ active: artwork.location === 'Room 1' }">🎨</div>
              <div class="mini-room" :class="{ active: artwork.location === 'Room 2' }">🖼️</div>
              <div class="mini-room" :class="{ active: artwork.location === 'Room 3' }">🏺</div>
            </div>
            <div class="location-marker">
              <span class="marker-icon">📍</span>
              <span class="marker-text">{{ artwork.location || 'Room 2 – Contemporary Art' }}</span>
            </div>
          </div>
          <div class="location-details">
            <p><strong>{{ t('visitor.artwork.floor') }}:</strong> {{ artwork.floor || '2nd Floor' }}</p>
            <p><strong>{{ t('visitor.artwork.room') }}:</strong> {{ artwork.room || 'Contemporary Art Room' }}</p>
            <p><strong>{{ t('visitor.artwork.artworkCode') }}:</strong> {{ artwork.code || artwork.title.substring(0, 8).toUpperCase() }}</p>
          </div>
          <button @click="$emit('go-to-location')" class="navigate-btn">{{ t('visitor.artwork.navigateBtn') }}</button>
        </div>
      </div>

      <div class="related-works-card">
        <div class="card-header">
          <span class="card-icon">🔗</span>
          <h3>{{ t('visitor.artwork.relatedWorks') }}</h3>
        </div>
        <div class="related-works-list">
          <div v-for="related in relatedWorks" :key="related.id" class="related-work-item" @click="$emit('view-related', related)">
            <div class="related-image"><span>{{ related.icon || '🎨' }}</span></div>
            <div class="related-info">
              <h4>{{ related.title }}</h4>
              <p>{{ related.artist }}</p>
              <span class="related-year">{{ related.year }}</span>
            </div>
            <div class="related-action"><span class="arrow-icon">→</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="$emit('scan-another')" class="action-btn scan">📷 {{ t('visitor.artwork.scanAnother') }}</button>
    </div>
  </div>

  <div v-else class="empty-state">
    <div class="empty-icon">🔍</div>
    <h3>{{ t('visitor.artwork.emptyTitle') }}</h3>
    <p>{{ t('visitor.artwork.emptyDesc') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { ref } from 'vue'

defineProps({ artwork: { type: Object, default: null }, relatedWorks: { type: Array, default: () => [] } })
defineEmits(['go-to-location', 'view-related', 'add-to-favorites', 'share-artwork', 'scan-another'])

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
      if (audioProgress.value < 100) { audioProgress.value += 1 } else { stopAudio() }
    }, 1500)
  } else { stopAudio() }
}

const stopAudio = () => {
  isPlaying.value = false
  if (audioInterval) { clearInterval(audioInterval); audioInterval = null }
}

const seekAudio = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  audioProgress.value = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100))
}

const changeVolume = () => { console.log('Volume:', volume.value) }
</script>

<style scoped>
.artwork-detail-container { display: flex; flex-direction: column; gap: 25px; }
.artwork-header { display: flex; gap: 30px; background: white; border-radius: 15px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.artwork-image-large { width: 200px; height: 200px; flex-shrink: 0; background: #f8f9fa; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.artwork-icon { font-size: 80px; }
.artwork-header-info { flex: 1; }
.artwork-header-info h2 { margin: 0 0 10px; color: #2c3e50; font-size: 24px; }
.artist-name { color: #667eea; font-weight: 500; margin-bottom: 5px; }
.artwork-year { color: #7f8c8d; margin-bottom: 15px; }
.artwork-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { background: #f0f0f0; padding: 5px 12px; border-radius: 20px; font-size: 12px; color: #555; }
.artwork-description { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.artwork-description h3 { margin: 0 0 15px; color: #2c3e50; }
.artwork-description p { color: #555; line-height: 1.6; }
.audio-guide-card { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.audio-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.audio-icon { font-size: 24px; }
.audio-header h3 { margin: 0; color: #2c3e50; }
.audio-controls { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
.audio-btn { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); border: none; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; }
.audio-btn.playing { animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.audio-info { flex: 1; }
.audio-title { margin: 0; font-weight: 500; color: #2c3e50; }
.audio-duration { margin: 0; font-size: 12px; color: #7f8c8d; }
.audio-progress-container { background: #e0e0e0; border-radius: 5px; height: 6px; cursor: pointer; margin-bottom: 15px; }
.audio-progress { background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; border-radius: 5px; }
.audio-volume { display: flex; align-items: center; gap: 10px; }
.volume-icon { font-size: 18px; }
.volume-slider { flex: 1; }
.audio-transcript { background: #f8f9fa; border-radius: 10px; padding: 15px; margin: 15px 0; }
.audio-transcript h4 { margin: 0 0 10px; color: #2c3e50; }
.audio-transcript p { margin: 0; color: #555; font-size: 13px; line-height: 1.5; }
.transcript-btn { padding: 8px 16px; background: none; border: 1px solid #667eea; border-radius: 8px; color: #667eea; cursor: pointer; font-size: 12px; }
.detail-two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.location-card, .related-works-card { background: white; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; color: #2c3e50; }
.mini-map { background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px; }
.map-rooms { display: flex; gap: 10px; justify-content: center; margin-bottom: 10px; }
.mini-room { width: 40px; height: 40px; background: #e0e0e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.mini-room.active { background: linear-gradient(135deg, #667eea, #764ba2); }
.location-marker { display: flex; align-items: center; gap: 5px; justify-content: center; }
.marker-icon { font-size: 18px; }
.marker-text { font-size: 13px; color: #2c3e50; font-weight: 500; }
.location-details p { margin: 8px 0; font-size: 13px; color: #555; }
.navigate-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; margin-top: 15px; transition: transform 0.2s; }
.navigate-btn:hover { transform: translateY(-2px); }
.related-works-list { display: flex; flex-direction: column; gap: 12px; }
.related-work-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border-radius: 10px; cursor: pointer; transition: transform 0.2s; }
.related-work-item:hover { transform: translateX(5px); }
.related-image { width: 45px; height: 45px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
.related-info { flex: 1; }
.related-info h4 { margin: 0 0 3px; font-size: 13px; color: #2c3e50; }
.related-info p { margin: 0; font-size: 11px; color: #7f8c8d; }
.related-year { font-size: 10px; color: #7f8c8d; }
.arrow-icon { font-size: 18px; color: #667eea; }
.action-buttons { display: flex; gap: 15px; justify-content: center; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.action-btn { padding: 12px 24px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: transform 0.2s; }
.action-btn.scan { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
.action-btn:hover { transform: translateY(-2px); }
.empty-state { text-align: center; padding: 80px 20px; background: white; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.empty-icon { font-size: 60px; margin-bottom: 20px; }
.empty-state h3 { color: #2c3e50; margin-bottom: 10px; }
.empty-state p { color: #7f8c8d; }
@media (max-width: 768px) { .artwork-header { flex-direction: column; } .artwork-image-large { width: 100%; height: 150px; } .detail-two-columns { grid-template-columns: 1fr; } .action-buttons { flex-direction: column; } }
</style>
