<script setup>
import { nextTick, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash, faPaw } from '@fortawesome/free-solid-svg-icons'
import { sessionStore } from '../application/sessionStore'
import { pushToast } from '../../../shared/application/toastStore'

const router = useRouter()
const base = import.meta.env.BASE_URL
const form = reactive({ name: '', email: '', password: '', passwordConfirmation: '' })
const showPassword = ref(false)
const showConfirmation = ref(false)
const submitting = ref(false)
const error = ref('')
const nameInput = ref(null)
const emailInput = ref(null)
const passwordInput = ref(null)
const confirmationInput = ref(null)

async function focusFirstError() {
  await nextTick()
  const target = !form.name ? nameInput.value
    : !form.email ? emailInput.value
      : !form.password ? passwordInput.value
        : !form.passwordConfirmation ? confirmationInput.value
          : nameInput.value
  target?.focus()
}

async function submit() {
  if (submitting.value) return
  error.value = ''
  submitting.value = true
  try {
    await sessionStore.register(form)
    await router.push('/')
    pushToast({ type: 'success', message: 'Cuenta creada', duration: 3000 })
  } catch (requestError) {
    error.value = typeof requestError?.message === 'string' && requestError.message.trim()
      ? requestError.message.trim()
      : 'Ocurrió un problema. Intentá nuevamente.'
    await focusFirstError()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <section class="register-story" aria-label="Crear una cuenta en Mi registro">
      <header class="register-brand">
        <span><FontAwesomeIcon :icon="faPaw" /></span>
        <div><strong>Mi <em>registro</em></strong><small>Comé bien. Entrená. Sentite mejor.</small></div>
      </header>
      <img class="register-cats" :src="base + 'auth/cats-login-hero-v2.png'" alt="Dorito, Felicia y Felipa juntos" />
      <blockquote>“Empezá un día a la vez.”</blockquote>
    </section>

    <section class="register-access">
      <div class="register-card">
        <div class="welcome-pill"><FontAwesomeIcon :icon="faPaw" /> Tu espacio personal</div>
        <h1>Crear cuenta</h1>
        <p class="register-subtitle">Tus comidas, entrenamientos y estados de ánimo, siempre separados de los demás usuarios.</p>

        <form novalidate @submit.prevent="submit">
          <label for="register-name">Nombre</label>
          <div class="register-input">
            <FontAwesomeIcon :icon="faPaw" aria-hidden="true" />
            <input id="register-name" ref="nameInput" v-model="form.name" name="name" type="text" autocomplete="name" maxlength="120" placeholder="¿Cómo te llamás?" required :aria-invalid="Boolean(error)" :aria-describedby="error ? 'register-error' : undefined" />
          </div>

          <label for="register-email">Correo electrónico</label>
          <div class="register-input">
            <img :src="base + 'icons/login-email-cat.svg'" alt="" aria-hidden="true" />
            <input id="register-email" ref="emailInput" v-model="form.email" name="email" type="email" autocomplete="email" placeholder="nombre@email.com" required :aria-invalid="Boolean(error)" :aria-describedby="error ? 'register-error' : undefined" />
          </div>

          <label for="register-password">Contraseña</label>
          <div class="register-input">
            <img :src="base + 'icons/login-password-cat.svg'" alt="" aria-hidden="true" />
            <input id="register-password" ref="passwordInput" v-model="form.password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" placeholder="Mínimo 8 caracteres" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'register-error register-password-help' : 'register-password-help'" required />
            <button type="button" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword" @click="showPassword = !showPassword"><FontAwesomeIcon :icon="showPassword ? faEyeSlash : faEye" /></button>
          </div>
          <p id="register-password-help" class="password-help">Podés usar una frase fácil de recordar. No exigimos símbolos ni mayúsculas.</p>

          <label for="register-confirmation">Confirmar contraseña</label>
          <div class="register-input">
            <img :src="base + 'icons/login-password-cat.svg'" alt="" aria-hidden="true" />
            <input id="register-confirmation" ref="confirmationInput" v-model="form.passwordConfirmation" name="passwordConfirmation" :type="showConfirmation ? 'text' : 'password'" autocomplete="new-password" minlength="8" placeholder="Repetí tu contraseña" required :aria-invalid="Boolean(error)" :aria-describedby="error ? 'register-error' : undefined" />
            <button type="button" :aria-label="showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'" :aria-pressed="showConfirmation" @click="showConfirmation = !showConfirmation"><FontAwesomeIcon :icon="showConfirmation ? faEyeSlash : faEye" /></button>
          </div>

          <p v-if="error" id="register-error" class="register-error" role="alert">{{ error }}</p>
          <button class="register-submit" type="submit" :disabled="submitting">
            <img :src="base + 'icons/nuevo-registro.svg'" alt="" aria-hidden="true" />
            <span>{{ submitting ? 'Creando cuenta…' : 'Crear cuenta' }}</span>
          </button>
        </form>
        <p class="login-prompt">¿Ya tenés una cuenta? <RouterLink to="/login">Iniciar sesión</RouterLink></p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.register-brand { z-index: 1; display: flex; align-items: center; gap: 16px; width: min(560px, 100%); }
.register-brand strong { display: block; color: var(--cocoa-950); font: 800 clamp(30px, 3vw, 46px)/1 var(--font-display); }.register-brand em { color: var(--dorito-500); font-style: normal; }.register-brand small { display: block; margin-top: 9px; color: var(--cocoa-600); }
blockquote { margin: -24px 0 0; color: var(--cocoa-950); font: 700 clamp(25px, 2.5vw, 38px) Georgia, serif; }
h1 { margin: 22px 0 8px; color: var(--cocoa-950); font: 800 clamp(32px, 3vw, 44px)/1.1 var(--font-display); }.register-subtitle { margin: 0 0 26px; color: var(--cocoa-600); line-height: 1.5; }
form > label { display: block; margin-top: 18px; color: var(--cocoa-900); font-weight: 700; }.register-input img { width: 30px; height: 30px; object-fit: contain; }.register-input input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--cocoa-900); background: transparent; font-size: 16px; }
.register-input input::placeholder { color: var(--cocoa-500, #928075); opacity: 1; }.register-input button { padding: 7px; border: 0; color: var(--cocoa-600); background: transparent; cursor: pointer; display: inline-grid; place-items: center; min-width: 44px; min-height: 44px; margin-right: -10px; border-radius: 10px; }
.password-help { margin: 7px 0 0; color: var(--cocoa-600); font-size: 13px; }.register-submit:disabled { opacity: .68; cursor: wait; }.register-submit img { width: 34px; height: 34px; object-fit: contain; }
.login-prompt { margin: 24px 0 0; color: var(--cocoa-600); text-align: center; }
@media (max-width: 420px) { .register-story { min-height: 218px; padding: 22px 18px 52px; }.register-cats { width: min(320px, 88%); height: 140px; }.register-access { margin-top: -40px; padding-inline: 10px; }.register-card { padding: 26px 18px 24px; border-radius: 24px; }.register-subtitle { margin-bottom: 20px; font-size: 15px; }.welcome-pill { min-height: 38px; padding-inline: 13px; font-size: 13px; }h1 { margin-top: 18px; font-size: 30px; }form > label { margin-top: 15px; }.register-input { gap: 8px; min-height: 56px; padding-inline: 12px; }.password-help { font-size: 14px; line-height: 1.45; }.register-submit { margin-top: 22px; }.login-prompt { margin-top: 20px; } }

/* Neo-brutalist identity surface: warm, explicit and easy to scan. */
.register-page { min-height: 100vh; display: grid; grid-template-columns: minmax(390px, .9fr) minmax(560px, 1.1fr); background: var(--cream-100); }
.register-story { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; padding: 48px; border-right: 3px solid var(--cocoa-950); background: var(--sand-50); }
.register-brand > span { display: grid; place-items: center; width: 62px; height: 62px; border-radius: 14px; color: white; background: var(--dorito-500); font-size: 30px; border: 3px solid var(--cocoa-950); box-shadow: 4px 4px 0 var(--cocoa-950); }
.register-cats { width: min(650px, 112%); margin-top: 24px; aspect-ratio: 4/3; object-fit: cover; -webkit-mask-image: radial-gradient(ellipse 70% 68% at center, #000 60%, transparent 100%); mask-image: radial-gradient(ellipse 70% 68% at center, #000 60%, transparent 100%); filter: drop-shadow(6px 8px 0 rgba(48,39,32,.16)); }
.register-access { display: grid; place-items: center; min-height: 100vh; padding: 24px; background: var(--cream-100); }
.register-card { width: min(720px, 100%); padding: clamp(36px, 5vh, 64px) clamp(34px, 6vw, 78px); border: 3px solid var(--cocoa-950); border-radius: 12px; background: var(--cream-50); box-shadow: 6px 6px 0 var(--cocoa-950); }
.welcome-pill { display: inline-flex; align-items: center; gap: 9px; min-height: 42px; padding: 0 16px; border: 2px solid var(--cocoa-950); border-radius: 9px; color: var(--cocoa-950); background: var(--dorito-100); font-weight: 700; box-shadow: 3px 3px 0 var(--cocoa-950); }
.register-input { display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; align-items: center; gap: 11px; min-height: 58px; margin-top: 8px; padding: 0 14px; border: 2px solid var(--cocoa-900); border-radius: 9px; color: var(--dorito-500); background: var(--cream-50); box-shadow: none; transition: border-color .2s, box-shadow .2s, background-color .2s; }
.register-input:focus-within { border-color: var(--dorito-600); box-shadow: none; outline: 3px solid var(--dorito-300); outline-offset: 2px; }
.register-input button:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 2px; }
.register-error { margin: 14px 0 0; color: var(--danger-700, #874033); font-size: 14px; padding: 9px 12px; border: 2px solid var(--danger-600); border-left-width: 6px; background: var(--danger-50, #fff0ec); font-weight: 700; }
.register-submit { display: flex; align-items: center; justify-content: center; gap: 11px; width: 100%; min-height: 60px; margin-top: 26px; border: 2px solid var(--cocoa-950); border-radius: 9px; color: white; background: var(--dorito-500); box-shadow: 4px 4px 0 var(--cocoa-950); font-size: 18px; font-weight: 800; cursor: pointer; transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease; }
.register-submit:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--cocoa-950); }
.login-prompt a { color: var(--cocoa-950); font-weight: 800; text-decoration: none; display: inline-block; padding: 2px 6px; border: 2px solid var(--cocoa-950); border-radius: 6px; background: var(--lavender-100, #ece8ff); }
.register-submit:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
.login-prompt a:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .register-submit { transition: none; }.register-submit:hover:not(:disabled) { transform: none; } }
@media (max-width: 900px) { .register-page { grid-template-columns: 1fr; }.register-cats { width: min(380px, 86%); height: 174px; margin-top: 8px; }.register-story blockquote { display: none; }.register-access { min-height: auto; margin-top: -44px; padding: 0 16px 24px; background: transparent; }.register-card { padding: 30px 24px; border-radius: 26px; }.register-brand { justify-content: center; }.register-brand > span { width: 50px; height: 50px; font-size: 24px; }.register-brand strong { font-size: 30px; }.register-brand small { font-size: 12px; } .register-story { min-height: 250px; padding: 26px 24px 60px; border: 0; border-right: 0; border-bottom: 3px solid var(--cocoa-950); } }
</style>
