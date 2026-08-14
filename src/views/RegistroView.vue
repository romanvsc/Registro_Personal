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
const scoreDescription = computed(() => {
  if (score.value <= 3) return `${score.value} de 10, te acompaña Felipa`
  if (score.value <= 7) return `${score.value} de 10, te acompaña Felicia`
  return `${score.value} de 10, te acompaña Dorito`
})

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
  if (nextType) type.value = nextType.slug
  tabs[nextIndex]?.focus()
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
    <div v-if="loading" class="record-form record-form--loading" role="status" aria-live="polite" aria-busy="true">
      <p>Cargando registro…</p>
      <div class="form-skeleton" aria-hidden="true">
        <span class="form-skeleton__tabs"></span>
        <span class="form-skeleton__panel"></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <form v-else-if="selectedType" class="record-form" @submit.prevent="save">
      <p v-if="journalError" class="form-error" role="alert">{{ journalError }}</p>
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
          @click="type = item.slug"
          @keydown="selectTypeFromKeyboard"
        >{{ item.name }}</button>
      </div>
      <div id="record-type-panel" class="score-panel" role="tabpanel" :aria-labelledby="`type-tab-${type}`">
        <div class="score-panel__copy"><p class="eyebrow">¿CÓMO TE SENTISTE?</p><h2>{{ cat.name }} te acompaña</h2><p>{{ score <= 3 ? 'Hoy costó, y está bien.' : score <= 7 ? 'Tomalo con calma y escuchá tu cuerpo.' : '¡Qué lindo verte así!' }}</p></div>
        <Transition name="mood-swap" mode="out-in">
          <div :key="cat.name" class="score-panel__visual">
            <img :src="cat.image" :alt="`${cat.name}, representación de tu sensación`" />
            <output aria-live="polite">{{ score }}<small>/10</small></output>
          </div>
        </Transition>
      </div>
      <label class="range-label"><span><b>1</b> Felipa</span><input v-model.number="score" type="range" min="1" max="10" :aria-valuetext="scoreDescription" /><span>Dorito <b>10</b></span></label>
      <Transition name="form-content" mode="out-in">
        <div :key="selectedType.slug" class="form-grid">
          <label><span>Título</span><input v-model="title" required :placeholder="selectedType.name" /></label>
          <label v-for="field in selectedType.fields" :key="field.key"><span>{{ field.label }}</span>
            <textarea v-if="field.inputType === 'textarea'" v-model="values[field.key]" :required="field.required" rows="3"></textarea>
            <select v-else-if="field.inputType === 'select'" v-model="values[field.key]" :required="field.required"><option value="">Seleccionar</option><option v-for="option in field.options" :key="option" :value="option">{{ option }}</option></select>
            <input v-else v-model="values[field.key]" :type="field.inputType" :required="field.required" />
          </label>
          <label><span>Fecha y hora</span><input v-model="occurredAt" type="datetime-local" /></label>
          <label><span>Notas</span><textarea v-model="notes" rows="4" placeholder="Contá un poco más, si querés..."></textarea></label>
        </div>
      </Transition>
      <div class="form-actions"><RouterLink to="/historial">Cancelar</RouterLink><button class="primary-button" type="submit" :disabled="saving">{{ saving ? 'Guardando…' : (editingId ? 'Guardar cambios' : 'Guardar registro') }}</button></div>
    </form>
  </div>
</template>

<style scoped>
.record-form--loading {
  min-height: 520px;
}

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

.type-tabs {
  display: flex;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
}

.type-tabs button {
  flex: 1 0 max-content;
  min-height: 44px;
  padding-inline: 18px;
  white-space: nowrap;
}

.type-tabs button:focus-visible {
  outline: 3px solid rgba(217, 120, 34, .35);
  outline-offset: -2px;
}

.score-panel {
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
}

.score-panel__copy {
  min-width: 0;
}

.score-panel__visual {
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 12px;
}

.score-panel__visual img {
  align-self: end;
  width: 160px;
  height: 156px;
}

.score-panel__visual output {
  min-width: 62px;
}

.form-grid label > span {
  color: var(--cocoa-800);
  font-size: 13px;
}

.mood-swap-enter-active,
.mood-swap-leave-active,
.form-content-enter-active,
.form-content-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}

.mood-swap-enter-from,
.mood-swap-leave-to {
  opacity: 0;
  transform: translateX(8px) scale(.98);
}

.form-content-enter-from,
.form-content-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

@media (max-width: 600px) {
  .record-form {
    padding: 16px;
    border-radius: 20px;
  }

  .record-form--loading {
    min-height: 460px;
  }

  .type-tabs {
    margin: -2px -2px 20px;
    padding-bottom: 6px;
  }

  .score-panel {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    min-height: 0;
    padding: 18px;
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

  .form-grid {
    gap: 16px;
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

  .form-actions .primary-button {
    padding-inline: 16px;
  }

  .form-grid :is(input, select, textarea):focus {
    scroll-margin-bottom: 96px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .form-skeleton span {
    animation: none;
    background: var(--sand-100);
  }

  .mood-swap-enter-active,
  .mood-swap-leave-active,
  .form-content-enter-active,
  .form-content-leave-active {
    transition: none;
  }
}
</style>
