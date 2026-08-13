<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  hasMoreInsights,
  insightEntries,
  insightEntryTypes,
  insightsError,
  insightsLoading,
  loadMoreInsights,
  loadPersonalInsights,
} from '../contexts/personal-insights/application/insightsStore'
import CatScore from '../components/CatScore.vue'
import AppIcon from '../shared/components/AppIcon.vue'

const base = import.meta.env.BASE_URL

const filter = ref('todos')
const firstEntryType = computed(() => insightEntryTypes.value[0]?.slug || '')
const filtered = computed(() => filter.value === 'todos'
  ? insightEntries.value
  : insightEntries.value.filter(entry => entry.type === filter.value))

onMounted(loadPersonalInsights)
</script>

<template>
  <div class="page history-page" :aria-busy="insightsLoading">
    <header class="page-header"><div><p class="eyebrow">TU CAMINO</p><h1>Historial</h1><p>Todos tus momentos, sin perder de vista cómo te hicieron sentir.</p></div><RouterLink v-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`"><AppIcon name="nuevo-registro" /> Nuevo registro</RouterLink></header>

    <p v-if="insightsLoading" class="soft-label" role="status">Cargando historial…</p>
    <div v-else-if="insightsError" class="entry-list-empty" role="alert"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>No pudimos cargar el historial</h3><p>{{ insightsError }}</p><button class="primary-button" type="button" @click="loadPersonalInsights">Reintentar</button></div></div>

    <template v-else>
      <div class="filters"><button :class="{ active: filter === 'todos' }" @click="filter = 'todos'">Todos</button><button v-for="item in insightEntryTypes" :key="item.slug" :class="{ active: filter === item.slug }" @click="filter = item.slug">{{ item.name }}</button></div>
      <div v-if="filtered.length" class="history-grid"><article v-for="entry in filtered" :key="entry.id"><CatScore :score="entry.score" size="lg" /><div><span>{{ entry.typeName }} · {{ entry.time }}</span><h2>{{ entry.title }}</h2><p>{{ entry.detail || 'Sin notas' }}</p></div><b>{{ entry.score }}/10</b></article></div>
      <div v-else class="entry-list-empty"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>Sin registros todavía</h3><p>{{ filter === 'todos' ? 'Felipa te espera para registrar el primer momento.' : 'No hay registros de este tipo.' }}</p></div></div>
      <button v-if="hasMoreInsights" class="primary-button load-more" type="button" @click="loadMoreInsights" :disabled="insightsLoading">{{ insightsLoading ? 'Cargando…' : 'Cargar más' }}</button>
    </template>
  </div>
</template>
