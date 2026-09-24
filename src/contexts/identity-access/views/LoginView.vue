<script setup>
import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sessionStore } from '../application/sessionStore'
import { getSafeRedirect } from '../application/safeRedirect'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPaw,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const route = useRoute()
const base = import.meta.env.BASE_URL
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const error = ref('')
const emailInput = ref(null)
const passwordInput = ref(null)

async function focusFirstError() {
  await nextTick()
  const target = !email.value ? emailInput.value : passwordInput.value
  target?.focus()
}

const cats = [
  { name: 'Dorito', message: 'Hoy puede ser un buen día.', image: `${base}cats/dorito-contento.png`, tone: 'dorito' },
  { name: 'Felicia', message: 'Con que empieces alcanza.', image: `${base}cats/felicia-cansada.png`, tone: 'felicia' },
  { name: 'Felipa', message: 'Entrená y dejame dormir.', image: `${base}cats/felipa-molesta.png`, tone: 'felipa' },
]

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Completá tu email y contraseña para continuar.'
    await focusFirstError()
    return
  }

  submitting.value = true
  try {
    await sessionStore.login(email.value, password.value)
    await router.push(getSafeRedirect(route.query.redirect))
  } catch (requestError) {
    error.value = requestError.message
    await focusFirstError()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <section class="login-story" aria-label="Bienvenida a Mi registro">
      <FontAwesomeIcon class="decorative-paw paw-one" :icon="faPaw" aria-hidden="true" />
      <FontAwesomeIcon class="decorative-paw paw-two" :icon="faPaw" aria-hidden="true" />
      <FontAwesomeIcon class="decorative-paw paw-three" :icon="faPaw" aria-hidden="true" />

      <header class="login-brand">
        <span class="login-brand__mark"><FontAwesomeIcon :icon="faPaw" /></span>
        <div>
          <strong>Mi <em>registro</em></strong>
          <small>Comé bien. Entrená. Sentite mejor.</small>
        </div>
      </header>

      <div class="cats-portrait">
        <img :src="base + 'auth/cats-login-hero-v2.png'" alt="Dorito, Felicia y Felipa juntos" />
      </div>

      <blockquote>“Un día a la vez.”</blockquote>
      <span class="story-heart" aria-hidden="true">♡</span>

      <div class="cat-intros">
        <article v-for="cat in cats" :key="cat.name" :class="cat.tone">
          <img :src="cat.image" alt="" />
          <div><strong>{{ cat.name }}</strong><p>{{ cat.message }}</p></div>
        </article>
      </div>
    </section>

    <section class="login-access">
      <div class="login-card">
        <div class="welcome-pill"><FontAwesomeIcon :icon="faPaw" /> Bienvenido <span aria-hidden="true"></span></div>
        <h1>Bienvenido de vuelta</h1>
        <p class="login-subtitle">Ingresá para continuar con tu registro.</p>

        <form novalidate @submit.prevent="submit">
          <label for="login-email">Email</label>
          <div class="login-input">
            <img class="login-input__cat-icon" :src="base + 'icons/login-email-cat.svg'" alt="" aria-hidden="true" />
            <input id="login-email" ref="emailInput" v-model.trim="email" type="email" autocomplete="email" placeholder="nombre@email.com" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'login-error' : undefined" />
          </div>

          <div class="password-row">
            <label for="login-password">Contraseña</label>
            <RouterLink to="/recuperar-contrasena">¿Olvidaste tu contraseña?</RouterLink>
          </div>
          <div class="login-input">
            <img class="login-input__cat-icon" :src="base + 'icons/login-password-cat.svg'" alt="" aria-hidden="true" />
            <input id="login-password" ref="passwordInput" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="••••••••" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'login-error' : undefined" />
            <button class="toggle-password" type="button" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword" @click="showPassword = !showPassword">
              <FontAwesomeIcon :icon="showPassword ? faEyeSlash : faEye" />
            </button>
          </div>

          <p v-if="error" id="login-error" class="login-error" role="alert">{{ error }}</p>

          <button class="login-submit" type="submit" :disabled="submitting">
            <FontAwesomeIcon :icon="faPaw" />
            <span>{{ submitting ? 'Ingresando…' : 'Iniciar sesión' }}</span>
          </button>
        </form>

        <div class="login-divider"><span></span><FontAwesomeIcon :icon="faPaw" /><span></span></div>
        <p class="signup-prompt">¿Todavía no tenés cuenta?</p>
        <RouterLink class="signup-button" to="/registro">
          <img :src="base + 'icons/nuevo-registro.svg'" alt="" aria-hidden="true" /> Crear cuenta
        </RouterLink>

        </div>
    </section>
  </div>
</template>

<style scoped>
.login-brand { position: relative; z-index: 2; display: flex; align-items: center; gap: 16px; width: min(520px, 100%); }
.login-brand strong { display: block; color: var(--cocoa-950); font: 800 clamp(30px, 3.4vw, 48px)/1 var(--font-display); letter-spacing: -.04em; }
.login-brand strong em { color: var(--dorito-500); font-style: normal; }
.login-brand small { display: block; margin-top: 10px; color: var(--cocoa-600); font-size: 16px; }
.cats-portrait::after { display: none; }
.cats-portrait img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: center;
  -webkit-mask-image:
    linear-gradient(to right, transparent 0, #000 13%, #000 87%, transparent 100%),
    linear-gradient(to bottom, transparent 0, #000 7%, #000 84%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to right, transparent 0, #000 13%, #000 87%, transparent 100%),
    linear-gradient(to bottom, transparent 0, #000 7%, #000 84%, transparent 100%);
  mask-composite: intersect;
}
blockquote { position: relative; z-index: 2; margin: -28px 0 0; color: var(--cocoa-950); font: 700 clamp(26px, 2.8vw, 39px) Georgia, serif; }
.story-heart { color: var(--dorito-500); font-size: 31px; line-height: 1; }
.cat-intros { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: min(650px, 100%); margin-top: 20px; }
.cat-intros article.dorito { border-color: var(--dorito-300); }.cat-intros article.felicia { border-color: #C6B77F; }.cat-intros article.felipa { border-color: #A8A29E; }
.cat-intros img { width: 58px; height: 62px; object-fit: contain; object-position: bottom; }
.cat-intros strong { color: var(--dorito-600); font: 800 15px var(--font-display); }.cat-intros .felicia strong { color: #6D653B; }.cat-intros .felipa strong { color: var(--felipa-600, #44403C); }
.cat-intros p { margin: 2px 0 0; color: var(--cocoa-700); font-size: 11px; line-height: 1.35; }
.decorative-paw { position: absolute; color: var(--dorito-200, #FFD09D); opacity: .25; }.paw-one { top: 18%; left: 5%; font-size: 56px; transform: rotate(-18deg); }.paw-two { top: 8%; right: 11%; font-size: 46px; transform: rotate(16deg); }.paw-three { top: 25%; right: 9%; font-size: 52px; transform: rotate(-10deg); }
.welcome-pill svg { color: var(--dorito-500); }
h1 { margin: 30px 0 10px; color: var(--cocoa-950); font: 800 clamp(34px, 3.5vw, 48px)/1.12 var(--font-display); letter-spacing: -.03em; }
.login-subtitle { margin: 0 0 36px; color: var(--cocoa-500); font-size: 18px; }
form > label { display: block; color: var(--cocoa-900); font-weight: 700; }
.password-row label { display: block; color: var(--cocoa-900); font-weight: 700; }
.login-input input { width: 100%; min-width: 0; border: 0; outline: 0; color: var(--cocoa-900); background: transparent; font-size: 17px; }
.login-input input::placeholder { color: var(--cocoa-500, #928075); opacity: 1; }
.login-input__cat-icon { width: 30px; height: 30px; margin-left: -4px; object-fit: contain; }
.password-row { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 16px; margin-top: 28px; }.password-row a { border: 0; color: var(--dorito-600); background: transparent; cursor: pointer; font-weight: 700; line-height: 1.45; text-decoration: none; }.toggle-password { border: 0; color: var(--cocoa-600, #756357); background: transparent; cursor: pointer; display: inline-grid; place-items: center; min-width: 44px; min-height: 44px; margin-right: -10px; padding: 8px; border-radius: 10px; }
.password-row a:focus-visible { outline: 3px solid var(--dorito-300); outline-offset: 3px; }.login-submit:disabled { opacity: .7; cursor: wait; }.login-submit span { grid-column: 2; }.login-submit svg { grid-column: 1; }
.login-divider { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 18px; margin: 42px 0 18px; color: var(--cream-400, #D5C3AC); }.login-divider span { height: 1px; background: var(--cream-300, #E8DCCB); }
.signup-prompt { margin: 0 0 18px; color: var(--cocoa-500); text-align: center; }
.signup-button img { width: 34px; height: 34px; object-fit: contain; }

@media (max-width: 1050px) {
  .login-page { grid-template-columns: 42% 58%; }.login-story { padding-inline: 24px; }.cat-intros { grid-template-columns: 1fr; max-width: 260px; }.cat-intros article { min-height: 72px; }.cats-portrait { margin-top: 38px; }.login-card { padding-inline: 48px; }
}
@media (max-width: 420px) {
  .login-story { padding-inline: 18px; }
  .login-access { padding-inline: 10px; }
  .login-card { padding: 30px 18px 24px; }
  .password-row { align-items: flex-start; }
  .password-row a { flex-basis: 100%; }
  .login-input { gap: 8px; padding-inline: 12px; }
}

/* Neo-brutalist identity surface: warm, explicit and easy to scan. */
.login-page { min-height: 100vh; display: grid; grid-template-columns: minmax(480px, 1fr) minmax(540px, 1fr); background: var(--cream-100); }
.login-story { position: relative; display: flex; flex-direction: column; align-items: center; overflow: hidden; min-height: 100vh; padding: clamp(52px, 7vh, 88px) clamp(34px, 5vw, 78px) 48px; border-right: 3px solid var(--cocoa-950); background: var(--sand-50); }
.login-brand__mark { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 14px; color: white; background: var(--dorito-500); box-shadow: 4px 4px 0 var(--cocoa-950); font-size: 32px; border: 3px solid var(--cocoa-950); }
.cats-portrait { position: relative; z-index: 1; width: min(720px, 112%); margin-top: clamp(22px, 4vh, 48px); filter: drop-shadow(6px 8px 0 rgba(48,39,32,.18)); }
.cat-intros article { display: grid; grid-template-columns: 58px 1fr; align-items: center; min-height: 92px; padding: 12px 15px 12px 8px; border: 2px solid var(--cocoa-800); border-radius: 12px; background: var(--cream-50); box-shadow: 3px 3px 0 var(--cocoa-800); }
.login-access { display: grid; place-items: center; min-height: 100vh; padding: 22px; background: var(--cream-100); }
.login-card { width: min(710px, 100%); min-height: min(92vh, 980px); display: flex; flex-direction: column; justify-content: center; padding: clamp(48px, 8vh, 100px) clamp(46px, 7vw, 90px); border: 3px solid var(--cocoa-950); border-radius: 12px; background: var(--cream-50); box-shadow: 6px 6px 0 var(--cocoa-950); backdrop-filter: none; }
.welcome-pill { align-self: flex-start; display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 18px; border: 2px solid var(--cocoa-950); border-radius: 9px; color: var(--cocoa-950); background: var(--dorito-100); font-weight: 700; box-shadow: 3px 3px 0 var(--cocoa-950); }
.login-input { display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; align-items: center; gap: 12px; min-height: 62px; margin-top: 11px; padding: 0 14px; border: 2px solid var(--cocoa-900); border-radius: 9px; color: var(--cocoa-600, #756357); background: var(--cream-50); box-shadow: none; transition: border-color .2s, box-shadow .2s, background-color .2s; }
.login-input:focus-within { border-color: var(--dorito-600); box-shadow: none; outline: 3px solid var(--dorito-300); outline-offset: 2px; }
.login-error { margin: 12px 0 0; color: var(--danger-700, #874033); font-size: 13px; padding: 9px 12px; border: 2px solid var(--danger-600); border-left-width: 6px; background: var(--danger-50, #fff0ec); font-weight: 700; }
.login-submit { width: 100%; min-height: 64px; border-radius: 9px; font-weight: 800; cursor: pointer; position: relative; display: grid; grid-template-columns: 30px 1fr 30px; align-items: center; margin-top: 34px; padding: 0 20px; border: 2px solid var(--cocoa-950); color: white; background: var(--dorito-500); box-shadow: 4px 4px 0 var(--cocoa-950); font-size: 18px; transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease; }
.signup-button { width: 100%; min-height: 64px; border-radius: 9px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; border: 2px solid var(--cocoa-950); color: var(--cocoa-950); background: var(--lavender-100, #ece8ff); font-size: 17px; text-decoration: none; box-shadow: 4px 4px 0 var(--cocoa-950); transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease; }
.login-submit:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--cocoa-950); }
.signup-button:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--cocoa-950); }
.login-submit:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
.signup-button:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
.toggle-password:focus-visible { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .login-submit { transition: none; } .signup-button { transition: none; }.login-submit:hover:not(:disabled) { transform: none; }.signup-button:hover { transform: none; } }
@media (max-width: 760px) {
  .login-page { display: block; background: var(--cream-100); }.login-brand { justify-content: center; }.login-brand__mark { width: 50px; height: 50px; border-radius: 14px; font-size: 24px; }.login-brand strong { font-size: 30px; }.login-brand small { margin-top: 5px; font-size: 12px; }.cats-portrait { width: min(450px, 100%); margin-top: 26px; }.cat-intros { display: none; }blockquote { display: none; }.story-heart { display: none; }.decorative-paw { display: none; }
  .login-access { min-height: auto; margin-top: -68px; padding: 0 16px 22px; background: transparent; }.login-card { min-height: 0; padding: 34px 24px 28px; border-radius: 26px; }.welcome-pill { min-height: 38px; padding: 0 14px; font-size: 13px; } h1 { margin-top: 22px; font-size: 31px; }.login-subtitle { margin-bottom: 28px; font-size: 15px; }.login-input { min-height: 58px; }.login-submit { min-height: 58px; }.signup-button { min-height: 58px; }.login-divider { margin-top: 30px; } .login-story { min-height: auto; padding: 30px 24px 95px; border: 0; border-right: 0; border-bottom: 3px solid var(--cocoa-950); } }
</style>
