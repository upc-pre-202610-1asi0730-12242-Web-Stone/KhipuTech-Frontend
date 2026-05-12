<template>
  <div class="route-page">
    <button class="back-btn" @click="goBack">← Volver</button>

    <section class="route-card">
      <h1>🗺️ {{ routeTitle }}</h1>
      <p>Este recorrido fue generado en base a tus obras favoritas.</p>

      <div class="route-path">
        <div class="step">Entrada</div>
        <div class="line"></div>
        <div class="step active">Sala recomendada</div>
        <div class="line"></div>
        <div class="step">Obras destacadas</div>
      </div>

      <button class="start-btn">Empezar recorrido</button>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const routeTitle = computed(() => {
  const routes = {
    moderno: 'Ruta Arte Moderno',
    clasica: 'Ruta Clásica',
    contemporanea: 'Ruta Contemporánea'
  }

  return routes[route.params.id] || 'Recorrido recomendado'
})

const goBack = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.route-page {
  min-height: 100vh;
  background: #f5f7fb;
  padding: 40px;
}

.back-btn {
  background: #e8f0ff;
  color: #0b1a3e;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
}

.route-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 6px 18px rgba(11, 26, 62, 0.08);
}

.route-card h1 {
  color: #0b1a3e;
  margin-bottom: 8px;
}

.route-card p {
  color: #4a7aba;
}

.route-path {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  gap: 12px;
}

.step {
  background: #e8f0ff;
  color: #0b1a3e;
  padding: 16px 22px;
  border-radius: 16px;
  font-weight: 700;
}

.step.active {
  background: #00c8ff;
}

.line {
  width: 70px;
  height: 4px;
  background: #cbd8f0;
  border-radius: 10px;
}

.start-btn {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
</style>