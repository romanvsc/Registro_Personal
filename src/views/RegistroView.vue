<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addEntry, catFor, editEntry, entryTypes, journalError, loadEntry, loadJournal } from '../lib/entries'
import { pushToast } from '../shared/application/toastStore'

const route = useRoute()
const router = useRouter()
const editingId = ref(null)
const type = ref('')
const score = ref(7)
const title = ref('')
const notes = ref('')
const occurredAt = ref('')
const values = reactive({})
const saving = ref(false)
const loading = ref(false)
const selectedType = computed(() => entryTypes.value.find(item => item.slug === type.value) || entryTypes.value[0])
const cat = computed(() => catFor(score.value))

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

async function prefillFromEntry(entry) {
  editingId.value = entry.id
  if (entryTypes.value.some(item => item.slug === entry.type)) {
    type.value = entry.type
  }
  title.value = entry.title || ''
  notes.value = entry.detail || ''
  score.value = Number(entry.score) || 7
  occurredAt.value = toDatetimeLocal(entry.occurredAt) || toDatetimeLocal(new Date())
  Object.keys(values).forEach(key => delete values[key])
  if (entry.values && typeof entry.values === 'object') {
    const typeDefinition = entryTypes.value.find(item => item.slug === entry.type)
    const knownKeys = new Set((typeDefinition?.fields || []).map(field => field.key))
    Object.entries(entry.values).forEach(([key, value]) => {
      if (knownKeys.has(key)) values[key] = value
    })
  }
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
    }
  } finally {
    loading.value = false
  }
})
watch(() => route.params.id, (id) => {
  editingId.value = null
  if (id) loadEntry(Number(id)).then(prefillFromEntry)
})
watch(() => route.params.type, (t) => {
  if (!editingId.value) selectRouteType()
})

async function save() {
  if (!selectedType.value) return
  saving.value = true
  try {
    const payload = {
      type: type.value,
      title: title.value || selectedType.value.name,
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
    <p v-if="loading" class="soft-label" role="status">Cargando registro…</p>
    <form v-else-if="selectedType" class="record-form" @submit.prevent="save">
      <p v-if="journalError" class="form-error" role="alert">{{ journalError }}</p>
      <div class="type-tabs" role="tablist"><button v-for="item in entryTypes" :key="item.slug" type="button" :class="{ active: type === item.slug }" @click="type = item.slug">{{ item.name }}</button></div>
      <div class="score-panel">
        <div><p class="eyebrow">¿CÓMO TE SENTISTE?</p><h2>{{ cat.name }} te acompaña</h2><p>{{ score <= 3 ? 'Hoy costó, y está bien.' : score <= 7 ? 'Tomalo con calma y escuchá tu cuerpo.' : '¡Qué lindo verte así!' }}</p></div>
        <img :src="cat.image" :alt="cat.name" /><output>{{ score }}<small>/10</small></output>
      </div>
      <label class="range-label"><span><b>1</b> Felipa</span><input v-model.number="score" type="range" min="1" max="10" /><span>Dorito <b>10</b></span></label>
      <div class="form-grid">
        <label><span>Título</span><input v-model="title" required :placeholder="selectedType.name" /></label>
        <label v-for="field in selectedType.fields" :key="field.key"><span>{{ field.label }}</span>
          <textarea v-if="field.inputType === 'textarea'" v-model="values[field.key]" :required="field.required" rows="3"></textarea>
          <select v-else-if="field.inputType === 'select'" v-model="values[field.key]" :required="field.required"><option value="">Seleccionar</option><option v-for="option in field.options" :key="option" :value="option">{{ option }}</option></select>
          <input v-else v-model="values[field.key]" :type="field.inputType" :required="field.required" />
        </label>
        <label><span>Fecha y hora</span><input v-model="occurredAt" type="datetime-local" /></label>
        <label><span>Notas</span><textarea v-model="notes" rows="4" placeholder="Contá un poco más, si querés..."></textarea></label>
      </div>
      <div class="form-actions"><RouterLink to="/historial">Cancelar</RouterLink><button class="primary-button" type="submit" :disabled="saving">{{ saving ? 'Guardando…' : (editingId ? 'Guardar cambios' : 'Guardar registro') }}</button></div>
    </form>
  </div>
</template>
