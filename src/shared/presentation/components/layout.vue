<template>
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
          @click="emit('update:tab', item.id)"
          :class="['nav-item', { active: currentTab === item.id }]"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span v-if="!sidebarCollapsed" class="nav-text">{{ item.name }}</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info-sidebar" v-if="!sidebarCollapsed">
        <div class="user-avatar">{{ userName.charAt(0) }}</div>
        <div class="user-details-sidebar">
          <p class="user-name-sidebar">{{ userName }}</p>
          <p class="user-role-sidebar">{{ userRole }}</p>
        </div>
      </div>
      <button @click="emit('logout')" class="logout-btn-sidebar">
        <span class="nav-icon">🚪</span>
        <span v-if="!sidebarCollapsed">Salir</span>
      </button>
    </div>
  </aside>

  <main class="main-content">
    <header class="top-header">
      <div class="header-left">
        <button @click="toggleSidebar" class="menu-toggle">☰</button>
        <h2>{{ currentTitle }}</h2>
      </div>
      <div class="header-right">
        <div class="user-badge">
          <span class="badge-name">{{ userName }}</span>
          <span class="badge-role">{{ userRole }}</span>
        </div>
        <div class="user-avatar-large">{{ userName.charAt(0) }}</div>
      </div>
    </header>

    <slot name="content"></slot>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIamStore } from '../../../iam/application/iam-store'

const props = defineProps({
  menuItems: { type: Array, required: true },
  currentTab: { type: String, required: true }
})

const emit = defineEmits(['update:tab', 'logout'])

const iamStore = useIamStore()
const sidebarCollapsed = ref(false)

const userName = computed(() => iamStore.user?.name || 'Usuario')
const userRole = computed(() => {
  const role = iamStore.user?.type
  if (role === 'gestor') return 'Administrador'
  if (role === 'public') return 'Gestor de Aforo'
  return 'Visitante'
})

const currentTitle = computed(() => {
  const item = props.menuItems.find(i => i.id === props.currentTab)
  return item?.name || 'Dashboard'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
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
  min-height: 100vh;
}

.sidebar.collapsed ~ .main-content {
  margin-left: 70px;
}

/* Top Header */
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

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .sidebar {
    transform: translateX(-100%);
    position: fixed;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .top-header {
    padding: 12px 15px;
  }

  .header-left h2 {
    font-size: 18px;
  }

  .user-badge {
    display: none;
  }
}
</style>