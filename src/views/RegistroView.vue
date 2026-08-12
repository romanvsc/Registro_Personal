<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addEntry, catFor, entryTypes, journalError, loadJournal } from '../lib/entries'

const route = useRoute()
const router = useRouter()
const type = ref('')
const score = ref(7)
const title = ref('')
const notes = ref('')
const values = reactive({})
const saving = ref(false)
const selectedType = computed(() => entryTypes.value.find(item => item.slug === type.value) || entryTypes.value[0])
const cat = computed(() => catFor(score.value))

function selectRouteType() {
  const requested = String(route.params.type || '')
  type.value = entryTypes.value.some(item => item.slug === requested) ? requested : (entryTypes.value[0]?.slug || '')
}

onMounted(async () => { await loadJournal(); selectRouteType() })
watch(() => route.params.type, selectRouteType)

async function save() {
  if (!selectedType.value) return
  saving.value = true
  try {
    await addEntry({ type: type.value, title: title.value || selectedType.value.name, notes: notes.value, score: score.value, values })
    router.push('/')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="page form-page">
    <header class="page-header"><div><p class="eyebrow">NUEVO MOMENTO</p><h1>Registrar {{ selectedType?.name?.toLowerCase() || 'momento' }}</h1><p>Sin juicios ni objetivos perfectos. Sólo cómo fue para vos.</p></div></header>
    <form v-if="selectedType" class="record-form" @submit.prevent="save">
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
        <label><span>Notas</span><textarea v-model="notes" rows="4" placeholder="Contá un poco más, si querés..."></textarea></label>
      </div>
      <div class="form-actions"><RouterLink to="/">Cancelar</RouterLink><button class="primary-button" type="submit" :disabled="saving">{{ saving ? 'Guardando…' : 'Guardar registro' }}</button></div>
    </form>
  </div>
</template>
