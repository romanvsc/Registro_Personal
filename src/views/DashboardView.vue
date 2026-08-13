<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  bestType,
  catForInsight,
  insightComparison,
  insightSummary,
  insightTrend,
  loadingSummary,
  loadingTrend,
  summaryError,
  trendError,
  loadInsightSummary,
  loadInsightTrend,
  loadInsightComparison,
} from '../contexts/personal-insights/application/insightsStore'
import { journalApi } from '../contexts/personal-journal/infrastructure/journalApi'
import { entryTypes, loadJournal } from '../lib/entries'
import CatScore from '../components/CatScore.vue'
import AppIcon from '../shared/components/AppIcon.vue'

const base = import.meta.env.BASE_URL

const recent = ref([])
const recentLoading = ref(false)
const recentError = ref('')

const date = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
const firstEntryType = computed(() => entryTypes.value[0]?.slug || '')

const quick = computed(() => entryTypes.value.map(type => ({
  type: type.slug,
  title: type.name,
  copy: `Registrá ${type.name.toLowerCase()} y cómo te hizo sentir.`,
  icon: type.icon,
})))

const totalEntries = computed(() => insightSummary.value?.totalEntries ?? 0)
const averageScore = computed(() => insightSummary.value?.averageScore ?? 0)
const hasSummary = computed(() => insightSummary.value !== null)
const hasComparison = computed(() => insightComparison.value?.difference?.percentage !== undefined && insightComparison.value?.difference?.percentage !== null)

const comparisonText = computed(() => {
  if (!hasComparison.value) return ''
  const percentage = insightComparison.value.difference.percentage
  const direction = percentage >= 0 ? 'mejor' : 'menor'
  return `${Math.abs(percentage).toFixed(1)}% ${direction} que el periodo anterior`
})

const trendMax = computed(() => {
  const values = insightTrend.value.map(item => item.averageScore)
  return values.length ? Math.max(...values, 1) : 1
})

function trendBars() {
  const items = insightTrend.value
  if (!items.length) return []
  const width = 24
  const gap = 6
  const chartWidth = items.length * (width + gap) - gap
  let x = 0
  return items.map(item => {
    const height = Math.max(6, (item.averageScore / trendMax.value) * 100)
    const bar = { x, y: 100 - height, width, height, score: item.averageScore, date: item.date }
    x += width + gap
    return bar
  })
}

async function loadRecent() {
  recentLoading.value = true
  recentError.value = ''
  try {
    const records = await journalApi.listEntries({ page: 1, limit: 3 })
    recent.value = records.items || []
  } catch (error) {
    recentError.value = error instanceof Error ? error.message : 'No se pudieron cargar los registros recientes.'
  } finally {
    recentLoading.value = false
  }
}

onMounted(async () => {
  loadInsightSummary()
  loadInsightTrend({ days: 30 })
  loadInsightComparison({ period: 'month' })
  loadJournal()
  loadRecent()
})

const wellbeing = [
  { icon: 'agua', label: 'Agua', value: '—', detail: 'Sin registros', tone: 'info' },
  { icon: 'racha', label: 'Racha', value: '—', detail: 'Sin registros', tone: 'orange' },
  { icon: 'progreso', label: 'Progreso', value: '—', detail: 'Sin registros', tone: 'success' },
  { icon: 'sueno', label: 'Sueño', value: '—', detail: 'Sin registros', tone: 'olive' },
]
</script>

<template>
  <div class="page dashboard-page">
    <header class="page-header">
      <div><p class="eyebrow">{{ date }}</p><h1>Hola, Roman <span></span></h1><p>Hoy también cuenta. Registrá cómo viene tu día.</p></div>
      <RouterLink v-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`"><AppIcon name="nuevo-registro" /> Nuevo registro</RouterLink>
    </header>

    <section class="hero-card" :class="{ 'is-empty': !totalEntries }">
      <div v-if="hasSummary && totalEntries">
        <span class="soft-label">TU PROMEDIO</span><h2>{{ averageScore }} <small>/ 10</small></h2>
        <p>{{ catForInsight(averageScore).name }} dice que vas {{ averageScore >= 8 ? 'con toda' : averageScore >= 4 ? 'a tu ritmo' : 'con paciencia' }}. <span v-if="comparisonText" class="comparison-pill">{{ comparisonText }}</span></p>
        <RouterLink to="/historial">Ver evolución →</RouterLink>
      </div>
      <div v-else-if="summaryError"><span class="soft-label">ESTADÍSTICAS</span><h2 class="empty-title">No pudimos cargar tus estadísticas</h2><button class="primary-button" type="button" @click="loadInsightSummary()">Reintentar</button></div>
      <div v-else><span class="soft-label">TODAVÍA NO HAY PROMEDIO</span><h2 class="empty-title">Sin registros todavía</h2><p>Felipa está esperando que le cuentes cómo viene tu día.</p><RouterLink v-if="firstEntryType" :to="`/registrar/${firstEntryType}`">Crear primer registro →</RouterLink></div>
      <img v-if="hasSummary && totalEntries" :src="catForInsight(averageScore).image" :alt="catForInsight(averageScore).name" />
      <img v-else :src="base + 'cats/felipa-molesta.png'" alt="Felipa esperando el primer registro" />
      <div v-if="totalEntries" class="scale-legend"><span>1</span><i></i><i></i><i></i><b></b><b></b><b></b><em></em><em></em><em></em><span>10</span></div>
    </section>

    <section>
      <div class="section-heading"><div><p class="eyebrow">RESUMEN</p><h2>Tu historial</h2></div></div>
      <div class="summary-strip">
        <article><span>Registros</span><strong>{{ totalEntries }}</strong><p>{{ totalEntries === 1 ? 'momento registrado' : 'momentos registrados' }}</p></article>
        <article><span>Mejor promedio</span><strong>{{ bestType?.name || '—' }}</strong><p v-if="bestType">{{ bestType.averageScore }} de promedio</p><p v-else>Sin datos todavía</p></article>
      </div>
    </section>

    <section>
      <div class="section-heading"><div><p class="eyebrow">TENDENCIA</p><h2>Últimos 30 días</h2></div></div>
      <p v-if="loadingTrend" class="soft-label" role="status">Cargando tendencia…</p>
      <div v-else-if="trendError" class="entry-list-empty" role="alert"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>No pudimos cargar tu tendencia</h3><p>{{ trendError }}</p><button class="primary-button" type="button" @click="loadInsightTrend({ days: 30 })">Reintentar</button></div></div>
      <div v-else-if="insightTrend.length" class="trend-chart" aria-label="Tendencia de sensación de los últimos 30 días">
        <svg viewBox="0 0 480 120" preserveAspectRatio="none" role="img">
          <g v-for="bar in trendBars()" :key="bar.date">
            <rect :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height" rx="4" fill="var(--dorito-400, #d79a5b)" />
            <title>{{ bar.date }} — {{ bar.score }} / 10</title>
          </g>
        </svg>
      </div>
      <div v-else class="entry-list-empty"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>Sin tendencia todavía</h3><p>Cuando sumes registros, acá vas a ver cómo evoluciona tu sensación.</p></div></div>
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
      <p v-if="recentLoading" class="soft-label" role="status">Cargando recientes…</p>
      <div v-else-if="recentError" class="entry-list-empty"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>No pudimos cargar los recientes</h3><p>{{ recentError }}</p><button class="primary-button" type="button" @click="loadRecent">Reintentar</button></div></div>
      <div v-else-if="recent.length" class="entry-list"><article v-for="entry in recent" :key="entry.id"><CatScore :score="entry.score" /><div><span>{{ entry.typeName }} · {{ entry.time }}</span><h3>{{ entry.title }}</h3><p>{{ entry.detail || 'Sin notas' }}</p></div><strong>{{ entry.score }}/10</strong></article></div>
      <div v-else class="entry-list-empty"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>Sin registros todavía</h3><p>Cuando agregues cualquier tipo de registro habilitado, aparecerá acá.</p></div></div>
    </section>
  </div>
</template>

<style scoped>
.hero-card:not(.is-empty) {
  grid-template-columns: minmax(0, 1fr) 310px;
}

.hero-card:not(.is-empty) > img {
  right: 34px;
  bottom: -8px;
  width: 315px;
  height: 282px;
}

.comparison-pill {
  display: inline-block;
  margin-left: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--sage-100, #e3efe4);
  color: var(--sage-700, #3f7a4a);
  font-size: 12.5px;
  font-weight: 700;
}

.summary-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.summary-strip article {
  padding: 18px 16px;
  border: 1px solid var(--dorito-200, #e9c9a8);
  border-radius: 14px;
  background: var(--cream-50, #fffdf7);
}

.summary-strip span {
  color: var(--cocoa-700);
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-strip strong {
  display: block;
  margin: 6px 0 2px;
  color: var(--cocoa-900);
  font-size: 26px;
}

.summary-strip p {
  margin: 0;
  color: var(--cocoa-600);
  font-size: 13.5px;
}

.trend-chart {
  padding: 14px 10px;
  border: 1px solid var(--dorito-200, #e9c9a8);
  border-radius: 14px;
  background: var(--cream-50, #fffdf7);
}

.trend-chart svg {
  width: 100%;
  height: 120px;
  display: block;
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