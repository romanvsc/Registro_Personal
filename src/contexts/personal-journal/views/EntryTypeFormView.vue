<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import {
  createEntryType,
  getEntryType,
  updateEntryType,
} from '../application/entryTypeAdminStore'
import { pushToast } from '../../../shared/application/toastStore'
import AppIcon from '../../../shared/components/AppIcon.vue'
import ConfirmDialog from '../../../shared/components/ConfirmDialog.vue'
import { cloneDraft, hasDraftChanges } from '../application/journalDraft'

const route = useRoute()
const router = useRouter()

const iconCatalog = [
  'hoy', 'comidas', 'entrenamientos', 'estado-animo', 'historial',
  'nuevo-registro', 'saludo',
  'agua', 'peso', 'objetivos', 'progreso', 'racha', 'record-personal',
  'sueno', 'exito', 'advertencia', 'error',
]

const inputTypes = ['text', 'textarea', 'number', 'date', 'time', 'select', 'checkbox']
const inputTypeLabels = {
  text: 'Escribiendo algo breve',
  textarea: 'Escribiendo una respuesta larga',
  number: 'Ingresando un número',
  date: 'Eligiendo una fecha',
  time: 'Eligiendo una hora',
  select: 'Eligiendo entre varias opciones',
  checkbox: 'Marcando sí o no',
}

const iconLabels = {
  hoy: 'Hoy',
  comidas: 'Comidas',
  entrenamientos: 'Entrenamientos',
  'estado-animo': 'Estado de ánimo',
  historial: 'Historial',
  'nuevo-registro': 'Nuevo registro',
  saludo: 'Saludo',
  agua: 'Agua',
  peso: 'Peso',
  objetivos: 'Objetivos',
  progreso: 'Progreso',
  racha: 'Racha',
  'record-personal': 'Récord personal',
  sueno: 'Sueño',
  exito: 'Éxito',
  advertencia: 'Advertencia',
  error: 'Error',
}

const editingId = ref(null)
const loading = ref(false)
const saving = ref(false)
const formError = ref('')
const initialDraft = ref(null)
const discardDialog = ref(false)
const pendingNavigationResolve = ref(null)
const allowNavigation = ref(false)

const form = reactive({
  name: '',
  slug: '',
  icon: '',
  sortOrder: 0,
  fields: [],
})

const slugTouched = ref(false)
const iconTouched = ref(false)
const selectedIconLabel = computed(() => iconLabels[form.icon] || 'Ninguno todavía')
const currentDraft = computed(() => ({
  name: form.name,
  slug: form.slug,
  icon: form.icon,
  sortOrder: form.sortOrder,
  fields: form.fields.map(field => ({
    fieldKey: field.fieldKey,
    label: field.label,
    inputType: field.inputType,
    required: field.required,
    options: [...(field.options || [])],
  })),
}))
const hasUnsavedChanges = computed(() => initialDraft.value !== null && hasDraftChanges(currentDraft.value, initialDraft.value))

function setInitialDraft() {
  initialDraft.value = cloneDraft(currentDraft.value)
}

function requestNavigation(resolve) {
  if (!hasUnsavedChanges.value || allowNavigation.value) {
    resolve(true)
    return
  }
  pendingNavigationResolve.value = resolve
  discardDialog.value = true
}

function confirmDiscard() {
  const resolve = pendingNavigationResolve.value
  pendingNavigationResolve.value = null
  discardDialog.value = false
  allowNavigation.value = true
  resolve?.(true)
}

function cancelDiscard() {
  const resolve = pendingNavigationResolve.value
  pendingNavigationResolve.value = null
  discardDialog.value = false
  resolve?.(false)
}

onBeforeRouteLeave((_to, _from, next) => requestNavigation(next))
onBeforeRouteUpdate((_to, _from, next) => requestNavigation(next))

function getErrorMessage(error, fallback) {
  const message = error instanceof Error ? error.message.trim() : ''
  if (/slug/i.test(message) && /existe/i.test(message)) return 'Ya existe un tipo de registro con ese nombre. Probá con otro.'
  if (/slug/i.test(message)) return 'No pudimos generar el acceso para este tipo. Revisá el nombre e intentá nuevamente.'
  if (/fieldKey/i.test(message)) return 'Revisá que todas las preguntas tengan un nombre diferente.'
  if (message && !['undefined', 'null', '[object Object]'].includes(message)) return message
  return fallback
}

function suggestSlug() {
  if (slugTouched.value) return
  const normalized = form.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  form.slug = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function normalizedWords(value) {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function suggestIcon() {
  if (iconTouched.value) return
  const name = normalizedWords(form.name)
  const suggestions = [
    [/comida|aliment|receta/, 'comidas'],
    [/entren|ejercicio|actividad/, 'entrenamientos'],
    [/animo|humor|emocion/, 'estado-animo'],
    [/sueno|dormir|descanso/, 'sueno'],
    [/agua|hidrat/, 'agua'],
    [/peso|balanza/, 'peso'],
    [/objetivo|meta/, 'objetivos'],
    [/progreso|evolucion/, 'progreso'],
    [/racha/, 'racha'],
  ]
  form.icon = suggestions.find(([pattern]) => pattern.test(name))?.[1] || ''
}

function handleNameInput() {
  suggestSlug()
  suggestIcon()
}

function suggestFieldType(field) {
  if (field.inputTypeTouched) return
  const fieldName = normalizedWords(`${field.fieldKey} ${field.label}`)
  if (/duracion|minutos|cantidad|peso|calorias|vasos|horas/.test(fieldName)) field.inputType = 'number'
  else if (/fecha/.test(fieldName)) field.inputType = 'date'
  else if (/\bhora\b/.test(fieldName)) field.inputType = 'time'
  else if (/nota|descripcion|detalle|comentario/.test(fieldName)) field.inputType = 'textarea'
  else field.inputType = ''
}

function makeFieldKey(label, fallback) {
  const key = normalizedWords(label).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return key || fallback
}

function handleFieldLabelInput(field, index) {
  if (!field.fieldKeyLocked) field.fieldKey = makeFieldKey(field.label, `pregunta_${index + 1}`)
  suggestFieldType(field)
}

function addField() {
  form.fields.push({ fieldKey: '', fieldKeyLocked: false, label: '', inputType: '', inputTypeTouched: false, required: false, options: [] })
}

function removeField(index) {
  form.fields.splice(index, 1)
}

function addOption(field) {
  field.options.push('')
}

function removeOption(field, index) {
  field.options.splice(index, 1)
}

function normalizeField(field, index, usedKeys) {
  const fallback = `pregunta_${index + 1}`
  const baseKey = makeFieldKey(field.fieldKey || field.label, fallback)
  let fieldKey = baseKey
  let suffix = 2
  while (usedKeys.has(fieldKey)) fieldKey = `${baseKey}_${suffix++}`
  usedKeys.add(fieldKey)

  return {
    fieldKey,
    label: field.label.trim(),
    inputType: field.inputType,
    required: field.required,
    sortOrder: (index + 1) * 10,
    options: field.inputType === 'select' ? field.options.map(o => String(o).trim()).filter(Boolean) : undefined,
  }
}

async function save() {
  saving.value = true
  formError.value = ''
  try {
    const usedKeys = new Set()
    const payload = {
      name: form.name,
      slug: form.slug,
      icon: form.icon,
      sortOrder: Number(form.sortOrder) || 0,
      fields: form.fields.map((field, index) => normalizeField(field, index, usedKeys)),
    }
    if (editingId.value) {
      await updateEntryType(editingId.value, payload)
    } else {
      await createEntryType(payload)
    }
    pushToast({
      type: 'success',
      message: editingId.value ? 'Tipo actualizado.' : 'Tipo creado.',
      duration: 3000,
    })
    initialDraft.value = null
    allowNavigation.value = true
    router.push('/configuracion/tipos')
  } catch (error) {
    const message = getErrorMessage(error, 'Ocurrió un problema. Intentá nuevamente.')
    formError.value = message
    pushToast({ type: 'error', message, duration: 5000 })
  } finally {
    saving.value = false
  }
}

function applyType(type) {
  editingId.value = type.id
  form.name = type.name
  form.slug = type.slug
  form.icon = type.icon
  form.sortOrder = type.sortOrder
  form.fields = type.fields.map(field => ({
    fieldKey: field.key,
    fieldKeyLocked: true,
    label: field.label,
    inputType: field.inputType,
    inputTypeTouched: true,
    required: field.required,
    options: field.options ? [...field.options] : [],
  }))
  slugTouched.value = true
  iconTouched.value = true
}

onMounted(async () => {
  loading.value = true
  try {
    const id = route.params.id
    if (id && id !== 'nuevo') {
      applyType(await getEntryType(Number(id)))
    }
    setInitialDraft()
  } catch (error) {
    formError.value = getErrorMessage(error, 'No se pudo cargar el tipo.')
  } finally {
    loading.value = false
  }
})

const isNew = computed(() => editingId.value === null)
</script>

<template>
  <div class="page admin-page">
    <header class="page-header">
      <div><p class="eyebrow">CONFIGURACIÓN</p><h1>{{ isNew ? 'Nuevo tipo de registro' : 'Editar tipo de registro' }}</h1><p>Elegí un nombre, un icono y las preguntas que querés responder.</p></div>
    </header>

    <p v-if="loading" class="soft-label" role="status">Cargando tipo…</p>
    <form v-else class="record-form type-form" @submit.prevent="save">
      <p v-if="formError" id="entry-type-form-error" class="form-error" role="alert">{{ formError }}</p>

      <div class="form-grid type-form__basics">
        <label class="type-name-field"><span>¿Qué querés registrar?</span><input v-model="form.name" required maxlength="120" placeholder="Ej: Sueño, lectura o meditación" :aria-invalid="Boolean(formError)" :aria-describedby="formError ? 'entry-type-form-error' : undefined" @input="handleNameInput" /></label>
        <fieldset class="icon-fieldset" :aria-invalid="Boolean(formError)" aria-describedby="icon-picker-help icon-picker-selection">
          <legend>Icono</legend>
          <div class="icon-picker">
            <label v-for="name in iconCatalog" :key="name" class="icon-option" :class="{ active: form.icon === name }" :title="iconLabels[name]">
              <input v-model="form.icon" type="radio" name="entry-type-icon" :value="name" :aria-label="iconLabels[name]" required @change="iconTouched = true" />
              <AppIcon :name="name" aria-hidden="true" />
              <span class="icon-option__name">{{ iconLabels[name] }}</span>
              <span v-if="form.icon === name" class="icon-option__check" aria-hidden="true">✓</span>
            </label>
          </div>
          <p id="icon-picker-selection" class="icon-selection" aria-live="polite">Icono elegido: <strong>{{ selectedIconLabel }}</strong></p>
          <p id="icon-picker-help" class="field-help">Lo vas a reconocer por este dibujo en el menú y en tus registros.</p>
        </fieldset>
      </div>

      <section class="fields-section">
        <div class="section-heading"><div><p class="eyebrow">PREGUNTAS</p><h2>¿Qué querés recordar cada vez?</h2></div><button class="ghost-button" type="button" @click="addField">＋ Agregar pregunta</button></div>

        <div v-if="form.fields.length" class="field-editor-list">
          <article v-for="(field, index) in form.fields" :key="index" class="field-editor">
            <div class="field-editor__grid">
              <label class="field-editor__question"><span>Pregunta</span><input v-model="field.label" required maxlength="120" placeholder="Ej: ¿Cuántas horas dormiste?" :aria-invalid="Boolean(formError)" :aria-describedby="formError ? 'entry-type-form-error' : undefined" @input="handleFieldLabelInput(field, index)" /></label>
              <label><span>¿Cómo querés responder?</span><select v-model="field.inputType" required :aria-invalid="Boolean(formError)" :aria-describedby="formError ? 'entry-type-form-error' : undefined" @change="field.inputTypeTouched = true"><option disabled value="">Elegí una forma</option><option v-for="type in inputTypes" :key="type" :value="type">{{ inputTypeLabels[type] }}</option></select></label>
              <label class="check-label"><input v-model="field.required" type="checkbox" /> Pedir siempre</label>
            </div>
            <div v-if="field.inputType === 'select'" class="option-editor">
              <span>Respuestas disponibles</span>
              <div v-for="(option, optionIndex) in field.options" :key="optionIndex" class="option-row">
                <input v-model="field.options[optionIndex]" placeholder="Ej: Bien" />
                <button type="button" aria-label="Quitar opción" @click="removeOption(field, optionIndex)">×</button>
              </div>
              <button class="ghost-button" type="button" @click="addOption(field)">＋ Agregar respuesta</button>
            </div>
            <button class="mini-link mini-link--danger field-editor__remove" type="button" @click="removeField(index)">Quitar pregunta</button>
          </article>
        </div>
        <p v-else class="soft-label">Todavía no agregaste preguntas. Podés guardar este tipo así o sumar una cuando quieras.</p>
      </section>

      <div class="form-actions">
        <RouterLink to="/configuracion/tipos">Cancelar</RouterLink>
        <button class="primary-button" type="submit" :disabled="saving">{{ saving ? 'Guardando…' : 'Guardar tipo' }}</button>
      </div>
    </form>
    <ConfirmDialog
      v-if="discardDialog"
      title="¿Descartar cambios?"
      message="Tenés cambios sin guardar en este tipo de registro. Si salís ahora, se perderán."
      cancel-label="Seguir editando"
      confirm-label="Descartar cambios"
      @confirm="confirmDiscard"
      @cancel="cancelDiscard"
    />
  </div>
</template>

<style scoped>
.icon-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  opacity: 0;
}

.icon-option .app-icon {
  width: 38px;
  height: 38px;
}

.field-editor__grid {
  display: grid;
  grid-template-columns: minmax(260px, 1.5fr) minmax(230px, 1fr) auto;
  gap: 12px;
  align-items: end;
}

.field-editor__question {
  min-width: 0;
}

.option-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

/* PersonalJournal: editor de tipos como módulo editorial neobrutalista. */
.admin-page .page-header {
  padding-left: 18px;
  border-left: 6px solid var(--dorito-500);
}

.admin-page .page-header h1 {
  color: var(--cocoa-950);
  letter-spacing: -0.03em;
}

.type-form {
  max-width: 940px;
  padding: 30px;
  border: 3px solid var(--cocoa-950);
  border-radius: 12px;
  background: var(--cream-50);
  box-shadow: 6px 6px 0 var(--cocoa-950);
}

.type-form > .form-error {
  border: 2px solid var(--danger-700);
  border-left-width: 7px;
  border-radius: 8px;
  box-shadow: 3px 3px 0 var(--danger-700);
}

.type-form__basics {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: 18px;
}

.type-name-field {
  grid-column: 1 / -1;
  max-width: 620px;
  padding: 16px;
  border: 2px solid var(--cocoa-950);
  border-left: 7px solid var(--dorito-500);
  border-radius: 8px;
  background: var(--dorito-50);
  box-shadow: 3px 3px 0 var(--cocoa-950);
}

.type-form__basics > label > span {
  color: var(--cocoa-950);
  font-size: 13px;
  font-weight: 800;
}

.icon-fieldset legend {
  color: var(--cocoa-950);
  font-size: 13px;
  padding: 0 6px;
  font-weight: 800;
}

.type-name-field input {
  border: 2px solid var(--cocoa-950);
  border-radius: 6px;
  background: var(--cream-50);
}

.field-editor__grid input {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 2px solid var(--cocoa-950);
  border-radius: 6px;
  background: var(--cream-50);
}

.field-editor__grid select {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 2px solid var(--cocoa-950);
  border-radius: 6px;
  background: var(--cream-50);
}

.option-row input {
  flex: 1;
  min-width: 0;
  min-height: 44px;
  padding: 9px 12px;
  border: 2px solid var(--cocoa-950);
  border-radius: 6px;
  background: var(--cream-50);
}

.type-form :is(input, select, textarea, button):focus-visible {
  outline: 3px solid var(--dorito-500);
  outline-offset: 3px;
}

.icon-fieldset {
  grid-column: 1 / -1;
  min-width: 0;
  margin: 0;
  padding: 18px;
  border: 3px solid var(--cocoa-950);
  border-radius: 10px;
  background: var(--felicia-50);
  box-shadow: 4px 4px 0 var(--cocoa-950);
}

.icon-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 10px;
}

.icon-option {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 52px;
  min-height: 86px;
  padding: 9px 5px 8px;
  border: 2px solid var(--cocoa-950);
  border-radius: 7px;
  background: var(--cream-50);
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--cocoa-950);
  transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease;
}

.icon-option:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--cocoa-950);
}

.icon-option.active {
  border-color: var(--cocoa-950);
  background: var(--dorito-300);
  box-shadow: 4px 4px 0 var(--cocoa-950);
}

.icon-option:focus-within {
  outline: 3px solid var(--dorito-500);
  outline-offset: 3px;
}

.icon-option__name {
  overflow: hidden;
  width: 100%;
  color: var(--cocoa-950);
  font-size: 10px;
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-option__check {
  position: absolute;
  right: 4px;
  bottom: 4px;
  display: grid;
  place-items: center;
  width: 19px;
  height: 19px;
  border-radius: 5px;
  color: var(--cocoa-950);
  background: var(--cream-50);
  font-size: 11px;
  font-weight: 900;
  border: 2px solid var(--cocoa-950);
}

.icon-selection {
  margin: 12px 0 2px;
  color: var(--cocoa-950);
  font-size: 14px;
  font-weight: 700;
}

.field-help {
  margin: 0;
  color: var(--cocoa-700);
  font-size: 13px;
  line-height: 1.45;
}

.fields-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 3px solid var(--cocoa-950);
}

.section-heading {
  margin-bottom: 20px;
}

.section-heading h2 {
  color: var(--cocoa-950);
  letter-spacing: -0.02em;
}

.section-heading .ghost-button {
  border: 2px solid var(--cocoa-950);
  border-radius: 6px;
  color: var(--cocoa-950);
  background: var(--felicia-100);
  box-shadow: 3px 3px 0 var(--cocoa-950);
  font-weight: 800;
}

.option-editor .ghost-button {
  border: 2px solid var(--cocoa-950);
  border-radius: 6px;
  color: var(--cocoa-950);
  background: var(--felicia-100);
  box-shadow: 3px 3px 0 var(--cocoa-950);
  font-weight: 800;
}

.section-heading .ghost-button:hover {
  border-color: var(--cocoa-950);
  color: var(--cocoa-950);
  background: var(--dorito-100);
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--cocoa-950);
}

.option-editor .ghost-button:hover {
  border-color: var(--cocoa-950);
  color: var(--cocoa-950);
  background: var(--dorito-100);
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--cocoa-950);
}

.field-editor-list {
  display: grid;
  gap: 18px;
}

.field-editor {
  position: relative;
  padding: 20px;
  border: 3px solid var(--cocoa-950);
  border-radius: 9px;
  background: var(--felicia-50);
  border-left: 8px solid var(--felicia-500);
  box-shadow: 4px 4px 0 var(--cocoa-950);
}

.field-editor:nth-child(3n + 2) {
  border-left-color: var(--dorito-500);
  background: var(--dorito-50);
}

.field-editor:nth-child(3n + 3) {
  border-left-color: var(--danger-500);
  background: var(--danger-50);
}

.field-editor__grid label span {
  display: block;
  margin-bottom: 6px;
  color: var(--cocoa-950);
  font-size: 13px;
  font-weight: 800;
}

.option-editor > span {
  display: block;
  margin-bottom: 6px;
  color: var(--cocoa-950);
  font-size: 13px;
  font-weight: 800;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  font-size: 13px;
  font-weight: 700;
  padding: 8px;
  border: 2px solid var(--cocoa-950);
  border-radius: 6px;
  color: var(--cocoa-950);
  background: var(--cream-50);
  box-shadow: 2px 2px 0 var(--cocoa-950);
}

.check-label input {
  width: 20px;
  height: 20px;
  accent-color: var(--dorito-500);
}

.option-editor {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 2px dashed var(--cocoa-700);
}

.option-row button {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  border: 2px solid var(--danger-700);
  border-radius: 6px;
  background: var(--danger-50);
  color: var(--danger-700);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--danger-700);
}

.option-row button:hover {
  background: var(--danger-100);
  transform: translate(-1px, -1px);
}

.field-editor__remove {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 18px;
  padding: 0 12px;
  border-radius: 6px;
  border: 2px solid var(--danger-700);
  color: var(--danger-700);
  background: var(--danger-50);
  box-shadow: 2px 2px 0 var(--danger-700);
}

.field-editor__remove:hover {
  color: var(--danger-700);
  background: var(--danger-100);
  text-decoration: none;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--danger-700);
}

.form-actions {
  margin-top: 30px;
  padding-top: 18px;
  border-top: 3px solid var(--cocoa-950);
}

.form-actions > a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border: 2px solid var(--cocoa-950);
  border-radius: 7px;
  color: var(--cocoa-950);
  background: var(--cream-50);
  box-shadow: 3px 3px 0 var(--cocoa-950);
  font-weight: 800;
}

.form-actions > a:hover {
  color: var(--cocoa-950);
  text-decoration: none;
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--cocoa-950);
}

.form-actions .primary-button {
  border: 2px solid var(--cocoa-950);
  border-radius: 7px;
  color: var(--cocoa-950);
  background: var(--dorito-300);
  box-shadow: 4px 4px 0 var(--cocoa-950);
}

.form-actions .primary-button:hover {
  color: var(--cocoa-950);
  background: var(--dorito-400);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--cocoa-950);
}

.soft-label {
  padding: 18px;
  border: 2px dashed var(--cocoa-950);
  border-radius: 8px;
  color: var(--cocoa-950);
  background: var(--felicia-50);
}

@media (max-width: 720px) {
  .type-form__basics {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  .field-editor__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .check-label {
    align-self: stretch;
  }

  .section-heading {
    align-items: flex-start;
    gap: 14px;
  }
  .type-form {
    padding: 20px;
  }
}

@media (max-width: 520px) {

  .type-form__basics {
    grid-template-columns: minmax(0, 1fr);
  }

  .field-editor__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .icon-picker {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section-heading {
    display: grid;
  }

  .section-heading .ghost-button {
    width: 100%;
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

  .type-form :is(input, select, textarea, button):focus {
    scroll-margin-bottom: 96px;
  }
  .admin-page .page-header {
    padding-left: 12px;
  }

  .type-form {
    padding: 16px;
    border-radius: 20px;
    border-width: 2px;
    box-shadow: 4px 4px 0 var(--cocoa-950);
  }

  .icon-fieldset {
    box-shadow: 3px 3px 0 var(--cocoa-950);
  }

  .field-editor {
    padding: 14px;
    box-shadow: 3px 3px 0 var(--cocoa-950);
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
    box-shadow: 4px 4px 0 var(--cocoa-950);
    backdrop-filter: blur(8px);
    border-top-width: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .icon-option {
    transition: none;
  }
  .section-heading .ghost-button {
    transition: none;
  }
  .option-editor .ghost-button {
    transition: none;
  }
  .field-editor__remove {
    transition: none;
  }
  .option-row button {
    transition: none;
  }
  .form-actions > a {
    transition: none;
  }
  .form-actions .primary-button {
    transition: none;
  }

  .icon-option:hover {
    transform: none;
  }

  .section-heading .ghost-button:hover {
    transform: none;
  }

  .option-editor .ghost-button:hover {
    transform: none;
  }

  .field-editor__remove:hover {
    transform: none;
  }

  .option-row button:hover {
    transform: none;
  }

  .form-actions > a:hover {
    transform: none;
  }

  .form-actions .primary-button:hover {
    transform: none;
  }
}
</style>
