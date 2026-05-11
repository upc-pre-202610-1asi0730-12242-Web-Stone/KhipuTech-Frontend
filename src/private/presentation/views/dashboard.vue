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
            <p class="user-name-sidebar">{{ user?.name || 'Museo Privado' }}</p>
            <p class="user-role-sidebar">Administrador</p>
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
            <span class="badge-name">{{ user?.name || 'Museo Privado' }}</span>
            <span class="badge-role">Administrador</span>
          </div>
          <div class="user-avatar-large">
            {{ user?.name?.charAt(0) || 'M' }}
          </div>
        </div>
      </header>

      <div class="content-area">
        <!-- ==================== TAB: DASHBOARD PRINCIPAL ==================== -->
        <div v-if="activeTab === 'dashboard'" class="tab-content">
          <!-- Fila de tarjetas principales -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.visitantesHoy }}</span>
                <span class="stat-label">Visitantes Hoy</span>
                <span class="stat-change positive">↑ {{ stats.visitantesChange }}%</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📱</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.obrasEscaneadas }}</span>
                <span class="stat-label">Obras escaneadas</span>
                <span class="stat-change positive">↑ {{ stats.obrasChange }}%</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏱️</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.duracionMedia }} min</span>
                <span class="stat-label">Duración media</span>
                <span class="stat-change negative">↓ {{ stats.duracionChange }}%</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.nps }}</span>
                <span class="stat-label">NPS</span>
                <span class="stat-change positive">↑ {{ stats.npsChange }}%</span>
              </div>
            </div>
          </div>

          <!-- Obras más visitadas y Visitas por hora en dos columnas -->
          <div class="two-columns">
            <!-- Obras más visitadas -->
            <div class="card">
              <div class="card-header">
                <span class="card-icon">🏆</span>
                <h3>Obras más visitadas</h3>
              </div>
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                  <tr><th>OBRA</th><th>SALA</th><th>VISITAS</th><th>% RETENCIÓN</th><th>ESTADO</th></tr>
                  </thead>
                  <tbody>
                  <tr v-for="obra in obrasMasVisitadas" :key="obra.id">
                    <td><strong>{{ obra.nombre }}</strong></td>
                    <td>{{ obra.sala }}</td>
                    <td>{{ obra.visitas }}</td>
                    <td>
                      <div class="progress-mini">
                        <div class="progress-bar-mini" :style="{ width: obra.retencion + '%' }"></div>
                        <span>{{ obra.retencion }}%</span>
                      </div>
                    </td>
                    <td>
                        <span :class="['status-badge', obra.estado]">
                          {{ obra.estado === 'abierto' ? '🟢 Abierto' : obra.estado === 'mantenimiento' ? '🟡 Mantenimiento' : '🔴 Cerrado' }}
                        </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Visitas por hora (Gráfico) -->
            <div class="card">
              <div class="card-header">
                <span class="card-icon">📊</span>
                <h3>Visitas por hora</h3>
                <div class="export-buttons">
                  <button @click="exportToExcel" class="export-btn excel">📊 Excel</button>
                  <button @click="exportToPDF" class="export-btn pdf">📄 PDF</button>
                </div>
              </div>
              <div class="chart-container">
                <canvas id="visitsChart" ref="visitsChartCanvas"></canvas>
              </div>
              <div class="chart-stats">
                <div class="chart-stat"><span>Pico máximo:</span> <strong>{{ maxVisitsHour }}</strong></div>
                <div class="chart-stat"><span>Promedio por hora:</span> <strong>{{ avgVisitsPerHour }}</strong></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== TAB: RANKING DE OBRAS ==================== -->
        <div v-if="activeTab === 'ranking'" class="tab-content">
          <div class="card">
            <div class="card-header">
              <span class="card-icon">🏆</span>
              <h3>Ranking de obras por engagement</h3>
              <div class="ranking-period">
                <button v-for="p in rankingPeriods" :key="p" @click="currentRankingPeriod = p" :class="{ active: currentRankingPeriod === p }">
                  {{ p }}
                </button>
              </div>
            </div>
            <div class="ranking-list">
              <div v-for="(obra, index) in rankingObras" :key="obra.id" class="ranking-item">
                <div class="ranking-number">{{ index + 1 }}</div>
                <div class="ranking-info">
                  <div class="ranking-title">{{ obra.nombre }}</div>
                  <div class="ranking-meta">{{ obra.sala }} • {{ obra.artista }}</div>
                </div>
                <div class="ranking-stats">
                  <div class="engagement-score">
                    <span class="score-value">{{ obra.engagement }}</span>
                    <span class="score-label">pts</span>
                  </div>
                  <div class="time-spent">⏱️ {{ obra.tiempoPromedio }} min</div>
                </div>
                <div class="trend-icon" :class="obra.trend">📈</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== TAB: SPONSORS ==================== -->
        <div v-if="activeTab === 'sponsors'" class="tab-content">
          <!-- Tarjetas de resumen -->
          <div class="stats-grid-small">
            <div class="stat-card-small">
              <span class="icon">💰</span>
              <div class="info">
                <span class="value">{{ formatMoney(ingresosMes) }}</span>
                <span class="label">Ingresos mes</span>
              </div>
            </div>
            <div class="stat-card-small">
              <span class="icon">🤝</span>
              <div class="info">
                <span class="value">{{ sponsorsActivos }}</span>
                <span class="label">Sponsors activos</span>
              </div>
            </div>
            <div class="stat-card-small">
              <span class="icon">👁️</span>
              <div class="info">
                <span class="value">{{ impresionesTotales }}</span>
                <span class="label">Impresiones</span>
              </div>
            </div>
          </div>

          <!-- Tabla de sponsors -->
          <div class="card">
            <div class="card-header">
              <span class="card-icon">🤝</span>
              <h3>Tabla de sponsors</h3>
              <div class="action-buttons-header">
                <button @click="agregarSponsor" class="btn-add">+ Agregar sponsor</button>
                <button @click="exportSponsorsPDF" class="export-btn pdf">📄 Exportar PDF</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                <tr><th>SPONSOR</th><th>SALA PATROCINADA</th><th>IMPRESIONES</th><th>$ APORTADO</th><th>ESTADO</th></tr>
                </thead>
                <tbody>
                <tr v-for="sponsor in sponsors" :key="sponsor.id">
                  <td><img :src="sponsor.logo" class="sponsor-logo" v-if="sponsor.logo" /><strong>{{ sponsor.nombre }}</strong></td>
                  <td>{{ sponsor.sala }}</td>
                  <td>{{ sponsor.impresiones.toLocaleString() }}</td>
                  <td class="money">{{ formatMoney(sponsor.aportado) }}</td>
                  <td><span :class="['status-badge', sponsor.estado]">{{ sponsor.estado === 'activo' ? '✅ Activo' : '⏸️ Inactivo' }}</span></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useIamStore } from '../../../iam/application/iam-store.js'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'

const iamStore = useIamStore()
const router = useRouter()
const sidebarCollapsed = ref(false)
const activeTab = ref('dashboard')
const user = computed(() => iamStore.user)

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'ranking', name: 'Ranking obras', icon: '🏆' },
  { id: 'sponsors', name: 'Sponsors', icon: '🤝' }
]

const currentTabTitle = computed(() => {
  const item = menuItems.find(i => i.id === activeTab.value)
  return item?.name || 'Dashboard'
})

// ========== DASHBOARD PRINCIPAL ==========
const stats = ref({
  visitantesHoy: 284,
  visitantesChange: 12,
  obrasEscaneadas: 1247,
  obrasChange: 8,
  duracionMedia: 47,
  duracionChange: 5,
  nps: 72,
  npsChange: 4
})

const obrasMasVisitadas = ref([
  { id: 1, nombre: 'La persistencia de la memoria', sala: 'Sala 2', visitas: 342, retencion: 78, estado: 'abierto' },
  { id: 2, nombre: 'La noche estrellada', sala: 'Sala 1', visitas: 298, retencion: 65, estado: 'abierto' },
  { id: 3, nombre: 'El grito', sala: 'Sala 1', visitas: 256, retencion: 54, estado: 'mantenimiento' },
  { id: 4, nombre: 'Guernica', sala: 'Sala 3', visitas: 187, retencion: 82, estado: 'abierto' },
  { id: 5, nombre: 'El beso', sala: 'Sala 2', visitas: 165, retencion: 71, estado: 'abierto' }
])

// Datos para el gráfico
const visitsByHour = ref([12, 8, 5, 7, 15, 28, 45, 62, 58, 42, 35, 48, 72, 85, 68, 54, 38, 25, 18, 12, 8, 6, 4, 3])
const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']

const maxVisitsHour = computed(() => Math.max(...visitsByHour.value))
const avgVisitsPerHour = computed(() => Math.round(visitsByHour.value.reduce((a, b) => a + b, 0) / 24))

const visitsChartCanvas = ref(null)
let visitsChart = null

// ========== RANKING DE OBRAS ==========
const rankingPeriods = ref(['Hoy', 'Esta semana', 'Este mes'])
const currentRankingPeriod = ref('Esta semana')

const rankingObras = ref([
  { id: 1, nombre: 'La persistencia de la memoria', sala: 'Sala 2', artista: 'Salvador Dalí', engagement: 98, tiempoPromedio: 4.2, trend: 'up' },
  { id: 2, nombre: 'La noche estrellada', sala: 'Sala 1', artista: 'Van Gogh', engagement: 92, tiempoPromedio: 3.8, trend: 'up' },
  { id: 3, nombre: 'El beso', sala: 'Sala 2', artista: 'Gustav Klimt', engagement: 87, tiempoPromedio: 3.5, trend: 'down' },
  { id: 4, nombre: 'Guernica', sala: 'Sala 3', artista: 'Picasso', engagement: 81, tiempoPromedio: 4.5, trend: 'down' },
  { id: 5, nombre: 'El pensador', sala: 'Sala 3', artista: 'Rodin', engagement: 76, tiempoPromedio: 3.2, trend: 'up' }
])

// ========== SPONSORS ==========
const ingresosMes = ref(28450)
const sponsorsActivos = ref(8)
const impresionesTotales = ref(15780)

const sponsors = ref([
  { id: 1, nombre: 'Coca-Cola', logo: null, sala: 'Sala 1 - Arte Moderno', impresiones: 3420, aportado: 8500, estado: 'activo' },
  { id: 2, nombre: 'Banco Interbank', logo: null, sala: 'Sala 2 - Contemporáneo', impresiones: 2890, aportado: 7200, estado: 'activo' },
  { id: 3, nombre: 'Movistar', logo: null, sala: 'Sala 3 - Clásico', impresiones: 2150, aportado: 5400, estado: 'activo' },
  { id: 4, nombre: 'Backus', logo: null, sala: 'Cafetería', impresiones: 1890, aportado: 4200, estado: 'inactivo' },
  { id: 5, nombre: 'Samsung', logo: null, sala: 'Entrada Principal', impresiones: 3120, aportado: 7800, estado: 'activo' }
])

// ========== FUNCIONES ==========
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

// Funciones de exportación
const exportToExcel = () => {
  alert('📊 Exportando a Excel... Los datos se descargarán como archivo .xlsx')
}

const exportToPDF = () => {
  alert('📄 Exportando a PDF... Se generará un reporte del dashboard')
}

const exportSponsorsPDF = () => {
  alert('📄 Exportando tabla de sponsors a PDF')
}

const agregarSponsor = () => {
  alert('➕ Formulario para agregar nuevo sponsor')
}

// Inicializar gráfico
onMounted(() => {
  if (visitsChartCanvas.value) {
    visitsChart = new Chart(visitsChartCanvas.value.getContext('2d'), {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          label: 'Visitas por hora',
          data: visitsByHour.value,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#fff',
          pointRadius: 3,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `${ctx.raw} visitas` } }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#e0e0e0' }, title: { display: true, text: 'Número de visitas' } },
          x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45 } }
        }
      }
    })
  }
})
</script>

<style scoped>
.dashboard-container { display: flex; min-height: 100vh; background: #f5f7fb; }

/* Sidebar (mismo estilo que dashboard visitante) */
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
.stat-change { font-size: 12px; margin-left: 5px; }
.stat-change.positive { color: #27ae60; }
.stat-change.negative { color: #e74c3c; }

/* Two columns */
.two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.card { background: white; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; flex: 1; }

/* Data Table */
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
.data-table th { background: #f8f9fa; font-weight: 600; color: #2c3e50; }
.progress-mini { display: flex; align-items: center; gap: 8px; }
.progress-bar-mini { height: 6px; background: #27ae60; border-radius: 3px; width: 0; }
.status-badge { font-size: 12px; padding: 4px 8px; border-radius: 20px; }
.status-badge.abierto { background: #d5f4e6; color: #27ae60; }
.status-badge.mantenimiento { background: #fff3e0; color: #f39c12; }
.status-badge.cerrado { background: #fde5e5; color: #e74c3c; }

/* Export buttons */
.export-buttons { display: flex; gap: 10px; }
.export-btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; }
.export-btn.excel { background: #27ae60; color: white; }
.export-btn.pdf { background: #e74c3c; color: white; }

/* Chart */
.chart-container { height: 300px; position: relative; }
.chart-stats { display: flex; gap: 20px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
.chart-stat span { color: #7f8c8d; font-size: 12px; }
.chart-stat strong { color: #2c3e50; }

/* Ranking */
.ranking-period { display: flex; gap: 10px; }
.ranking-period button { padding: 5px 12px; background: #f0f0f0; border: none; border-radius: 20px; cursor: pointer; font-size: 12px; }
.ranking-period button.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
.ranking-list { display: flex; flex-direction: column; gap: 12px; }
.ranking-item { display: flex; align-items: center; gap: 15px; padding: 12px; background: #f8f9fa; border-radius: 12px; }
.ranking-number { width: 35px; height: 35px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; }
.ranking-info { flex: 1; }
.ranking-title { font-weight: 600; }
.ranking-meta { font-size: 12px; color: #7f8c8d; }
.ranking-stats { display: flex; gap: 20px; align-items: center; }
.engagement-score { text-align: center; }
.score-value { font-size: 20px; font-weight: bold; color: #667eea; }
.score-label { font-size: 10px; color: #7f8c8d; }
.time-spent { font-size: 13px; color: #2c3e50; }

/* Stats Grid Small */
.stats-grid-small { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
.stat-card-small { background: white; border-radius: 15px; padding: 20px; display: flex; align-items: center; gap: 15px; }
.stat-card-small .icon { font-size: 35px; }
.stat-card-small .value { display: block; font-size: 28px; font-weight: bold; color: #2c3e50; }
.stat-card-small .label { font-size: 12px; color: #7f8c8d; }

/* Sponsor table */
.sponsor-logo { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; margin-right: 10px; vertical-align: middle; }
.money { color: #27ae60; font-weight: bold; }
.btn-add { padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
.action-buttons-header { display: flex; gap: 10px; }

/* Responsive */
@media (max-width: 1200px) {
  .two-columns { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-grid-small { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .main-content { margin-left: 0; }
  .stats-grid { grid-template-columns: 1fr; }
}
</style>