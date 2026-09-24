<script setup>
import { nextTick, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaw } from '@fortawesome/free-solid-svg-icons'
import { authApi } from '../infrastructure/authApi'

const base = import.meta.env.BASE_URL
const email = ref('')
const submitting = ref(false)
const sent = ref(false)
const error = ref('')
const emailInput = ref(null)

async function focusEmailError() {
  await nextTick()
  emailInput.value?.focus()
}

async function submit() {
  if (submitting.value) return
  error.value = ''
  submitting.value = true
  try {
    await authApi.forgotPassword(email.value)
    sent.value = true
  } catch (requestError) {
    error.value = requestError.status === 429 ? requestError.message : 'Ocurrió un problema. Intentá nuevamente.'
    await focusEmailError()
  } finally { submitting.value = false }
}
</script>

<template>
  <main class="recovery-page">
    <section class="recovery-card">
      <img class="recovery-cat" :src="base + 'cats/felicia-cansada.png'" alt="Felicia descansando" />
      <span class="recovery-mark"><FontAwesomeIcon :icon="faPaw" /></span>
      <template v-if="sent">
        <h1>Revisá tu correo</h1>
        <p class="recovery-message" role="status">Si existe una cuenta asociada a ese correo, te enviaremos instrucciones.</p>
        <RouterLink class="recovery-primary" to="/login">Volver al login</RouterLink>
      </template>
      <template v-else>
        <h1>Recuperar contraseña</h1>
        <p>Ingresá tu correo y te enviaremos un enlace de recuperación.</p>
        <form novalidate @submit.prevent="submit">
          <label for="recovery-email">Correo electrónico</label>
          <div class="recovery-input">
            <img :src="base + 'icons/login-email-cat.svg'" alt="" aria-hidden="true" />
            <input id="recovery-email" ref="emailInput" v-model.trim="email" type="email" autocomplete="email" placeholder="nombre@email.com" required :aria-invalid="Boolean(error)" :aria-describedby="error ? 'recovery-error' : undefined" />
          </div>
          <p v-if="error" id="recovery-error" class="recovery-error" role="alert">{{ error }}</p>
          <button class="recovery-primary" type="submit" :disabled="submitting">{{ submitting ? 'Enviando…' : 'Enviar instrucciones' }}</button>
        </form>
        <RouterLink class="recovery-secondary" to="/login">Volver al login</RouterLink>
      </template>
    </section>
  </main>
</template>

<style scoped>
h1 { margin: 22px 0 10px; color: var(--cocoa-950); font: 800 clamp(30px, 6vw, 42px)/1.1 var(--font-display); }p { color: var(--cocoa-600); line-height: 1.55; }.recovery-message { margin: 18px 0 28px; }form { margin-top: 28px; text-align: left; }label { color: var(--cocoa-900); font-weight: 700; }.recovery-input img { width: 31px; height: 31px; object-fit: contain; }.recovery-input input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--cocoa-900); background: transparent; font-size: 16px; }.recovery-input input::placeholder { color: var(--cocoa-500, #928075); opacity: 1; }.recovery-primary:disabled { opacity: .65; cursor: wait; }
@media (max-width: 420px) { .recovery-page { padding: 12px; }.recovery-card { padding: 42px 20px 30px; border-radius: 24px; }.recovery-cat { top: 12px; right: 10px; width: 70px; height: 70px; }.recovery-mark { width: 52px; height: 52px; }h1 { font-size: 31px; }.recovery-input { padding-inline: 12px; } }

/* Neo-brutalist identity surface: warm, explicit and easy to scan. */
.recovery-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: var(--cream-100); }
.recovery-card { position: relative; width: min(560px, 100%); padding: 54px clamp(28px, 7vw, 64px) 42px; overflow: hidden; border: 3px solid var(--cocoa-950); border-radius: 12px; background: var(--cream-50); box-shadow: 6px 6px 0 var(--cocoa-950); text-align: center; }
.recovery-mark { display: grid; place-items: center; width: 58px; height: 58px; margin: 0 auto; border-radius: 14px; color: white; background: var(--dorito-500); font-size: 27px; border: 3px solid var(--cocoa-950); box-shadow: 4px 4px 0 var(--cocoa-950); }
.recovery-cat { position: absolute; top: 18px; right: 22px; width: 92px; height: 92px; object-fit: contain; opacity: .9; transform: rotate(5deg); }
.recovery-input { display: grid; grid-template-columns: 34px minmax(0, 1fr); align-items: center; gap: 10px; min-height: 58px; margin-top: 9px; padding: 0 16px; border: 2px solid var(--cocoa-900); border-radius: 9px; background: var(--cream-50); box-shadow: none; transition: border-color .2s, box-shadow .2s; }
.recovery-input:focus-within { border-color: var(--dorito-600); box-shadow: none; outline: 3px solid var(--dorito-300); outline-offset: 2px; }
.recovery-primary { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 58px; margin-top: 24px; border: 2px solid var(--cocoa-950); border-radius: 9px; color: white; background: var(--dorito-500); font-weight: 800; text-decoration: none; cursor: pointer; box-shadow: 4px 4px 0 var(--cocoa-950); transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease; }
.recovery-primary:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--cocoa-950); }
.recovery-secondary { display: inline-block; margin-top: 22px; color: var(--cocoa-950); font-weight: 700; text-decoration: none; padding: 2px 6px; border: 2px solid var(--cocoa-950); border-radius: 6px; background: var(--lavender-100, #ece8ff); }
.recovery-error { margin: 10px 0 0; color: var(--danger-700, #874033); font-size: 14px; padding: 9px 12px; border: 2px solid var(--danger-600); border-left-width: 6px; background: var(--danger-50, #fff0ec); font-weight: 700; }
.recovery-primary:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
.recovery-secondary:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .recovery-primary { transition: none; }.recovery-primary:hover:not(:disabled) { transform: none; } }
</style>
