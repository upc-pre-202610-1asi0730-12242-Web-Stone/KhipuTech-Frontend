<template>
  <div class="dashboard-container">
    <SharedLayout
        :menu-items="menuItems"
        current-tab="map"
        @update:tab="goToDashboardTab"
        @logout="handleLogout"
    >
      <template #content>
        <div class="content-area">
          <button class="back-btn" @click="goBack">← Volver al mapa</button>

          <section class="route-hero">
            <div>
              <span class="route-chip">{{ routeData.category }}</span>
              <h1>{{ routeData.icon }} {{ routeData.title }}</h1>
              <p>{{ routeData.description }}</p>
            </div>

            <div class="route-meta">
              <strong>{{ routeData.duration }}</strong>
              <span>Duración estimada</span>
            </div>
          </section>

          <section class="route-layout">
            <div class="route-panel">
              <h2>Recorrido recomendado</h2>

              <div class="timeline">
                <div
                    v-for="(stop, index) in routeData.stops"
                    :key="stop.id"
                    class="timeline-item"
                    :class="{
                    active: index === currentStep,
                    completed: index < currentStep
                  }"
                    @click="currentStep = index"
                >
                  <div class="timeline-dot">{{ stop.icon }}</div>

                  <div>
                    <h3>{{ stop.name }}</h3>
                    <p>{{ stop.description }}</p>
                  </div>
                </div>
              </div>

              <div class="route-actions">
                <button class="secondary-btn" @click="previousStep" :disabled="currentStep === 0">
                  Anterior
                </button>

                <button class="start-btn" @click="nextStep">
                  {{ isLastStep ? 'Finalizar recorrido' : 'Siguiente parada' }}
                </button>
              </div>
            </div>

            <div class="route-detail">
              <div class="current-room-card">
                <span class="big-icon">{{ currentStop.icon }}</span>
                <h2>{{ currentStop.name }}</h2>
                <p>{{ currentStop.description }}</p>

                <div class="progress-info">
                  <span>Progreso</span>
                  <strong>{{ progress }}%</strong>
                </div>

                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                </div>
              </div>

              <div class="artworks-box">
                <h3>Obras recomendadas aquí</h3>

                <div class="artworks-grid">
                  <div
                      v-for="artwork in currentStop.artworks"
                      :key="artwork"
                      class="artwork-card"
                  >
                    🖼️ {{ artwork }}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>
    </SharedLayout>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIamStore } from '../../../iam/application/iam-store.js'
import SharedLayout from '../../../shared/presentation/components/layout.vue'

const route = useRoute()
const router = useRouter()
const iamStore = useIamStore()

const currentStep = ref(0)

const menuItems = [
  { id: 'scan', name: 'Escanear QR/NFC', icon: '📱' },
  { id: 'detail', name: 'Detalle de obra', icon: '🖼️' },
  { id: 'map', name: 'Mapa de recorrido', icon: '🗺️' },
  { id: 'achievements', name: 'Logros y XP', icon: '🏆' }
]

const recommendedRoutes = {
  moderno: {
    icon: '🎨',
    title: 'Ruta Arte Moderno',
    category: 'Recomendado por tus obras favoritas',
    duration: '25 min',
    description: 'Un recorrido enfocado en salas con obras modernas, expresivas y visualmente llamativas.',
    stops: [
      {
        id: 'entrada',
        icon: '🚪',
        name: 'Entrada',
        description: 'Inicio del recorrido y orientación general del museo.',
        artworks: ['Mapa interactivo', 'Introducción al museo']
      },
      {
        id: 'sala1',
        icon: '🎨',
        name: 'Sala 1 — Arte Moderno',
        description: 'Explora obras con alto nivel de color, abstracción y composición experimental.',
        artworks: ['Composición Azul', 'Fragmentos Urbanos', 'Luz en Movimiento']
      },
      {
        id: 'sala2',
        icon: '🖼️',
        name: 'Sala 2 — Arte Contemporáneo',
        description: 'Continúa con piezas recientes y experiencias visuales inmersivas.',
        artworks: ['Horizonte Digital', 'Ecos del Presente']
      }
    ]
  },

  clasica: {
    icon: '🏺',
    title: 'Ruta Clásica',
    category: 'Ruta histórica',
    duration: '30 min',
    description: 'Una ruta para descubrir piezas históricas, esculturas y obras con valor patrimonial.',
    stops: [
      {
        id: 'entrada',
        icon: '🚪',
        name: 'Entrada',
        description: 'Inicio del recorrido clásico con una breve introducción histórica.',
        artworks: ['Línea de tiempo del museo']
      },
      {
        id: 'sala3',
        icon: '🏺',
        name: 'Sala 3 — Arte Clásico',
        description: 'Sala principal del recorrido, enfocada en piezas antiguas y elementos patrimoniales.',
        artworks: ['Vasija ceremonial', 'Escultura de mármol', 'Retrato colonial']
      },
      {
        id: 'sala1',
        icon: '🎨',
        name: 'Sala 1 — Transición artística',
        description: 'Cierre comparativo entre técnicas clásicas y modernas.',
        artworks: ['Bocetos académicos', 'Paisaje tradicional']
      }
    ]
  },

  relax: {
    icon: '☕',
    title: 'Ruta Relax',
    category: 'Recorrido tranquilo',
    duration: '15 min',
    description: 'Una ruta ligera para recorrer el museo sin prisa, ideal para una visita breve.',
    stops: [
      {
        id: 'entrada',
        icon: '🚪',
        name: 'Entrada',
        description: 'Inicio suave del recorrido con orientación básica.',
        artworks: ['Panel de bienvenida']
      },
      {
        id: 'sala2',
        icon: '🖼️',
        name: 'Sala 2 — Obras visuales',
        description: 'Obras de observación rápida y fácil lectura visual.',
        artworks: ['Paisaje abstracto', 'Color y forma']
      },
      {
        id: 'cafeteria',
        icon: '☕',
        name: 'Cafetería',
        description: 'Punto final recomendado para descanso después del recorrido.',
        artworks: ['Zona de descanso']
      }
    ]
  }
}

const routeData = computed(() => {
  return recommendedRoutes[route.params.id] || recommendedRoutes.moderno
})

const currentStop = computed(() => routeData.value.stops[currentStep.value])

const progress = computed(() => {
  return Math.round(((currentStep.value + 1) / routeData.value.stops.length) * 100)
})

const isLastStep = computed(() => {
  return currentStep.value === routeData.value.stops.length - 1
})

const nextStep = () => {
  if (isLastStep.value) {
    alert('🎉 ¡Recorrido completado!')
    router.push('/dashboard')
    return
  }

  currentStep.value++
}

const previousStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const goBack = () => {
  router.push('/dashboard')
}

const goToDashboardTab = () => {
  router.push('/dashboard')
}

const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}
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

.back-btn {
  background: #e8f0ff;
  color: #0b1a3e;
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 24px;
}

.route-hero {
  background: linear-gradient(135deg, #0b1a3e, #172554);
  color: white;
  border-radius: 24px;
  padding: 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
}

.route-chip {
  background: rgba(0, 200, 255, 0.18);
  color: #00c8ff;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.route-hero h1 {
  margin: 18px 0 8px;
  font-size: 34px;
}

.route-hero p {
  color: #dbeafe;
  max-width: 720px;
}

.route-meta {
  background: rgba(255, 255, 255, 0.12);
  padding: 20px;
  border-radius: 18px;
  text-align: center;
}

.route-meta strong {
  display: block;
  font-size: 30px;
}

.route-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
}

.route-panel,
.route-detail {
  background: white;
  border-radius: 22px;
  padding: 26px;
  box-shadow: 0 6px 18px rgba(11, 26, 62, 0.08);
}

.timeline {
  margin-top: 20px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding: 18px;
  border-radius: 16px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.25s;
  margin-bottom: 14px;
  background: #f8fafc;
}

.timeline-item.active {
  border-color: #00c8ff;
  background: #e8f7ff;
}

.timeline-item.completed {
  border-color: #2dffa0;
  background: #ecfdf5;
}

.timeline-dot {
  font-size: 30px;
}

.timeline-item h3 {
  margin: 0 0 6px;
  color: #0b1a3e;
}

.timeline-item p {
  color: #4a7aba;
  margin: 0;
}

.route-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.start-btn,
.secondary-btn {
  border: none;
  padding: 13px 18px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}

.start-btn {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: white;
}

.secondary-btn {
  background: #e8f0ff;
  color: #0b1a3e;
}

.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-room-card {
  background: #141a33;
  color: white;
  border-radius: 22px;
  padding: 34px;
  text-align: center;
}

.big-icon {
  font-size: 56px;
}

.current-room-card h2 {
  margin: 16px 0 8px;
}

.current-room-card p {
  color: #dbeafe;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 28px;
}

.progress-bar {
  height: 12px;
  background: #4b526b;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill {
  height: 100%;
  background: #2dffa0;
}

.artworks-box {
  margin-top: 22px;
}

.artworks-box h3 {
  color: #0b1a3e;
  margin-bottom: 16px;
}

.artworks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.artwork-card {
  background: #f2f6ff;
  padding: 16px;
  border-radius: 14px;
  color: #0b1a3e;
  font-weight: 700;
}

@media (max-width: 900px) {
  .route-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .route-layout {
    grid-template-columns: 1fr;
  }

  .artworks-grid {
    grid-template-columns: 1fr;
  }
}
</style>