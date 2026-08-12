<script setup>
import { computed, onMounted } from 'vue'
import {
  catForInsight,
  hasInsightEntries,
  insightAverage,
  insightEntries,
  insightEntryTypes,
  insightsError,
  insightsLoading,
  loadPersonalInsights,
} from '../contexts/personal-insights/application/insightsStore'
import CatScore from '../components/CatScore.vue'
import AppIcon from '../shared/components/AppIcon.vue'

const base = import.meta.env.BASE_URL

const date = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
const firstEntryType = computed(() => insightEntryTypes.value[0]?.slug || '')
const quick = computed(() => insightEntryTypes.value.map(type => ({
  type: type.slug,
  title: type.name,
  copy: `Registrá ${type.name.toLowerCase()} y cómo te hizo sentir.`,
  icon: type.icon,
})))

onMounted(loadPersonalInsights)

const wellbeing = [
  { icon: 'agua', label: 'Agua', value: '—', detail: 'Sin registros', tone: 'info' },
  { icon: 'racha', label: 'Racha', value: '—', detail: 'Sin registros', tone: 'orange' },
  { icon: 'progreso', label: 'Progreso', value: '—', detail: 'Sin registros', tone: 'success' },
  { icon: 'sueno', label: 'Sueño', value: '—', detail: 'Sin registros', tone: 'olive' },
]
</script>

<template>
  <div class="page dashboard-page" :aria-busy="insightsLoading">
    <header class="page-header">
      <div><p class="eyebrow">{{ date }}</p><h1>Hola, Roman <span></span></h1><p>Hoy también cuenta. Registrá cómo viene tu día.</p></div>
      <RouterLink v-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`"><AppIcon name="nuevo-registro" /> Nuevo registro</RouterLink>
    </header>

    <p v-if="insightsLoading" class="soft-label" role="status">Cargando tus registros…</p>
    <div v-else-if="insightsError" class="entry-list-empty" role="alert">
      <img :src="base + 'cats/felipa-molesta.png'" alt="" />
      <div><h3>No pudimos cargar tus registros</h3><p>{{ insightsError }}</p><button class="primary-button" type="button" @click="loadPersonalInsights">Reintentar</button></div>
    </div>

    <template v-else>
      <section class="hero-card" :class="{ 'is-empty': !hasInsightEntries }">
        <div v-if="hasInsightEntries"><span class="soft-label">TU PROMEDIO DE HOY</span><h2>{{ insightAverage }} <small>/ 10</small></h2><p>{{ catForInsight(insightAverage).name }} dice que vas llevando el día {{ insightAverage >= 8 ? 'con toda' : insightAverage >= 4 ? 'a tu ritmo' : 'con paciencia' }}.</p><RouterLink to="/historial">Ver evolución →</RouterLink></div>
        <div v-else><span class="soft-label">TODAVÍA NO HAY PROMEDIO</span><h2 class="empty-title">Sin registros todavía</h2><p>Felipa está esperando que le cuentes cómo viene tu día.</p><RouterLink v-if="firstEntryType" :to="`/registrar/${firstEntryType}`">Crear primer registro →</RouterLink></div>
        <img :src="hasInsightEntries ? catForInsight(insightAverage).image : base + 'cats/felipa-molesta.png'" :alt="hasInsightEntries ? catForInsight(insightAverage).name : 'Felipa esperando el primer registro'" />
        <div v-if="hasInsightEntries" class="scale-legend"><span>1</span><i></i><i></i><i></i><b></b><b></b><b></b><em></em><em></em><em></em><span>10</span></div>
      </section>

      <section><div class="section-heading"><div><p class="eyebrow">SUMÁ UN MOMENTO</p><h2>¿Qué querés registrar?</h2></div></div>
        <div v-if="quick.length" class="quick-grid"><RouterLink v-for="item in quick" :key="item.type" :to="`/registrar/${item.type}`" class="quick-card"><span><AppIcon :name="item.icon" /></span><div><h3>{{ item.title }}</h3><p>{{ item.copy }}</p></div><b>＋</b></RouterLink></div>
        <p v-else class="form-error" role="status">Todavía no hay tipos de registro habilitados.</p>
      </section>

      <section class="wellbeing-section">
        <div class="section-heading"><div><p class="eyebrow">UN VISTAZO</p><h2>Tu bienestar</h2></div></div>
        <div class="wellbeing-grid"><article v-for="item in wellbeing" :key="item.label" :class="item.tone"><span><AppIcon :name="item.icon" /></span><div><small>{{ item.label }}</small><strong>{{ item.value }}</strong><p>{{ item.detail }}</p></div></article></div>
      </section>

      <section><div class="section-heading"><div><p class="eyebrow">ASÍ VIENE EL DÍA</p><h2>Registros recientes</h2></div><RouterLink to="/historial">Ver todos</RouterLink></div>
        <div v-if="hasInsightEntries" class="entry-list"><article v-for="entry in insightEntries.slice(0, 3)" :key="entry.id"><CatScore :score="entry.score" /><div><span>{{ entry.typeName }} · {{ entry.time }}</span><h3>{{ entry.title }}</h3><p>{{ entry.detail || 'Sin notas' }}</p></div><strong>{{ entry.score }}/10</strong></article></div>
        <div v-else class="entry-list-empty"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>Sin registros todavía</h3><p>Cuando agregues cualquier tipo de registro habilitado, aparecerá acá.</p></div></div>
      </section>
    </template>
  </div>
</template>

<style scoped>
/* PersonalInsights presentation: strengthen the daily summary without changing its projection. */
.hero-card:not(.is-empty) {
  grid-template-columns: minmax(0, 1fr) 310px;
}

.hero-card:not(.is-empty) > img {
  right: 34px;
  bottom: -8px;
  width: 315px;
  height: 282px;
}

.quick-card p {
  color: var(--cocoa-700);
  font-size: 13.5px;
  line-height: 1.45;
}

.quick-card > b {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--dorito-200);
  border-radius: 50%;
  background: var(--dorito-50);
  color: var(--dorito-600);
  font-size: 21px;
  font-weight: 700;
  line-height: 1;
  transition: background-color .2s ease, color .2s ease, transform .2s ease;
}

.quick-card:hover > b,
.quick-card:focus-visible > b {
  background: var(--dorito-500);
  color: white;
  transform: scale(1.06);
}

.wellbeing-grid article {
  min-height: 104px;
  padding: 19px 16px;
}

@media (max-width: 900px) {
  .hero-card:not(.is-empty) {
    grid-template-columns: 1fr;
  }

  .hero-card:not(.is-empty) > img {
    right: 10px;
  }
}

@media (max-width: 560px) {
  .hero-card:not(.is-empty) > img {
    width: 205px;
    height: 205px;
  }

  .wellbeing-grid article {
    min-height: 92px;
    padding: 15px 14px;
  }
}
</style>
