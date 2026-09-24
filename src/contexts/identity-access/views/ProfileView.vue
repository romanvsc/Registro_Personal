<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash, faLock, faPaw, faUser } from '@fortawesome/free-solid-svg-icons'
import { sessionStore } from '../application/sessionStore'
import { PROFILE_AVATARS } from '../application/profileAvatarCatalog'
import ProfileAvatar from '../components/ProfileAvatar.vue'
import { pushToast } from '../../../shared/application/toastStore'
import { hasProfileChanges, snapshotProfileForm } from '../application/profileForm'
import ConfirmDialog from '../../../shared/components/ConfirmDialog.vue'

const router = useRouter()
const form = reactive({
  name: '',
  avatarKey: null,
  biography: '',
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
})
const saving = ref(false)
const error = ref('')
const showCurrentPassword = ref(false)
const showPassword = ref(false)
const showConfirmation = ref(false)
const passwordChangeEnabled = ref(false)
const baseline = ref(null)
const showDiscardDialog = ref(false)
const pendingRoute = ref(null)
const allowNavigation = ref(false)
const nameInput = ref(null)
const currentPasswordInput = ref(null)

const user = computed(() => sessionStore.user.value)
const previewUser = computed(() => ({ ...user.value, name: form.name, avatarKey: form.avatarKey }))
const biographyCount = computed(() => form.biography.length)
const isDirty = computed(() => hasProfileChanges(form, baseline.value, passwordChangeEnabled.value))

function hydrateFromUser(currentUser) {
  form.name = currentUser.name ?? ''
  form.avatarKey = currentUser.avatarKey ?? null
  form.biography = currentUser.biography ?? ''
  clearPasswords()
  passwordChangeEnabled.value = false
  baseline.value = snapshotProfileForm(form)
}

watch(user, currentUser => {
  if (!currentUser) return
  hydrateFromUser(currentUser)
}, { immediate: true })

function clearPasswords() {
  form.currentPassword = ''
  form.password = ''
  form.passwordConfirmation = ''
}

function togglePasswordChange() {
  passwordChangeEnabled.value = !passwordChangeEnabled.value
  if (!passwordChangeEnabled.value) clearPasswords()
}

async function focusProfileError() {
  await nextTick()
  const target = passwordChangeEnabled.value && form.currentPassword
    ? currentPasswordInput.value
    : nameInput.value
  target?.focus()
}

function cancelDiscard() {
  showDiscardDialog.value = false
  pendingRoute.value = null
}

async function discardChanges() {
  const destination = pendingRoute.value
  showDiscardDialog.value = false
  pendingRoute.value = null
  if (user.value) hydrateFromUser(user.value)
  if (!destination) return

  allowNavigation.value = true
  try {
    await router.push(destination.fullPath || destination.path || '/')
  } finally {
    allowNavigation.value = false
  }
}

onBeforeRouteLeave(to => {
  if (allowNavigation.value || !isDirty.value) return true
  pendingRoute.value = to
  showDiscardDialog.value = true
  return false
})

async function submit() {
  if (saving.value) return
  error.value = ''
  saving.value = true

  try {
    await sessionStore.updateProfile({
      name: form.name.trim(),
      avatarKey: form.avatarKey,
      biography: form.biography.trim(),
      currentPassword: form.currentPassword,
      password: form.password,
      passwordConfirmation: form.passwordConfirmation,
    })
    clearPasswords()
    passwordChangeEnabled.value = false
    baseline.value = snapshotProfileForm(form)
    pushToast({ type: 'success', message: 'Perfil actualizado', duration: 3000 })
  } catch (requestError) {
    error.value = typeof requestError?.message === 'string' && requestError.message.trim()
      ? requestError.message.trim()
      : 'Ocurrió un problema. Intentá nuevamente.'
    await focusProfileError()
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="page profile-page">
    <header class="page-header">
      <div><p class="eyebrow">TU ESPACIO</p><h1>Mi perfil</h1><p>Elegí cómo querés verte y mantené tus datos al día.</p></div>
    </header>

    <form class="profile-form" novalidate @submit.prevent="submit">
      <section class="profile-card profile-overview" aria-labelledby="profile-overview-title">
        <div class="profile-overview__avatar"><ProfileAvatar :user="previewUser" size="xl" /></div>
        <div><p class="eyebrow">VISTA PREVIA</p><h2 id="profile-overview-title">{{ form.name.trim() || 'Tu nombre' }}</h2><p>{{ user?.email }}</p></div>
      </section>

      <section class="profile-card" aria-labelledby="personal-data-title">
        <div class="profile-section-heading"><span><FontAwesomeIcon :icon="faUser" /></span><div><h2 id="personal-data-title">Datos personales</h2><p>Tu correo identifica la cuenta y no puede modificarse desde aquí.</p></div></div>
        <div class="profile-fields">
          <label for="profile-name"><span>Nombre</span><input id="profile-name" ref="nameInput" v-model="form.name" name="name" type="text" autocomplete="name" maxlength="120" required :aria-invalid="Boolean(error)" :aria-describedby="error ? 'profile-error' : undefined" /></label>
          <label for="profile-email"><span>Correo electrónico</span><input id="profile-email" :value="user?.email || ''" name="email" type="email" autocomplete="email" readonly /></label>
          <label class="profile-fields__wide" for="profile-biography"><span>Sobre vos <small>Opcional</small></span><textarea id="profile-biography" v-model="form.biography" name="biography" rows="4" maxlength="500" placeholder="Contá algo que quieras recordar sobre tu proceso…" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'profile-error profile-biography-count' : 'profile-biography-count'"></textarea><small id="profile-biography-count" class="character-count">{{ biographyCount }}/500</small></label>
        </div>
      </section>

      <fieldset class="profile-card avatar-picker">
        <legend>Elegí tu avatar</legend>
        <p>Los tres gatitos también pueden acompañarte desde tu perfil.</p>
        <div class="avatar-grid">
          <label v-for="avatar in PROFILE_AVATARS" :key="avatar.key" :class="{ selected: form.avatarKey === avatar.key }">
            <input v-model="form.avatarKey" type="radio" name="avatarKey" :value="avatar.key" />
            <ProfileAvatar :avatar-key="avatar.key" :name="avatar.label" size="lg" decorative />
            <span class="avatar-grid__label">{{ avatar.label }}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5.2 10.2 3 3 6.7-6.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"/></svg>
          </label>
        </div>
      </fieldset>

      <section class="profile-card" aria-labelledby="security-title">
        <div class="profile-section-heading profile-section-heading--security"><span><FontAwesomeIcon :icon="faLock" /></span><div><h2 id="security-title">Cambiar contraseña <small>Opcional</small></h2><p>Activá esta sección únicamente cuando quieras elegir una contraseña nueva.</p></div><button type="button" :aria-expanded="passwordChangeEnabled" aria-controls="profile-password-fields" @click="togglePasswordChange">{{ passwordChangeEnabled ? 'Cancelar cambio' : 'Cambiar contraseña' }}</button></div>
        <div v-if="passwordChangeEnabled" id="profile-password-fields" class="password-grid">
          <label for="current-password"><span>Contraseña actual</span><div class="password-input"><input id="current-password" v-model="form.currentPassword" name="currentPassword" :type="showCurrentPassword ? 'text' : 'password'" autocomplete="current-password" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'profile-error' : undefined" /><button type="button" :aria-label="showCurrentPassword ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'" :aria-pressed="showCurrentPassword" @click="showCurrentPassword = !showCurrentPassword"><FontAwesomeIcon :icon="showCurrentPassword ? faEyeSlash : faEye" /></button></div></label>
          <label for="new-password"><span>Nueva contraseña</span><div class="password-input"><input id="new-password" v-model="form.password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" placeholder="Mínimo 8 caracteres" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'profile-error' : undefined" /><button type="button" :aria-label="showPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'" :aria-pressed="showPassword" @click="showPassword = !showPassword"><FontAwesomeIcon :icon="showPassword ? faEyeSlash : faEye" /></button></div></label>
          <label for="password-confirmation"><span>Confirmar contraseña</span><div class="password-input"><input id="password-confirmation" v-model="form.passwordConfirmation" name="passwordConfirmation" :type="showConfirmation ? 'text' : 'password'" autocomplete="new-password" minlength="8" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'profile-error' : undefined" /><button type="button" :aria-label="showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'" :aria-pressed="showConfirmation" @click="showConfirmation = !showConfirmation"><FontAwesomeIcon :icon="showConfirmation ? faEyeSlash : faEye" /></button></div></label>
        </div>
      </section>

      <p v-if="error" id="profile-error" class="form-error" role="alert">{{ error }}</p>
      <div class="profile-actions"><RouterLink class="ghost-button" to="/">Cancelar</RouterLink><button class="primary-button" type="submit" :disabled="saving"><FontAwesomeIcon :icon="faPaw" aria-hidden="true" />{{ saving ? 'Guardando…' : 'Guardar cambios' }}</button></div>
    </form>
    <ConfirmDialog
      v-if="showDiscardDialog"
      title="¿Descartar cambios?"
      message="Hay cambios sin guardar en tu perfil. Podés seguir editando o descartarlos antes de salir."
      cancel-label="Seguir editando"
      confirm-label="Descartar cambios"
      @confirm="discardChanges"
      @cancel="cancelDiscard"
    />
  </div>
</template>

<style scoped>
.profile-page { max-width: 1080px; }
.profile-form { display: grid; gap: 20px; }
.profile-card { min-width: 0; padding: 26px; border: 1px solid var(--sand-200); border-radius: 22px; background: var(--cream-50); box-shadow: var(--shadow-soft); }
.profile-overview { display: flex; align-items: center; gap: 24px; overflow: hidden; background: radial-gradient(circle at 82% 12%, var(--dorito-100), transparent 34%), var(--dorito-50); }
.profile-overview__avatar { padding: 6px; border-radius: 50%; background: rgba(255,255,255,.72); box-shadow: 0 8px 24px rgba(76,61,47,.12); }
.profile-overview h2 { margin: 3px 0 4px; color: var(--cocoa-950); font: 800 28px/1.15 Nunito; }.profile-overview p:last-child { margin: 0; color: var(--cocoa-700); }
.profile-section-heading { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 22px; }.profile-section-heading > span { display: grid; place-items: center; width: 42px; height: 42px; flex: none; border-radius: 12px; color: var(--dorito-600); background: var(--dorito-50); }.profile-section-heading h2, .avatar-picker legend { margin: 0; color: var(--cocoa-950); font: 800 20px/1.2 Nunito; }.profile-section-heading h2 small { color: var(--cocoa-600); font-size: 12px; font-weight: 600; }.profile-section-heading p, .avatar-picker > p { margin: 5px 0 0; color: var(--cocoa-700); font-size: 13.5px; line-height: 1.45; }
.profile-section-heading--security { align-items: center; margin-bottom: 0; }.profile-section-heading--security > div { min-width: 0; flex: 1; }.profile-section-heading--security > button { min-height: 44px; padding: 0 14px; border: 1px solid var(--dorito-300); border-radius: 11px; color: var(--dorito-700); background: var(--dorito-50); font-weight: 800; cursor: pointer; }.profile-section-heading--security > button:hover, .profile-section-heading--security > button:focus-visible { border-color: var(--dorito-500); background: var(--dorito-100); }
.profile-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }.profile-fields__wide { grid-column: 1 / -1; }.profile-fields label > span, .password-grid label > span { display: block; margin-bottom: 7px; color: var(--cocoa-800); font-size: 13px; font-weight: 700; }.profile-fields label > span small { color: var(--cocoa-600); font-weight: 500; }
.profile-fields input, .profile-fields textarea, .password-input { width: 100%; border: 1px solid var(--sand-300); border-radius: 11px; color: var(--cocoa-900); background: white; font-size: 15px; }.profile-fields input { min-height: 48px; padding: 0 13px; }.profile-fields input[readonly] { color: var(--cocoa-600); background: var(--sand-50); }.profile-fields textarea { padding: 12px 13px; resize: vertical; line-height: 1.5; }.profile-fields :is(input, textarea):focus, .password-input:focus-within { border-color: var(--dorito-400); outline: 3px solid rgba(217,120,34,.13); outline-offset: 1px; }.character-count { display: block; margin-top: 6px; color: var(--cocoa-600); font-size: 12px; text-align: right; }
.avatar-picker { margin: 0; padding-top: 20px; }.avatar-picker legend { margin-left: 8px; padding: 0 10px; border-radius: 8px; background: var(--cream-50); }.avatar-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }.avatar-grid label { position: relative; display: flex; flex-direction: column; align-items: center; gap: 9px; min-width: 0; padding: 13px 8px 11px; border: 1px solid var(--sand-200); border-radius: 16px; background: var(--sand-50); cursor: pointer; transition: border-color .18s ease, background-color .18s ease, transform .18s ease; }.avatar-grid label:hover { border-color: var(--dorito-300); transform: translateY(-2px); }.avatar-grid label.selected { border-color: var(--dorito-500); background: var(--dorito-50); box-shadow: 0 0 0 2px rgba(217,120,34,.12); }.avatar-grid input { position: absolute; width: 1px; height: 1px; opacity: 0; }.avatar-grid label:has(input:focus-visible) { outline: 3px solid rgba(217,120,34,.3); outline-offset: 2px; }.avatar-grid__label { overflow: hidden; width: 100%; color: var(--cocoa-800); font-size: 11.5px; font-weight: 700; text-align: center; text-overflow: ellipsis; white-space: nowrap; }.avatar-grid label > svg { position: absolute; top: 7px; right: 7px; width: 22px; height: 22px; padding: 3px; border-radius: 50%; color: white; background: var(--dorito-500); opacity: 0; transform: scale(.8); transition: opacity .18s ease, transform .18s ease; }.avatar-grid label.selected > svg { opacity: 1; transform: scale(1); }
.password-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 22px; }.password-input { display: grid; grid-template-columns: minmax(0, 1fr) 44px; align-items: center; min-height: 48px; }.password-input input { min-width: 0; width: 100%; padding: 0 0 0 13px; border: 0; outline: 0; color: var(--cocoa-900); background: transparent; font-size: 15px; }.password-input button { display: grid; place-items: center; width: 44px; height: 44px; border: 0; border-radius: 9px; color: var(--cocoa-600); background: transparent; cursor: pointer; }.password-input button:hover { color: var(--dorito-600); background: var(--dorito-50); }
.profile-actions { position: sticky; bottom: 14px; z-index: 4; display: flex; justify-content: flex-end; gap: 12px; padding: 12px; border: 1px solid rgba(229,219,207,.9); border-radius: 16px; background: rgba(255,252,247,.92); box-shadow: var(--shadow-float); backdrop-filter: blur(10px); }
@media (max-width: 900px) { .avatar-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }.password-grid { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .profile-card { padding: 20px 16px; border-radius: 18px; }.profile-overview { gap: 16px; }.profile-overview :deep(.profile-avatar--xl) { --avatar-size: 88px; }.profile-overview h2 { font-size: 23px; }.profile-fields { grid-template-columns: 1fr; }.profile-fields__wide { grid-column: 1; }.avatar-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }.profile-section-heading--security { align-items: flex-start; flex-wrap: wrap; }.profile-section-heading--security > button { width: 100%; }.profile-actions { justify-content: stretch; bottom: 10px; }.profile-actions > * { flex: 1; padding-inline: 10px; } }
@media (prefers-reduced-motion: reduce) { .avatar-grid label, .avatar-grid label > svg { transition: none; }.avatar-grid label:hover { transform: none; } }

/* Neo-brutalist profile: visible structure without changing the form contract. */
.profile-card { border: 2px solid var(--cocoa-950); border-radius: 10px; background: var(--cream-50); box-shadow: 4px 4px 0 var(--cocoa-950); }
.profile-overview { border-color: var(--cocoa-950); background: var(--dorito-100); }
.profile-overview__avatar { border: 2px solid var(--cocoa-950); background: var(--cream-50); box-shadow: 3px 3px 0 var(--cocoa-950); }
.profile-section-heading > span { border: 2px solid var(--cocoa-950); border-radius: 8px; color: var(--cocoa-950); background: var(--lavender-100, #ece8ff); }
.profile-section-heading--security > button { border: 2px solid var(--cocoa-950); border-radius: 8px; color: var(--cocoa-950); background: var(--sage-100, #e4f0e3); box-shadow: 3px 3px 0 var(--cocoa-950); }
.profile-section-heading--security > button:hover, .profile-section-heading--security > button:focus-visible { border-color: var(--cocoa-950); background: var(--sage-200, #d4e8d2); }
.profile-fields input, .profile-fields textarea, .password-input { border: 2px solid var(--cocoa-900); border-radius: 8px; background: var(--cream-50); }
.profile-fields input[readonly] { background: var(--sand-100, #f3e9da); }
.profile-fields :is(input, textarea):focus, .password-input:focus-within { border-color: var(--dorito-600); outline: 3px solid var(--dorito-300); outline-offset: 2px; }
.avatar-picker legend { border: 2px solid var(--cocoa-950); border-radius: 7px; background: var(--cream-50); }
.avatar-grid label { border: 2px solid var(--cocoa-900); border-radius: 9px; background: var(--sand-50); box-shadow: 3px 3px 0 var(--cocoa-900); transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease; }
.avatar-grid label:hover { border-color: var(--cocoa-950); transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--cocoa-950); }
.avatar-grid label.selected { border-color: var(--cocoa-950); background: var(--dorito-100); box-shadow: 3px 3px 0 var(--cocoa-950); }
.avatar-grid label:has(input:focus-visible) { outline: 3px solid var(--dorito-600); outline-offset: 3px; }
.avatar-grid label > svg { border: 2px solid var(--cocoa-950); color: var(--cocoa-950); background: var(--dorito-300); }
.password-input button:hover, .password-input button:focus-visible { color: var(--cocoa-950); background: var(--lavender-100, #ece8ff); }
.profile-actions { border: 2px solid var(--cocoa-950); border-radius: 10px; background: var(--cream-50); box-shadow: 4px 4px 0 var(--cocoa-950); backdrop-filter: none; }
.profile-actions .ghost-button, .profile-actions .primary-button { border: 2px solid var(--cocoa-950); border-radius: 8px; box-shadow: 3px 3px 0 var(--cocoa-950); transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease; }
.profile-actions .ghost-button { color: var(--cocoa-950); background: var(--lavender-100, #ece8ff); }
.profile-actions .primary-button { background: var(--dorito-500); }
.profile-actions .ghost-button:hover, .profile-actions .primary-button:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--cocoa-950); }
.form-error { padding: 9px 12px; border: 2px solid var(--danger-600); border-left-width: 6px; color: var(--danger-700, #874033); background: var(--danger-50, #fff0ec); font-weight: 700; }
@media (prefers-reduced-motion: reduce) { .avatar-grid label, .profile-actions .ghost-button, .profile-actions .primary-button { transition: none; }.avatar-grid label:hover, .profile-actions .ghost-button:hover, .profile-actions .primary-button:hover:not(:disabled) { transform: none; } }
</style>
