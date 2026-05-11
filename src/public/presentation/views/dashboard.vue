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
            {{ user?.name?.charAt(0) || 'M' }}
          </div>
          <div class="user-details-sidebar">
            <p class="user-name-sidebar">{{ user?.name || 'Museo Público' }}</p>
            <p class="user-role-sidebar">Gestor de Aforo</p>
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
      <header class="top-header">
        <div class="header-left">
          <button @click="toggleSidebar" class="menu-toggle">☰</button>
          <h2>{{ currentTabTitle }}</h2>
        </div>
        <div class="header-right">
          <div class="user-badge">
            <span class="badge-name">{{ user?.name || 'Museo Público' }}</span>
            <span class="badge-role">Gestor de Aforo</span>
          </div>
          <div class="user-avatar-large">
            {{ user?.name?.charAt(0) || 'M' }}
          </div>
        </div>
      </header>

      <div class="content-area">
        <!-- ==================== TAB: CONTROL DE AFORO ==================== -->
        <div v-if="activeTab === 'aforo'" class="tab-content">
          <!-- Tarjetas de resumen -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <span class="stat-value">{{ aforo.totalEnMuseo }}</span>
                <span class="stat-label">TOTAL EN MUSEO</span>
              </div>
            </div>
            <div class="stat-card" :class="{ warning: aforo.salasCriticas > 0 }">
              <div class="stat-icon">⚠️</div>
              <div class="stat-info">
                <span class="stat-value">{{ aforo.salasCriticas }}</span>
                <span class="stat-label">SALAS CRÍTICAS</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🏛️</div>
              <div class="stat-info">
                <span class="stat-value">{{ aforo.capacidadTotal }}</span>
                <span class="stat-label">CAPACIDAD TOTAL</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📥</div>
              <div class="stat-info">
                <span class="stat-value">{{ aforo.ingresosHoy }}</span>
                <span class="stat-label">INGRESOS HOY</span>
              </div>
            </div>
          </div>

          <!-- Aforo por sala (Tabla) -->
          <div class="card">
            <div class="card-header">
              <span class="card-icon">📊</span>
              <h3>Aforo por sala</h3>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                <tr><th>SALA</th><th>ACTUAL</th><th>CAPACIDAD</th><th>OCUPACIÓN</th><th>ESTADO</th><th></th></tr>
                </thead>
                <tbody>
                <tr v-for="sala in aforoPorSala" :key="sala.id">
                  <td><strong>{{ sala.nombre }}</strong></td>
                  <td>{{ sala.actual }}</td>
                  <td>{{ sala.capacidad }}</td>
                  <td>
                    <div class="ocupacion-bar">
                      <div class="bar-fill" :class="sala.estadoClase" :style="{ width: sala.porcentaje + '%' }"></div>
                      <span class="porcentaje">{{ sala.porcentaje }}%</span>
                    </div>
                  </td>
                  <td>
                      <span :class="['status-badge', sala.estadoClase]">
                        {{ sala.estadoTexto }}
                      </span>
                  </td>
                  <td>
                    <div class="color-indicator" :class="sala.estadoClase"></div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Mapas de salas -->
          <div class="card">
            <div class="card-header">
              <span class="card-icon">🗺️</span>
              <h3>Mapas de salas - Distribución visual</h3>
              <div class="export-buttons">
                <button @click="guardarConfigMapas" class="export-btn">💾 Guardar config</button>
                <button @click="exportarMapasPDF" class="export-btn pdf">📄 Exportar PDF</button>
                <button @click="exportarMapasExcel" class="export-btn excel">📊 Exportar Excel</button>
              </div>
            </div>
            <div class="mapas-container">
              <div v-for="sala in mapasSalas" :key="sala.id" class="mapa-card" :class="sala.estadoClase">
                <h4>{{ sala.nombre }}</h4>
                <div class="mapa-preview">
                  <div class="mapa-grid">
                    <div v-for="i in sala.asientos" :key="i" class="asiento" :class="{ ocupado: i <= sala.ocupados }"></div>
                  </div>
                </div>
                <div class="mapa-info">
                  <span>👥 {{ sala.ocupados }}/{{ sala.asientos }}</span>
                  <span class="estado-text">{{ sala.estadoTexto }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== TAB: ALERTAS ==================== -->
        <div v-if="activeTab === 'alertas'" class="tab-content">
          <div class="two-columns">
            <!-- Alertas Activas -->
            <div class="card">
              <div class="card-header">
                <span class="card-icon">🚨</span>
                <h3>Alertas Activas</h3>
              </div>
              <div class="alertas-lista">
                <div v-for="alerta in alertasActivas" :key="alerta.id" :class="['alerta-item', alerta.tipo]">
                  <div class="alerta-icon">{{ alerta.tipo === 'critica' ? '🔴' : alerta.tipo === 'moderada' ? '🟡' : '🟠' }}</div>
                  <div class="alerta-info">
                    <strong>{{ alerta.sala }}</strong>
                    <p>{{ alerta.mensaje }}</p>
                    <small>{{ alerta.tiempo }}</small>
                  </div>
                </div>
                <div v-if="alertasActivas.length === 0" class="no-alertas">
                  ✅ No hay alertas activas - Todas las salas están en estado normal
                </div>
              </div>
            </div>

            <!-- Configurar notificaciones -->
            <div class="card">
              <div class="card-header">
                <span class="card-icon">⚙️</span>
                <h3>Configurar notificaciones</h3>
              </div>
              <div class="config-form">
                <div class="config-group">
                  <label>Umbral alerta moderada (Amarilla)</label>
                  <input type="range" v-model="config.umbralModerada" min="50" max="90" step="5">
                  <span>{{ config.umbralModerada }}% de ocupación</span>
                </div>
                <div class="config-group">
                  <label>Umbral alerta crítica (Naranja)</label>
                  <input type="range" v-model="config.umbralCritica" min="80" max="100" step="5">
                  <span>{{ config.umbralCritica }}% de ocupación</span>
                </div>
                <div class="config-group">
                  <label>Notificación vía</label>
                  <div class="checkbox-group">
                    <label><input type="checkbox" v-model="config.notificaciones.correo"> Correo electrónico</label>
                    <label><input type="checkbox" v-model="config.notificaciones.whatsapp"> WhatsApp</label>
                    <label><input type="checkbox" v-model="config.notificaciones.sms"> SMS</label>
                    <label><input type="checkbox" v-model="config.notificaciones.panel"> Panel de control</label>
                  </div>
                </div>
                <div class="config-group">
                  <label>Contacto Defensa Civil</label>
                  <input type="text" v-model="config.contactoDefensaCivil" placeholder="Número de teléfono">
                </div>
                <button @click="guardarConfiguracion" class="btn-save">💾 Guardar configuración</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== TAB: DEFENSA CIVIL ==================== -->
        <div v-if="activeTab === 'defensaCivil'" class="tab-content">
          <div class="two-columns">
            <!-- Protocolo de evacuación -->
            <div class="card">
              <div class="card-header">
                <span class="card-icon">📋</span>
                <h3>Protocolo de evacuación</h3>
              </div>
              <div class="protocolo-buttons">
                <button @click="activarAlertaGeneral" class="protocolo-btn alerta">🚨 Activar alerta general</button>
                <button @click="llamarDefensaCivil" class="protocolo-btn defensa">📞 Llamar Defensa Civil</button>
                <button @click="verProtocolo" class="protocolo-btn protocolo">📄 Ver protocolo</button>
              </div>
            </div>

            <!-- Reporte para autoridades -->
            <div class="card">
              <div class="card-header">
                <span class="card-icon">📑</span>
                <h3>Reporte para autoridades</h3>
              </div>
              <div class="reporte-content">
                <p>Generar reporte actualizado del estado del museo para enviar a Defensa Civil</p>
                <button @click="enviarReporte" class="btn-enviar">📨 Enviar a Defensa Civil</button>
              </div>
            </div>
          </div>

          <!-- Estado de sensores -->
          <div class="card">
            <div class="card-header">
              <span class="card-icon">📡</span>
              <h3>Estado de sensores</h3>
            </div>
            <div class="sensores-grid">
              <div v-for="sensor in sensores" :key="sensor.id" class="sensor-card" :class="sensor.estado">
                <div class="sensor-icon">{{ sensor.estado === 'activo' ? '🟢' : '🔴' }}</div>
                <div class="sensor-info">
                  <strong>{{ sensor.nombre }}</strong>
                  <p>{{ sensor.ubicacion }}</p>
                  <span class="sensor-status">{{ sensor.estado === 'activo' ? 'Conectado' : 'Sin conexión' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useIamStore } from '../../../iam/application/iam-store.js'
import { useRouter } from 'vue-router'

const iamStore = useIamStore()
const router = useRouter()
const sidebarCollapsed = ref(false)
const activeTab = ref('aforo')
const user = computed(() => iamStore.user)

const menuItems = [
  { id: 'aforo', name: 'Control de aforo', icon: '🚪' },
  { id: 'alertas', name: 'Alertas', icon: '⚠️' },
  { id: 'defensaCivil', name: 'Defensa Civil', icon: '🛡️' }
]

const currentTabTitle = computed(() => {
  const item = menuItems.find(i => i.id === activeTab.value)
  return item?.name || 'Panel de Control'
})

// ========== CONTROL DE AFORO ==========
const aforo = ref({
  totalEnMuseo: 851,
  salasCriticas: 2,
  capacidadTotal: 1000,
  ingresosHoy: 1248
})

const aforoPorSala = ref([
  { id: 1, nombre: 'Sala 1 - Arte Moderno', actual: 145, capacidad: 200, porcentaje: 73, estadoClase: 'normal', estadoTexto: 'Normal' },
  { id: 2, nombre: 'Sala 2 - Contemporáneo', actual: 178, capacidad: 200, porcentaje: 89, estadoClase: 'moderada', estadoTexto: 'Crítico' },
  { id: 3, nombre: 'Sala 3 - Clásico', actual: 210, capacidad: 200, porcentaje: 105, estadoClase: 'critica', estadoTexto: 'Sobrepasado' },
  { id: 4, nombre: 'Sala 4 - Temporal', actual: 95, capacidad: 150, porcentaje: 63, estadoClase: 'normal', estadoTexto: 'Normal' },
  { id: 5, nombre: 'Sala 5 - Esculturas', actual: 82, capacidad: 120, porcentaje: 68, estadoClase: 'normal', estadoTexto: 'Normal' }
])

const mapasSalas = ref([
  { id: 1, nombre: 'Sala 1 - Arte Moderno', asientos: 200, ocupados: 145, estadoClase: 'normal', estadoTexto: 'Normal' },
  { id: 2, nombre: 'Sala 2 - Contemporáneo', asientos: 200, ocupados: 178, estadoClase: 'moderada', estadoTexto: 'Crítico' },
  { id: 3, nombre: 'Sala 3 - Clásico', asientos: 200, ocupados: 210, estadoClase: 'critica', estadoTexto: 'Sobrepasado' }
])

// ========== ALERTAS ==========
const config = ref({
  umbralModerada: 80,
  umbralCritica: 95,
  notificaciones: {
    correo: true,
    whatsapp: false,
    sms: false,
    panel: true
  },
  contactoDefensaCivil: '911 - 123 456'
})

const alertasActivas = ref([
  { id: 1, sala: 'Sala 2 - Contemporáneo', tipo: 'moderada', mensaje: 'Ocupación al 89% - Cerca del umbral crítico', tiempo: 'Hace 5 minutos' },
  { id: 2, sala: 'Sala 3 - Clásico', tipo: 'critica', mensaje: '¡OCUPACIÓN EXCEDIDA! 105% de capacidad', tiempo: 'Hace 12 minutos' }
])

// ========== SENSORES ==========
const sensores = ref([
  { id: 1, nombre: 'Sensor entrada principal', ubicacion: 'Puerta principal', estado: 'activo' },
  { id: 2, nombre: 'Sensor Sala Central', ubicacion: 'Sala 2', estado: 'activo' },
  { id: 3, nombre: 'Sensor jardín', ubicacion: 'Jardín esculturas', estado: 'inactivo' },
  { id: 4, nombre: 'Sensor Sala 3', ubicacion: 'Sala Clásica', estado: 'activo' }
])

// ========== FUNCIONES ==========
const actualizarPorcentajes = () => {
  aforoPorSala.value.forEach(sala => {
    sala.porcentaje = Math.round((sala.actual / sala.capacidad) * 100)
    if (sala.porcentaje >= 100) {
      sala.estadoClase = 'critica'
      sala.estadoTexto = 'Sobrepasado'
    } else if (sala.porcentaje >= config.value.umbralCritica) {
      sala.estadoClase = 'critica'
      sala.estadoTexto = 'Crítico'
    } else if (sala.porcentaje >= config.value.umbralModerada) {
      sala.estadoClase = 'moderada'
      sala.estadoTexto = 'Alerta'
    } else {
      sala.estadoClase = 'normal'
      sala.estadoTexto = 'Normal'
    }
  })
  aforo.value.salasCriticas = aforoPorSala.value.filter(s => s.estadoClase !== 'normal').length
}

const guardarConfiguracion = () => {
  actualizarPorcentajes()
  alert('✅ Configuración guardada exitosamente')
}

const guardarConfigMapas = () => alert('💾 Configuración de mapas guardada')
const exportarMapasPDF = () => alert('📄 Exportando mapas a PDF')
const exportarMapasExcel = () => alert('📊 Exportando mapas a Excel')

const activarAlertaGeneral = () => alert('🚨 ALERTA GENERAL ACTIVADA - Protocolo de evacuación iniciado')
const llamarDefensaCivil = () => alert(`📞 Llamando a Defensa Civil: ${config.value.contactoDefensaCivil}`)
const verProtocolo = () => alert('📄 Abriendo protocolo de evacuación completo')
const enviarReporte = () => alert('📨 Reporte enviado a Defensa Civil')

const toggleSidebar = () => { sidebarCollapsed.value = !sidebarCollapsed.value }
const handleLogout = () => { iamStore.signOut(); router.push('/sign-in') }

watch([() => config.value.umbralModerada, () => config.value.umbralCritica], () => { actualizarPorcentajes() })
</script>

<style scoped>
.dashboard-container { display: flex; min-height: 100vh; background: #f5f7fb; }

/* Sidebar */
.sidebar { width: 260px; background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%); color: white; display: flex; flex-direction: column; transition: width 0.3s ease; position: fixed; height: 100vh; overflow-y: auto; z-index: 100; }
.sidebar.collapsed { width: 70px; }
.sidebar-header { padding: 25px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.logo-icon { font-size: 28px; }
.logo-text { font-size: 20px; font-weight: bold; }
.sidebar-nav { flex: 1; padding: 20px 0; }
.nav-item { width: 100%; padding: 12px 20px; display: flex; align-items: center; gap: 12px; background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; transition: all 0.3s; font-size: 14px; }
.nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
.nav-item.active { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; }
.nav-icon { font-size: 20px; min-width: 24px; }
.sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
.user-info-sidebar { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
.user-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; }
.user-details-sidebar { flex: 1; }
.user-name-sidebar { font-size: 14px; font-weight: 600; }
.user-role-sidebar { font-size: 11px; opacity: 0.7; }
.logout-btn-sidebar { width: 100%; padding: 10px; background: rgba(231,76,60,0.3); border: none; border-radius: 8px; color: white; display: flex; align-items: center; gap: 8px; cursor: pointer; }

/* Main Content */
.main-content { flex: 1; margin-left: 260px; transition: margin-left 0.3s ease; }
.sidebar.collapsed ~ .main-content { margin-left: 70px; }
.top-header { background: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.header-left { display: flex; align-items: center; gap: 20px; }
.menu-toggle { background: none; border: none; font-size: 24px; cursor: pointer; color: #2c3e50; }
.header-left h2 { margin: 0; color: #2c3e50; }
.header-right { display: flex; align-items: center; gap: 15px; }
.user-badge { text-align: right; }
.badge-name { display: block; font-weight: 600; color: #2c3e50; }
.badge-role { font-size: 12px; color: #7f8c8d; }
.user-avatar-large { width: 45px; height: 45px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; color: white; }
.content-area { padding: 30px; }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
.stat-card { background: white; border-radius: 15px; padding: 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.stat-icon { font-size: 40px; }
.stat-info { flex: 1; }
.stat-value { display: block; font-size: 28px; font-weight: bold; color: #2c3e50; }
.stat-label { font-size: 13px; color: #7f8c8d; }
.stat-card.warning .stat-value { color: #e74c3c; }

/* Card */
.card { background: white; border-radius: 15px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; flex: 1; }

/* Tabla */
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
.data-table th { background: #f8f9fa; font-weight: 600; color: #2c3e50; }

/* Ocupación Bar */
.ocupacion-bar { display: flex; align-items: center; gap: 8px; min-width: 150px; }
.bar-fill { height: 8px; border-radius: 4px; transition: width 0.3s; background: #ddd; }
.bar-fill.normal { background: #27ae60; }
.bar-fill.moderada { background: #f39c12; }
.bar-fill.critica { background: #e74c3c; }
.porcentaje { font-size: 12px; min-width: 40px; }

.status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
.status-badge.normal { background: #d5f4e6; color: #27ae60; }
.status-badge.moderada { background: #fff3e0; color: #f39c12; }
.status-badge.critica { background: #fde5e5; color: #e74c3c; }

.color-indicator { width: 20px; height: 20px; border-radius: 4px; }
.color-indicator.normal { background: #27ae60; }
.color-indicator.moderada { background: #f39c12; }
.color-indicator.critica { background: #e74c3c; }

/* Mapas */
.mapas-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.mapa-card { background: #f8f9fa; border-radius: 12px; padding: 15px; border-left: 4px solid; }
.mapa-card.normal { border-left-color: #27ae60; }
.mapa-card.moderada { border-left-color: #f39c12; }
.mapa-card.critica { border-left-color: #e74c3c; }
.mapa-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; margin: 15px 0; }
.asiento { width: 100%; padding-top: 100%; background: #ddd; border-radius: 4px; }
.asiento.ocupado { background: #667eea; }
.mapa-info { display: flex; justify-content: space-between; margin-top: 10px; }

/* Alertas */
.two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.alertas-lista { display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; }
.alerta-item { display: flex; gap: 12px; padding: 12px; border-radius: 10px; }
.alerta-item.critica { background: #fde5e5; border-left: 4px solid #e74c3c; }
.alerta-item.moderada { background: #fff3e0; border-left: 4px solid #f39c12; }
.no-alertas { text-align: center; padding: 40px; color: #27ae60; }

/* Configuración */
.config-form { display: flex; flex-direction: column; gap: 20px; }
.config-group { display: flex; flex-direction: column; gap: 8px; }
.config-group input[type="range"] { width: 100%; }
.checkbox-group { display: flex; gap: 15px; flex-wrap: wrap; }
.btn-save { padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }

/* Protocolo */
.protocolo-buttons { display: flex; flex-direction: column; gap: 12px; }
.protocolo-btn { padding: 15px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; }
.protocolo-btn.alerta { background: #e74c3c; color: white; }
.protocolo-btn.defensa { background: #f39c12; color: white; }
.protocolo-btn.protocolo { background: #3498db; color: white; }

/* Sensores */
.sensores-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
.sensor-card { display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 12px; }
.sensor-card.activo { border-left: 4px solid #27ae60; }
.sensor-card.inactivo { border-left: 4px solid #e74c3c; opacity: 0.7; }
.sensor-icon { font-size: 24px; }
.sensor-info p { font-size: 12px; color: #7f8c8d; margin: 4px 0; }
.sensor-status { font-size: 11px; font-weight: bold; }
.sensor-card.activo .sensor-status { color: #27ae60; }
.sensor-card.inactivo .sensor-status { color: #e74c3c; }

.export-buttons { display: flex; gap: 10px; }
.export-btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; background: #667eea; color: white; }
.export-btn.pdf { background: #e74c3c; }
.export-btn.excel { background: #27ae60; }

.reporte-content { text-align: center; padding: 20px; }
.btn-enviar { padding: 12px 24px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; }

/* Responsive */
@media (max-width: 1024px) { .two-columns { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .main-content { margin-left: 0; } .mapas-container { grid-template-columns: 1fr; } }
</style>