<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  createEntryType,
  getEntryType,
  updateEntryType,
} from '../application/entryTypeAdminStore'
import { pushToast } from '../../../shared/application/toastStore'
import AppIcon from '../../../shared/components/AppIcon.vue'

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
  text: 'Texto corto',
  textarea: 'Texto largo',
  number: 'Número',
  date: 'Fecha',
  time: 'Hora',
  select: 'Lista de opciones',
  checkbox: 'Casilla',
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

const form = reactive({
  name: '',
  slug: '',
  icon: 'hoy',
  sortOrder: 0,
  fields: [],
})

const slugTouched = ref(false)
const selectedIconLabel = computed(() => iconLabels[form.icon] || form.icon)

function getErrorMessage(error, fallback) {
  const message = error instanceof Error ? error.message.trim() : ''
  if (message && !['undefined', 'null', '[object Object]'].includes(message)) return message
  return fallback
}

function suggestSlug() {
  if (slugTouched.value) return
  const normalized = form.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  form.slug = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function addField() {
  form.fields.push({ fieldKey: '', label: '', inputType: 'text', required: false, options: [] })
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

function normalizeField(field, index) {
  return {
    fieldKey: field.fieldKey.trim(),
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
    const payload = {
      name: form.name,
      slug: form.slug,
      icon: form.icon,
      sortOrder: Number(form.sortOrder) || 0,
      fields: form.fields.map(normalizeField),
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
    label: field.label,
    inputType: field.inputType,
    required: field.required,
    options: field.options ? [...field.options] : [],
  }))
  slugTouched.value = true
}

onMounted(async () => {
  loading.value = true
  try {
    const id = route.params.id
    if (id && id !== 'nuevo') {
      applyType(await getEntryType(Number(id)))
    }
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
      <div><p class="eyebrow">CONFIGURACIÓN</p><h1>{{ isNew ? 'Nuevo tipo de registro' : 'Editar tipo de registro' }}</h1><p>Definí el nombre, el icono y los campos que va a pedir.</p></div>
    </header>

    <p v-if="loading" class="soft-label" role="status">Cargando tipo…</p>
    <form v-else class="record-form type-form" @submit.prevent="save">
      <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>

      <div class="form-grid type-form__basics">
        <label><span>Nombre</span><input v-model="form.name" required maxlength="120" placeholder="Ej: Comida" @input="suggestSlug" /></label>
        <label><span>Slug (identificador en la URL)</span><input v-model="form.slug" required maxlength="80" placeholder="Ej: comida" @input="slugTouched = true" /></label>
        <label><span>Orden</span><input v-model.number="form.sortOrder" type="number" min="0" placeholder="0" /></label>
        <fieldset class="icon-fieldset" aria-describedby="icon-picker-help icon-picker-selection">
          <legend>Icono</legend>
          <div class="icon-picker">
            <label v-for="name in iconCatalog" :key="name" class="icon-option" :class="{ active: form.icon === name }" :title="iconLabels[name]">
              <input v-model="form.icon" type="radio" name="entry-type-icon" :value="name" :aria-label="iconLabels[name]" />
              <AppIcon :name="name" aria-hidden="true" />
              <span v-if="form.icon === name" class="icon-option__check" aria-hidden="true">✓</span>
            </label>
          </div>
          <p id="icon-picker-selection" class="icon-selection" aria-live="polite">Seleccionado: <strong>{{ selectedIconLabel }}</strong></p>
          <p id="icon-picker-help" class="field-help">Este icono identificará el tipo en las tarjetas y accesos rápidos.</p>
        </fieldset>
      </div>

      <section class="fields-section">
        <div class="section-heading"><div><p class="eyebrow">CAMPOS DINÁMICOS</p><h2>¿Qué datos querés capturar?</h2></div><button class="ghost-button" type="button" @click="addField">＋ Agregar campo</button></div>

        <div v-if="form.fields.length" class="field-editor-list">
          <article v-for="(field, index) in form.fields" :key="index" class="field-editor">
            <div class="field-editor__grid">
              <label><span>Identificador (fieldKey)</span><input v-model="field.fieldKey" required placeholder="duracion" /></label>
              <label><span>Etiqueta</span><input v-model="field.label" required maxlength="120" placeholder="Duración" /></label>
              <label><span>Tipo</span><select v-model="field.inputType"><option v-for="type in inputTypes" :key="type" :value="type">{{ inputTypeLabels[type] }}</option></select></label>
              <label class="check-label"><input v-model="field.required" type="checkbox" /> Obligatorio</label>
            </div>
            <div v-if="field.inputType === 'select'" class="option-editor">
              <span>Opciones</span>
              <div v-for="(option, optionIndex) in field.options" :key="optionIndex" class="option-row">
                <input v-model="field.options[optionIndex]" placeholder="Opción" />
                <button type="button" aria-label="Quitar opción" @click="removeOption(field, optionIndex)">×</button>
              </div>
              <button class="ghost-button" type="button" @click="addOption(field)">＋ Agregar opción</button>
            </div>
            <button class="mini-link mini-link--danger field-editor__remove" type="button" @click="removeField(index)">Quitar campo</button>
          </article>
        </div>
        <p v-else class="soft-label">Todavía no agregaste campos. Podés guardar el tipo y agregarlos luego.</p>
      </section>

      <div class="form-actions">
        <RouterLink to="/configuracion/tipos">Cancelar</RouterLink>
        <button class="primary-button" type="submit" :disabled="saving">{{ saving ? 'Guardando…' : 'Guardar tipo' }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.type-form {
  max-width: 940px;
}

.type-form__basics {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.type-form__basics > label > span,
.icon-fieldset legend {
  color: var(--cocoa-800);
  font-size: 13px;
}

.icon-fieldset {
  grid-column: 1 / -1;
  min-width: 0;
  margin: 0;
  padding: 16px;
  border: 1px solid var(--sand-200);
  border-radius: 16px;
  background: var(--sand-50);
}

.icon-fieldset legend {
  padding: 0 6px;
  font-weight: 700;
}

.icon-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(58px, 1fr));
  gap: 8px;
}

.icon-option {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 52px;
  height: 58px;
  padding: 0;
  border: 1px solid var(--sand-200);
  border-radius: 12px;
  background: var(--cream-50);
  cursor: pointer;
}

.icon-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  opacity: 0;
}

.icon-option.active {
  border-color: var(--dorito-500);
  background: var(--dorito-50);
  box-shadow: 0 0 0 2px var(--dorito-500);
}

.icon-option:focus-within {
  outline: 3px solid rgba(217, 120, 34, .35);
  outline-offset: 3px;
}

.icon-option .app-icon {
  width: 38px;
  height: 38px;
}

.icon-option__check {
  position: absolute;
  right: 3px;
  bottom: 3px;
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border-radius: 999px;
  color: white;
  background: var(--dorito-600);
  font-size: 11px;
  font-weight: 900;
}

.icon-selection {
  margin: 12px 0 2px;
  color: var(--cocoa-800);
  font-size: 14px;
}

.field-help {
  margin: 0;
  color: var(--cocoa-700);
  font-size: 13px;
  line-height: 1.45;
}

.fields-section {
  margin-top: 26px;
}

.field-editor-list {
  display: grid;
  gap: 14px;
}

.field-editor {
  position: relative;
  padding: 18px;
  border: 1px solid var(--sand-200);
  border-radius: 16px;
  background: var(--sand-50);
}

.field-editor__grid {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) minmax(170px, 1.15fr) minmax(150px, .8fr) auto;
  gap: 12px;
  align-items: end;
}

.field-editor__grid label span,
.option-editor > span {
  display: block;
  margin-bottom: 6px;
  color: var(--cocoa-800);
  font-size: 13px;
  font-weight: 700;
}

.field-editor__grid input,
.field-editor__grid select {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--sand-200);
  border-radius: 10px;
  background: white;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  font-size: 13px;
  font-weight: 700;
  padding: 0 4px;
}

.check-label input {
  width: 20px;
  height: 20px;
  accent-color: var(--dorito-500);
}

.option-editor {
  margin-top: 14px;
}

.option-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.option-row input {
  flex: 1;
  min-width: 0;
  min-height: 44px;
  padding: 9px 12px;
  border: 1px solid var(--sand-200);
  border-radius: 10px;
  background: white;
}

.option-row button {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  border: 1px solid var(--danger-100);
  border-radius: 10px;
  background: var(--danger-50);
  color: var(--danger-600);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.option-row button:hover {
  background: var(--danger-100);
}

.field-editor__remove {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 14px;
  padding: 0 10px;
  border-radius: 10px;
}

@media (max-width: 720px) {
  .type-form__basics,
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
}

@media (max-width: 520px) {
  .type-form {
    padding: 16px;
    border-radius: 20px;
  }

  .type-form__basics,
  .field-editor__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .icon-picker {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .section-heading {
    display: grid;
  }

  .section-heading .ghost-button {
    width: 100%;
  }

  .field-editor {
    padding: 14px;
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
    background: rgba(255, 252, 247, .96);
    box-shadow: var(--shadow-float);
    backdrop-filter: blur(8px);
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
}
</style>
