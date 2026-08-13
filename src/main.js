import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import DashboardView from './views/DashboardView.vue'
import RegistroView from './views/RegistroView.vue'
import HistorialView from './views/HistorialView.vue'
import LoginView from './contexts/identity-access/views/LoginView.vue'
import { sessionStore } from './contexts/identity-access/application/sessionStore'
import './styles.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginView, meta: { publicLayout: true } },
    { path: '/', component: DashboardView },
    { path: '/registrar/:type?', component: RegistroView },
    { path: '/editar/:id', component: RegistroView },
    { path: '/historial', component: HistorialView },
  ],
})

router.beforeEach(async (to) => {
  const user = await sessionStore.restore()
  if (to.path === '/login') return user ? '/' : true
  return user ? true : { path: '/login', query: { redirect: to.fullPath } }
})

createApp(App).use(router).mount('#app')
