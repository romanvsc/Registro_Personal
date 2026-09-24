<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash, faPaw } from '@fortawesome/free-solid-svg-icons'
import { authApi } from '../infrastructure/authApi'

const route = useRoute()
const base = import.meta.env.BASE_URL
const token = computed(() => typeof route.query.token === 'string' ? route.query.token : '')
const form = reactive({ password: '', passwordConfirmation: '' })
const showPassword = ref(false)
const showConfirmation = ref(false)
const submitting = ref(false)
const updated = ref(false)
const error = ref('')
const passwordInput = ref(null)
const confirmationInput = ref(null)

async function focusFirstError() {
  await nextTick()
  const target = !form.password ? passwordInput.value : confirmationInput.value
  target?.focus()
}

async function submit() {
  if (submitting.value) return
  error.value = ''
  submitting.value = true
  if (!token.value) {
    error.value = 'Este enlace de recuperación no es válido o ya venció.'
    await focusFirstError()
    submitting.value = false
    return
  }
  try { await authApi.resetPassword({ token: token.value, ...form }); updated.value = true }
  catch (requestError) { error.value = requestError?.message || 'Ocurrió un problema. Intentá nuevamente.'; await focusFirstError() }
  finally { submitting.value = false }
}
</script>

<template>
  <main class="reset-page"><section class="reset-card">
    <span class="reset-mark"><FontAwesomeIcon :icon="faPaw" /></span>
    <template v-if="updated">
      <img class="reset-success-cat" :src="base + 'cats/dorito-contento.png'" alt="Dorito contento" />
      <h1>Contraseña actualizada</h1><p>Ya podés ingresar con tu nueva contraseña.</p>
      <RouterLink class="reset-primary" to="/login">Ir al login</RouterLink>
    </template>
    <template v-else-if="!token">
      <h1>Enlace no válido</h1>
      <p id="reset-token-error" class="reset-error" role="alert">Este enlace de recuperación no es válido o ya venció.</p>
      <RouterLink class="reset-primary" to="/recuperar-contrasena">Solicitar otro enlace</RouterLink>
    </template>
    <template v-else>
      <h1>Restablecer contraseña</h1><p>Elegí una nueva contraseña de al menos 8 caracteres.</p>
      <form novalidate @submit.prevent="submit">
        <label for="reset-password">Nueva contraseña</label>
        <div class="reset-input"><img :src="base + 'icons/login-password-cat.svg'" alt="" aria-hidden="true" /><input id="reset-password" ref="passwordInput" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'reset-error' : undefined" required /><button type="button" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword" @click="showPassword = !showPassword"><FontAwesomeIcon :icon="showPassword ? faEyeSlash : faEye" /></button></div>
        <label for="reset-confirmation">Confirmar contraseña</label>
        <div class="reset-input"><img :src="base + 'icons/login-password-cat.svg'" alt="" aria-hidden="true" /><input id="reset-confirmation" ref="confirmationInput" v-model="form.passwordConfirmation" :type="showConfirmation ? 'text' : 'password'" autocomplete="new-password" minlength="8" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'reset-error' : undefined" required /><button type="button" :aria-label="showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'" :aria-pressed="showConfirmation" @click="showConfirmation = !showConfirmation"><FontAwesomeIcon :icon="showConfirmation ? faEyeSlash : faEye" /></button></div>
        <p v-if="error" id="reset-error" class="reset-error" role="alert">{{ error }}</p>
        <button class="reset-primary" type="submit" :disabled="submitting || !token">{{ submitting ? 'Actualizando…' : 'Restablecer contraseña' }}</button>
      </form>
      <RouterLink class="reset-secondary" to="/login">Volver al login</RouterLink>
    </template>
  </section></main>
</template>

<style scoped>
.reset-success-cat { width: 110px; height: 110px; margin: 16px auto -8px; object-fit: contain; }h1 { margin: 22px 0 9px; color: var(--cocoa-950); font: 800 clamp(30px,6vw,42px)/1.1 var(--font-display); }p { color: var(--cocoa-600); }form { margin-top: 28px; text-align: left; }label { display: block; margin-top: 18px; color: var(--cocoa-900); font-weight: 700; }.reset-input img { width: 31px; height: 31px; object-fit: contain; }.reset-input input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--cocoa-900); background: transparent; font-size: 16px; }.reset-input button { display: inline-grid; place-items: center; min-width: 44px; min-height: 44px; margin-right: -10px; padding: 8px; border: 0; border-radius: 10px; color: var(--cocoa-600); background: transparent; cursor: pointer; }.reset-primary:disabled { opacity: .65; cursor: not-allowed; }
@media (max-width: 420px) { .reset-page { padding: 12px; }.reset-card { padding: 38px 18px 30px; border-radius: 24px; }h1 { font-size: 31px; }.reset-input { gap: 8px; padding-inline: 12px; } }

/* Neo-brutalist identity surface: warm, explicit and easy to scan. */
.reset-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: var(--cream-100); }
.reset-card { width: min(570px,100%); padding: 48px clamp(28px,7vw,64px) 40px; border: 3px solid var(--cocoa-950); border-radius: 12px; background: var(--cream-50); box-shadow: 6px 6px 0 var(--cocoa-950); text-align: center; }
.reset-mark { display: grid; place-items: center; width: 58px; height: 58px; margin: auto; border-radius: 14px; color: white; background: var(--dorito-500); font-size: 27px; border: 3px solid var(--cocoa-950); box-shadow: 4px 4px 0 var(--cocoa-950); }
.reset-input { display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; align-items: center; gap: 10px; min-height: 58px; margin-top: 8px; padding: 0 14px; border: 2px solid var(--cocoa-900); border-radius: 9px; background: var(--cream-50); box-shadow: none; transition: border-color .2s, box-shadow .2s; }
.reset-input:focus-within { border-color: var(--dorito-600); box-shadow: none; outline: 3px solid var(--dorito-300); outline-offset: 2px; }
.reset-primary { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 58px; margin-top: 26px; border: 2px solid var(--cocoa-950); border-radius: 9px; color: white; background: var(--dorito-500); font-weight: 800; text-decoration: none; cursor: pointer; box-shadow: 4px 4px 0 var(--cocoa-950); transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease; }
.reset-primary:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--cocoa-950); }
.reset-secondary { display: inline-block; margin-top: 22px; color: var(--cocoa-950); font-weight: 700; text-decoration: none; padding: 2px 6px; border: 2px solid var(--cocoa-950); border-radius: 6px; background: var(--lavender-100, #ece8ff); }
.reset-error { margin: 12px 0 0; color: var(--danger-700, #874033); font-size: 14px; padding: 9px 12px; border: 2px solid var(--danger-600); border-left-width: 6px; background: var(--danger-50, #fff0ec); font-weight: 700; }
.reset-primary:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
.reset-secondary:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
.reset-input button:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .reset-primary { transition: none; }.reset-primary:hover:not(:disabled) { transform: none; } }
</style>
