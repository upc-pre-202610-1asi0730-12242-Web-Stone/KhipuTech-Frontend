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
          <div v-if="activeTab === 'scan'" class="tab-content">
            <div class="scan-header">
              <h3>{{ t('visitor.scan.title') }}</h3>
              <p>{{ t('visitor.scan.subtitle') }}</p>
            </div>
            <div class="scanner-layout">
              <QRScanner :scanned-data="scannedData" :scan-status="scanStatus" :scan-message="scanMessage" />
              <QRVerification :verification-status="verificationStatus" :verification-message="verificationMessage" />
            </div>
            <ManualCodeSearch v-model:code="manualCode" @search="searchCode" />
            <div class="simulation-buttons">
              <button @click="simulateQRScan('KH-2025-001', 'La persistencia de la memoria')" class="simulate-btn success">{{ t('visitor.scan.simulateValid') }}</button>
              <button @click="simulateQRScan('INVALIDO', 'Código inválido')" class="simulate-btn error">{{ t('visitor.scan.simulateInvalid') }}</button>
              <button @click="simulateQRScan('', '', true)" class="simulate-btn warning">{{ t('visitor.scan.simulateBlurred') }}</button>
            </div>
          </div>

          <div v-if="activeTab === 'detail'" class="tab-content">
            <ArtworkDetail
                :artwork="currentArtwork"
                :related-works="relatedWorks"
                @view-related="viewRelatedWork"
                @go-to-location="goToLocation"
                @scan-another="activeTab = 'scan'"
            />
          </div>

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
          </div>

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
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../../iam/application/iam-store.js'
import SharedLayout from '../../../shared/presentation/components/layout.vue'
import QRScanner from '../components/qrscanner.vue'
import QRVerification from '../components/qrverification.vue'
import ManualCodeSearch from '../components/manualcodesearch.vue'
import ArtworkDetail from '../components/artworkdetail.vue'
import MuseumMap from '../components/museummap.vue'
import AchievementsPanel from '../components/achievementspanel.vue'
import RankingPanel from '../components/rankingpanel.vue'

const { t } = useI18n()
const iamStore = useIamStore()
const router = useRouter()
const activeTab = ref('scan')
const manualCode = ref('')

const menuItems = computed(() => [
  { id: 'scan', name: t('nav.scan'), icon: '📱' },
  { id: 'detail', name: t('nav.detail'), icon: '🖼️' },
  { id: 'map', name: t('nav.map'), icon: '🗺️' },
  { id: 'achievements', name: t('nav.achievements'), icon: '🏆' }
])

const scannedData = ref(null)
const scanStatus = ref('')
const scanMessage = ref(t('visitor.scan.waiting'))
const verificationStatus = ref('')
const verificationMessage = ref(t('visitor.scan.waitingCode'))

const currentArtwork = ref(null)
const currentRoom = ref('room2')
const exploredRooms = ref(2)
const totalRooms = ref(6)
const artworksFound = ref(5)
const exploredPercentage = computed(() => Math.round((exploredRooms.value / totalRooms.value) * 100))

const roomStates = ref({
  entrance: { explored: true }, room1: { explored: true }, room2: { explored: false },
  room3: { explored: false }, cafeteria: { explored: false }, store: { explored: false }
})

const museumRooms = computed(() => [
  { id: 'entrance', name: t('visitor.rooms.entrance.name'), icon: '🚪', explored: roomStates.value.entrance.explored, artworks: 0, description: t('visitor.rooms.entrance.description') },
  { id: 'room1', name: t('visitor.rooms.room1.name'), icon: '🎨', explored: roomStates.value.room1.explored, artworks: 3, description: t('visitor.rooms.room1.description') },
  { id: 'room2', name: t('visitor.rooms.room2.name'), icon: '🖼️', explored: roomStates.value.room2.explored, artworks: 2, description: t('visitor.rooms.room2.description') },
  { id: 'room3', name: t('visitor.rooms.room3.name'), icon: '🏺', explored: roomStates.value.room3.explored, artworks: 4, description: t('visitor.rooms.room3.description') },
  { id: 'cafeteria', name: t('visitor.rooms.cafeteria.name'), icon: '☕', explored: roomStates.value.cafeteria.explored, artworks: 0, description: t('visitor.rooms.cafeteria.description') },
  { id: 'store', name: t('visitor.rooms.store.name'), icon: '🛍️', explored: roomStates.value.store.explored, artworks: 0, description: t('visitor.rooms.store.description') }
])

const currentXP = ref(450)
const nextLevelXP = ref(1000)
const currentLevel = computed(() => Math.floor(currentXP.value / 200) + 1)
const xpProgress = computed(() => (currentXP.value / nextLevelXP.value) * 100)

const achievements = computed(() => [
  { id: 1, name: t('visitor.achievementsList.firstScan.name'), description: t('visitor.achievementsList.firstScan.description'), icon: '🎯', progress: 100, xp: 50, completed: true },
  { id: 2, name: t('visitor.achievementsList.explorer.name'), description: t('visitor.achievementsList.explorer.description'), icon: '🗺️', progress: 60, xp: 100, completed: false },
  { id: 3, name: t('visitor.achievementsList.collector.name'), description: t('visitor.achievementsList.collector.description'), icon: '📚', progress: 40, xp: 150, completed: false },
  { id: 4, name: t('visitor.achievementsList.artExpert.name'), description: t('visitor.achievementsList.artExpert.description'), icon: '🎓', progress: 20, xp: 200, completed: false }
])

const currentUserId = ref(3)
const rankingPeriods = computed(() => [t('visitor.periods.thisWeek'), t('visitor.periods.thisMonth'), t('visitor.periods.allTime')])
const currentRankingPeriod = ref('')
watch(rankingPeriods, (val) => { if (!currentRankingPeriod.value) currentRankingPeriod.value = val[0] }, { immediate: true })

const rankings = ref({
  week: [
    { id: 1, name: 'Maria', role: 'Explorer', xp: 1250, scans: 34 },
    { id: 2, name: 'Carlos', role: 'Collector', xp: 980, scans: 27 },
    { id: 3, name: 'You', role: 'Visitor', xp: 450, scans: 12 },
    { id: 4, name: 'Ana', role: 'Beginner', xp: 450, scans: 8 }
  ],
  month: [
    { id: 1, name: 'Carlos', role: 'Collector', xp: 2450, scans: 67 },
    { id: 2, name: 'Maria', role: 'Explorer', xp: 2100, scans: 58 },
    { id: 3, name: 'You', role: 'Visitor', xp: 450, scans: 32 }
  ],
  all: [
    { id: 1, name: 'Carlos', role: 'Expert', xp: 5800, scans: 156 },
    { id: 2, name: 'Maria', role: 'Master', xp: 4950, scans: 134 },
    { id: 3, name: 'You', role: 'Visitor', xp: 450, scans: 45 }
  ]
})

const currentRanking = computed(() => {
  const keys = ['week', 'month', 'all']
  const idx = rankingPeriods.value.indexOf(currentRankingPeriod.value)
  const key = keys[idx] || 'week'
  return (rankings.value[key] || []).map(r => r.id === currentUserId.value ? { ...r, xp: currentXP.value } : r).sort((a, b) => b.xp - a.xp)
})

const currentUserRank = computed(() => currentRanking.value.findIndex(r => r.id === currentUserId.value) + 1)
const totalVisitors = computed(() => currentRanking.value.length)
const xpToNextRank = computed(() => {
  const idx = currentRanking.value.findIndex(r => r.id === currentUserId.value)
  if (idx <= 0) return 0
  return (currentRanking.value[idx - 1]?.xp || 0) - currentXP.value
})

const relatedWorks = ref([
  { id: 1, title: 'The Starry Night', artist: 'Van Gogh', year: '1889', icon: '🌙' },
  { id: 2, title: 'The Scream', artist: 'Munch', year: '1893', icon: '😱' },
  { id: 3, title: 'Guernica', artist: 'Picasso', year: '1937', icon: '🎭' },
  { id: 4, title: 'The Kiss', artist: 'Klimt', year: '1908', icon: '💑' }
])

const handleLogout = () => { iamStore.signOut(); router.push('/sign-in') }

const setArtworkData = (artwork) => {
  currentArtwork.value = { title: artwork.title, artist: artwork.artist, year: artwork.year, style: artwork.style || t('visitor.artwork.defaultStyle'), description: artwork.description || t('visitor.artwork.defaultDescription') }
  activeTab.value = 'detail'
}

const simulateQRScan = (code, title, isBlurred = false) => {
  if (isBlurred) {
    scanStatus.value = 'warning'
    scanMessage.value = '⚠️ Poor focus – Adjust the camera'
    verificationStatus.value = 'warning'
    verificationMessage.value = 'Camera out of focus – Try again'
    scannedData.value = null
    return
  }
  scannedData.value = { code, title }
  const validCodes = {
    'KH-2025-001': { title: 'The Persistence of Memory', artist: 'Salvador Dalí', year: '1931' },
    'MOMA-001': { title: 'The Starry Night', artist: 'Van Gogh', year: '1889' }
  }
  if (validCodes[code]) {
    scanStatus.value = 'success'
    scanMessage.value = `✅ Valid QR – Artwork found`
    verificationStatus.value = 'success'
    verificationMessage.value = `Artwork found! "${validCodes[code].title}"`
    setArtworkData(validCodes[code])
    currentXP.value += 25
  } else {
    scanStatus.value = 'error'
    scanMessage.value = '❌ Invalid QR – Code not recognized'
    verificationStatus.value = 'error'
    verificationMessage.value = 'Invalid code – Try again'
  }
}

const searchCode = () => {
  if (manualCode.value.trim()) { simulateQRScan(manualCode.value.toUpperCase(), 'Manual search'); manualCode.value = '' }
  else alert('Enter a valid artwork code')
}

const viewRelatedWork = (related) => { setArtworkData(related); currentXP.value += 10 }
const goToLocation = () => { activeTab.value = 'map' }
const goToRoom = (roomId) => {
  const room = museumRooms.value.find(r => r.id === roomId)
  if (room && !room.explored) {
    roomStates.value[roomId].explored = true
    exploredRooms.value++
    artworksFound.value += room.artworks
    currentXP.value += 30
    alert(`🎉 ${room.name} +30 XP`)
  }
}

watch(currentXP, (newXP) => {
  const keys = ['week', 'month', 'all']
  keys.forEach(k => { const idx = rankings.value[k].findIndex(r => r.id === currentUserId.value); if (idx !== -1) rankings.value[k][idx].xp = newXP })
})
</script>

<style scoped>
.dashboard-container { display: flex; min-height: 100vh; background: #f5f7fb; }
.content-area { padding: 30px; width: 100%; }
.scan-header { margin-bottom: 30px; }
.scan-header h3 { font-size: 24px; color: #2c3e50; margin-bottom: 8px; }
.scan-header p { color: #7f8c8d; }
.scanner-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px; }
.simulation-buttons { display: flex; gap: 10px; margin-top: 20px; justify-content: center; }
.simulate-btn { padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.3s; }
.simulate-btn.success { background: #27ae60; color: white; }
.simulate-btn.error { background: #e74c3c; color: white; }
.simulate-btn.warning { background: #f39c12; color: white; }
.simulate-btn:hover { transform: translateY(-2px); opacity: 0.9; }
@media (max-width: 768px) { .content-area { padding: 15px; } .scanner-layout { grid-template-columns: 1fr; gap: 15px; } .simulation-buttons { flex-direction: column; } }
</style>
