<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
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
  wellbeingStreak,
  wellbeingProgress,
  loadingWellbeingStreak,
  loadingWellbeingProgress,
  wellbeingStreakError,
  wellbeingProgressError,
  loadInsightSummary,
  loadInsightTrend,
  loadInsightComparison,
  loadWellbeingStreak,
  loadWellbeingProgress,
} from '../contexts/personal-insights/application/insightsStore'
import { sessionStore } from '../contexts/identity-access/application/sessionStore'
import { journalApi } from '../contexts/personal-journal/infrastructure/journalApi'
import { formatTrendRange, summarizeTrend } from '../contexts/personal-insights/application/trendPresentation'
import { entryTypes, loadJournal } from '../lib/entries'
import CatScore from '../components/CatScore.vue'
import AppIcon from '../shared/components/AppIcon.vue'
import { MOTION, gsap } from '../shared/motion/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const base = import.meta.env.BASE_URL

const recent = ref([])
const recentLoading = ref(false)
const recentError = ref('')
const dashboardRoot = ref(null)
let dashboardMotionMedia = null

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
const trendRange = computed(() => formatTrendRange(trendBars.value))
const trendSummary = computed(() => summarizeTrend(trendBars.value))
const trendNeedsScroll = computed(() => trendBars.value.length > 8)

function entryRail(entry) {
  const type = String(entry?.type || entry?.typeName || '').toLowerCase()
  if (type.includes('entren') || type.includes('ejercicio')) return 'var(--neo-lavender-strong, #8f7ac4)'
  if (type.includes('ánimo') || type.includes('animo') || type.includes('mood')) return 'var(--neo-sage-strong, #5b8c72)'
  if (type.includes('comida') || type.includes('aliment')) return 'var(--neo-orange-strong, #c45f16)'
  return 'var(--neo-butter-strong, #b47c18)'
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

function setupDashboardMotion() {
  dashboardMotionMedia?.revert()
  dashboardMotionMedia = null

  const root = dashboardRoot.value
  if (!root) return

  dashboardMotionMedia = gsap.matchMedia()
  dashboardMotionMedia.add(
    {
      reduce: '(prefers-reduced-motion: reduce)',
      compact: '(max-width: 720px)',
      desktop: '(min-width: 721px)',
    },
    ({ conditions }) => {
      if (conditions.reduce) return

      root.querySelectorAll('[data-motion-section]').forEach((section) => {
        const targets = [
          ...(section.matches('[data-motion-reveal]') ? [section] : []),
          ...section.querySelectorAll('[data-motion-reveal], .summary-strip article, .quick-card, .wellbeing-grid article, .entry-list:not(.entry-list--loading) article'),
        ]
        if (!targets.length) targets.push(section)

        const shadowTargets = targets.filter((target) => {
          const shadow = window.getComputedStyle(target).boxShadow
          return shadow && shadow !== 'none'
        })
        const finalShadows = new Map(shadowTargets.map((target) => [target, window.getComputedStyle(target).boxShadow]))

        // Keep the editorial irregularity in CSS: GSAP clears its temporary
        // transform when the reveal finishes so card rotations remain intact.
        gsap.set(targets, {
          opacity: 0,
          y: MOTION.offset.reveal,
          rotation: (index) => (index % 2 ? -MOTION.rotation.reveal : MOTION.rotation.reveal),
          scale: MOTION.scale.reveal,
          transformOrigin: '50% 0%',
        })
        if (shadowTargets.length) {
          gsap.set(shadowTargets, { boxShadow: '2px 2px 0 rgba(33, 25, 20, .72)' })
        }
        ScrollTrigger.create({
          trigger: section,
          start: conditions.compact ? 'top 90%' : 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: MOTION.duration.reveal,
              ease: MOTION.ease.standard,
              stagger: MOTION.stagger,
              overwrite: 'auto',
              onComplete: () => gsap.set(targets, { clearProps: 'transform,opacity' }),
            })
            if (shadowTargets.length) gsap.to(shadowTargets, {
              boxShadow: (_, target) => finalShadows.get(target),
              duration: MOTION.duration.reveal,
              ease: MOTION.ease.standard,
              stagger: MOTION.stagger,
              overwrite: 'auto',
              onComplete: () => gsap.set(shadowTargets, { clearProps: 'boxShadow' }),
            })
          },
        })
      })

      const chart = root.querySelector('.trend-chart')
      const bars = [...root.querySelectorAll('[data-motion-bar]')]
      if (!chart || !bars.length) return

      gsap.set(bars, {
        opacity: 0.35,
        scaleY: 0.08,
        rotation: (index) => (index % 2 ? -0.35 : 0.35),
        transformOrigin: 'bottom',
      })
      ScrollTrigger.create({
        trigger: chart,
        start: conditions.compact ? 'top 92%' : 'top 84%',
        once: true,
        onEnter: () => gsap.to(bars, {
          opacity: 1,
          scaleY: 1,
          rotation: 0,
          duration: MOTION.duration.reveal,
          ease: MOTION.ease.standard,
          stagger: MOTION.stagger,
          overwrite: 'auto',
          onComplete: () => gsap.set(bars, { clearProps: 'transform,opacity' }),
        }),
      })
    },
  )
}

onMounted(async () => {
  await Promise.all([
    loadInsightSummary(),
    loadInsightTrend({ days: 30 }),
    loadInsightComparison({ period: 'month' }),
    loadWellbeingStreak(),
    loadWellbeingProgress(),
    loadJournal(),
    loadRecent(),
  ])
  await nextTick()
  setupDashboardMotion()
})

onBeforeUnmount(() => {
  dashboardMotionMedia?.revert()
  dashboardMotionMedia = null
})

const wellbeing = computed(() => [
  {
    icon: 'racha',
    label: 'Racha',
    value: wellbeingStreak.value.value,
    detail: wellbeingStreakError.value ? 'No pudimos calcularla' : wellbeingStreak.value.detail,
    tone: 'orange',
    loading: loadingWellbeingStreak.value,
    error: wellbeingStreakError.value,
    retry: loadWellbeingStreak,
  },
  {
    icon: 'progreso',
    label: 'Progreso semanal',
    value: wellbeingProgress.value.value,
    detail: wellbeingProgressError.value ? 'No pudimos calcularlo' : wellbeingProgress.value.detail,
    tone: wellbeingProgress.value.direction === 'down' ? 'orange' : 'success',
    loading: loadingWellbeingProgress.value,
    error: wellbeingProgressError.value,
    retry: loadWellbeingProgress,
  },
])
</script>

<template>
  <div ref="dashboardRoot" class="page dashboard-page">
    <header class="page-header" data-motion-section data-motion-reveal>
      <div><p class="eyebrow">{{ date }}</p><h1>Hola<span v-if="userName">, {{ userName }}</span> <span></span></h1><p>Hoy también cuenta. Registrá cómo viene tu día.</p></div>
      <RouterLink v-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`"><AppIcon name="nuevo-registro" /> Nuevo registro</RouterLink>
    </header>

    <section class="hero-card" data-motion-section data-motion-reveal :class="{ 'is-empty': !totalEntries }">
      <div v-if="hasSummary && totalEntries" class="hero-card__content" data-motion-reveal>
        <span class="soft-label hero-sticker">TU PROMEDIO</span><h2 class="hero-score"><span>{{ averageScore }}</span><small>/ 10</small></h2>
        <p>{{ catForInsight(averageScore).name }} dice que vas {{ averageScore >= 8 ? 'con toda' : averageScore >= 4 ? 'a tu ritmo' : 'con paciencia' }}. <span v-if="comparisonText" class="comparison-pill">{{ comparisonText }}</span></p>
        <RouterLink to="/historial">Ver evolución →</RouterLink>
      </div>
      <div v-else-if="summaryError" class="hero-card__content"><span class="soft-label hero-sticker">ESTADÍSTICAS</span><h2 class="empty-title">No pudimos cargar tus estadísticas</h2><button class="primary-button" type="button" @click="loadInsightSummary()">Reintentar</button></div>
      <div v-else-if="loadingSummary" class="hero-card__content hero-loading" role="status">
        <span class="soft-label">ESTADÍSTICAS</span>
        <span class="visually-hidden">Calculando tu promedio…</span>
        <div class="skeleton skeleton--hero-title" aria-hidden="true"></div>
        <div class="skeleton skeleton--hero-copy" aria-hidden="true"></div>
        <div class="skeleton skeleton--hero-link" aria-hidden="true"></div>
      </div>
      <div v-else class="hero-card__content"><span class="soft-label hero-sticker">TODAVÍA NO HAY PROMEDIO</span><h2 class="empty-title">Sin registros todavía</h2><p>Felipa está esperando que le cuentes cómo viene tu día.</p><RouterLink v-if="firstEntryType" :to="`/registrar/${firstEntryType}`">Crear primer registro →</RouterLink></div>
      <img v-if="hasSummary && totalEntries" :src="catForInsight(averageScore).image" :alt="catForInsight(averageScore).name" />
      <img v-else :src="base + 'cats/felipa-molesta.png'" alt="Felipa esperando el primer registro" />
      <div v-if="totalEntries" class="scale-legend"><span>1</span><i></i><i></i><i></i><b></b><b></b><b></b><em></em><em></em><em></em><span>10</span></div>
    </section>

    <section class="dashboard-section dashboard-section--summary" data-motion-section data-motion-reveal>
      <div class="section-heading"><div><p class="eyebrow">RESUMEN</p><h2>Tu historial</h2></div></div>
      <div class="summary-strip">
        <article><span>Registros</span><template v-if="loadingSummary && !hasSummary"><i class="skeleton skeleton--summary-value" aria-hidden="true"></i><i class="skeleton skeleton--summary-copy" aria-hidden="true"></i></template><template v-else><strong>{{ totalEntries }}</strong><p>{{ totalEntries === 1 ? 'momento registrado' : 'momentos registrados' }}</p></template></article>
        <article><span>Mejor promedio</span><template v-if="loadingSummary && !hasSummary"><i class="skeleton skeleton--summary-value skeleton--summary-value-wide" aria-hidden="true"></i><i class="skeleton skeleton--summary-copy" aria-hidden="true"></i></template><template v-else><strong>{{ bestType?.name || '—' }}</strong><p v-if="bestType">{{ bestType.averageScore }} de promedio</p><p v-else>Sin datos todavía</p></template></article>
      </div>
    </section>

    <section class="dashboard-section dashboard-section--trend" data-motion-section data-motion-reveal>
      <div class="section-heading"><div><p class="eyebrow">TENDENCIA</p><h2>Últimos 30 días</h2></div></div>
      <div v-if="loadingTrend" class="trend-chart trend-chart--loading" role="status">
        <span class="visually-hidden">Cargando tendencia…</span>
        <div class="skeleton skeleton--trend-caption" aria-hidden="true"></div>
        <div class="trend-skeleton" aria-hidden="true"><i v-for="height in [45, 72, 56, 88, 65, 78, 52]" :key="height" class="skeleton" :style="{ height: `${height}%` }"></i></div>
      </div>
      <div v-else-if="trendError" class="entry-list-empty" role="alert"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>No pudimos cargar tu tendencia</h3><p>{{ trendError }}</p><button class="primary-button" type="button" @click="loadInsightTrend({ days: 30 })">Reintentar</button></div></div>
      <figure v-else-if="insightTrend.length" class="trend-chart" data-motion-reveal>
        <figcaption>Promedio diario de sensación, en una escala de 1 a 10.</figcaption>
        <p v-if="trendRange" class="trend-chart__range">Datos disponibles: {{ trendRange }}</p>
        <p id="trend-summary" class="trend-chart__summary">{{ trendSummary }}</p>
        <p v-if="trendNeedsScroll" id="trend-scroll-hint" class="trend-chart__hint" role="note"><span aria-hidden="true">↔</span> Deslizá horizontalmente para explorar todos los días.</p>
        <div class="trend-chart__viewport" role="region" aria-label="Gráfico de tendencia" tabindex="0" :aria-describedby="trendNeedsScroll ? 'trend-summary trend-scroll-hint' : 'trend-summary'">
          <div class="trend-chart__axis" aria-hidden="true"><span>10</span><span>5</span><span>0</span></div>
          <ol class="trend-chart__bars" :style="{ '--trend-min-width': trendMinWidth }" aria-label="Tendencia de sensación de los últimos 30 días">
            <li v-for="bar in trendBars" :key="bar.date" :aria-label="`${bar.dateLabel}: ${bar.score} de 10`">
              <strong>{{ bar.score }}</strong>
              <span class="trend-chart__track" aria-hidden="true"><i data-motion-bar :style="{ height: bar.height }"></i></span>
              <time :datetime="bar.date">{{ bar.dateLabel }}</time>
            </li>
          </ol>
        </div>
      </figure>
      <div v-else class="entry-list-empty entry-list-empty--insight"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>Tu tendencia empieza con el primer registro</h3><p>Cuando registres un momento, vas a poder ver cómo evoluciona tu sensación durante los últimos 30 días.</p><RouterLink v-if="firstEntryType" class="primary-button" :to="`/registrar/${firstEntryType}`">Crear primer registro</RouterLink></div></div>
    </section>

    <section class="dashboard-section dashboard-section--quick" data-motion-section><div class="section-heading"><div><p class="eyebrow">SUMÁ UN MOMENTO</p><h2>¿Qué querés registrar?</h2></div></div>
      <div v-if="quick.length" class="quick-grid"><RouterLink v-for="item in quick" :key="item.type" :to="`/registrar/${item.type}`" class="quick-card"><span><AppIcon :name="item.icon" /></span><div><h3>{{ item.title }}</h3><p>{{ item.copy }}</p></div><b>＋</b></RouterLink></div>
      <p v-else class="form-error" role="status">Todavía no hay tipos de registro habilitados.</p>
    </section>

    <section class="dashboard-section dashboard-section--wellbeing wellbeing-section" data-motion-section data-motion-reveal>
      <div class="section-heading"><div><p class="eyebrow">UN VISTAZO</p><h2>Tu bienestar</h2></div></div>
      <div class="wellbeing-grid" aria-live="polite">
        <article v-for="item in wellbeing" :key="item.label" :class="item.tone" :aria-busy="item.loading">
          <span><AppIcon :name="item.icon" /></span>
          <div>
            <small>{{ item.label }}</small>
            <template v-if="item.loading">
              <i class="skeleton wellbeing-card__value" aria-hidden="true"></i>
              <i class="skeleton wellbeing-card__detail" aria-hidden="true"></i>
              <span class="visually-hidden">Calculando {{ item.label.toLowerCase() }}…</span>
            </template>
            <template v-else>
              <strong>{{ item.value }}</strong>
              <p>{{ item.detail }}</p>
              <button v-if="item.error" type="button" @click="item.retry">Reintentar</button>
            </template>
          </div>
        </article>
      </div>
    </section>

    <section class="dashboard-section dashboard-section--recent" data-motion-section><div class="section-heading"><div><p class="eyebrow">ASÍ VIENE EL DÍA</p><h2>Registros recientes</h2></div><RouterLink to="/historial">Ver todos</RouterLink></div>
      <div v-if="recentLoading" class="entry-list entry-list--loading" role="status">
        <span class="visually-hidden">Cargando registros recientes…</span>
        <article v-for="item in 3" :key="item" aria-hidden="true"><i class="skeleton skeleton--avatar"></i><div><i class="skeleton skeleton--meta"></i><i class="skeleton skeleton--entry-title"></i><i class="skeleton skeleton--entry-copy"></i></div><i class="skeleton skeleton--score"></i></article>
      </div>
      <div v-else-if="recentError" class="entry-list-empty"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>No pudimos cargar los recientes</h3><p>{{ recentError }}</p><button class="primary-button" type="button" @click="loadRecent">Reintentar</button></div></div>
      <div v-else-if="recent.length" class="entry-list"><article v-for="entry in recent" :key="entry.id" class="entry-list__row" :style="{ '--entry-rail': entryRail(entry) }"><CatScore :score="entry.score" /><div><span>{{ entry.typeName }} · {{ entry.time }}</span><h3>{{ entry.title }}</h3><p>{{ entry.detail || 'Sin notas' }}</p></div><strong>{{ entry.score }}/10</strong></article></div>
      <div v-else class="entry-list-empty"><img :src="base + 'cats/felipa-molesta.png'" alt="" /><div><h3>Sin registros todavía</h3><p>Cuando agregues cualquier tipo de registro habilitado, aparecerá acá.</p></div></div>
    </section>
  </div>
</template>

<style scoped>
.hero-card {
  min-height: 300px;
  margin-bottom: 54px;
  padding: 38px 42px;
  overflow: visible;
  border: var(--neo-border);
  border-radius: var(--neo-radius);
  box-shadow: var(--neo-shadow-3);
}

.hero-card:not(.is-empty) {
  grid-template-columns: minmax(0, 1fr) 310px;
}

.hero-card:not(.is-empty) > img {
  z-index: 3;
  right: 26px;
  bottom: -24px;
  width: 340px;
  height: 318px;
  filter: drop-shadow(6px 6px 0 rgba(33, 25, 20, .26));
  transform: translate(8px, 7px) rotate(1deg);
  transform-origin: bottom center;
}

.hero-card.is-empty > img {
  z-index: 3;
  right: 30px;
  bottom: -18px;
  width: 286px;
  height: 270px;
  transform: translate(4px, 3px) rotate(-2deg);
  transform-origin: bottom center;
}

.hero-card__content {
  position: relative;
  z-index: 2;
  max-width: min(560px, 68%);
}

.hero-sticker {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  padding: 4px 10px;
  border: 2px solid var(--neo-ink);
  border-radius: 5px;
  background: var(--neo-butter);
  box-shadow: 2px 2px 0 var(--neo-ink);
  color: var(--neo-ink);
  transform: rotate(-2deg);
}

.hero-score {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 16px 0 4px;
}

.hero-score > span {
  color: var(--neo-orange-dark);
  font: 800 clamp(72px, 8vw, 108px) / .86 var(--font-display);
  letter-spacing: -.07em;
}

.hero-score small {
  color: var(--neo-ink);
  font-size: clamp(20px, 2.2vw, 29px);
  font-weight: 800;
  letter-spacing: -.04em;
}

.hero-card__content .empty-title {
  max-width: 520px;
  margin-top: 18px;
  color: var(--neo-ink);
  font-size: clamp(34px, 4.5vw, 58px);
  letter-spacing: -.045em;
  text-wrap: balance;
}

.dashboard-section .section-heading { position: relative; z-index: 1; }

.comparison-pill {
  display: inline-block;
  margin-left: 6px;
  padding: 3px 10px;
  border: 2px solid var(--neo-ink);
  border-radius: 999px;
  background: var(--neo-sage);
  color: var(--neo-ink);
  box-shadow: 2px 2px 0 var(--neo-ink);
  font-size: 12.5px;
  font-weight: 700;
}

.summary-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
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

.trend-chart figcaption {
  margin-bottom: 14px;
  color: var(--cocoa-700);
  font-size: 13.5px;
}

.trend-chart__range {
  margin: 0;
  color: var(--cocoa-800);
  font-size: 13px;
  line-height: 1.45;
  margin-bottom: 6px;
  font-weight: 800;
}

.trend-chart__summary {
  margin: 0;
  color: var(--cocoa-700);
  font-size: 13px;
  line-height: 1.45;
  max-width: 720px;
  margin-bottom: 8px;
}

.trend-chart__hint {
  margin: 0;
  color: var(--cocoa-600);
  font-size: 13px;
  line-height: 1.45;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.trend-chart__hint span {
  color: var(--dorito-600);
  font-size: 17px;
  font-weight: 800;
  line-height: 1;
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

.trend-chart__viewport:focus-visible {
  outline: 3px solid var(--neo-orange);
  outline-offset: 4px;
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

.quick-card > b {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 2px solid var(--neo-ink);
  border-radius: 50%;
  background: var(--neo-paper);
  color: var(--neo-ink);
  font-size: 21px;
  font-weight: 700;
  line-height: 1;
  transition: background-color .2s ease, color .2s ease, transform .2s ease;
}

.quick-card:hover > b {
  background: var(--neo-orange);
  color: var(--neo-ink);
  transform: scale(1.06);
}

.quick-card:focus-visible > b {
  background: var(--neo-orange);
  color: var(--neo-ink);
  transform: scale(1.06);
}

.wellbeing-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wellbeing-grid article > div {
  min-width: 0;
}

.wellbeing-grid article button {
  min-height: 32px;
  margin-top: 6px;
  padding: 0 10px;
  border: 2px solid var(--neo-ink);
  border-radius: var(--neo-radius-sm);
  color: var(--neo-ink);
  background: var(--neo-paper);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.wellbeing-grid article button:hover {
  border-color: var(--neo-ink);
  background: var(--neo-butter);
}

.wellbeing-grid article button:focus-visible {
  border-color: var(--neo-ink);
  background: var(--neo-butter);
}

.wellbeing-card__value { width: 72px; height: 22px; margin: 6px 0; }
.wellbeing-card__detail { width: min(160px, 90%); height: 11px; }

.entry-list article span {
  color: var(--cocoa-700);
}

.wellbeing-grid small {
  color: var(--cocoa-700);
}

.wellbeing-grid p {
  color: var(--cocoa-700);
}

.entry-list article p {
  color: var(--cocoa-700);
  font-size: 13.5px;
  line-height: 1.45;
}

.entry-list-empty p {
  color: var(--cocoa-700);
  font-size: 13.5px;
  line-height: 1.45;
}

.entry-list-empty--insight .primary-button {
  display: inline-flex;
  margin-top: 12px;
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
  0% { opacity: .5; }
  100% { opacity: .5; }
  50% { opacity: .92; }
}

@media (max-width: 900px) {
  .hero-card {
    overflow: hidden;
  }

  .hero-card:not(.is-empty) {
    grid-template-columns: 1fr;
  }

  .hero-card:not(.is-empty) > img {
    right: 8px;
    bottom: -18px;
    width: 286px;
    height: 270px;
    opacity: .82;
  }

  .dashboard-page {
    display: block;
  }

  .dashboard-section--summary,
  .dashboard-section--trend,
  .dashboard-section--quick,
  .dashboard-section--wellbeing,
  .dashboard-section--recent {
    width: 100%;
    margin-left: 0;
  }
}
/* Editorial dashboard composition: one poster, then varied modules instead of a card stack. */
.dashboard-section {
  position: relative;
  margin-inline: 0;
  margin-bottom: 38px;
  padding: 24px 24px 20px;
  border: var(--neo-border);
  border-radius: var(--neo-radius);
  box-shadow: var(--neo-shadow-2);
}

.dashboard-section--summary {
  width: min(82%, 760px);
  background: var(--surface-hero);
}

.dashboard-section--trend {
  width: 100%;
  border-left-width: 10px;
  background: var(--neo-lilac);
}

.dashboard-section--quick {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.dashboard-section--wellbeing {
  width: min(92%, 960px);
  margin-left: auto;
  border-right-width: 10px;
  background: var(--neo-sage);
}

.dashboard-section--recent {
  width: 100%;
  background: var(--neo-paper);
}

.summary-strip article {
  min-height: 132px;
  padding: 22px 18px;
  border: var(--neo-border);
  border-radius: var(--neo-radius-sm);
  background: var(--neo-paper);
  box-shadow: var(--neo-shadow-1);
}

.summary-strip article:nth-child(2) {
  margin-top: 18px;
  background: var(--neo-butter);
}

.trend-chart {
  margin: 0;
  padding: 14px 0 8px;
  border-top: var(--neo-border);
  border-bottom: var(--neo-border);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.trend-chart--loading {
  min-height: 190px;
}

.trend-chart__track i {
  position: absolute;
  right: 16%;
  bottom: 0;
  left: 16%;
  min-height: 8px;
  border-radius: 2px 2px 0 0;
  background: var(--neo-orange);
  transform-origin: bottom;
}

.quick-card {
  min-height: 124px;
  border: var(--neo-border);
  border-left-width: 8px;
  border-radius: var(--neo-radius-sm);
  box-shadow: var(--neo-shadow-1);
  background: var(--neo-butter);
  transition: transform .2s ease, box-shadow .2s ease;
}

.quick-card:nth-child(2) {
  min-height: 146px;
  align-self: end;
  border-left-color: var(--neo-ink);
  background: var(--neo-lilac);
}

.quick-card:nth-child(3) {
  min-height: 112px;
  border-left-color: var(--neo-ink);
  background: var(--neo-sage);
}

.quick-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--neo-shadow-2);
}

.quick-card:focus-visible {
  transform: translate(-2px, -2px);
  box-shadow: var(--neo-shadow-2);
}

.wellbeing-grid article {
  min-height: 122px;
  padding: 20px 18px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.wellbeing-grid article + article {
  border-left: 3px solid var(--neo-ink);
  padding-left: 24px;
}

.wellbeing-grid article > span {
  border: 2px solid var(--neo-ink);
  border-radius: 50%;
  background: var(--neo-paper);
  box-shadow: 2px 2px 0 var(--neo-ink);
}

.entry-list {
  border-top: var(--neo-border);
  border-bottom: var(--neo-border);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: hidden;
}

.entry-list:not(.entry-list--loading) .entry-list__row {
  position: relative;
  padding-left: 28px;
  background: var(--neo-paper);
}

.entry-list:not(.entry-list--loading) .entry-list__row::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 7px;
  background: var(--entry-rail, var(--neo-orange));
  content: '';
}

.entry-list article + article { border-top: 2px solid var(--neo-ink); }

.entry-list-empty--insight {
  border: var(--neo-border);
  border-style: dashed;
  border-radius: var(--neo-radius-sm);
  background: var(--neo-paper);
}

.entry-list-empty {
  position: relative;
  min-height: 154px;
  padding-right: 176px;
  overflow: hidden;
  border: var(--neo-border);
  border-style: dashed;
  border-radius: var(--neo-radius-sm);
  background: var(--neo-paper);
}

.entry-list-empty > img {
  position: absolute;
  right: -12px;
  bottom: -14px;
  z-index: 0;
  width: 154px;
  height: 154px;
  object-fit: contain;
  pointer-events: none;
}

.entry-list-empty > div {
  position: relative;
  z-index: 1;
  max-width: 52ch;
}

@media (max-width: 560px) {

  .hero-card {
    min-height: 310px;
    margin-bottom: 42px;
    padding: 24px 20px 20px;
    overflow: hidden;
  }

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
    width: 146px;
    height: 164px;
    opacity: 1;
    transform: translate(10px, 5px);
  }

  .hero-card__content {
    max-width: none;
  }

  .hero-card:not(.is-empty) > div:first-child {
    grid-column: 1;
    grid-row: 1;
  }

  .hero-score {
    gap: 7px;
    margin-top: 14px;
  }

  .hero-score > span {
    font-size: 58px;
  }

  .hero-score small {
    font-size: 20px;
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

  .hero-card:not(.is-empty) .scale-legend i {
    flex: 1;
    width: auto;
  }

  .hero-card:not(.is-empty) .scale-legend b {
    flex: 1;
    width: auto;
  }

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

  .trend-chart__viewport {
    padding-bottom: 4px;
  }

  .trend-chart__bars {
    min-width: max(100%, var(--trend-min-width));
  }

  .summary-strip,
  .quick-grid,
  .wellbeing-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-section {
    width: 100%;
    margin-inline: 0;
    margin-bottom: 30px;
    padding: 18px 16px 16px;
    border-radius: var(--neo-radius-sm);
    box-shadow: var(--neo-shadow-1);
  }

  .entry-list-empty {
    min-height: 136px;
    padding-right: 118px;
  }

  .entry-list-empty > img {
    right: -8px;
    bottom: -10px;
    width: 112px;
    height: 112px;
  }

  .summary-strip article {
    min-height: 112px;
    padding: 18px 15px;
    box-shadow: var(--neo-shadow-1);
  }

  .summary-strip article:nth-child(2) {
    margin-top: 0;
  }

  .trend-chart {
    padding-inline: 0;
  }

  .quick-card {
    min-height: 112px;
    box-shadow: var(--neo-shadow-1);
  }

  .quick-card:nth-child(2),
  .quick-card:nth-child(3) {
    min-height: 112px;
  }

  .wellbeing-grid article {
    min-height: 92px;
    padding: 15px 14px;
  }

  .wellbeing-grid article + article {
    border-top: 2px solid var(--neo-ink);
    border-left: 0;
    padding-left: 14px;
  }

  .entry-list {
    box-shadow: none;
  }

  .entry-list:not(.entry-list--loading) .entry-list__row { padding-left: 24px; }
}

@media (min-width: 901px) {
  .dashboard-page {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: clamp(16px, 2vw, 28px);
    align-items: start;
  }

  .dashboard-page > .page-header,
  .dashboard-page > .hero-card,
  .dashboard-page > .dashboard-section--quick {
    grid-column: 1 / -1;
  }

  .dashboard-page > .dashboard-section--summary {
    grid-column: 1 / span 5;
    width: 100%;
  }

  .dashboard-page > .dashboard-section--trend {
    grid-column: 6 / -1;
    width: 100%;
  }

  .dashboard-page > .dashboard-section--wellbeing {
    grid-column: 1 / span 7;
    width: 100%;
    margin-left: 0;
  }

  .dashboard-page > .dashboard-section--recent {
    grid-column: 8 / -1;
    width: 100%;
  }

  .dashboard-section--summary .summary-strip {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .dashboard-section--summary .summary-strip article:first-child {
    grid-column: span 2;
  }

  .dashboard-section--summary .summary-strip article:nth-child(2) {
    grid-column: span 3;
    transform: rotate(1deg);
  }

  .dashboard-section--quick .quick-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .dashboard-section--quick .quick-card {
    align-self: start;
  }

  .dashboard-section--quick .quick-card:nth-child(1) {
    grid-column: span 5;
  }

  .dashboard-section--quick .quick-card:nth-child(2) {
    grid-column: span 4;
    transform: rotate(-.7deg);
  }

  .dashboard-section--quick .quick-card:nth-child(3) {
    grid-column: span 3;
    transform: rotate(.7deg);
  }

  .dashboard-section--quick .quick-card:nth-child(n + 4) {
    grid-column: span 3;
  }

  .dashboard-section--quick .quick-card:nth-child(2):hover,
  .dashboard-section--quick .quick-card:nth-child(2):focus-visible {
    transform: translate(-2px, -2px) rotate(-.7deg);
  }

  .dashboard-section--quick .quick-card:nth-child(3):hover,
  .dashboard-section--quick .quick-card:nth-child(3):focus-visible {
    transform: translate(-2px, -2px) rotate(.7deg);
  }

  .dashboard-section--wellbeing .wellbeing-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0;
  }

  .dashboard-section--wellbeing .wellbeing-grid article:first-child {
    grid-column: span 3;
  }

  .dashboard-section--wellbeing .wellbeing-grid article:nth-child(2) {
    grid-column: span 2;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-card > img {
    transform: none !important;
  }

  .skeleton {
    animation: none;
  }
  .quick-card {
    transform: none;
    transition: none;
  }
  .quick-card:hover {
    transform: none;
    transition: none;
  }
  .quick-card:focus-visible {
    transform: none;
    transition: none;
  }
  .summary-strip article:nth-child(2),
  .quick-card:nth-child(2),
  .quick-card:nth-child(3) {
    transform: none !important;
  }
}
</style>
