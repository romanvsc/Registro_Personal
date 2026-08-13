<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from './shared/components/AppIcon.vue'
import ToastHost from './shared/components/ToastHost.vue'
import { sessionStore } from './contexts/identity-access/application/sessionStore'

const menuOpen = ref(false)
const route = useRoute()
const router = useRouter()
const user = sessionStore.user
async function signOut() {
  await sessionStore.logout()
  await router.push('/login')
}
const links = [
  { to: '/', label: 'Hoy', icon: 'hoy' },
  { to: '/registrar/comida', label: 'Comidas', icon: 'comidas' },
  { to: '/registrar/entrenamiento', label: 'Entrenamientos', icon: 'entrenamientos' },
  { to: '/registrar/animo', label: 'Estado de ánimo', icon: 'estado-animo' },
  { to: '/historial', label: 'Historial', icon: 'historial' },
  { to: '/configuracion/tipos', label: 'Tipos', icon: 'nuevo-registro' },
]
</script>

<template>
  <RouterView v-if="route.meta.publicLayout" />
  <div v-else class="app-shell">
    <button class="mobile-menu" aria-label="Abrir menú" @click="menuOpen = !menuOpen">☰</button>
    <aside class="sidebar" :class="{ open: menuOpen }">
      <RouterLink class="brand" to="/" @click="menuOpen = false">
        <span class="brand-mark"><AppIcon name="saludo" /></span>
        <span><strong>Mi registro</strong><small>Un día a la vez</small></span>
      </RouterLink>
      <nav aria-label="Navegación principal">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" @click="menuOpen = false">
          <span aria-hidden="true"><AppIcon :name="link.icon" /></span>{{ link.label }}
        </RouterLink>
      </nav>
      <div class="sidebar-cat">
        <AppIcon name="saludo" />
        <p>¿Cómo estuvo tu día?</p>
        <RouterLink to="/registrar/animo">Cuentaselo a Felicia</RouterLink>
      </div>
      <button class="profile" type="button" title="Cerrar sesión" @click="signOut">
        <span>{{ user?.name?.slice(0, 2).toUpperCase() || 'MI' }}</span>
        <span><strong>{{ user?.name || 'Mi cuenta' }}</strong><small>Cerrar sesión</small></span><b>×</b>
      </button>
    </aside>
    <main><RouterView /></main>
    <ToastHost />
  </div>
</template>
