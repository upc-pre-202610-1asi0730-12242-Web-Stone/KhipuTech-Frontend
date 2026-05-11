<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <div class="logo-icon">🏛️</div>
          <h1>KhipuTech</h1>
        </div>
        <p class="subtitle">Museo de Arte Contemporáneo</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label>Correo Electrónico</label>
          <div class="input-icon">
            <span class="icon">📧</span>
            <input
                type="email"
                v-model="email"
                placeholder="usuario@ejemplo.com"
                required
            />
          </div>
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <div class="input-icon">
            <span class="icon">🔒</span>
            <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Ingresa tu contraseña"
                required
            />
            <span class="toggle-password" @click="showPassword = !showPassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </span>
          </div>
        </div>

        <button type="submit" class="btn-primary">
          <span>Ingresar</span>
          <span class="arrow">→</span>
        </button>
      </form>

      <div class="divider">
        <span>o accede como</span>
      </div>

      <div class="visitor-buttons">
        <button @click="enterAsVisitor('visitor')" class="btn-visitor">
          👤 Visitante
        </button>
        <button @click="enterAsVisitor('museum')" class="btn-visitor private">
          🏛️ Gestor
        </button>
      </div>
    </div>

    <div class="login-footer">
      <p>© 2026 KhipuTech - Todos los derechos reservados</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useIamStore } from '../../application/iam-store'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const iamStore = useIamStore()

const handleLogin = async () => {
  await iamStore.signIn(email.value, password.value)
  router.push('/dashboard')
}

const enterAsVisitor = async (type) => {
  iamStore.setVisitorMode(type)
  if (type === 'museum') {
    router.push('/dashboard-museum')
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.logo-icon {
  font-size: 40px;
}

.logo h1 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0;
}

.subtitle {
  color: #7f8c8d;
  font-size: 14px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.input-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon .icon {
  position: absolute;
  left: 12px;
  font-size: 18px;
}

.input-icon input {
  width: 100%;
  padding: 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
}

.input-icon input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toggle-password {
  position: absolute;
  right: 12px;
  cursor: pointer;
  font-size: 18px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.arrow {
  font-size: 18px;
}

.divider {
  text-align: center;
  margin: 25px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 70px);
  height: 1px;
  background: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 15px;
  color: #7f8c8d;
  font-size: 12px;
}

.visitor-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-visitor {
  padding: 12px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-visitor:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.btn-visitor.private {
  background: linear-gradient(135deg, #fe8c00 0%, #f83600 100%);
  color: white;
  border: none;
}

.btn-visitor.public {
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  color: white;
  border: none;
}

.login-footer {
  margin-top: 30px;
  text-align: center;
  color: white;
  font-size: 12px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
}
</style>