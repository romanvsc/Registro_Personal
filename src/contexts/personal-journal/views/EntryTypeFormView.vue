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
    pushToast(editingId.value ? 'Tipo actualizado.' : 'Tipo creado.')
    router.push('/configuracion/tipos')
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'No se pudo guardar el tipo.'
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
    formError.value = error instanceof Error ? error.message : 'No se pudo cargar el tipo.'
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

      <div class="form-grid">
        <label><span>Nombre</span><input v-model="form.name" required maxlength="120" placeholder="Ej: Comida" @input="suggestSlug" /></label>
        <label><span>Slug (identificador en la URL)</span><input v-model="form.slug" required maxlength="80" placeholder="Ej: comida" @input="slugTouched = true" /></label>
        <label><span>Icono</span>
          <div class="icon-picker" role="listbox" aria-label="Elegir icono">
            <button v-for="name in iconCatalog" :key="name" type="button" :class="{ active: form.icon === name }" :aria-label="`Icono ${name}`" @click="form.icon = name"><AppIcon :name="name" /></button>
          </div>
        </label>
        <label><span>Orden</span><input v-model.number="form.sortOrder" type="number" min="0" placeholder="0" /></label>
      </div>

      <section class="fields-section">
        <div class="section-heading"><div><p class="eyebrow">CAMPOS DINÁMICOS</p><h2>¿Qué datos querés capturar?</h2></div><button class="ghost-button" type="button" @click="addField">＋ Agregar campo</button></div>

        <div v-if="form.fields.length" class="field-editor-list">
          <article v-for="(field, index) in form.fields" :key="index" class="field-editor">
            <div class="field-editor__grid">
              <label><span>Identificador (fieldKey)</span><input v-model="field.fieldKey" required placeholder="duracion" /></label>
              <label><span>Etiqueta</span><input v-model="field.label" required maxlength="120" placeholder="Duración" /></label>
              <label><span>Tipo</span><select v-model="field.inputType"><option v-for="type in inputTypes" :key="type" :value="type">{{ type }}</option></select></label>
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
.icon-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
  gap: 8px;
}

.icon-picker button {
  display: grid;
  place-items: center;
  height: 52px;
  padding: 0;
  border: 1px solid var(--sand-200);
  border-radius: 12px;
  background: var(--sand-50);
  cursor: pointer;
}

.icon-picker button.active {
  border-color: var(--dorito-500);
  background: var(--dorito-50);
  box-shadow: 0 0 0 2px var(--dorito-500);
}

.icon-picker button .app-icon {
  width: 38px;
  height: 38px;
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
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.field-editor__grid label span,
.option-editor > span {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 700;
}

.field-editor__grid input,
.field-editor__grid select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--sand-200);
  border-radius: 10px;
  background: white;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  padding-bottom: 10px;
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
  padding: 9px 12px;
  border: 1px solid var(--sand-200);
  border-radius: 10px;
  background: white;
}

.option-row button {
  width: 36px;
  border: 0;
  border-radius: 10px;
  background: var(--danger-100);
  color: var(--danger-600);
  cursor: pointer;
}

.field-editor__remove {
  margin-top: 14px;
}

.ghost-button {
  padding: 9px 14px;
  border: 1px solid var(--dorito-200, #e9c9a8);
  border-radius: 10px;
  background: transparent;
  color: var(--cocoa-800);
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 720px) {
  .field-editor__grid { grid-template-columns: 1fr 1fr; }
}
</style>
