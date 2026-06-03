<template>
  <SharedLayout
      :menu-items="menuItems"
      :current-tab="activeSection"
      @update:tab="navegarASeccion"
      @logout="handleLogout"
  >
    <template #content>
      <div class="content-area">
        <component
            :is="currentComponent"
            :tab="activeTab"
            @update:tab="updateTab"
        />
      </div>
    </template>
  </SharedLayout>
</template>

<script setup>
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useIamStore } from '../../../iam/application/iam-store'
import SharedLayout from '../../../shared/presentation/components/layout.vue'

const CapacityDashboard = defineAsyncComponent(() => import('../../../capacity/presentation/views/capacity-dashboard.vue'))
const OperationDashboard = defineAsyncComponent(() => import('../../../operation/presentation/views/operation-dashboard.vue'))
const MaintenanceDashboard = defineAsyncComponent(() => import('../../../maintenance/presentation/views/maintenance-dashboard.vue'))

const iamStore = useIamStore()
const router = useRouter()
const route = useRoute()
const user = computed(() => iamStore.user)

const activeSection = ref(route.params.section || 'capacity')
const activeTab = ref(route.params.tab || null)  // ← se inicializa con el tab de la URL

// Mapeo de secciones
const sectionsMap = {
  capacity: {
    component: CapacityDashboard,
    name: 'Aforo',
    icon: '🏛️',
    defaultTab: 'rooms'
  },
  operation: {
    component: OperationDashboard,
    name: 'Alertas y Defensa Civil',
    icon: '⚠️',
    defaultTab: 'alertas'
  },
  maintenance: {
    component: MaintenanceDashboard,
    name: 'Mantenimiento',
    icon: '🔧',
    defaultTab: 'tasks'
  }
}

const menuItems = computed(() => {
  const permissions = user.value?.permissions || []
  return permissions
      .filter(perm => sectionsMap[perm])
      .map(perm => ({
        id: perm,
        name: sectionsMap[perm].name,
        icon: sectionsMap[perm].icon
      }))
})

const currentComponent = computed(() => sectionsMap[activeSection.value]?.component || null)

// Watcher para cambios en la sección (cuando cambia /manager/operation)
watch(() => route.params.section, (newSection) => {
  if (newSection && sectionsMap[newSection]) {
    activeSection.value = newSection
    // Reiniciar pestaña interna con la default de la nueva sección
    const defaultTab = sectionsMap[newSection].defaultTab
    activeTab.value = defaultTab
    // Si la URL no tiene el tab, lo añadimos
    if (defaultTab && !route.params.tab) {
      router.replace(`/manager/${newSection}/${defaultTab}`)
    }
  }
}, { immediate: true })

// ✅ NUEVO: Watcher para cambios en el parámetro 'tab' de la URL
watch(() => route.params.tab, (newTab) => {
  if (newTab && newTab !== activeTab.value) {
    activeTab.value = newTab
  }
})

const navegarASeccion = (sectionId) => {
  if (sectionId !== activeSection.value) {
    const defaultTab = sectionsMap[sectionId]?.defaultTab
    const newPath = defaultTab ? `/manager/${sectionId}/${defaultTab}` : `/manager/${sectionId}`
    router.push(newPath)
  }
}

const updateTab = (newTab) => {
  if (newTab !== activeTab.value) {
    router.push(`/manager/${activeSection.value}/${newTab}`)
  }
}

const handleLogout = () => {
  iamStore.signOut()
  router.push('/sign-in')
}
</script>

<style scoped>
.content-area {
  padding: 20px;
  width: 100%;
}
</style>