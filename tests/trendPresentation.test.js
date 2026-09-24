import assert from 'node:assert/strict'
import { formatTrendRange, summarizeTrend } from '../src/contexts/personal-insights/application/trendPresentation.js'

const trend = [
  { date: '2026-09-10', count: 2, averageScore: 6 },
  { date: '2026-09-12', count: 1, averageScore: 9 },
]

assert.match(formatTrendRange(trend), /^Del 10 sept 2026 al 12 sept 2026$/)
assert.equal(formatTrendRange([]), '')
assert.equal(
  summarizeTrend(trend),
  '3 registros en 2 días. Promedio del periodo: 7.0/10. Mejor día: 12 sept 2026, 9/10.',
)
assert.equal(summarizeTrend([]), 'Todavía no hay registros en este periodo.')

console.log('PersonalInsights trend presentation tests: OK')
