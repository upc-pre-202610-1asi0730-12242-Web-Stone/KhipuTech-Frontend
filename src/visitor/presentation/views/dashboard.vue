<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo" @click="toggleSidebar">
          <span class="logo-icon">🏛️</span>
          <span v-if="!sidebarCollapsed" class="logo-text">KhipuTech</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
            v-for="item in menuItems"
            :key="item.id"
            @click="activeTab = item.id"
            :class="['nav-item', { active: activeTab === item.id }]"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" class="nav-text">{{ item.name }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info-sidebar" v-if="!sidebarCollapsed">
          <div class="user-avatar">
            {{ user?.name?.charAt(0) || 'V' }}
          </div>
          <div class="user-details-sidebar">
            <p class="user-name-sidebar">{{ user?.name || 'Visitante' }}</p>
            <p class="user-role-sidebar">{{ user?.role || 'visitante' }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn-sidebar">
          <span class="nav-icon">🚪</span>
          <span v-if="!sidebarCollapsed">Salir</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="top-header">
        <div class="header-left">
          <button @click="toggleSidebar" class="menu-toggle">
            ☰
          </button>
          <h2>{{ currentTabTitle }}</h2>
        </div>
        <div class="header-right">
          <div class="user-badge">
            <span class="badge-name">{{ user?.name || 'Visitante' }}</span>
            <span class="badge-role">{{ user?.role || 'visitante' }}</span>
          </div>
          <div class="user-avatar-large">
            {{ user?.name?.charAt(0) || 'V' }}
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Tab: Escanear QR/NFC -->
        <div v-if="activeTab === 'scan'" class="tab-content">
          <div class="scan-section">
            <div class="scan-header">
              <h3>📱 Escanear QR / NFC</h3>
              <p>Coloca el código QR frente a la cámara</p>
            </div>

            <!-- Distribución de dos columnas -->
            <div class="scanner-layout">
              <!-- Columna Izquierda: QR Escaneado -->
              <div class="scanner-card">
                <div class="card-title">
                  <span class="title-icon">📷</span>
                  <h4>QR Escaneado</h4>
                </div>
                <div class="qr-result" :class="scanStatus">
                  <div class="qr-placeholder">
                    <span v-if="!scannedData" class="placeholder-icon">📸</span>
                    <div v-else class="qr-data">
                      <span class="qr-code">{{ scannedData.code }}</span>
                      <span class="qr-type">{{ scannedData.type }}</span>
                    </div>
                  </div>
                </div>
                <p class="qr-hint">{{ scanMessage }}</p>
              </div>

              <!-- Columna Derecha: Verificación de QR -->
              <div class="scanner-card">
                <div class="card-title">
                  <span class="title-icon">🔍</span>
                  <h4>Verifica el código QR</h4>
                </div>
                <div class="verification-box" :class="verificationStatus">
                  <div class="verification-content">
                    <div class="verification-icon">
                      <span v-if="verificationStatus === 'success'">✅</span>
                      <span v-else-if="verificationStatus === 'error'">❌</span>
                      <span v-else-if="verificationStatus === 'warning'">⚠️</span>
                      <span v-else>🔍</span>
                    </div>
                    <p>{{ verificationMessage }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Código Manual -->
            <div class="manual-code-section">
              <div class="divider-text">
                <span>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
                <span>O ingresa el código manualmente</span>
                <span>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
              </div>
              <div class="code-input-group">
                <input
                    type="text"
                    v-model="manualCode"
                    placeholder="CÓDIGO DE OBRA (Ej: KH-2025-001)"
                    class="code-input"
                    @keyup.enter="searchCode"
                />
                <button @click="searchCode" class="search-btn">
                  🔍 Buscar
                </button>
              </div>
            </div>

            <!-- Botones de simulación para pruebas -->
            <div class="simulation-buttons">
              <button @click="simulateQRScan('KH-2025-001', 'Obra Maestra 1')" class="simulate-btn success">
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
        </div>

        <!-- Resto del contenido del dashboard se mantiene igual -->

        <!-- Tab: Detalle de obra -->
        <div v-if="activeTab === 'detail'" class="tab-content">
          <div class="detail-section">
            <div v-if="currentArtwork" class="artwork-detail-container">
              <!-- Encabezado de la obra -->
              <div class="artwork-header">
                <div class="artwork-image-large">
                  <div class="image-placeholder">
                    <span class="artwork-icon">🖼️</span>
                  </div>
                </div>
                <div class="artwork-header-info">
                  <h2>{{ currentArtwork.title }}</h2>
                  <p class="artist-name">{{ currentArtwork.artist }}</p>
                  <p class="artwork-year">{{ currentArtwork.year }}</p>
                  <div class="artwork-tags">
                    <span class="tag">{{ currentArtwork.style || 'Surrealismo' }}</span>
                    <span class="tag">{{ currentArtwork.technique || 'Óleo sobre lienzo' }}</span>
                    <span class="tag">{{ currentArtwork.period || 'Siglo XX' }}</span>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div class="artwork-description">
                <h3>📖 Descripción</h3>
                <p>{{ currentArtwork.description }}</p>
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
                      <p class="audio-title">{{ currentArtwork.audioTitle || 'Explicación de la obra' }}</p>
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
                  <p>{{ currentArtwork.transcript || 'Esta obra maestra representa... (texto completo de la explicación auditiva)' }}</p>
                </div>
                <button @click="showTranscript = !showTranscript" class="transcript-btn">
                  {{ showTranscript ? 'Ocultar transcripción' : 'Ver transcripción' }}
                </button>
              </div>

              <!-- Ubicación en el museo y obras relacionadas en dos columnas -->
              <div class="detail-two-columns">
                <!-- Ubicación en museo -->
                <div class="location-card">
                  <div class="card-header">
                    <span class="card-icon">📍</span>
                    <h3>Ubicación en museo</h3>
                  </div>
                  <div class="location-content">
                    <div class="museum-map-mini">
                      <div class="mini-map">
                        <div class="map-rooms">
                          <div class="mini-room" :class="{ active: currentArtwork.location === 'Entrada' }">🚪</div>
                          <div class="mini-room" :class="{ active: currentArtwork.location === 'Sala 1' }">🎨</div>
                          <div class="mini-room" :class="{ active: currentArtwork.location === 'Sala 2' }">🖼️</div>
                          <div class="mini-room" :class="{ active: currentArtwork.location === 'Sala 3' }">🏺</div>
                        </div>
                        <div class="location-marker">
                          <span class="marker-icon">📍</span>
                          <span class="marker-text">{{ currentArtwork.location || 'Sala 2 - Arte Contemporáneo' }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="location-details">
                      <p><strong>Piso:</strong> {{ currentArtwork.floor || '2° Piso' }}</p>
                      <p><strong>Sala:</strong> {{ currentArtwork.room || 'Sala de Arte Contemporáneo' }}</p>
                      <p><strong>Código de obra:</strong> {{ currentArtwork.code || currentArtwork.title.substring(0, 8).toUpperCase() }}</p>
                    </div>
                    <button @click="goToLocation" class="navigate-btn">
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
                        @click="viewRelatedWork(related)"
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
                <button @click="addToFavorites" class="action-btn favorite">
                  ❤️ Agregar a favoritos
                </button>
                <button @click="shareArtwork" class="action-btn share">
                  📤 Compartir obra
                </button>
                <button @click="scanAnother" class="action-btn scan">
                  📷 Escanear otra obra
                </button>
              </div>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">🔍</div>
              <h3>No hay obra seleccionada</h3>
              <p>Escanea un código QR o busca una obra manualmente para ver sus detalles</p>
              <button @click="activeTab = 'scan'" class="scan-now-btn">
                Escanear ahora
              </button>
            </div>
          </div>
        </div>

        <!-- Tab: Mapa de recorrido -->
        <div v-if="activeTab === 'map'" class="tab-content">
          <div class="map-section">
            <h3>🗺️ Mapa del museo</h3>

            <!-- Tarjeta de Progreso de Exploración -->
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
                    v-for="room in museumRooms"
                    :key="room.id"
                    :class="['room-mini-card', { explored: room.explored, current: room.id === currentRoom }]"
                    @click="goToRoom(room.id)"
                >
                  <span class="room-mini-icon">{{ room.icon }}</span>
                  <span class="room-mini-name">{{ room.name }}</span>
                  <span v-if="room.explored" class="room-check">✅</span>
                </div>
              </div>

              <div class="next-reward" v-if="nextReward">
                <span class="reward-icon">🎁</span>
                <div class="reward-info">
                  <p>¡Sigue explorando!</p>
                  <small>Explora {{ nextReward.roomsNeeded }} salas más para desbloquear: <strong>{{ nextReward.name }}</strong></small>
                </div>
              </div>
            </div>

            <!-- Mapa existente -->
            <div class="museum-map">
              <div class="map-grid">
                <div class="map-node entrance">🚪 Entrada</div>
                <div class="map-node room1">🎨 Sala 1<br><small>Arte Moderno</small></div>
                <div class="map-node room2">🖼️ Sala 2<br><small>Arte Contemporáneo</small></div>
                <div class="map-node room3">🏺 Sala 3<br><small>Arte Clásico</small></div>
                <div class="map-node cafeteria">☕ Cafetería</div>
                <div class="map-node store">🛍️ Tienda</div>
              </div>
              <div class="map-legend">
                <div class="legend-item"><span class="dot current"></span> Tu ubicación</div>
                <div class="legend-item"><span class="dot visited"></span> Visitado</div>
                <div class="legend-item"><span class="dot pending"></span> Por visitar</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Logros y XP -->
        <div v-if="activeTab === 'achievements'" class="tab-content">
          <div class="achievements-section">
            <!-- Tarjeta de XP -->
            <div class="xp-card">
              <h3>🏆 Nivel de Visitante</h3>
              <div class="xp-bar-container">
                <div class="xp-bar-fill" :style="{ width: xpProgress + '%' }"></div>
                <span class="xp-text">{{ currentXP }} / {{ nextLevelXP }} XP</span>
              </div>
              <p class="level-text">Nivel {{ currentLevel }} - ¡Sigue escaneando obras!</p>
            </div>

            <!-- Ranking de Visitantes -->
            <div class="ranking-card">
              <div class="ranking-header">
                <h3>📊 Ranking de Visitantes</h3>
                <span class="ranking-period">Esta semana</span>
              </div>

              <div class="ranking-tabs">
                <button
                    v-for="period in rankingPeriods"
                    :key="period.id"
                    @click="currentRankingPeriod = period.id"
                    :class="['period-tab', { active: currentRankingPeriod === period.id }]"
                >
                  {{ period.name }}
                </button>
              </div>

              <div class="ranking-list">
                <div
                    v-for="(visitor, index) in currentRanking"
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

            <!-- Logros -->
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
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIamStore } from '../../../iam/application/iam-store.js'
import { useRouter } from 'vue-router'

const iamStore = useIamStore()
const router = useRouter()
const sidebarCollapsed = ref(false)
const activeTab = ref('scan')
const manualCode = ref('')
const user = computed(() => iamStore.user)

const menuItems = [
  { id: 'scan', name: 'Escanear QR/NFC', icon: '📱' },
  { id: 'detail', name: 'Detalle de obra', icon: '🖼️' },
  { id: 'map', name: 'Mapa de recorrido', icon: '🗺️' },
  { id: 'achievements', name: 'Logros y XP', icon: '🏆' }
]

const currentTabTitle = computed(() => {
  const item = menuItems.find(i => i.id === activeTab.value)
  return item?.name || 'Dashboard'
})

// Mock data para demo
const currentArtwork = ref(null)

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

// ========== NUEVAS VARIABLES PARA EL ESCÁNER QR ==========
const scannedData = ref(null)
const scanStatus = ref('') // '', 'success', 'error', 'warning'
const scanMessage = ref('Esperando escaneo...')
const verificationStatus = ref('') // '', 'success', 'error', 'warning'
const verificationMessage = ref('Esperando código QR...')

// ========== FUNCIÓN SIMULAR ESCANEO QR ==========
const simulateQRScan = (code, type, isBlurred = false) => {
  if (isBlurred) {
    scanStatus.value = 'warning'
    scanMessage.value = '⚠️ Enfoque deficiente - Ajusta la cámara'
    verificationStatus.value = 'warning'
    verificationMessage.value = 'Cámara desenfocada - Intenta nuevamente'
    scannedData.value = null
    return
  }

  scannedData.value = { code, type }

  const validCodes = {
    'KH-2025-001': { title: 'La persistencia de la memoria', artist: 'Salvador Dalí', year: '1931', style: 'Surrealismo' },
    'KH-2025-002': { title: 'Obra Maestra 1', artist: 'Artista Destacado', year: '2024', style: 'Arte Contemporáneo' },
    'KH-2025-003': { title: 'El pensador', artist: 'Auguste Rodin', year: '1904', style: 'Escultura' },
    'MOMA-001': { title: 'La noche estrellada', artist: 'Vincent van Gogh', year: '1889', style: 'Postimpresionismo' },
    'LUVRE-001': { title: 'Mona Lisa', artist: 'Leonardo da Vinci', year: '1503', style: 'Renacimiento' }
  }

  if (validCodes[code]) {
    scanStatus.value = 'success'
    scanMessage.value = '✅ QR válido - Obra encontrada'
    verificationStatus.value = 'success'
    verificationMessage.value = `¡Obra encontrada! "${validCodes[code].title}" se ha agregado a tu colección`

    // Mostrar detalle automáticamente con los datos correctos
    setArtworkData(validCodes[code])
    activeTab.value = 'detail'

    // Agregar XP
    currentXP.value += 25
  } else {
    scanStatus.value = 'error'
    scanMessage.value = '❌ QR inválido - Código no reconocido'
    verificationStatus.value = 'error'
    verificationMessage.value = 'Código no válido - Intenta nuevamente'
  }
}

        // ========== FUNCIÓN BÚSQUEDA MANUAL (ACTUALIZADA) ==========
        const searchCode = () => {
          if (manualCode.value.trim()) {
            simulateQRScan(manualCode.value.toUpperCase(), `Búsqueda manual: ${manualCode.value}`)
            manualCode.value = ''
          } else {
            alert('Ingresa un código de obra válido')
          }
        }

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}

// ========== RANKING DE VISITANTES ==========
const currentUserId = ref(3) // ID del usuario actual (Tú)

const rankingPeriods = [
  { id: 'week', name: 'Esta semana' },
  { id: 'month', name: 'Este mes' },
  { id: 'all', name: 'Todo el tiempo' }
]

const currentRankingPeriod = ref('week')

// Datos del ranking
const rankings = ref({
  week: [
    { id: 1, name: 'Maria', role: 'Exploradora', xp: 1250, scans: 34, avatar: 'M' },
    { id: 2, name: 'Carlos', role: 'Coleccionista', xp: 980, scans: 27, avatar: 'C' },
    { id: 3, name: 'Tú', role: 'Visitante', xp: currentXP.value, scans: 12, avatar: 'T', isCurrentUser: true },
    { id: 4, name: 'Ana', role: 'Principiante', xp: 450, scans: 8, avatar: 'A' },
    { id: 5, name: 'Luis', role: 'Principiante', xp: 320, scans: 5, avatar: 'L' },
    { id: 6, name: 'Sofia', role: 'Nuevo', xp: 180, scans: 3, avatar: 'S' }
  ],
  month: [
    { id: 1, name: 'Carlos', role: 'Coleccionista', xp: 2450, scans: 67, avatar: 'C' },
    { id: 2, name: 'Maria', role: 'Exploradora', xp: 2100, scans: 58, avatar: 'M' },
    { id: 3, name: 'Tú', role: 'Visitante', xp: currentXP.value, scans: 32, avatar: 'T', isCurrentUser: true },
    { id: 4, name: 'Luis', role: 'Principiante', xp: 890, scans: 22, avatar: 'L' },
    { id: 5, name: 'Ana', role: 'Principiante', xp: 670, scans: 15, avatar: 'A' }
  ],
  all: [
    { id: 1, name: 'Carlos', role: 'Experto', xp: 5800, scans: 156, avatar: 'C' },
    { id: 2, name: 'Maria', role: 'Maestra', xp: 4950, scans: 134, avatar: 'M' },
    { id: 3, name: 'Tú', role: 'Visitante', xp: currentXP.value, scans: 45, avatar: 'T', isCurrentUser: true },
    { id: 4, name: 'Ana', role: 'Aprendiz', xp: 2100, scans: 58, avatar: 'A' },
    { id: 5, name: 'Luis', role: 'Aprendiz', xp: 1850, scans: 42, avatar: 'L' }
  ]
})

// Computed para ranking actual
const currentRanking = computed(() => {
  const ranking = rankings.value[currentRankingPeriod.value]
  // Actualizar XP del usuario actual
  return ranking.map(r =>
      r.id === currentUserId.value ? { ...r, xp: currentXP.value } : r
  ).sort((a, b) => b.xp - a.xp)
})

// Computed para posición del usuario
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

// ========== VARIABLES DE AUDIO ==========
const isPlaying = ref(false)
const audioProgress = ref(0)
const audioDuration = ref('02:30')
const volume = ref(70)
const showTranscript = ref(false)
let audioInterval = null

// ========== FUNCIÓN PARA SETEAR DATOS DE OBRA ==========
const setArtworkData = (artwork) => {
  currentArtwork.value = {
    title: artwork.title || 'La persistencia de la memoria',
    artist: artwork.artist || 'Salvador Dalí',
    year: artwork.year || '1931',
    style: artwork.style || 'Surrealismo',
    technique: artwork.technique || 'Óleo sobre lienzo',
    period: artwork.period || 'Siglo XX',
    location: artwork.location || 'Sala 2',
    floor: artwork.floor || '2° Piso',
    room: artwork.room || 'Sala de Arte Contemporáneo',
    code: artwork.code || artwork.title?.substring(0, 8).toUpperCase() || 'DAL-1931-001',
    audioTitle: artwork.audioTitle || 'Análisis de la obra',
    transcript: artwork.transcript || 'Esta obra maestra representa una fusión única entre el arte tradicional y las nuevas tecnologías. Utiliza técnicas mixtas y materiales innovadores para crear una experiencia visual única.',
    description: artwork.description || 'Una obra excepcional que captura la esencia del arte contemporáneo, invitando al espectador a una reflexión profunda sobre la percepción y la realidad.'
  }
}

// ========== FUNCIONES DE AUDIO ==========
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

// ========== OBRAS RELACIONADAS ==========
const relatedWorks = ref([
  {
    id: 1,
    title: 'La noche estrellada',
    artist: 'Vincent van Gogh',
    year: '1889',
    icon: '🌙',
    style: 'Postimpresionismo',
    location: 'Sala 1',
    description: 'Una de las pinturas más icónicas del arte occidental.'
  },
  {
    id: 2,
    title: 'El grito',
    artist: 'Edvard Munch',
    year: '1893',
    icon: '😱',
    style: 'Expresionismo',
    location: 'Sala 1',
    description: 'Representa la angustia existencial humana.'
  },
  {
    id: 3,
    title: 'Guernica',
    artist: 'Pablo Picasso',
    year: '1937',
    icon: '🎭',
    style: 'Cubismo',
    location: 'Sala 3',
    description: 'Poderoso símbolo contra la guerra.'
  },
  {
    id: 4,
    title: 'El beso',
    artist: 'Gustav Klimt',
    year: '1908',
    icon: '💑',
    style: 'Modernismo',
    location: 'Sala 2',
    description: 'Obra maestra del simbolismo vienés.'
  }
])

// ========== ACCIONES DEL DETALLE ==========
const viewRelatedWork = (related) => {
  setArtworkData(related)
  currentXP.value += 10
  alert(`Ahora explorando: ${related.title}`)
}

const goToLocation = () => {
  alert(`Navegando hacia: ${currentArtwork.value.location || 'Sala de la obra'}`)
  activeTab.value = 'map'
}

const addToFavorites = () => {
  alert(`❤️ "${currentArtwork.value.title}" ha sido agregado a tus favoritos`)
}

const shareArtwork = () => {
  alert(`📤 Compartir "${currentArtwork.value.title}" en redes sociales`)
}

const scanAnother = () => {
  activeTab.value = 'scan'
}

// ========== INICIALIZAR OBRA DE PRUEBA ==========
const initTestArtwork = () => {
  setArtworkData({
    title: 'Obra Maestra 1',
    artist: 'Artista Destacado',
    year: '2024',
    style: 'Arte Contemporáneo',
    technique: 'Mixta sobre lienzo',
    period: 'Siglo XXI',
    location: 'Sala 2',
    floor: '1° Piso',
    room: 'Sala de Arte Contemporáneo',
    code: 'MAESTRA-001',
    audioTitle: 'Análisis de Obra Maestra 1',
    description: 'Esta obra maestra representa la fusión entre el arte tradicional y las nuevas tecnologías. Utiliza técnicas mixtas y materiales innovadores para crear una experiencia visual única que desafía los límites de la percepción artística.'
  })
}

// Llamar a la función para que haya una obra de prueba
initTestArtwork()

// ========== PROGRESO DE EXPLORACIÓN DEL MUSEO ==========
const currentRoom = ref('room2') // Sala actual del usuario
const exploredRooms = ref(2) // Salas exploradas
const totalRooms = ref(6) // Total de salas
const artworksFound = ref(5) // Obras descubiertas

const exploredPercentage = computed(() => Math.round((exploredRooms.value / totalRooms.value) * 100))

const museumRooms = ref([
  { id: 'entrance', name: 'Entrada', icon: '🚪', explored: true, artworks: 0 },
  { id: 'room1', name: 'Sala 1', icon: '🎨', explored: true, artworks: 3, description: 'Arte Moderno' },
  { id: 'room2', name: 'Sala 2', icon: '🖼️', explored: false, artworks: 2, description: 'Arte Contemporáneo' },
  { id: 'room3', name: 'Sala 3', icon: '🏺', explored: false, artworks: 4, description: 'Arte Clásico' },
  { id: 'cafeteria', name: 'Cafetería', icon: '☕', explored: false, artworks: 0 },
  { id: 'store', name: 'Tienda', icon: '🛍️', explored: false, artworks: 0 }
])

const nextReward = computed(() => {
  const remainingToExplore = totalRooms.value - exploredRooms.value
  if (remainingToExplore <= 2) {
    return { name: '🏆 "Explorador Experto"', roomsNeeded: remainingToExplore }
  } else if (remainingToExplore <= 4) {
    return { name: '📜 "Guía del Museo"', roomsNeeded: remainingToExplore - 2 }
  }
  return null
})

// Función para ir a una sala (desde el mapa mini)
const goToRoom = (roomId) => {
  const room = museumRooms.value.find(r => r.id === roomId)
  if (room) {
    currentRoom.value = roomId
    if (!room.explored) {
      room.explored = true
      exploredRooms.value++
      currentXP.value += 30
      alert(`🎉 ¡Has descubierto ${room.name}! +30 XP`)

      // Agregar obras descubiertas
      artworksFound.value += room.artworks
    } else {
      alert(`📍 Ya has visitado ${room.name}`)
    }
  }
}

// Actualizar exploración cuando se escanea una obra
const updateExplorationFromArtwork = (artworkLocation) => {
  const roomMap = {
    'Sala 1': 'room1',
    'Sala 2': 'room2',
    'Sala 3': 'room3',
    'Entrada': 'entrance',
    'Cafetería': 'cafeteria',
    'Tienda': 'store'
  }

  const roomId = roomMap[artworkLocation]
  if (roomId) {
    const room = museumRooms.value.find(r => r.id === roomId)
    if (room && !room.explored) {
      room.explored = true
      exploredRooms.value++
      artworksFound.value += room.artworks
      currentXP.value += 30
    }
  }
}

</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 25px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  width: 100%;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-icon {
  font-size: 20px;
  min-width: 24px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info-sidebar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.user-details-sidebar {
  flex: 1;
}

.user-name-sidebar {
  font-size: 14px;
  font-weight: 600;
}

.user-role-sidebar {
  font-size: 11px;
  opacity: 0.7;
}

.logout-btn-sidebar {
  width: 100%;
  padding: 10px;
  background: rgba(231, 76, 60, 0.3);
  border: none;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn-sidebar:hover {
  background: rgba(231, 76, 60, 0.5);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed ~ .main-content {
  margin-left: 70px;
}

.top-header {
  background: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #2c3e50;
}

.header-left h2 {
  margin: 0;
  color: #2c3e50;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-badge {
  text-align: right;
}

.badge-name {
  display: block;
  font-weight: 600;
  color: #2c3e50;
}

.badge-role {
  font-size: 12px;
  color: #7f8c8d;
}

.user-avatar-large {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: white;
}

.content-area {
  padding: 30px;
}

/* Scan Section */
.scan-section h3, .detail-section h3, .map-section h3, .achievements-section h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.scan-header {
  margin-bottom: 30px;
}

.scanner-container {
  max-width: 600px;
  margin: 0 auto;
}

.scanner-box {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.scanner-frame {
  width: 300px;
  height: 300px;
  margin: 0 auto 20px;
  position: relative;
  border: 3px solid #667eea;
  border-radius: 15px;
  overflow: hidden;
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.scanner-hint {
  color: #7f8c8d;
}

.manual-code-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
}

.divider-text {
  text-align: center;
  margin-bottom: 20px;
  color: #7f8c8d;
}

.code-input-group {
  display: flex;
  gap: 10px;
}

.code-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
}

.search-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

/* Artwork Card */
.artwork-card {
  display: flex;
  gap: 30px;
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-top: 20px;
}

.artwork-image-placeholder {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
}

.artwork-info h4 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.artist, .year {
  color: #7f8c8d;
  margin-bottom: 5px;
}

.description {
  margin-top: 15px;
  line-height: 1.6;
  color: #34495e;
}

.empty-state {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 15px;
  color: #7f8c8d;
}

/* Map Section */
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

/* Achievements Section */
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
}

.level-text {
  font-size: 14px;
  opacity: 0.9;
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
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .artwork-card {
    flex-direction: column;
  }

  .map-grid {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }
}

/* Scanner Layout - Dos columnas */
.scanner-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 30px;
}

.scanner-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.scanner-card:hover {
  transform: translateY(-5px);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.card-title .title-icon {
  font-size: 24px;
}

.card-title h4 {
  margin: 0;
  color: #2c3e50;
}

/* QR Result Styles */
.qr-result {
  min-height: 200px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 3px solid #e0e0e0;
}

.qr-result.success {
  border-color: #27ae60;
  background: #d5f4e6;
}

.qr-result.error {
  border-color: #e74c3c;
  background: #fde5e5;
}

.qr-result.warning {
  border-color: #f39c12;
  background: #fff3e0;
}

.qr-placeholder {
  text-align: center;
}

.placeholder-icon {
  font-size: 60px;
  opacity: 0.5;
}

.qr-data {
  text-align: center;
}

.qr-code {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
  font-family: monospace;
}

.qr-type {
  font-size: 12px;
  color: #7f8c8d;
}

.qr-hint {
  margin-top: 15px;
  font-size: 12px;
  color: #7f8c8d;
  text-align: center;
}

/* Verification Box Styles */
.verification-box {
  min-height: 200px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 3px solid #e0e0e0;
}

.verification-box.success {
  border-color: #27ae60;
  background: linear-gradient(135deg, #d5f4e6, #a8e6cf);
  animation: pulseSuccess 0.5s ease;
}

.verification-box.error {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #fde5e5, #f8c9c9);
  animation: shake 0.5s ease;
}

.verification-box.warning {
  border-color: #f39c12;
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
}

.verification-content {
  text-align: center;
}

.verification-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.verification-box p {
  margin: 0;
  font-weight: 500;
  color: #2c3e50;
}

/* Animations */
@keyframes pulseSuccess {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Manual Code Section */
.manual-code-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-top: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.divider-text {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  color: #7f8c8d;
  font-size: 13px;
}

.divider-text span:first-child,
.divider-text span:last-child {
  flex: 1;
  font-family: monospace;
  letter-spacing: -1px;
}

.code-input-group {
  display: flex;
  gap: 15px;
}

.code-input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: monospace;
}

.code-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Simulation Buttons for Testing */
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
  .scanner-layout {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .code-input-group {
    flex-direction: column;
  }

  .divider-text {
    flex-direction: column;
    gap: 10px;
  }

  .simulation-buttons {
    flex-direction: column;
  }
}

/* Ranking Card */
.ranking-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
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

/* Responsive */
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

/* Detalle de obra */
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

/* Audio Guide */
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

/* Two columns layout */
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

.scan-now-btn {
  margin-top: 20px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
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

/* Tarjeta de Progreso de Exploración */
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

.next-reward {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 15px;
  margin-top: 15px;
}

.reward-icon {
  font-size: 28px;
}

.reward-info p {
  margin: 0;
  font-weight: 600;
  font-size: 13px;
}

.reward-info small {
  font-size: 11px;
  opacity: 0.8;
}

.reward-info strong {
  color: #f39c12;
}

/* Responsive */
@media (max-width: 768px) {
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