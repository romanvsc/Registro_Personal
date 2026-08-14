<script setup>
import { computed, reactive, ref } from 'vue'
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

async function submit() {
  if (submitting.value) return
  error.value = ''
  submitting.value = true
  try { await authApi.resetPassword({ token: token.value, ...form }); updated.value = true }
  catch (requestError) { error.value = requestError?.message || 'Ocurrió un problema. Intentá nuevamente.' }
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
    <template v-else>
      <h1>Restablecer contraseña</h1><p>Elegí una nueva contraseña de al menos 8 caracteres.</p>
      <form novalidate @submit.prevent="submit">
        <label for="reset-password">Nueva contraseña</label>
        <div class="reset-input"><img :src="base + 'icons/login-password-cat.svg'" alt="" aria-hidden="true" /><input id="reset-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" required /><button type="button" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword" @click="showPassword = !showPassword"><FontAwesomeIcon :icon="showPassword ? faEyeSlash : faEye" /></button></div>
        <label for="reset-confirmation">Confirmar contraseña</label>
        <div class="reset-input"><img :src="base + 'icons/login-password-cat.svg'" alt="" aria-hidden="true" /><input id="reset-confirmation" v-model="form.passwordConfirmation" :type="showConfirmation ? 'text' : 'password'" autocomplete="new-password" minlength="8" required /><button type="button" :aria-label="showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'" :aria-pressed="showConfirmation" @click="showConfirmation = !showConfirmation"><FontAwesomeIcon :icon="showConfirmation ? faEyeSlash : faEye" /></button></div>
        <p v-if="error" class="reset-error" role="alert">{{ error }}</p>
        <button class="reset-primary" type="submit" :disabled="submitting || !token">{{ submitting ? 'Actualizando…' : 'Restablecer contraseña' }}</button>
      </form>
      <RouterLink class="reset-secondary" to="/login">Volver al login</RouterLink>
    </template>
  </section></main>
</template>

<style scoped>
.reset-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 80% 8%, var(--dorito-50), transparent 34%), var(--cream-100); }.reset-card { width: min(570px,100%); padding: 48px clamp(28px,7vw,64px) 40px; border: 1px solid var(--cream-300); border-radius: 30px; background: rgba(255,255,255,.9); box-shadow: var(--shadow-float); text-align: center; }.reset-mark { display: grid; place-items: center; width: 58px; height: 58px; margin: auto; border-radius: 18px; color: white; background: linear-gradient(145deg,var(--dorito-400),var(--dorito-600)); font-size: 27px; }.reset-success-cat { width: 110px; height: 110px; margin: 16px auto -8px; object-fit: contain; }h1 { margin: 22px 0 9px; color: var(--cocoa-950); font: 800 clamp(30px,6vw,42px)/1.1 Nunito; }p { color: var(--cocoa-600); }form { margin-top: 28px; text-align: left; }label { display: block; margin-top: 18px; color: var(--cocoa-900); font-weight: 700; }.reset-input { display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; align-items: center; gap: 10px; min-height: 58px; margin-top: 8px; padding: 0 14px; border: 1px solid var(--sand-400, #B7A08D); border-radius: 12px; background: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,.9); transition: border-color .2s, box-shadow .2s; }.reset-input:focus-within { border-color: var(--dorito-400); box-shadow: 0 0 0 4px rgba(217,120,34,.1); }.reset-input img { width: 31px; height: 31px; object-fit: contain; }.reset-input input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--cocoa-900); background: transparent; font-size: 16px; }.reset-input button { display: inline-grid; place-items: center; min-width: 44px; min-height: 44px; margin-right: -10px; padding: 8px; border: 0; border-radius: 10px; color: var(--cocoa-600); background: transparent; cursor: pointer; }.reset-primary { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 58px; margin-top: 26px; border: 0; border-radius: 12px; color: white; background: linear-gradient(90deg,var(--dorito-400),var(--dorito-600)); font-weight: 800; text-decoration: none; cursor: pointer; }.reset-primary:disabled { opacity: .65; cursor: not-allowed; }.reset-secondary { display: inline-block; margin-top: 22px; color: var(--dorito-600); font-weight: 700; text-decoration: none; }.reset-input button:focus-visible, .reset-primary:focus-visible, .reset-secondary:focus-visible { outline: 3px solid var(--dorito-300); outline-offset: 3px; }.reset-error { margin: 12px 0 0; color: var(--danger-600); font-size: 14px; }
@media (max-width: 420px) { .reset-page { padding: 12px; }.reset-card { padding: 38px 18px 30px; border-radius: 24px; }h1 { font-size: 31px; }.reset-input { gap: 8px; padding-inline: 12px; } }
</style>
