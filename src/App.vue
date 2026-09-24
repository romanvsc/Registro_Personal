<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import AppIcon from './shared/components/AppIcon.vue'
import ToastHost from './shared/components/ToastHost.vue'
import AppVersion from './shared/components/AppVersion.vue'
import AccountMenu from './contexts/identity-access/components/AccountMenu.vue'
import { sessionStore } from './contexts/identity-access/application/sessionStore'
import JournalNavigation from './contexts/personal-journal/components/JournalNavigation.vue'
import MobileBottomNavigation from './contexts/personal-journal/components/MobileBottomNavigation.vue'
import { MOTION, createMotionContext, prefersReducedMotion, gsap } from './shared/motion/gsap'

const menuOpen = ref(false)
const menuButton = ref(null)
const sidebar = ref(null)
const sidebarClose = ref(null)
const route = useRoute()
const router = useRouter()
const user = sessionStore.user
const assetsBase = import.meta.env.BASE_URL
const recordPatternIcons = {
  comida: 'comidas.svg',
  entrenamiento: 'entrenamientos.svg',
  animo: 'estado-animo.svg',
}
const recordTheme = computed(() => {
  if (route.params.type === 'comida') return 'records-theme--food'
  if (route.params.type === 'entrenamiento') return 'records-theme--training'
  if (route.params.type === 'animo') return 'records-theme--mood'
  if (route.path.startsWith('/registrar')) return 'records-theme--custom'
  return ''
})
const isDashboard = computed(() => route.path === '/')
const recordPatternStyle = computed(() => {
  const icon = recordPatternIcons[route.params.type]
  return icon ? { '--record-pattern': `url("${assetsBase}icons/${icon}")` } : undefined
})

function animateRouteEnter(element, done) {
  if (prefersReducedMotion()) {
    done()
    return
  }

  let context
  context = createMotionContext(element, () => {
    gsap.fromTo(element,
      {
        opacity: 0,
        y: MOTION.offset.routeEnter,
        rotation: MOTION.rotation.routeEnter,
        scale: MOTION.scale.routeEnter,
        transformOrigin: '50% 0%',
      },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: MOTION.duration.route,
        ease: MOTION.ease.enter,
        onComplete: () => {
          context?.revert()
          done()
        },
      },
    )
  })
}

function animateRouteLeave(element, done) {
  if (prefersReducedMotion()) {
    done()
    return
  }

  let context
  context = createMotionContext(element, () => {
    gsap.to(element, {
      opacity: 0,
      y: MOTION.offset.routeLeave,
      rotation: MOTION.rotation.routeLeave,
      scale: MOTION.scale.routeLeave,
      duration: MOTION.duration.route,
      ease: MOTION.ease.leave,
      onComplete: () => {
        context?.revert()
        done()
      },
    })
  })
}

function closeMenu({ restoreFocus = false } = {}) {
  menuOpen.value = false
  if (restoreFocus) nextTick(() => menuButton.value?.focus())
}

function trapSidebarFocus(event) {
  if (event.key === 'Escape') {
    if (event.target.closest('.account-menu__popover')) return
    event.preventDefault()
    closeMenu({ restoreFocus: true })
    return
  }
  if (event.key !== 'Tab') return
  if (!sidebar.value) return

  const focusable = [...sidebar.value.querySelectorAll('a[href], button:not([disabled])')]
    .filter((element) => element.offsetParent !== null)
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable.at(-1)
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(menuOpen, async (open) => {
  document.body.classList.toggle('menu-open', open)
  if (open) {
    await nextTick()
    sidebarClose.value?.focus()
  }
})

watch(() => route.fullPath, () => closeMenu())
onBeforeUnmount(() => document.body.classList.remove('menu-open'))

async function editProfile() {
  closeMenu()
  await router.push('/perfil')
}

async function signOut() {
  closeMenu()
  try {
    await sessionStore.logout()
  } finally {
    await router.push('/login')
  }
}
</script>

<template>
  <RouterView v-if="route.meta.publicLayout" v-slot="{ Component, route: viewRoute }">
    <Transition
      name="page-view"
      mode="in-out"
      :css="false"
      @enter="animateRouteEnter"
      @leave="animateRouteLeave"
    >
      <component :is="Component" :key="viewRoute.path" />
    </Transition>
  </RouterView>
  <div v-else class="app-shell app-shell--neo">
    <header class="mobile-header">
      <button
        ref="menuButton"
        class="mobile-menu"
        type="button"
        aria-controls="app-sidebar"
        :aria-expanded="menuOpen"
        :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click="menuOpen = !menuOpen"
      >
        <FontAwesomeIcon :icon="menuOpen ? faXmark : faBars" aria-hidden="true" />
      </button>
      <span>Mi registro</span>
    </header>
    <button v-if="menuOpen" class="sidebar-backdrop" type="button" tabindex="-1" aria-label="Cerrar menú" @click="closeMenu({ restoreFocus: true })"></button>
    <aside id="app-sidebar" ref="sidebar" class="sidebar" :class="{ open: menuOpen }" aria-label="Menú de la aplicación" @keydown="trapSidebarFocus">
      <button ref="sidebarClose" class="sidebar-close" type="button" aria-label="Cerrar menú" @click="closeMenu({ restoreFocus: true })">
        <FontAwesomeIcon :icon="faXmark" aria-hidden="true" />
      </button>
      <RouterLink class="brand" to="/" @click="closeMenu()">
        <span class="brand-mark"><AppIcon name="saludo" /></span>
        <span><strong>Mi registro</strong><small>Un día a la vez</small></span>
      </RouterLink>
      <nav aria-label="Navegación principal">
        <RouterLink to="/" @click="closeMenu()">
          <span aria-hidden="true"><AppIcon name="hoy" /></span>Hoy
        </RouterLink>
        <JournalNavigation @navigate="closeMenu()" />
        <RouterLink to="/historial" @click="closeMenu()">
          <span aria-hidden="true"><AppIcon name="historial" /></span>Historial
        </RouterLink>
      </nav>
      <div class="sidebar-cat">
        <AppIcon name="saludo" />
        <p>¿Cómo estuvo tu día?</p>
        <RouterLink to="/registrar/animo">Cuentaselo a Felicia</RouterLink>
      </div>
      <AccountMenu v-if="user" :user="user" @edit-profile="editProfile" @logout="signOut" />
    </aside>
    <main :class="[recordTheme, 'neo-main', { 'dashboard-theme': isDashboard }]" :style="recordPatternStyle" :inert="menuOpen ? '' : null" :aria-hidden="menuOpen ? 'true' : null">
      <RouterView v-slot="{ Component, route: viewRoute }">
        <Transition
          name="page-view"
          mode="in-out"
          :css="false"
          @enter="animateRouteEnter"
          @leave="animateRouteLeave"
        >
          <component :is="Component" :key="viewRoute.path" />
        </Transition>
      </RouterView>
    </main>
    <MobileBottomNavigation v-if="!menuOpen" />
    <ToastHost />
  </div>
  <AppVersion />
</template>
