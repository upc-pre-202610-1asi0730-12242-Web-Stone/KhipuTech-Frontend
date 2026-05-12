<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">📊</span>
      <h3>{{ t('museum.visitsChart.title') }}</h3>
      <div class="export-buttons">
        <button @click="$emit('export-excel')" class="export-btn excel">{{ t('museum.visitsChart.excel') }}</button>
        <button @click="$emit('export-pdf')" class="export-btn pdf">{{ t('museum.visitsChart.pdf') }}</button>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="chart-stats">
      <div class="chart-stat"><span>{{ t('museum.visitsChart.peakLabel') }}</span> <strong>{{ maxVisitas }} {{ t('museum.visitsChart.visits') }}</strong></div>
      <div class="chart-stat"><span>{{ t('museum.visitsChart.avgLabel') }}</span> <strong>{{ promedioVisitas }}</strong></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'chart.js/auto'

const { t } = useI18n()

const props = defineProps({
  data: { type: Array, required: true },
  labels: { type: Array, required: true },
  maxVisitas: { type: Number, default: 0 },
  promedioVisitas: { type: Number, default: 0 }
})

defineEmits(['export-excel', 'export-pdf'])

const chartCanvas = ref(null)
let chart = null

const createChart = () => {
  if (chart) chart.destroy()
  chart = new Chart(chartCanvas.value.getContext('2d'), {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [{
        label: t('museum.visitsChart.datasetLabel'),
        data: props.data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 2, fill: true, tension: 0.4,
        pointBackgroundColor: '#667eea', pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: t('museum.visitsChart.yAxisLabel') } },
        x: { ticks: { maxRotation: 45, minRotation: 45 } }
      }
    }
  })
}

onMounted(() => { if (chartCanvas.value) createChart() })
watch(() => props.data, () => { if (chartCanvas.value) createChart() }, { deep: true })
</script>

<style scoped>
.card { background: white; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.card-icon { font-size: 24px; }
.card-header h3 { margin: 0; flex: 1; color: #2c3e50; }
.export-buttons { display: flex; gap: 10px; }
.export-btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; }
.export-btn.excel { background: #27ae60; color: white; }
.export-btn.pdf { background: #e74c3c; color: white; }
.chart-container { height: 300px; position: relative; }
.chart-stats { display: flex; gap: 20px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
.chart-stat span { color: #7f8c8d; font-size: 12px; }
.chart-stat strong { color: #2c3e50; }
</style>