<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { addEntry, catFor, editEntry, entryTypes, journalError, loadEntry, loadJournal } from '../lib/entries'
import { pushToast } from '../shared/application/toastStore'
import ConfirmDialog from '../shared/components/ConfirmDialog.vue'
import {
  cloneDraft,
  hasDiscardableValues,
  hasDraftChanges,
  sanitizeValuesForType,
} from '../contexts/personal-journal/application/journalDraft'

const route = useRoute()
const router = useRouter()
const editingId = ref(null)
const type = ref('')
const score = ref(null)
const title = ref('')
const notes = ref('')
const occurredAt = ref('')
const values = reactive({})
const saving = ref(false)
const loading = ref(false)
const saveAttempted = ref(false)
const scoreInput = ref(null)
const initialDraft = ref(null)
const discardDialog = ref(null)
const pendingType = ref('')
const pendingNavigationResolve = ref(null)
const allowNavigation = ref(false)
// En un registro nuevo priorizamos la captura rápida. Al editar, los detalles
// quedan visibles para que ningún dato existente quede oculto.
const detailsOpen = ref(false)
const selectedType = computed(() => entryTypes.value.find(item => item.slug === type.value) || entryTypes.value[0])
const hasScore = computed(() => Number.isInteger(score.value) && score.value >= 1 && score.value <= 10)
const cat = computed(() => hasScore.value ? catFor(score.value) : null)
const scoreDescription = computed(() => {
  if (!hasScore.value) return 'Elegí una sensación del 1 al 10'
  if (score.value <= 3) return `${score.value} de 10, te acompaña Felipa`
  if (score.value <= 7) return `${score.value} de 10, te acompaña Felicia`
  return `${score.value} de 10, te acompaña Dorito`
})

const currentDraft = computed(() => ({
  type: type.value,
  score: score.value,
  title: title.value,
  notes: notes.value,
  occurredAt: occurredAt.value,
  values: { ...values },
}))
const hasUnsavedChanges = computed(() => initialDraft.value !== null && hasDraftChanges(currentDraft.value, initialDraft.value))

function setInitialDraft() {
  initialDraft.value = cloneDraft(currentDraft.value)
  saveAttempted.value = false
}

function clearDynamicValues(typeDefinition) {
  const sanitized = sanitizeValuesForType(values, typeDefinition)
  Object.keys(values).forEach(key => delete values[key])
  Object.assign(values, sanitized)
}

function changeType(nextType) {
  const nextDefinition = entryTypes.value.find(item => item.slug === nextType)
  if (!nextDefinition || nextType === type.value) return
  if (hasDiscardableValues(values, nextDefinition)) {
    pendingType.value = nextType
    discardDialog.value = 'type'
    return
  }
  type.value = nextType
  clearDynamicValues(nextDefinition)
  saveAttempted.value = false
}

function finishTypeChange() {
  const nextDefinition = entryTypes.value.find(item => item.slug === pendingType.value)
  if (!nextDefinition) return
  type.value = pendingType.value
  clearDynamicValues(nextDefinition)
  pendingType.value = ''
  discardDialog.value = null
  saveAttempted.value = false
}

function requestNavigation(resolve, nextRoute = null) {
  if (!hasUnsavedChanges.value || allowNavigation.value) {
    resolve(true)
    return
  }
  if (nextRoute?.params?.type && nextRoute.params.type !== route.params.type) {
    pendingType.value = String(nextRoute.params.type)
    const nextDefinition = entryTypes.value.find(item => item.slug === nextRoute.params.type)
    if (nextDefinition && hasDiscardableValues(values, nextDefinition)) {
      pendingType.value = String(nextRoute.params.type)
      discardDialog.value = 'route-type'
      pendingNavigationResolve.value = resolve
      return
    }
  }
  discardDialog.value = 'leave'
  pendingNavigationResolve.value = resolve
}

function confirmDiscard() {
  const mode = discardDialog.value
  const resolve = pendingNavigationResolve.value
  pendingNavigationResolve.value = null
  if (mode === 'type') finishTypeChange()
  if (mode === 'route-type') {
    const nextDefinition = entryTypes.value.find(item => item.slug === pendingType.value)
    clearDynamicValues(nextDefinition)
    type.value = pendingType.value
    pendingType.value = ''
    discardDialog.value = null
  } else if (mode === 'leave') {
    if (pendingType.value) type.value = pendingType.value
    pendingType.value = ''
    discardDialog.value = null
  }
  if (resolve) {
    allowNavigation.value = true
    resolve(true)
  }
}

function cancelDiscard() {
  const resolve = pendingNavigationResolve.value
  pendingNavigationResolve.value = null
  pendingType.value = ''
  discardDialog.value = null
  resolve?.(false)
}

function getErrorMessage(error) {
  const message = error instanceof Error ? error.message.trim() : ''
  if (message && !['undefined', 'null', '[object Object]'].includes(message)) return message
  return 'Ocurrió un problema. Intentá nuevamente.'
}

function toDatetimeLocal(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = n => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function selectRouteType() {
  const requested = String(route.params.type || '')
  type.value = entryTypes.value.some(item => item.slug === requested) ? requested : (entryTypes.value[0]?.slug || '')
}

function selectTypeFromKeyboard(event) {
  const tabs = [...event.currentTarget.parentElement.querySelectorAll('[role="tab"]')]
  const currentIndex = tabs.indexOf(event.currentTarget)
  let nextIndex = currentIndex

  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length
  else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = tabs.length - 1
  else return

  event.preventDefault()
  const nextType = entryTypes.value[nextIndex]
  if (nextType) changeType(nextType.slug)
  tabs[nextIndex]?.focus()
}

async function prefillFromEntry(entry) {
  editingId.value = entry.id
  detailsOpen.value = true
  if (entryTypes.value.some(item => item.slug === entry.type)) {
    type.value = entry.type
  }
  title.value = entry.title || ''
  notes.value = entry.detail || ''
  const existingScore = Number(entry.score)
  score.value = Number.isFinite(existingScore) && existingScore >= 1 && existingScore <= 10 ? existingScore : null
  occurredAt.value = toDatetimeLocal(entry.occurredAt) || toDatetimeLocal(new Date())
  Object.keys(values).forEach(key => delete values[key])
  if (entry.values && typeof entry.values === 'object') {
    const typeDefinition = entryTypes.value.find(item => item.slug === entry.type)
    const knownKeys = new Set((typeDefinition?.fields || []).map(field => field.key))
    Object.entries(entry.values).forEach(([key, value]) => {
      if (knownKeys.has(key)) values[key] = value
    })
  }
  setInitialDraft()
}

onMounted(async () => {
  loading.value = true
  try {
    await loadJournal()
    const id = route.params.id
    if (id) {
      const entry = await loadEntry(Number(id))
      await prefillFromEntry(entry)
    } else {
      selectRouteType()
      occurredAt.value = toDatetimeLocal(new Date())
      detailsOpen.value = false
      setInitialDraft()
    }
  } finally {
    loading.value = false
  }
})
watch(() => route.params.id, (id) => {
  editingId.value = null
  detailsOpen.value = Boolean(id)
  if (!id) {
    score.value = null
    title.value = ''
    notes.value = ''
    occurredAt.value = toDatetimeLocal(new Date())
    Object.keys(values).forEach(key => delete values[key])
    setInitialDraft()
  }
  if (id) loadEntry(Number(id)).then(prefillFromEntry)
})
watch(() => route.params.type, (t) => {
  if (!editingId.value && !allowNavigation.value) selectRouteType()
  allowNavigation.value = false
})

onBeforeRouteLeave((_to, _from, next) => requestNavigation(next))
onBeforeRouteUpdate((to, _from, next) => requestNavigation(next, to))

function fieldId(field) {
  return `record-field-${field.key}`
}

function fieldIsInvalid(field) {
  const value = values[field.key]
  return saveAttempted.value && field.required && (value === undefined || value === null || value === '')
}

async function validateForm() {
  saveAttempted.value = true
  if (!hasScore.value) {
    pushToast({
      type: 'error',
      message: 'Elegí una sensación del 1 al 10 antes de guardar.',
      duration: 5000,
    })
    await nextTick()
    scoreInput.value?.focus()
    return false
  }
  const missingField = selectedType.value?.fields.find(field => fieldIsInvalid(field))
  if (missingField) {
    pushToast({
      type: 'error',
      message: `Completá el campo "${missingField.label}" para guardar.`,
      duration: 5000,
    })
    await nextTick()
    document.getElementById(fieldId(missingField))?.focus()
    return false
  }
  return true
}

async function save() {
  if (!selectedType.value) return
  if (!(await validateForm())) return
  if (!hasScore.value) {
    pushToast({
      type: 'error',
      message: 'Elegí una sensación del 1 al 10 antes de guardar.',
      duration: 5000,
    })
    return
  }
  saving.value = true
  try {
    const payload = {
      type: type.value,
      title: title.value.trim() || selectedType.value.name,
      notes: notes.value,
      score: score.value,
      values,
      occurredAt: occurredAt.value,
    }
    if (editingId.value) {
      await editEntry(editingId.value, payload)
    } else {
      await addEntry(payload)
    }
    pushToast({
      type: 'success',
      message: editingId.value ? 'Registro actualizado.' : 'Registro creado.',
      duration: 3000,
    })
    initialDraft.value = null
    allowNavigation.value = true
    router.push('/historial')
  } catch (error) {
    pushToast({
      type: 'error',
      message: getErrorMessage(error),
      duration: 5000,
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="page form-page">
    <header class="page-header"><div><p class="eyebrow">{{ editingId ? 'EDITAR MOMENTO' : 'NUEVO MOMENTO' }}</p><h1>{{ editingId ? `Editar ${selectedType?.name?.toLowerCase() || 'registro'}` : `Registrar ${selectedType?.name?.toLowerCase() || 'momento'}` }}</h1><p>Sin juicios ni objetivos perfectos. Sólo cómo fue para vos.</p></div></header>
    <div v-if="loading" class="record-form record-form--loading" role="status" aria-live="polite" aria-busy="true">
      <p>Cargando registro…</p>
      <div class="form-skeleton" aria-hidden="true">
        <span class="form-skeleton__tabs"></span>
        <span class="form-skeleton__panel"></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <form v-else-if="selectedType" class="record-form" novalidate @submit.prevent="save">
      <p v-if="journalError" id="journal-form-error" class="form-error" role="alert">{{ journalError }}</p>
      <div class="type-tabs" role="tablist" aria-label="Tipo de registro">
        <button
          v-for="item in entryTypes"
          :id="`type-tab-${item.slug}`"
          :key="item.slug"
          type="button"
          role="tab"
          :aria-selected="type === item.slug"
          aria-controls="record-type-panel"
          :tabindex="type === item.slug ? 0 : -1"
          :class="{ active: type === item.slug }"
          @click="changeType(item.slug)"
          @keydown="selectTypeFromKeyboard"
        >{{ item.name }}</button>
      </div>
      <div id="record-type-panel" class="score-panel" role="tabpanel" :aria-labelledby="`type-tab-${type}`">
        <div v-if="cat" class="score-panel__copy"><p class="eyebrow">¿CÓMO TE SENTISTE?</p><h2>{{ cat.name }} te acompaña</h2><p>{{ score <= 3 ? 'Hoy costó, y está bien.' : score <= 7 ? 'Tomalo con calma y escuchá tu cuerpo.' : '¡Qué lindo verte así!' }}</p></div>
        <div v-else class="score-panel__copy score-panel__copy--empty"><p class="eyebrow">¿CÓMO TE SENTISTE?</p><h2>¿Cómo te sentiste?</h2><p>Elegí una sensación del 1 al 10.</p></div>
        <Transition name="mood-swap" mode="out-in">
          <div v-if="cat" :key="cat.name" class="score-panel__visual">
            <img :src="cat.image" :alt="`${cat.name}, representación de tu sensación`" />
            <output aria-live="polite">{{ score }}<small>/10</small></output>
          </div>
          <div v-else key="empty" class="score-panel__visual score-panel__visual--empty">
            <output aria-live="polite">—<small>/10</small></output>
          </div>
        </Transition>
      </div>
      <label class="range-label" :class="{ 'range-label--empty': !hasScore }"><span><b>1</b> Felipa</span><input ref="scoreInput" :value="score ?? 1" type="range" min="1" max="10" :aria-invalid="saveAttempted && !hasScore" :aria-describedby="!hasScore ? 'score-help' : undefined" :aria-valuenow="hasScore ? score : undefined" :aria-valuetext="scoreDescription" @input="score = Number($event.target.value)" /><span>Dorito <b>10</b></span></label>
      <p v-if="!hasScore" class="range-empty-hint">Elegí una sensación para poder guardar.</p>
      <span id="score-help" class="visually-hidden">Elegí una sensación del 1 al 10 antes de guardar.</span>
      <Transition name="form-content" mode="out-in">
        <div :key="selectedType.slug" class="form-grid quick-fields">
          <label v-for="field in selectedType.fields" :key="field.key" :for="fieldId(field)"><span>{{ field.label }}</span>
            <textarea v-if="field.inputType === 'textarea'" :id="fieldId(field)" v-model="values[field.key]" :required="field.required" :aria-invalid="fieldIsInvalid(field)" :aria-describedby="fieldIsInvalid(field) ? `${fieldId(field)}-error` : undefined" rows="3"></textarea>
            <select v-else-if="field.inputType === 'select'" :id="fieldId(field)" v-model="values[field.key]" :required="field.required" :aria-invalid="fieldIsInvalid(field)" :aria-describedby="fieldIsInvalid(field) ? `${fieldId(field)}-error` : undefined"><option value="">Seleccionar</option><option v-for="option in field.options" :key="option" :value="option">{{ option }}</option></select>
            <input v-else :id="fieldId(field)" v-model="values[field.key]" :type="field.inputType" :required="field.required" :aria-invalid="fieldIsInvalid(field)" :aria-describedby="fieldIsInvalid(field) ? `${fieldId(field)}-error` : undefined" />
            <span v-if="fieldIsInvalid(field)" :id="`${fieldId(field)}-error`" class="field-error" role="alert">Este campo es obligatorio.</span>
          </label>
        </div>
      </Transition>
      <div class="form-actions form-actions--quick"><RouterLink to="/historial">Cancelar</RouterLink><button class="primary-button" type="submit" :disabled="saving">{{ saving ? 'Guardando…' : (editingId ? 'Guardar cambios' : 'Guardar registro') }}</button></div>
      <details class="optional-details" :open="detailsOpen" @toggle="detailsOpen = $event.target.open">
        <summary>
          <span><b>Más detalles</b><small>Podés completarlos ahora o después.</small></span>
          <span class="optional-details__chevron" aria-hidden="true">⌄</span>
        </summary>
        <div class="form-grid optional-details__body">
          <label><span>Título personalizado <small>(opcional)</small></span><input v-model="title" :placeholder="selectedType.name" /></label>
          <label><span>Fecha y hora</span><input v-model="occurredAt" type="datetime-local" /></label>
          <label class="optional-details__notes"><span>Notas <small>(opcional)</small></span><textarea v-model="notes" rows="4" placeholder="Contá un poco más, si querés..."></textarea></label>
        </div>
      </details>
    </form>
    <ConfirmDialog
      v-if="discardDialog"
      :title="discardDialog === 'type' || discardDialog === 'route-type' ? '¿Descartar respuestas?' : '¿Descartar cambios?'"
      :message="discardDialog === 'type' || discardDialog === 'route-type'
        ? 'Al cambiar el tipo se quitarán las respuestas que no corresponden al nuevo registro.'
        : 'Tenés cambios sin guardar. Si salís ahora, se perderán.'"
      cancel-label="Seguir editando"
      :confirm-label="discardDialog === 'type' || discardDialog === 'route-type' ? 'Descartar respuestas' : 'Descartar cambios'"
      @confirm="confirmDiscard"
      @cancel="cancelDiscard"
    />
  </div>
</template>

<style scoped>
.record-form--loading > p {
  margin: 0 0 18px;
  color: var(--cocoa-700);
  font-size: 14px;
  font-weight: 700;
}

.form-skeleton {
  display: grid;
  gap: 18px;
}

.form-skeleton span {
  display: block;
  min-height: 48px;
  border-radius: 12px;
  background: linear-gradient(100deg, var(--sand-100) 20%, var(--cream-50) 40%, var(--sand-100) 60%);
  background-size: 220% 100%;
  animation: form-shimmer 1.25s ease-in-out infinite;
}

.form-skeleton__tabs {
  min-height: 54px !important;
}

.form-skeleton__panel {
  min-height: 180px !important;
  border-radius: 20px !important;
}

@keyframes form-shimmer {
  to { background-position-x: -220%; }
}

.score-panel__copy {
  min-width: 0;
}

.score-panel__copy--empty h2 {
  margin-top: 8px;
}

.score-panel__visual {
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 12px;
}

.score-panel__visual--empty {
  justify-content: center;
}

.score-panel__visual--empty output {
  color: var(--cocoa-500);
  font-size: 42px;
}

.range-label--empty input {
  accent-color: var(--theme-secondary);
}

.range-label--empty input::-webkit-slider-thumb {
  visibility: hidden;
}

.range-label--empty input::-moz-range-thumb {
  visibility: hidden;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.field-error {
  display: block;
  margin-top: 5px;
  color: var(--danger-600);
  font-size: 12px;
  font-weight: 700;
}

.range-empty-hint {
  margin: -14px 0 18px;
  color: var(--cocoa-600);
  font-size: 13px;
  font-weight: 700;
}

.form-grid label > span small {
  color: var(--cocoa-500);
  font-size: 12px;
  font-weight: 600;
}

.optional-details summary small {
  color: var(--cocoa-500);
  font-size: 12px;
  font-weight: 600;
}

.optional-details summary::-webkit-details-marker {
  display: none;
}

.optional-details summary > span:first-child {
  display: grid;
  gap: 2px;
}

.optional-details__chevron {
  color: var(--theme-secondary);
  font-size: 24px;
  line-height: 1;
  transition: transform .18s ease;
}

.optional-details[open] .optional-details__chevron {
  transform: rotate(180deg);
}

.optional-details__body {
  padding: 0 16px 16px;
  animation: details-reveal .18s ease both;
}

.optional-details__notes {
  grid-column: 1 / -1;
}

@keyframes details-reveal {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.mood-swap-enter-active {
  transition: opacity .18s ease, transform .18s ease;
}

.mood-swap-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}

.form-content-enter-active {
  transition: opacity .18s ease, transform .18s ease;
}

.form-content-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}

.mood-swap-enter-from {
  opacity: 0;
  transform: translateX(8px) scale(.98);
}

.mood-swap-leave-to {
  opacity: 0;
  transform: translateX(8px) scale(.98);
}

.form-content-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.form-content-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* PersonalJournal: neobrutalismo amable. La composición mantiene el foco en
   la puntuación y convierte cada respuesta en un bloque fácil de escanear. */
.form-page .page-header {
  max-width: 900px;
  margin-inline: auto;
  padding-left: 18px;
  border-left: 6px solid var(--theme-accent);
}

.form-page .page-header h1 {
  color: var(--cocoa-950);
  letter-spacing: -0.03em;
}

.form-page .page-header .eyebrow {
  color: var(--theme-detail) !important;
}

.record-form {
  max-width: 900px;
  padding: 30px;
  border: 3px solid var(--theme-secondary);
  border-radius: 12px;
  background: var(--neo-paper);
  box-shadow: 6px 6px 0 var(--theme-secondary);
}

.record-form--loading {
  min-height: 520px;
  box-shadow: 6px 6px 0 var(--theme-secondary);
}

.record-form > .form-error {
  border: 2px solid var(--danger-700);
  border-left-width: 7px;
  border-radius: 8px;
  box-shadow: 3px 3px 0 var(--danger-700);
}

.type-tabs {
  display: flex;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  gap: 10px;
  margin-bottom: 28px;
  padding: 5px;
  border: 2px solid var(--theme-secondary);
  border-radius: 8px;
  background: var(--theme-soft);
}

.type-tabs button {
  flex: 1 0 max-content;
  min-height: 48px;
  padding-inline: 18px;
  white-space: nowrap;
  padding: 10px 18px;
  border: 2px solid var(--theme-secondary);
  border-radius: 8px;
  color: var(--theme-ink);
  background: var(--neo-paper);
  box-shadow: 3px 3px 0 var(--theme-secondary);
  font-weight: 800;
  transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease;
}

.type-tabs button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--theme-secondary);
}

.type-tabs button.active {
  color: var(--theme-ink);
  background: var(--theme-accent);
  border-color: var(--theme-secondary);
  box-shadow: 4px 4px 0 var(--theme-secondary);
}

.type-tabs button:focus-visible {
  outline: 3px solid var(--theme-accent);
  outline-offset: 3px;
}

.score-panel {
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  min-height: 194px;
  margin-bottom: 24px;
  padding: 26px;
  overflow: visible;
  border: 3px solid var(--theme-detail);
  border-radius: 10px;
  background: var(--theme-panel);
  box-shadow: 5px 5px 0 var(--theme-secondary);
}

.score-panel__copy .eyebrow {
  color: var(--theme-ink) !important;
  border-left-color: var(--theme-detail) !important;
  background: var(--theme-soft) !important;
}

.score-panel h2 {
  color: var(--theme-ink);
  letter-spacing: -0.025em;
}

.score-panel__visual output {
  min-width: 62px;
  color: var(--theme-detail);
  text-shadow: 2px 2px 0 var(--theme-soft);
}

.score-panel__visual img {
  align-self: end;
  width: 160px;
  height: 156px;
  transform: translate(8px, 8px) rotate(2deg);
  transform-origin: bottom center;
  filter: drop-shadow(4px 4px 0 rgba(36, 29, 25, .16));
}

.range-label {
  margin: 24px 0 30px;
  color: var(--theme-ink);
  font-weight: 800;
}

.range-label input {
  height: 10px;
  accent-color: var(--theme-detail);
}

.range-label input:focus-visible {
  outline: 3px solid var(--theme-accent);
  outline-offset: 5px;
}

.quick-fields {
  min-height: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.quick-fields > label {
  min-width: 0;
  padding: 14px;
  border: 2px solid var(--theme-secondary);
  border-left: 7px solid var(--theme-accent);
  border-radius: 8px;
  background: var(--cream-50);
  box-shadow: 3px 3px 0 var(--theme-secondary);
}

.quick-fields > label:nth-child(3n + 2) {
  border-left-color: var(--theme-secondary);
}

.quick-fields > label:nth-child(3n + 3) {
  border-left-color: var(--theme-detail);
}

.form-grid label > span {
  color: var(--theme-ink);
  font-size: 13px;
  font-weight: 800;
}

.form-grid input {
  border: 2px solid var(--theme-secondary);
  border-radius: 6px;
  background: var(--neo-paper);
}

.form-grid textarea {
  border: 2px solid var(--theme-secondary);
  border-radius: 6px;
  background: var(--neo-paper);
}

.form-grid select {
  border: 2px solid var(--theme-secondary);
  border-radius: 6px;
  background: var(--neo-paper);
}

.form-grid :is(input, textarea, select):focus-visible {
  outline: 3px solid var(--theme-accent);
  outline-offset: 3px;
}

.form-actions {
  margin-top: 30px;
  padding-top: 18px;
  border-top: 3px solid var(--theme-secondary);
}

.form-actions > a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border: 2px solid var(--theme-secondary);
  border-radius: 7px;
  color: var(--theme-ink);
  background: var(--neo-paper);
  box-shadow: 3px 3px 0 var(--theme-secondary);
  font-weight: 800;
}

.form-actions > a:hover {
  color: var(--theme-ink);
  text-decoration: none;
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--theme-secondary);
}

.form-actions .primary-button {
  border: 2px solid var(--theme-secondary);
  border-radius: 7px;
  color: var(--theme-ink);
  background: var(--theme-accent);
  box-shadow: 4px 4px 0 var(--theme-secondary);
}

.form-actions .primary-button:hover {
  color: var(--theme-ink);
  background: var(--theme-soft);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--theme-secondary);
}

.form-actions .primary-button:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--theme-secondary);
}

.optional-details {
  margin-top: 18px;
  border: 2px solid var(--theme-secondary);
  border-radius: 8px;
  background: var(--theme-soft);
  box-shadow: 3px 3px 0 var(--theme-secondary);
}

.optional-details summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  padding: 10px 16px;
  color: var(--theme-ink);
  cursor: pointer;
  list-style: none;
}

.optional-details summary b {
  color: var(--theme-ink);
  font-size: 15px;
}

.optional-details summary:focus-visible {
  outline: 3px solid var(--theme-accent);
  outline-offset: -3px;
  border-radius: 14px;
  outline-color: var(--theme-accent);
}

@media (max-width: 700px) {
  .record-form {
    padding: 20px;
  }

  .quick-fields {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 600px) {

  .record-form--loading {
    min-height: 460px;
  }

  .type-tabs {
    margin: -2px -2px 20px;
    padding-bottom: 6px;
  }

  .score-panel h2 {
    font-size: 21px;
  }

  .score-panel__visual {
    flex-direction: row-reverse;
    justify-content: space-between;
    min-height: 100px;
  }

  .score-panel__visual img {
    width: 118px;
    height: 104px;
    transform: translate(3px, 4px) rotate(1deg);
  }

  .score-panel__visual output {
    position: static;
    font-size: 38px;
  }

  .score-panel__visual output small {
    display: inline;
    margin-left: 3px;
    font-size: 13px;
  }

  .range-label {
    grid-template-columns: 62px minmax(0, 1fr) 62px;
    gap: 8px;
    margin: 18px 0 24px;
    color: var(--cocoa-700);
    font-size: 12px;
  }

  .range-label input {
    min-height: 44px;
  }

  .range-empty-hint {
    margin-top: -16px;
  }

  .form-grid {
    gap: 16px;
  }

  .optional-details {
    margin-top: 16px;
  }

  .optional-details summary {
    min-height: 60px;
    padding-inline: 14px;
  }

  .optional-details__body {
    padding-inline: 14px;
  }

  .form-actions > a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding-inline: 8px;
    color: var(--cocoa-700);
    font-size: 14px;
    font-weight: 700;
  }

  .form-actions .primary-button {
    padding-inline: 16px;
  }

  .form-grid :is(input, select, textarea):focus {
    scroll-margin-bottom: 96px;
  }
  .form-page .page-header {
    padding-left: 12px;
  }

  .record-form {
    padding: 16px;
    border-radius: 20px;
    border-width: 2px;
    box-shadow: 4px 4px 0 var(--theme-secondary);
  }

  .type-tabs button {
    box-shadow: 2px 2px 0 var(--theme-secondary);
  }

  .score-panel {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    min-height: 0;
    padding: 18px;
    overflow: hidden;
    box-shadow: 3px 3px 0 var(--theme-secondary);
  }

  .quick-fields > label {
    box-shadow: 2px 2px 0 var(--theme-secondary);
  }

  .form-actions {
    position: sticky;
    z-index: 4;
    bottom: 10px;
    justify-content: space-between;
    margin: 22px -8px -8px;
    padding: 10px;
    border: 1px solid var(--sand-200);
    border-radius: 14px;
    background: var(--cream-50);
    box-shadow: 4px 4px 0 var(--theme-secondary);
    backdrop-filter: blur(8px);
    border-top: 2px solid var(--theme-secondary);
  }
}

@media (prefers-reduced-motion: reduce) {
  .score-panel__visual img {
    transform: none;
  }

  .form-skeleton span {
    animation: none;
    background: var(--sand-100);
  }

  .mood-swap-enter-active {
    transition: none;
    animation: none;
  }

  .mood-swap-leave-active {
    transition: none;
    animation: none;
  }

  .form-content-enter-active {
    transition: none;
    animation: none;
  }

  .form-content-leave-active {
    transition: none;
    animation: none;
  }

  .optional-details__body {
    transition: none;
    animation: none;
  }
  .type-tabs button {
    transition: none;
  }
  .form-actions > a {
    transition: none;
  }
  .form-actions .primary-button {
    transition: none;
  }

  .type-tabs button:hover {
    transform: none;
  }

  .form-actions > a:hover {
    transform: none;
  }

  .form-actions .primary-button:hover {
    transform: none;
  }

  .form-actions .primary-button:active {
    transform: none;
  }
}
</style>
