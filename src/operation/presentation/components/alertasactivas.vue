<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🚨</span>
      <h3>Alertas Activas</h3>
    </div>
    <div class="alertas-lista">
      <div v-for="alerta in alertas" :key="alerta.id" :class="['alerta-item', alerta.tipo]">
        <div class="alerta-icon">{{ alerta.tipo === 'critica' ? '🔴' : alerta.tipo === 'moderada' ? '🟡' : '🟠' }}</div>
        <div class="alerta-info">
          <strong>{{ alerta.sala }}</strong>
          <p>{{ alerta.mensaje }}</p>
          <small>{{ alerta.tiempo }}</small>
        </div>
      </div>
      <div v-if="alertas.length === 0" class="no-alertas">
        ✅ No hay alertas activas - Todas las salas están en estado normal
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  alertas: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.card-icon {
  font-size: 24px;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.alertas-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.alerta-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
}

.alerta-item.critica {
  background: #fde5e5;
  border-left: 4px solid #e74c3c;
}

.alerta-item.moderada {
  background: #fff3e0;
  border-left: 4px solid #f39c12;
}

.alerta-icon {
  font-size: 24px;
}

.alerta-info {
  flex: 1;
}

.alerta-info strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 5px;
}

.alerta-info p {
  margin: 0;
  font-size: 13px;
  color: #2c3e50;
}

.alerta-info small {
  font-size: 11px;
  color: #7f8c8d;
}

.no-alertas {
  text-align: center;
  padding: 40px;
  color: #27ae60;
  font-weight: 500;
}
</style>