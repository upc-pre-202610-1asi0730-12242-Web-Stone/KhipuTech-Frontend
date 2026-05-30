<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">⚙️</span>
      <h3>Configurar notificaciones</h3>
    </div>
    <div class="config-form">
      <div class="config-group">
        <label>Umbral alerta moderada (Amarilla)</label>
        <input type="range" :value="umbralModerada" min="50" max="90" step="5" @input="$emit('update:umbralModerada', $event.target.value)">
        <span>{{ umbralModerada }}% de ocupación</span>
      </div>
      <div class="config-group">
        <label>Umbral alerta crítica (Naranja)</label>
        <input type="range" :value="umbralCritica" min="80" max="100" step="5" @input="$emit('update:umbralCritica', $event.target.value)">
        <span>{{ umbralCritica }}% de ocupación</span>
      </div>
      <div class="config-group">
        <label>Notificación vía</label>
        <div class="checkbox-group">
          <label><input type="checkbox" :checked="notificaciones.correo" @change="$emit('update:notificaciones', { ...notificaciones, correo: $event.target.checked })"> Correo electrónico</label>
          <label><input type="checkbox" :checked="notificaciones.whatsapp" @change="$emit('update:notificaciones', { ...notificaciones, whatsapp: $event.target.checked })"> WhatsApp</label>
          <label><input type="checkbox" :checked="notificaciones.sms" @change="$emit('update:notificaciones', { ...notificaciones, sms: $event.target.checked })"> SMS</label>
          <label><input type="checkbox" :checked="notificaciones.panel" @change="$emit('update:notificaciones', { ...notificaciones, panel: $event.target.checked })"> Panel de control</label>
        </div>
      </div>
      <div class="config-group">
        <label>Contacto Defensa Civil</label>
        <input type="text" :value="contactoDefensaCivil" @input="$emit('update:contactoDefensaCivil', $event.target.value)" placeholder="Número de teléfono">
      </div>
      <button @click="$emit('guardar')" class="btn-save">💾 Guardar configuración</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  umbralModerada: {
    type: Number,
    default: 80
  },
  umbralCritica: {
    type: Number,
    default: 95
  },
  notificaciones: {
    type: Object,
    default: () => ({ correo: true, whatsapp: false, sms: false, panel: true })
  },
  contactoDefensaCivil: {
    type: String,
    default: ''
  }
})

defineEmits(['update:umbralModerada', 'update:umbralCritica', 'update:notificaciones', 'update:contactoDefensaCivil', 'guardar'])
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

.config-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-group label {
  font-weight: 500;
  color: #2c3e50;
}

.config-group input[type="range"] {
  width: 100%;
}

.config-group input[type="text"] {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.checkbox-group label {
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-save {
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-save:hover {
  transform: translateY(-2px);
}
</style>