<template>
  <div class="dashboard-container">
    <SharedLayout
        :menu-items="menuItems"
        :current-tab="activeTab"
        @update:tab="activeTab = $event"
        @logout="handleLogout"
    >
      <template #content>
        <div class="content-area">
          <!-- Tab: Escanear QR/NFC -->
          <div v-if="activeTab === 'scan'" class="tab-content">
            <div class="scan-header">
              <h3>📱 Escanear QR / NFC</h3>
              <p>Coloca el código QR frente a la cámara</p>
            </div>

            <!-- Layout de dos columnas para el escáner -->
            <div class="scanner-layout">
              <QRScanner
                  :scanned-data="scannedData"
                  :scan-status="scanStatus"
                  :scan-message="scanMessage"
              />
              <QRVerification
                  :verification-status="verificationStatus"
                  :verification-message="verificationMessage"
              />
            </div>

            <!-- Búsqueda manual -->
            <ManualCodeSearch
                v-model:code="manualCode"
                @search="searchCode"
            />

            <!-- Botones de simulación (solo desarrollo) -->
            <div class="simulation-buttons">
              <button @click="simulateQRScan('KH-2025-001', 'La persistencia de la memoria')" class="simulate-btn success">
                Simular QR Válido
              </button>
              <button @click="simulateQRScan('INVALIDO', 'Código inválido')" class="simulate-btn error">
                Simular QR Inválido
              </button>
              <button @click="simulateQRScan('', '', true)" class="simulate-btn warning">
                Simular Mal Enfoque
              </button>
            </div>
          </div>

          <!-- Tab: Detalle de obra -->
          <div v-if="activeTab === 'detail'" class="tab-content">
            <ArtworkDetail
                :artwork="currentArtwork"
                :related-works="relatedWorks"
                @view-related="viewRelatedWork"
                @go-to-location="goToLocation"
                @scan-another="activeTab = 'scan'"
            />
          </div>

          <!-- Tab: Mapa de recorrido -->
          <div v-if="activeTab === 'map'" class="tab-content">

            <MuseumMap
                :rooms="museumRooms"
                :current-room="currentRoom"
                :explored-percentage="exploredPercentage"
                :explored-rooms="exploredRooms"
                :total-rooms="totalRooms"
                :artworks-found="artworksFound"
                @go-to-room="goToRoom"
            />

            <!-- Recomendaciones -->
            <div class="recommendations-section">
              <div class="recommendations-header">
                <h3>✨ En base a tus obras favoritas</h3>
                <p>Recorridos recomendados para ti</p>
              </div>

              <div class="recommendations-grid">

                <div class="recommendation-card">
                  <div class="recommendation-icon">🎨</div>
                  <h4>Ruta Arte Moderno</h4>
                  <p>Explora obras contemporáneas.</p>
                  <button class="recommendation-btn" @click="router.push('/recorrido/moderno')">
                    Ver recorrido
                  </button>
                </div>

                <div class="recommendation-card">
                  <div class="recommendation-icon">🏺</div>
                  <h4>Ruta Clásica</h4>
                  <p>Descubre las piezas históricas más destacadas del museo.</p>
                  <button class="recommendation-btn" @click="router.push('/recorrido/clasica')">
                    Ver recorrido
                  </button>
                </div>

                <div class="recommendation-card">
                  <div class="recommendation-icon">☕</div>
                  <h4>Ruta Relax</h4>
                  <p>Un recorrido tranquilo.</p>
                  <button class="recommendation-btn" @click="router.push('/recorrido/relax')">
                    Ver recorrido
                  </button>
                </div>

              </div>
            </div>

          </div>



          <!-- Tab: Logros y XP -->
          <div v-if="activeTab === 'achievements'" class="tab-content">
            <AchievementsPanel
                :current-xp="currentXP"
                :next-level-xp="nextLevelXP"
                :current-level="currentLevel"
                :xp-progress="xpProgress"
                :achievements="achievements"
            />
            <RankingPanel
                :ranking="currentRanking"
                :current-user-id="currentUserId"
                :current-user-rank="currentUserRank"
                :total-visitors="totalVisitors"
                :xp-to-next-rank="xpToNextRank"
                :periods="rankingPeriods"
                v-model:period="currentRankingPeriod"
            />
          </div>
        </div>
      </template>
    </SharedLayout>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useIamStore } from '../../../iam/application/iam-store.js'
import SharedLayout from '../../../shared/presentation/components/layout.vue'
import QRScanner from '../components/qrscanner.vue'
import QRVerification from '../components/qrverification.vue'
import ManualCodeSearch from '../components/manualcodesearch.vue'
import ArtworkDetail from '../components/artworkdetail.vue'
import MuseumMap from '../components/museummap.vue'
import AchievementsPanel from '../components/achievementspanel.vue'
import RankingPanel from '../components/rankingpanel.vue'

const iamStore = useIamStore()
const router = useRouter()
const activeTab = ref('scan')
const manualCode = ref('')
const user = computed(() => iamStore.user)

const menuItems = [
  { id: 'scan', name: 'Escanear QR/NFC', icon: '📱' },
  { id: 'detail', name: 'Detalle de obra', icon: '🖼️' },
  { id: 'map', name: 'Mapa de recorrido', icon: '🗺️' },
  { id: 'achievements', name: 'Logros y XP', icon: '🏆' }
]

// ========== ESCÁNER QR ==========
const scannedData = ref(null)
const scanStatus = ref('')
const scanMessage = ref('Esperando escaneo...')
const verificationStatus = ref('')
const verificationMessage = ref('Esperando código QR...')

// ========== DETALLE DE OBRA ==========
const currentArtwork = ref(null)

// ========== MAPA ==========
const currentRoom = ref('room2')
const exploredRooms = ref(2)
const totalRooms = ref(6)
const artworksFound = ref(5)

const exploredPercentage = computed(() => Math.round((exploredRooms.value / totalRooms.value) * 100))

const museumRooms = ref([
  { id: 'entrance', name: 'Entrada', icon: '🚪', explored: true, artworks: 0, description: 'Puerta principal' },
  { id: 'room1', name: 'Sala 1', icon: '🎨', explored: true, artworks: 3, description: 'Arte Moderno' },
  { id: 'room2', name: 'Sala 2', icon: '🖼️', explored: false, artworks: 2, description: 'Arte Contemporáneo' },
  { id: 'room3', name: 'Sala 3', icon: '🏺', explored: false, artworks: 4, description: 'Arte Clásico' },
  { id: 'cafeteria', name: 'Cafetería', icon: '☕', explored: false, artworks: 0, description: 'Descanso' },
  { id: 'store', name: 'Tienda', icon: '🛍️', explored: false, artworks: 0, description: 'Souvenirs' }
])

// ========== LOGROS Y XP ==========
const currentXP = ref(450)
const nextLevelXP = ref(1000)
const currentLevel = computed(() => Math.floor(currentXP.value / 200) + 1)
const xpProgress = computed(() => (currentXP.value / nextLevelXP.value) * 100)

const achievements = ref([
  { id: 1, name: 'Primer Escaneo', description: 'Escanea tu primera obra', icon: '🎯', progress: 100, xp: 50, completed: true },
  { id: 2, name: 'Explorador', description: 'Visita 5 salas diferentes', icon: '🗺️', progress: 60, xp: 100, completed: false },
  { id: 3, name: 'Coleccionista', description: 'Escanea 10 obras', icon: '📚', progress: 40, xp: 150, completed: false },
  { id: 4, name: 'Experto en Arte', description: 'Completa todas las salas', icon: '🎓', progress: 20, xp: 200, completed: false }
])

// ========== RANKING ==========
const currentUserId = ref(3)
const rankingPeriods = ref(['Esta semana', 'Este mes', 'Todo el tiempo'])
const currentRankingPeriod = ref('Esta semana')

const rankings = ref({
  'Esta semana': [
    { id: 1, name: 'Maria', role: 'Exploradora', xp: 1250, scans: 34 },
    { id: 2, name: 'Carlos', role: 'Coleccionista', xp: 980, scans: 27 },
    { id: 3, name: 'Tú', role: 'Visitante', xp: currentXP.value, scans: 12 },
    { id: 4, name: 'Ana', role: 'Principiante', xp: 450, scans: 8 }
  ],
  'Este mes': [
    { id: 1, name: 'Carlos', role: 'Coleccionista', xp: 2450, scans: 67 },
    { id: 2, name: 'Maria', role: 'Exploradora', xp: 2100, scans: 58 },
    { id: 3, name: 'Tú', role: 'Visitante', xp: currentXP.value, scans: 32 }
  ],
  'Todo el tiempo': [
    { id: 1, name: 'Carlos', role: 'Experto', xp: 5800, scans: 156 },
    { id: 2, name: 'Maria', role: 'Maestra', xp: 4950, scans: 134 },
    { id: 3, name: 'Tú', role: 'Visitante', xp: currentXP.value, scans: 45 }
  ]
})

const currentRanking = computed(() => {
  const ranking = rankings.value[currentRankingPeriod.value]
  return ranking.map(r =>
      r.id === currentUserId.value ? { ...r, xp: currentXP.value } : r
  ).sort((a, b) => b.xp - a.xp)
})

const currentUserRank = computed(() => {
  const index = currentRanking.value.findIndex(r => r.id === currentUserId.value)
  return index + 1
})

const totalVisitors = computed(() => currentRanking.value.length)

const xpToNextRank = computed(() => {
  const currentIndex = currentRanking.value.findIndex(r => r.id === currentUserId.value)
  if (currentIndex === 0) return 0
  const nextUser = currentRanking.value[currentIndex - 1]
  return nextUser ? nextUser.xp - currentXP.value : 0
})

// ========== OBRAS RELACIONADAS ==========
const relatedWorks = ref([
  { id: 1, title: 'La noche estrellada', artist: 'Van Gogh', year: '1889', icon: '🌙' },
  { id: 2, title: 'El grito', artist: 'Munch', year: '1893', icon: '😱' },
  { id: 3, title: 'Guernica', artist: 'Picasso', year: '1937', icon: '🎭' },
  { id: 4, title: 'El beso', artist: 'Klimt', year: '1908', icon: '💑' }
])

// ========== FUNCIONES ==========
const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}

const setArtworkData = (artwork) => {
  currentArtwork.value = {
    title: artwork.title,
    artist: artwork.artist,
    year: artwork.year,
    style: artwork.style || 'Surrealismo',
    description: artwork.description || 'Esta obra maestra representa una fusión única entre el arte tradicional y las nuevas tecnologías.'
  }
  activeTab.value = 'detail'
}

const simulateQRScan = (code, title, isBlurred = false) => {
  if (isBlurred) {
    scanStatus.value = 'warning'
    scanMessage.value = '⚠️ Enfoque deficiente - Ajusta la cámara'
    verificationStatus.value = 'warning'
    verificationMessage.value = 'Cámara desenfocada - Intenta nuevamente'
    scannedData.value = null
    return
  }

  scannedData.value = { code, title }

  const validCodes = {
    'KH-2025-001': { title: 'La persistencia de la memoria', artist: 'Salvador Dalí', year: '1931' },
    'MOMA-001': { title: 'La noche estrellada', artist: 'Van Gogh', year: '1889' }
  }

  if (validCodes[code]) {
    scanStatus.value = 'success'
    scanMessage.value = '✅ QR válido - Obra encontrada'
    verificationStatus.value = 'success'
    verificationMessage.value = `¡Obra encontrada! "${validCodes[code].title}"`
    setArtworkData(validCodes[code])
    currentXP.value += 25
  } else {
    scanStatus.value = 'error'
    scanMessage.value = '❌ QR inválido - Código no reconocido'
    verificationStatus.value = 'error'
    verificationMessage.value = 'Código no válido - Intenta nuevamente'
  }
}

const searchCode = () => {
  if (manualCode.value.trim()) {
    simulateQRScan(manualCode.value.toUpperCase(), 'Búsqueda manual')
    manualCode.value = ''
  } else {
    alert('Ingresa un código de obra válido')
  }
}

const viewRelatedWork = (related) => {
  setArtworkData(related)
  currentXP.value += 10
}

const goToLocation = () => {
  activeTab.value = 'map'
}

const goToRoom = (roomId) => {
  const room = museumRooms.value.find(r => r.id === roomId)
  if (room && !room.explored) {
    room.explored = true
    exploredRooms.value++
    artworksFound.value += room.artworks
    currentXP.value += 30
    alert(`🎉 ¡Has descubierto ${room.name}! +30 XP`)
  }
}

// Sincronizar ranking con XP actual
watch(currentXP, (newXP) => {
  const userRanking = rankings.value[currentRankingPeriod.value]
  const userIndex = userRanking.findIndex(r => r.id === currentUserId.value)
  if (userIndex !== -1) {
    userRanking[userIndex].xp = newXP
  }
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.content-area {
  padding: 30px;
  width: 100%;
}
.recommendations-section {
  margin-top: 55px;
}

.recommendations-header h3 {
  font-size: 28px;
  color: #0f172a;
  margin-bottom: 10px;
}

.recommendations-header p {
  font-size: 18px;
  color: #64748b;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.recommendation-card {
  min-height: 210px;
  background: white;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.recommendation-icon {
  font-size: 36px;
  margin-bottom: 32px;
}

.recommendation-card h4 {
  font-size: 22px;
  margin-bottom: 14px;
  color: #0f172a;
}

.recommendation-card p {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 26px;
  line-height: 1.5;
}

.recommendation-btn {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: white;
  border: none;
  padding: 13px 22px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
}

.scan-header {
  margin-bottom: 30px;
}

.scan-header h3 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.scan-header p {
  color: #7f8c8d;
}

.scanner-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 30px;
}

.simulation-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
}

.simulate-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s;
}

.simulate-btn.success {
  background: #27ae60;
  color: white;
}

.simulate-btn.error {
  background: #e74c3c;
  color: white;
}

.simulate-btn.warning {
  background: #f39c12;
  color: white;
}

.simulate-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .content-area {
    padding: 15px;
  }

  .scanner-layout {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .simulation-buttons {
    flex-direction: column;
  }
}
</style>