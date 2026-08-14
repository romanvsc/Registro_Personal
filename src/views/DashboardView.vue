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
import { sessionStore } from '../contexts/identity-access/application/sessionStore'
import { journalApi } from '../contexts/personal-journal/infrastructure/journalApi'
import { entryTypes, loadJournal } from '../lib/entries'
import CatScore from '../components/CatScore.vue'
import AppIcon from '../shared/components/AppIcon.vue'

const base = import.meta.env.BASE_URL

const recent = ref([])
const recentLoading = ref(false)
const recentError = ref('')

const date = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
const userName = computed(() => sessionStore.user.value?.name?.trim() || '')
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

const trendBars = computed(() => insightTrend.value.map(item => {
  const score = Math.min(10, Math.max(0, Number(item.averageScore) || 0))
  const parsedDate = new Date(`${item.date}T12:00:00`)
  const dateLabel = Number.isNaN(parsedDate.getTime())
    ? item.date
    : new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })
      .format(parsedDate)
      .replace('.', '')

  return {
    ...item,
    score,
    dateLabel,
    height: `${Math.max(8, score * 10)}%`,
  }
}))
const trendMinWidth = computed(() => `${trendBars.value.length * 50}px`)

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
      <div><p class="eyebrow">{{ date }}</p><h1>Hola<span v-if="userName">, {{ userName }}</span> <span></span></h1><p>Hoy también cuenta. Registrá cómo viene tu día.</p></div>
      <RouterLink v-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`"><AppIcon name="nuevo-registro" /> Nuevo registro</RouterLink>
    </header>

    <section class="hero-card" :class="{ 'is-empty': !totalEntries }">
      <div v-if="hasSummary && totalEntries">
        <span class="soft-label">TU PROMEDIO</span><h2>{{ averageScore }} <small>/ 10</small></h2>
        <p>{{ catForInsight(averageScore).name }} dice que vas {{ averageScore >= 8 ? 'con toda' : averageScore >= 4 ? 'a tu ritmo' : 'con paciencia' }}. <span v-if="comparisonText" class="comparison-pill">{{ comparisonText }}</span></p>
        <RouterLink to="/historial">Ver evolución →</RouterLink>
      </div>
      <div v-else-if="summaryError"><span class="soft-label">ESTADÍSTICAS</span><h2 class="empty-title">No pudimos cargar tus estadísticas</h2><button class="primary-button" type="button" @click="loadInsightSummary()">Reintentar</button></div>
      <div v-else-if="loadingSummary" class="hero-loading" role="status">
        <span class="soft-label">ESTADÍSTICAS</span>
        <span class="visually-hidden">Calculando tu promedio…</span>
        <div class="skeleton skeleton--hero-title" aria-hidden="true"></div>
        <div class="skeleton skeleton--hero-copy" aria-hidden="true"></div>
        <div class="skeleton skeleton--hero-link" aria-hidden="true"></div>
      </div>
      <div v-else><span class="soft-label">TODAVÍA NO HAY PROMEDIO</span><h2 class="empty-title">Sin registros todavía</h2><p>Felipa está esperando que le cuentes cómo viene tu día.</p><RouterLink v-if="firstEntryType" :to="`/registrar/${firstEntryType}`">Crear primer registro →</RouterLink></div>
      <img v-if="hasSummary && totalEntries" :src="catForInsight(averageScore).image" :alt="catForInsight(averageScore).name" />
      <img v-else :src="base + 'cats/felipa-molesta.png'" alt="Felipa esperando el primer registro" />
      <div v-if="totalEntries" class="scale-legend"><span>1</span><i></i><i></i><i></i><b></b><b></b><b></b><em></em><em></em><em></em><span>10</span></div>
    </section>

    <section>
      <div class="section-heading"><div><p class="eyebrow">RESUMEN</p><h2>Tu historial</h2></div></div>
      <div class="summary-strip">
        <article><span>Registros</span><template v-if="loadingSummary && !hasSummary"><i class="skeleton skeleton--summary-value" aria-hidden="true"></i><i class="skeleton skeleton--summary-copy" aria-hidden="true"></i></template><template v-else><strong>{{ totalEntries }}</strong><p>{{ totalEntries === 1 ? 'momento registrado' : 'momentos registrados' }}</p></template></article>
        <article><span>Mejor promedio</span><template v-if="loadingSummary && !hasSummary"><i class="skeleton skeleton--summary-value skeleton--summary-value-wide" aria-hidden="true"></i><i class="skeleton skeleton--summary-copy" aria-hidden="true"></i></template><template v-else><strong>{{ bestType?.name || '—' }}</strong><p v-if="bestType">{{ bestType.averageScore }} de promedio</p><p v-else>Sin datos todavía</p></template></article>
      </div>
    </section>

    <section>
      <div class="section-heading"><div><p class="eyebrow">TENDENCIA</p><h2>Últimos 30 días</h2></div></div>
      <div v-if="loadingTrend" class="trend-chart trend-chart--loading" role="status">
        <span class="visually-hidden">Cargando tendencia…</span>
        <div class="skeleton skeleton--trend-caption" aria-hidden="true"></div>
        <div class="trend-skeleton" aria-hidden="true"><i v-for="height in [45, 72, 56, 88, 65, 78, 52]" :key="height" class="skeleton" :style="{ height: `${height}%` }"></i></div>
      </div>
      <div v-else-if="trendError" class="entry-list-empty" role="alert"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>No pudimos cargar tu tendencia</h3><p>{{ trendError }}</p><button class="primary-button" type="button" @click="loadInsightTrend({ days: 30 })">Reintentar</button></div></div>
      <figure v-else-if="insightTrend.length" class="trend-chart">
        <figcaption>Promedio diario de sensación, en una escala de 1 a 10.</figcaption>
        <div class="trend-chart__viewport">
          <div class="trend-chart__axis" aria-hidden="true"><span>10</span><span>5</span><span>0</span></div>
          <ol class="trend-chart__bars" :style="{ '--trend-min-width': trendMinWidth }" aria-label="Tendencia de sensación de los últimos 30 días">
            <li v-for="bar in trendBars" :key="bar.date" :aria-label="`${bar.dateLabel}: ${bar.score} de 10`">
              <strong>{{ bar.score }}</strong>
              <span class="trend-chart__track" aria-hidden="true"><i :style="{ height: bar.height }"></i></span>
              <time :datetime="bar.date">{{ bar.dateLabel }}</time>
            </li>
          </ol>
        </div>
      </figure>
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
      <div v-if="recentLoading" class="entry-list entry-list--loading" role="status">
        <span class="visually-hidden">Cargando registros recientes…</span>
        <article v-for="item in 3" :key="item" aria-hidden="true"><i class="skeleton skeleton--avatar"></i><div><i class="skeleton skeleton--meta"></i><i class="skeleton skeleton--entry-title"></i><i class="skeleton skeleton--entry-copy"></i></div><i class="skeleton skeleton--score"></i></article>
      </div>
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
  animation: insight-cat-in .4s ease-out both;
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
  animation: insight-card-in .32s ease-out both;
}

.summary-strip article:nth-child(2) { animation-delay: 45ms; }

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
  margin: 0;
  padding: 18px 18px 14px;
  border: 1px solid var(--dorito-200, #e9c9a8);
  border-radius: 14px;
  background: var(--cream-50, #fffdf7);
}

.trend-chart figcaption {
  margin-bottom: 14px;
  color: var(--cocoa-700);
  font-size: 13.5px;
}

.trend-chart__viewport {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
}

.trend-chart__axis {
  position: sticky;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 154px;
  padding: 19px 0 24px;
  color: var(--cocoa-600);
  background: var(--cream-50, #fffdf7);
  font-size: 11px;
  text-align: right;
}

.trend-chart__bars {
  display: grid;
  grid-auto-columns: minmax(48px, 1fr);
  grid-auto-flow: column;
  gap: 9px;
  min-width: 100%;
  height: 154px;
  margin: 0;
  padding: 0 2px;
  list-style: none;
  background: linear-gradient(to bottom, transparent 18px, var(--sand-100) 19px, transparent 20px, transparent 76px, var(--sand-100) 77px, transparent 78px, transparent 133px, var(--sand-100) 134px, transparent 135px);
}

.trend-chart__bars li {
  display: grid;
  grid-template-rows: 19px 110px 24px;
  align-items: end;
  min-width: 0;
  text-align: center;
}

.trend-chart__bars strong {
  align-self: start;
  color: var(--cocoa-800);
  font-size: 11px;
}

.trend-chart__track {
  position: relative;
  display: block;
  height: 110px;
}

.trend-chart__track i {
  position: absolute;
  right: 16%;
  bottom: 0;
  left: 16%;
  min-height: 8px;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(180deg, var(--dorito-300), var(--dorito-500));
  transform-origin: bottom;
  animation: insight-bar-in .42s ease-out both;
}

.trend-chart__bars time {
  align-self: end;
  overflow: hidden;
  color: var(--cocoa-700);
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-card p {
  color: var(--cocoa-700);
  font-size: 13.5px;
  line-height: 1.45;
}

.quick-card,
.wellbeing-grid article,
.entry-list:not(.entry-list--loading) article {
  animation: insight-card-in .32s ease-out both;
}

.quick-card:nth-child(2),
.wellbeing-grid article:nth-child(2),
.entry-list:not(.entry-list--loading) article:nth-child(2) { animation-delay: 45ms; }

.quick-card:nth-child(3),
.wellbeing-grid article:nth-child(3),
.entry-list:not(.entry-list--loading) article:nth-child(3) { animation-delay: 90ms; }

.wellbeing-grid article:nth-child(4) { animation-delay: 135ms; }

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

.entry-list article span,
.entry-list article p,
.entry-list-empty p,
.wellbeing-grid small,
.wellbeing-grid p {
  color: var(--cocoa-700);
}

.entry-list article p,
.entry-list-empty p {
  font-size: 13.5px;
  line-height: 1.45;
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

.skeleton {
  display: block;
  border-radius: 999px;
  background: var(--sand-200);
  animation: insight-skeleton-pulse 1.35s ease-in-out infinite;
}

.skeleton--hero-title { width: min(280px, 78%); height: 44px; margin: 12px 0 18px; }
.skeleton--hero-copy { width: min(360px, 90%); height: 15px; }
.skeleton--hero-link { width: 112px; height: 13px; margin-top: 20px; }
.skeleton--summary-value { width: 62px; height: 31px; margin: 9px 0 8px; }
.skeleton--summary-value-wide { width: 132px; }
.skeleton--summary-copy { width: 112px; height: 12px; }
.summary-strip i { font-style: normal; }
.skeleton--trend-caption { width: min(330px, 75%); height: 13px; margin-bottom: 18px; }

.trend-skeleton {
  display: flex;
  align-items: end;
  gap: clamp(8px, 2vw, 18px);
  height: 120px;
  padding: 8px 10px 0;
}

.trend-skeleton i {
  flex: 1;
  min-width: 16px;
  max-width: 64px;
  border-radius: 7px 7px 3px 3px;
}

.entry-list--loading article {
  min-height: 91px;
}

.entry-list--loading article > div { min-width: 0; }
.skeleton--avatar { width: 58px; height: 58px; border-radius: 16px; }
.skeleton--meta { width: 92px; height: 9px; margin-bottom: 7px; }
.skeleton--entry-title { width: min(230px, 72%); height: 14px; margin-bottom: 7px; }
.skeleton--entry-copy { width: min(360px, 92%); height: 10px; }
.skeleton--score { width: 38px; height: 14px; }

@keyframes insight-skeleton-pulse {
  0%, 100% { opacity: .5; }
  50% { opacity: .92; }
}

@keyframes insight-card-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes insight-cat-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes insight-bar-in {
  from { opacity: .4; transform: scaleY(.08); }
  to { opacity: 1; transform: scaleY(1); }
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
  .hero-card:not(.is-empty) {
    grid-template-columns: minmax(0, 1fr) 118px;
    column-gap: 8px;
    min-height: 0;
    padding: 24px 20px 18px;
  }

  .hero-card:not(.is-empty) > img {
    position: relative;
    right: auto;
    bottom: auto;
    grid-column: 2;
    grid-row: 1;
    align-self: end;
    width: 132px;
    height: 150px;
    opacity: 1;
    transform: translateX(10px);
  }

  .hero-card:not(.is-empty) > div:first-child {
    grid-column: 1;
    grid-row: 1;
  }

  .hero-card:not(.is-empty) h2 {
    font-size: 46px;
  }

  .hero-card:not(.is-empty) p {
    margin: 12px 0;
    font-size: 14px;
    line-height: 1.45;
  }

  .hero-card .comparison-pill {
    margin: 8px 0 0;
  }

  .hero-card:not(.is-empty) .scale-legend {
    position: static;
    grid-column: 1 / -1;
    gap: 5px;
    margin-top: 16px;
  }

  .hero-card:not(.is-empty) .scale-legend i,
  .hero-card:not(.is-empty) .scale-legend b,
  .hero-card:not(.is-empty) .scale-legend em {
    flex: 1;
    width: auto;
  }

  .hero-card.is-empty {
    grid-template-columns: minmax(0, 1fr) 92px;
    min-height: 0;
    padding: 24px 20px;
  }

  .hero-card.is-empty > img {
    position: relative;
    right: auto;
    bottom: auto;
    align-self: end;
    width: 100px;
    height: 118px;
    opacity: .92;
  }

  .hero-card.is-empty h2.empty-title {
    font-size: 30px;
  }

  .trend-chart {
    padding-inline: 12px;
  }

  .trend-chart__viewport {
    padding-bottom: 4px;
  }

  .trend-chart__bars {
    min-width: max(100%, var(--trend-min-width));
  }

  .wellbeing-grid article {
    min-height: 92px;
    padding: 15px 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-card:not(.is-empty) > img,
  .summary-strip article,
  .quick-card,
  .wellbeing-grid article,
  .entry-list article,
  .trend-chart__track i,
  .skeleton {
    animation: none;
  }
}
</style>
